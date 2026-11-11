"use client";

// The website chatbot's panel (2026-10-27; redesigned the same day): a glass
// panel above the button (a sheet from the bottom on phones). The header has
// the assistant's name, an "AI" badge and "Talk to a person" (WhatsApp); the
// first screen a greeting by the time of day, suggested questions as rows and
// a "Prefer a person?" row that opens the WhatsApp and demo links.
// Messages are plain text, never HTML; paths of the site's own pages
// ("/pricing") become links. The answers come from app/api/chat/route.ts; on a
// failure the panel says so and offers a retry, WhatsApp and the Contact page.

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type KeyboardEvent } from "react";
import { ChevronDown, RotateCcw, SendHorizontal, SquarePen, X } from "lucide-react";
import { ChatBotIcon } from "@/components/marketing/chat-bot-icon";
import { CONTACT_INFO } from "@/components/marketing/brand";
import { WHATSAPP_CHAT_URL, WHATSAPP_GREEN, WhatsAppIcon } from "@/components/marketing/whatsapp-float";

type Message = { role: "user" | "model"; text: string };

/** "Good morning" / "Good afternoon" / "Good evening" (the same split as the server's greetings) */
const partOfDay = (hour: number) => (hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening");

const SUGGESTIONS = [
  "What does the app do?",
  "How much does it cost?",
  "Is there a free trial?",
  "Do prescriptions have Urdu instructions?",
];
const MAX_CHARS = 1000;
// the site's pages, as the server leaves them in a reply
const ROUTE = /(\/(?:pricing|products|faq|contact|success-stories))(?![\w-])/;
const isUrdu = (text: string) => /[\u0600-\u06FF]/.test(text);
const phone = CONTACT_INFO.whatsappDisplay;

function MessageText({ text }: { text: string }) {
  // split() with a capturing group: the paths are at the odd places
  return text.split(new RegExp(ROUTE, "g")).map((part, i) =>
    i % 2 ? (
      <Link key={i} href={part} className="chat-link" dir="ltr">
        {part}
      </Link>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

/** a new answer, written out a few words at a time (about 1.5 s at most), then shown with its links */
function TypedText({ text, onGrow, onDone }: { text: string; onGrow: () => void; onDone: () => void }) {
  const [parts] = useState(() => text.split(/(\s+)/)); // words and the spaces between them
  const [n, setN] = useState(0);
  useEffect(() => {
    if (n >= parts.length) {
      onDone();
      return;
    }
    const step = Math.max(1, Math.ceil(parts.length / 90));
    const t = window.setTimeout(() => setN((c) => Math.min(parts.length, c + step)), 16);
    return () => window.clearTimeout(t);
  }, [n]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(onGrow, [n]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      {parts.slice(0, n).join("")}
      <span className="chat-caret" aria-hidden />
    </>
  );
}

/** the assistant's small round mark, beside its messages */
function BotAvatar() {
  return (
    <span className="chat-avatar chat-avatar-sm" aria-hidden>
      <ChatBotIcon className="size-[22px]" />
    </span>
  );
}

export function ChatPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState<string | null>(null);
  const [personOpen, setPersonOpen] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const chat = useRef(0); // which conversation an answer belongs to (New chat moves it on)
  const [typing, setTyping] = useState<number | null>(null); // the answer being written out
  const [announce, setAnnounce] = useState(""); // a whole answer, for screen readers, once
  // stays on screen while it closes, so it can fade out
  const [shown, setShown] = useState(open);
  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (open) {
      setShown(true);
      input.current?.focus();
      return;
    }
    const t = window.setTimeout(() => setShown(false), reduced() ? 0 : 200);
    return () => window.clearTimeout(t);
  }, [open]);

  const followTyping = () => {
    const el = list.current;
    if (el) el.scrollTop = el.scrollHeight;
  };
  useEffect(() => {
    const el = list.current;
    if (!el || messages.length === 0) return;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
  }, [messages, busy, failed]);

  const ask = async (history: Message[]) => {
    const id = chat.current;
    const current = () => id === chat.current;
    setBusy(true);
    setFailed(null);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // the visitor's hour, so a greeting fits their time of day
        // only the recent messages: the server reads the last three
        body: JSON.stringify({ messages: history.slice(-3), hour: new Date().getHours() }),
      });
      const data = (await res.json().catch(() => ({}))) as { reply?: unknown; error?: unknown };
      if (!res.ok || typeof data.reply !== "string") {
        throw new Error(typeof data.error === "string" ? data.error : "The assistant couldn’t answer just now.");
      }
      if (current()) {
        setMessages([...history, { role: "model", text: data.reply }]);
        setTyping(reduced() ? null : history.length);
        setAnnounce(data.reply);
      }
    } catch (e) {
      if (current()) setFailed(e instanceof Error && e.message ? e.message : "The assistant couldn’t answer just now.");
    } finally {
      if (current()) setBusy(false);
    }
  };

  const send = (text: string) => {
    const t = text.trim().slice(0, MAX_CHARS);
    if (!t || busy) return;
    const history: Message[] = [...messages, { role: "user", text: t }];
    setTyping(null); // an answer still being written out shows in full
    setMessages(history);
    setDraft("");
    void ask(history);
    input.current?.focus();
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(draft);
  };

  /** a fresh conversation: back to the welcome screen (an answer still on its way is dropped) */
  const newChat = () => {
    chat.current += 1;
    setMessages([]);
    setDraft("");
    setBusy(false);
    setFailed(null);
    setPersonOpen(false);
    setTyping(null);
    setAnnounce("");
    input.current?.focus();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  };

  return (
    <div
      id="chat-panel"
      role="dialog"
      aria-label="Ask Chatbot, AI assistant"
      hidden={!shown}
      data-state={open ? "open" : "closing"}
      onKeyDown={onKeyDown}
      className="chat-panel"
      style={{ "--wa": WHATSAPP_GREEN } as CSSProperties}
    >
      {/* Header */}
      <div className="chat-head">
        <span className="chat-avatar" aria-hidden>
          <ChatBotIcon className="size-[34px]" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="how-ink truncate font-display text-[16px] font-semibold leading-tight">Ask Chatbot</p>
          <span className="chat-badge">
            <span className="size-1.5 rounded-full bg-success" aria-hidden />
            AI assistant
          </span>
        </div>
        <a
          href={WHATSAPP_CHAT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="chat-person"
          aria-label="Talk to a person on WhatsApp"
        >
          <WhatsAppIcon className="chat-wa size-[18px] shrink-0" />
          <span className="chat-person-label">Talk to a person</span>
        </a>
        {messages.length > 0 && (
          <button type="button" onClick={newChat} aria-label="Start a new chat" title="New chat" className="chat-icon-btn">
            <SquarePen aria-hidden className="size-[18px]" />
          </button>
        )}
        <button type="button" onClick={onClose} aria-label="Close the chat" className="chat-icon-btn">
          <X aria-hidden className="size-5" />
        </button>
      </div>

      {/* Conversation (its own scroll, not the page's: Lenis) */}
      {/* each answer, whole, for screen readers (not the words as they are written out) */}
      <p className="sr-only" aria-live="polite">
        {announce}
      </p>
      <div ref={list} data-lenis-prevent className="chat-list">
        {messages.length === 0 && (
          <div className="chat-intro">
            <p className="how-ink font-display text-[24px] font-medium leading-[1.2] tracking-[-0.02em]">
              {partOfDay(new Date().getHours())}!
              <br />
              <span className="font-light text-primary">I’m the Clinics assistant.</span>
            </p>
            <p className="chat-intro-text mt-3">
              I can explain our plans and prices, the features doctors and receptionists use every day, and how to get
              started. For a demo, I’ll put you in touch with the team.
            </p>

            <ul className="mt-5 space-y-2.5">
              {SUGGESTIONS.map((s) => (
                <li key={s}>
                  <button type="button" onClick={() => send(s)} className="chat-suggest">
                    <SendHorizontal aria-hidden className="size-4 shrink-0 text-primary" />
                    <span className="flex-1 text-left">{s}</span>
                  </button>
                </li>
              ))}
            </ul>

            {/* a person instead */}
            <div className="chat-person-card mt-4" data-open={personOpen}>
              <button
                type="button"
                onClick={() => setPersonOpen(!personOpen)}
                aria-expanded={personOpen}
                aria-controls="chat-person-more"
                className="chat-person-toggle"
              >
                <WhatsAppIcon className="chat-wa size-[18px] shrink-0" />
                <span className="flex-1 text-left">Prefer a person? WhatsApp the team</span>
                <ChevronDown aria-hidden className="chat-chevron size-4 shrink-0" />
              </button>
              <div id="chat-person-more" className="chat-person-more" inert={!personOpen}>
                <div className="overflow-hidden">
                  <div className="px-4 pb-4">
                    <p className="chat-intro-text text-[14px]">
                      Message our team on WhatsApp at <span dir="ltr">{phone}</span>, or book a free demo.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <a href={WHATSAPP_CHAT_URL} target="_blank" rel="noopener noreferrer" className="chat-btn chat-btn-wa">
                        <WhatsAppIcon className="size-4" />
                        Open WhatsApp
                      </a>
                      <Link href="/contact" className="chat-btn chat-btn-ghost">
                        Book a free demo
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {messages.map((m, i) =>
          m.role === "user" ? (
            <p key={i} dir="auto" lang={isUrdu(m.text) ? "ur" : "en"} className="chat-msg chat-msg-user chat-in">
              <span className="sr-only">You: </span>
              {m.text}
            </p>
          ) : (
            <div key={i} className="chat-row chat-in">
              <BotAvatar />
              <p dir="auto" lang={isUrdu(m.text) ? "ur" : "en"} className="chat-msg chat-msg-bot">
                <span className="sr-only">Assistant: </span>
                {i === typing ? (
                  <span aria-hidden>
                    <TypedText text={m.text} onGrow={followTyping} onDone={() => setTyping(null)} />
                  </span>
                ) : (
                  <MessageText text={m.text} />
                )}
              </p>
            </div>
          )
        )}

        {busy && (
          <div className="chat-row chat-in">
            <BotAvatar />
            <p className="chat-msg chat-msg-bot chat-typing">
              <span className="chat-dots" aria-hidden>
                <span />
                <span />
                <span />
              </span>
              <span className="sr-only">Typing…</span>
            </p>
          </div>
        )}

        {failed && (
          <div role="alert" className="chat-error chat-in">
            <p>{failed}</p>
            <div className="mt-1 flex flex-wrap gap-x-4">
              <button type="button" onClick={() => void ask(messages)} className="chat-link inline-flex min-h-11 items-center gap-1.5">
                <RotateCcw aria-hidden className="size-3.5" />
                Try again
              </button>
              <a href={WHATSAPP_CHAT_URL} target="_blank" rel="noopener noreferrer" className="chat-link inline-flex min-h-11 items-center">
                WhatsApp
              </a>
              <Link href="/contact" className="chat-link inline-flex min-h-11 items-center">
                Contact us
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Ask */}
      <form onSubmit={onSubmit} className="chat-form">
        <label htmlFor="chat-input" className="sr-only">
          Your question
        </label>
        <input
          ref={input}
          id="chat-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={MAX_CHARS}
          dir="auto"
          autoComplete="off"
          // no red underlines for spelling (Roman Urdu is never "spelled right")
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="sentences"
          placeholder="Ask Chatbot anything…"
          className="chat-input"
        />
        <button type="submit" disabled={busy || !draft.trim()} aria-label="Send" className="chat-send">
          <SendHorizontal aria-hidden className="size-[18px]" />
        </button>
      </form>
    </div>
  );
}
