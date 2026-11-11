// A small drawn token queue for the marketing pages (UI audit, 2026-10-23):
// readable at any size, unlike a shrunken screenshot. Invented names.
const ROWS = [
  { token: "07", name: "Ayesha Bibi", status: "Called", tone: "called" },
  { token: "08", name: "Muhammad Asif", status: "Waiting", tone: "waiting" },
  { token: "09", name: "Sana Tariq", status: "Waiting", tone: "waiting" },
] as const

export function MiniQueue({ dark = false, compact = false }: { dark?: boolean; compact?: boolean }) {
  return (
    <ul aria-label="Example token queue" className={`w-full space-y-2 ${compact ? "text-[11px]" : "text-[13px]"}`}>
      {ROWS.map((r) => (
        <li
          key={r.token}
          className={`flex items-center gap-2.5 rounded-xl px-3 ${compact ? "py-1.5" : "py-2.5"} ${
            dark ? "bg-brand-deep-foreground/[0.06]" : "border border-border bg-card shadow-sm"
          }`}
        >
          <span className={`inline-flex shrink-0 items-center justify-center rounded-lg font-display font-bold tabular-nums ${
            compact ? "size-6 text-[10px]" : "size-8 text-[12px]"
          } ${dark ? "bg-brand-deep-foreground/[0.1] text-brand-deep-foreground" : "bg-primary/10 text-primary"}`}>
            {r.token}
          </span>
          <span className={`min-w-0 flex-1 truncate font-medium ${dark ? "text-brand-deep-foreground" : "text-foreground"}`}>{r.name}</span>
          <span className={`shrink-0 rounded-full px-2 py-0.5 font-semibold ${compact ? "text-[9px]" : "text-[11px]"} ${
            r.tone === "called"
              ? "bg-success/10 text-success"
              : dark ? "bg-brand-deep-foreground/[0.08] text-brand-deep-foreground/80" : "bg-warning/10 text-warning"
          }`}>
            {r.status}
          </span>
        </li>
      ))}
    </ul>
  )
}
