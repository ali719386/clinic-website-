"use client";

// The interactive parts of /faq (2026-10-27): the search in the hero, the
// topic list and the accordion. Search (questions, the English and Urdu
// answers and topic names, any case) and the topic apply together; a change
// closes the open answer. An open answer shows English (left) and Urdu
// (right, RTL), one under the other on phones.
// One answer open at a time, the first to begin with; closed answers are
// inert, so their links are out of the tab order. The rows are revealed once
// by the page's lazy wrapper, so typing never replays an entrance.

import Link from "next/link";
import { createContext, useContext, useRef, useState, type ReactNode, type RefObject } from "react";
import { ArrowLeft, ArrowRight, Plus, Search, X } from "lucide-react";
import { Urdu } from "@/components/urdu";
import { FAQS, TOPICS, type TopicId } from "@/components/marketing/faq-data";

type Topic = TopicId | "all";

const FaqContext = createContext<{
  query: string;
  setQuery: (q: string) => void;
  topic: Topic;
  setTopic: (t: Topic) => void;
  open: string | null;
  setOpen: (id: string | null) => void;
  input: RefObject<HTMLInputElement | null>;
} | null>(null);

function useFaq() {
  const ctx = useContext(FaqContext);
  if (!ctx) throw new Error("FaqProvider is missing");
  return ctx;
}

export function FaqProvider({ children }: { children: ReactNode }) {
  const [query, setQueryState] = useState("");
  const [topic, setTopicState] = useState<Topic>("all");
  const [open, setOpen] = useState<string | null>(FAQS[0]!.id);
  const input = useRef<HTMLInputElement>(null);
  // a new search or topic: no answer stays open
  const setQuery = (q: string) => {
    setQueryState(q);
    setOpen(null);
  };
  const setTopic = (t: Topic) => {
    setTopicState(t);
    setOpen(null);
  };
  return (
    <FaqContext.Provider value={{ query, setQuery, topic, setTopic, open, setOpen, input }}>{children}</FaqContext.Provider>
  );
}

const topicLabel = (id: Topic) => TOPICS.find((t) => t.id === id)!.label;
const answers = (n: number) => `${n} ${n === 1 ? "answer" : "answers"}`;

/** the hero's search field */
export function FaqSearch() {
  const { query, setQuery, input } = useFaq();
  return (
    <div className="mx-auto w-full max-w-[560px]">
      <label htmlFor="faq-search" className="sr-only">
        Search frequently asked questions
      </label>
      <div className="relative">
        <Search aria-hidden className="spec-subtext pointer-events-none absolute top-1/2 left-5 size-5 -translate-y-1/2" />
        <input
          ref={input}
          id="faq-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search questions, e.g. Urdu or doctors"
          aria-describedby="faq-search-hint"
          autoComplete="off"
          className="faqp-search how-ink w-full"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              input.current?.focus();
            }}
            aria-label="Clear search"
            className="faqp-clear absolute top-1/2 right-2 -translate-y-1/2"
          >
            <X aria-hidden className="size-4" />
          </button>
        )}
      </div>
      <p id="faq-search-hint" className="spec-subtext mt-3 text-center text-[14px]">
        Try &lsquo;trial&rsquo;, &lsquo;prescriptions&rsquo; or &lsquo;annual&rsquo;.
      </p>
    </div>
  );
}

