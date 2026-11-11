// The website chatbot (2026-10-27): the visitor's messages go to Google
// Gemini from here, so the API key (GEMINI_API_KEY) never reaches the
// browser. The bot answers only from the site's own data
// (lib/chat-knowledge.ts). Nothing the visitor writes is logged or stored.
// On any failure the answer is a clear error, never an invented reply.

import { NextResponse } from "next/server";
import {
  REPLIES,
  cleanReply,
  greetingReply,
  isUrdu,
  localAnswer,
  localHelp,
  looksLikePatientData,
  systemInstruction,
} from "@/lib/chat-knowledge";

export const runtime = "nodejs";

// the new message and the exchange before it (the visitor's last question and
// its answer): enough context, a small request
const MAX_MESSAGES = 3;
const MAX_CHARS = 1000;
const TIMEOUT_MS = 15_000;
// Gemini's answer time varies a lot (3 s to 40 s, measured 2026-10-27): if the
// first call hasn't answered by then, a second one races it
const HEDGE_MS = 5_000;
// a question this short that matches a topic gets the site's own answer at once
const SHORT_WORDS = 4;
// per visitor (IP) and per server instance: on a serverless host each
// instance keeps its own count, so this is a soft limit
const LIMIT = 10;
const WINDOW_MS = 60_000;
const hits = new Map<string, number[]>();

type Message = { role: "user" | "model"; text: string };

const error = (status: number, message: string) => NextResponse.json({ error: message }, { status });

function limited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (now - v[v.length - 1]! >= WINDOW_MS) hits.delete(k);
  return recent.length > LIMIT;
}

/** the request's messages, checked: the last three, plain text, ending with the visitor's */
function parse(body: unknown): Message[] | null {
  const list = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(list) || list.length === 0) return null;
  const messages: Message[] = [];
  for (const m of list.slice(-MAX_MESSAGES)) {
    const role = (m as Message)?.role;
    const raw = (m as Message)?.text;
    if ((role !== "user" && role !== "model") || typeof raw !== "string") return null;
    const text = raw.replace(/<[^>]*>/g, "").trim();
    if (!text || text.length > MAX_CHARS) return null;
    // two of the visitor's in a row (the first went unanswered): one turn
    const prev = messages.at(-1);
    if (prev?.role === role) prev.text += `\n${text}`;
    else messages.push({ role, text });
  }
  // Gemini's history starts with the visitor and must end with them
  while (messages[0]?.role === "model") messages.shift();
  if (messages.at(-1)?.role !== "user") return null;
  return messages;
}

const retryable = (status: number) => status === 429 || status >= 500;

/** a Gemini call, and a second one if the first is slow or busy: the first good answer wins */
async function generate(call: () => Promise<Response>): Promise<Response> {
  const first = call();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const slow = new Promise<"slow">((resolve) => (timer = setTimeout(() => resolve("slow"), HEDGE_MS)));
  const early = await Promise.race([first.catch(() => null), slow]);
  clearTimeout(timer);
  if (early instanceof Response && (early.ok || !retryable(early.status))) return early;
  const second = call();
  if (early !== "slow") return second;
  const ok = (r: Response) => (r.ok ? r : Promise.reject(r));
  return Promise.any([first.then(ok), second.then(ok)]).catch(() => second);
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";
  if (limited(ip)) return error(429, "You’re sending messages quickly. Please wait a minute and try again.");

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return error(400, "Sorry, that message couldn’t be read.");
  }
  const messages = parse(body);
  if (!messages) return error(400, `Please send a message of up to ${MAX_CHARS} characters.`);

  const last = messages.at(-1)!.text;
  // patient data never leaves the site
  if (looksLikePatientData(last)) return NextResponse.json({ reply: REPLIES.patientData });

  // a plain greeting is answered here, by the visitor's time of day (their
  // hour, 0-23, sent by the panel; the server's if missing)
  const sent = (body as { hour?: unknown }).hour;
  const hour = Number.isInteger(sent) && (sent as number) >= 0 && (sent as number) <= 23 ? (sent as number) : new Date().getHours();
  const hello = greetingReply(last, hour);
  if (hello) return NextResponse.json({ reply: hello });

  // the site's own answer for this question (by its words), used when Gemini
  // isn't set up or doesn't answer; then the error only if nothing matched
  const local = localAnswer(last);
  const fallback = (status: number, message: string) =>
    local ? NextResponse.json({ reply: local }) : error(status, message);
  // a short, clear question ("price?", "who u", "me baat krun?") needs no wait for Gemini
  if (local && last.split(/\s+/).length <= SHORT_WORDS) return NextResponse.json({ reply: local });

  const key = process.env.GEMINI_API_KEY;
  if (!key) return NextResponse.json({ reply: local ?? localHelp(last) });
  const model = process.env.GEMINI_MODEL || "gemini-flash-lite-latest";

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const payload = JSON.stringify({
    systemInstruction: { parts: [{ text: systemInstruction() }] },
    contents: messages.map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
    generationConfig: { temperature: 0.2, maxOutputTokens: 500 },
  });
  try {
    const res = await generate(() =>
      fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        body: payload,
        signal: controller.signal,
        cache: "no-store",
      })
    );
    if (res.status === 429) return fallback(503, "The assistant is busy right now. Please try again later, or contact our team.");
    if (!res.ok) return fallback(502, "The assistant couldn’t answer just now. Please try again, or contact our team.");

    const data = (await res.json()) as {
      promptFeedback?: { blockReason?: string };
      candidates?: { finishReason?: string; content?: { parts?: { text?: string }[] } }[];
    };
    const candidate = data.candidates?.[0];
    const text = candidate?.content?.parts?.map((p) => p.text ?? "").join("").trim() ?? "";
    if (data.promptFeedback?.blockReason || candidate?.finishReason === "SAFETY" || !text) {
      return NextResponse.json({ reply: REPLIES.blocked });
    }
    let reply = cleanReply(text);
    // Urdu script only for a question in Urdu script: otherwise the site's English answer
    if (!isUrdu(last) && isUrdu(reply)) reply = local ?? localHelp(last);
    return NextResponse.json({ reply: reply || REPLIES.blocked });
  } catch {
    return fallback(504, "The assistant took too long to answer. Please try again, or contact our team.");
  } finally {
    clearTimeout(timer);
    controller.abort(); // the call that lost the race, if one is still open
  }
}
