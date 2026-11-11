"use client";

// The interactive parts of /success-stories (2026-10-27): the story dialog
// (the shared Radix dialog: focus kept inside, Escape and the close button
// close it, the page under it does not scroll, focus goes back to the button
// that opened it), the buttons that open it, and the collection's product
// filter and search, which work together.

import { createContext, useContext, useState, type ReactNode } from "react";
import { ArrowRight, Search } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { CardMockup } from "@/components/marketing/story-mockups";
import { ALL_STORIES, STORIES, type StoryProduct } from "@/components/marketing/stories-data";

const StoryContext = createContext<((id: string) => void) | null>(null);

export function StoryDialogProvider({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [shownId, setShownId] = useState<string | null>(null); // kept while it closes
  const story = ALL_STORIES.find((s) => s.id === (openId ?? shownId));
  const open = (id: string) => {
    setShownId(id);
    setOpenId(id);
  };

  return (
    <StoryContext.Provider value={open}>
      {children}
      <Dialog open={openId !== null} onOpenChange={(o) => !o && setOpenId(null)}>
        <DialogContent className="max-h-[90svh] overflow-y-auto rounded-[20px] p-6 sm:max-w-xl sm:p-8">
          {story && (
            <>
              <DialogHeader className="text-left">
                <span className="teal-chip self-start">Sample</span>
                <DialogTitle className="how-ink mt-2 font-display text-[22px] font-medium leading-snug text-balance">
                  {story.title}
                </DialogTitle>
                <DialogDescription className="spec-subtext text-[14px]">
                  {story.product} · {story.team}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 text-[15px] leading-[1.7]">
                <section>
                  <h3 className="how-ink font-display text-[16px] font-medium">The everyday challenge</h3>
                  <p className="spec-subtext mt-2">{story.challenge}</p>
                </section>
                <section>
                  <h3 className="how-ink font-display text-[16px] font-medium">The proposed workflow</h3>
                  <ol className="spec-subtext mt-2 list-decimal space-y-1.5 pl-5">
                    {story.workflow.map((w) => (
                      <li key={w}>{w}</li>
                    ))}
                  </ol>
                </section>
                <section>
                  <h3 className="how-ink font-display text-[16px] font-medium">What needs verification</h3>
                  <ul className="spec-subtext mt-2 list-disc space-y-1.5 pl-5">
                    {story.verify.map((v) => (
                      <li key={v}>{v}</li>
                    ))}
                  </ul>
                </section>
                <p className="story-note p-4 text-[13px]">
                  This is a hypothetical scenario, not a customer result. The workflow is a proposal to confirm in a
                  demo, not a list of features a plan is sure to include.
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </StoryContext.Provider>
  );
}

/** a button that opens a story's dialog */
export function StoryButton({ id, className, children }: { id: string; className?: string; children: ReactNode }) {
  const open = useContext(StoryContext);
  return (
    <button type="button" onClick={() => open?.(id)} aria-haspopup="dialog" className={className}>
      {children}
    </button>
  );
}

const FILTERS: { label: string; value: StoryProduct | "all" }[] = [
  { label: "All stories", value: "all" },
  { label: "DMS", value: "DMS" },
  { label: "CMS", value: "CMS" },
  { label: "ECMS", value: "ECMS" },
];

/** the collection: a product filter and a search, then the matching cards */
export function StoryBrowser() {
  const [product, setProduct] = useState<StoryProduct | "all">("all");
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const shown = STORIES.filter(
    (s) =>
      (product === "all" || s.product === product) &&
      (!q || [s.title, s.summary, s.team, s.product].some((t) => t.toLowerCase().includes(q)))
  );
  const reset = () => {
    setProduct("all");
    setQuery("");
  };

  return (
    <>
      {/* the filters and the search, at the grid's edges */}
      <div data-card className="mt-12 flex flex-col items-center gap-4 md:flex-row md:justify-between">
        <div role="group" aria-label="Filter by product" className="story-filters">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              aria-pressed={product === f.value}
              onClick={() => setProduct(f.value)}
              className="story-filter"
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-[300px]">
          <label htmlFor="story-search" className="sr-only">
            Search sample stories
          </label>
          <Search aria-hidden className="spec-subtext pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2" />
          <Input
            id="story-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sample stories…"
            className="glass-field h-12 rounded-full pl-10 pr-4 text-base md:text-[15px] focus-visible:border-primary/50 focus-visible:ring-[3px] focus-visible:ring-primary/20"
          />
        </div>
      </div>

      <p data-card aria-live="polite" className="spec-subtext mt-6 text-center text-[14px]">
        {shown.length === STORIES.length
          ? `Showing all ${STORIES.length} sample stories`
          : `Showing ${shown.length} of ${STORIES.length} sample stories`}
      </p>

      {shown.length ? (
        // the same rows in every card (pill, context, title, description,
        // mock-up), so their tops line up and every button sits at the bottom
        <ul className="mt-8 grid gap-7 min-[700px]:grid-cols-2 lg:grid-cols-3">
          {shown.map((s) => (
            <li key={s.id} data-card className="flex">
              <article className="story-card relative flex w-full flex-col p-6 sm:p-7">
                <div className="flex items-center justify-between gap-3">
                  <span className="story-pill">Sample story</span>
                  <span className="story-product">{s.product}</span>
                </div>
                <p className="spec-subtext mt-5 text-[14px]">{s.team}</p>
                <h3 className="story-title how-ink mt-2 font-display">{s.title}</h3>
                <p className="story-desc mt-3">{s.summary}</p>
                <div className="mt-6">
                  <CardMockup kind={s.mockup} />
                </div>
                <div className="mt-auto pt-6">
                  <StoryButton id={s.id} className="story-cta group">
                    <span>
                      Read sample story
                      <span className="sr-only">: {s.title}</span>
                    </span>
                    <span aria-hidden className="story-cta-arrow">
                      <ArrowRight className="size-4" />
                    </span>
                  </StoryButton>
                </div>
              </article>
            </li>
          ))}
        </ul>
      ) : (
        <div className="glass-tile glass-static mx-auto mt-8 max-w-[560px] p-8 text-center">
          <p className="how-ink text-[17px] font-medium">No sample stories match your search.</p>
          <p className="spec-subtext mt-2 text-[15px] leading-[1.7]">
            Try another word, or show every story again.
          </p>
          <button type="button" onClick={reset} className="story-link mx-auto mt-4">
            Show all stories
          </button>
        </div>
      )}
    </>
  );
}