/** the topics (a sidebar from 1024px, a sideways strip below) and the answers */
export function FaqContent({ sidebarExtra }: { sidebarExtra?: ReactNode }) {
  const { query, setQuery, topic, setTopic, open, setOpen, input } = useFaq();
  const q = query.trim().toLowerCase();
  const shown = FAQS.filter(
    (f) =>
      (topic === "all" || f.category === topic) &&
      (!q || [f.question.en, f.question.ur, f.answer.en, f.answer.ur, topicLabel(f.category)].some((t) => t.toLowerCase().includes(q)))
  );

  const reset = () => {
    setQuery("");
    setTopic("all");
    input.current?.focus();
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12">
      <aside className="min-w-0 lg:sticky lg:top-[96px] lg:self-start">
        <p data-card className="spec-subtext text-[12px] font-semibold uppercase tracking-[0.12em]" id="faq-topics-label">
          Browse by topic
        </p>
        <div data-card role="group" aria-labelledby="faq-topics-label" className="faqp-topics mt-4">
          {TOPICS.map((t) => {
            const Icon = t.icon;
            const count = t.id === "all" ? FAQS.length : FAQS.filter((f) => f.category === t.id).length;
            return (
              <button
                key={t.id}
                type="button"
                aria-pressed={topic === t.id}
                onClick={() => setTopic(t.id)}
                className="faqp-topic"
              >
                <Icon aria-hidden className="size-[18px] shrink-0" />
                <span className="flex-1 text-left">{t.label}</span>
                <span className="faqp-count">
                  <span className="sr-only">(</span>
                  {count}
                  <span className="sr-only">)</span>
                </span>
              </button>
            );
          })}
        </div>
        {sidebarExtra && <div className="mt-6 hidden lg:block">{sidebarExtra}</div>}
      </aside>

      <div className="min-w-0">
        <div data-card className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="how-ink font-display text-[clamp(1.5rem,2.6vw,2rem)] font-medium tracking-[-0.03em]">
            {topicLabel(topic)}
          </h2>
          <p aria-live="polite" className="spec-subtext text-[14px]">
            {answers(shown.length)}
          </p>
        </div>

        {shown.length ? (
          <ul className="mt-6 space-y-4">
            {shown.map((f) => {
              const isOpen = open === f.id;
              const qId = `faq-q-${f.id}`;
              const aId = `faq-a-${f.id}`;
              return (
                <li key={f.id} data-card className="glass-tile faq-item faqp-item relative" data-open={isOpen}>
                  <h3>
                    <button
                      id={qId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={aId}
                      onClick={() => setOpen(isOpen ? null : f.id)}
                      className="faq-q flex w-full items-center gap-4 px-5 py-5 text-left sm:px-6"
                    >
                      <span className="faqp-num" aria-hidden>
                        {f.id}
                      </span>
                      {/* the question in English, its Urdu under it (right-aligned, RTL) */}
                      <span className="min-w-0 flex-1">
                        <span className="how-ink block text-[17px] font-medium leading-snug sm:text-[18px]">{f.question.en}</span>
                        <Urdu className="faqp-q-ur mt-1 block">{f.question.ur}</Urdu>
                      </span>
                      <span className="faq-icon" data-open={isOpen} aria-hidden>
                        <Plus className="size-4" />
                      </span>
                    </button>
                  </h3>
                  <div id={aId} role="region" aria-labelledby={qId} className="faq-panel" data-open={isOpen} inert={!isOpen}>
                    <div className="overflow-hidden">
                      {/* English left, Urdu right (from 640px); one under the other on phones */}
                      <div className="faqp-bi px-5 pb-6 sm:pl-[72px] sm:pr-6">
                        <div lang="en" className="faqp-col">
                          <p className="faqp-lang">English</p>
                          <p className="spec-subtext mt-2 text-[15px] leading-[1.75] text-pretty">{f.answer.en}</p>
                          {f.link && (
                            <Link href={f.link.href} className="faqp-link group mt-2">
                              {f.link.labelEn}
                              <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                          )}
                        </div>
                        <Urdu as="div" className="faqp-col faqp-ur">
                          <p className="faqp-lang">اردو</p>
                          <p className="faqp-ur-text mt-1">{f.answer.ur}</p>
                          {f.link && (
                            <Link href={f.link.href} className="faqp-link group">
                              {f.link.labelUr}
                              <ArrowLeft aria-hidden className="size-4 transition-transform group-hover:-translate-x-1" />
                            </Link>
                          )}
                        </Urdu>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="glass-tile glass-static mt-6 p-8 text-center">
            <h3 className="how-ink font-display text-[20px] font-medium">No matching questions</h3>
            <p className="spec-subtext mt-2 text-[15px] leading-[1.7]">Try another word or browse all topics.</p>
            <button type="button" onClick={reset} className="faqp-link mx-auto mt-4">
              Reset search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
