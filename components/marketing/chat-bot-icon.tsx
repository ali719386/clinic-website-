// The chatbot's mascot (2026-10-27): a small friendly robot (a white head,
// a dark visor with smiling teal eyes, teal ear pods), drawn here so it
// matches the site's teal and stays sharp at any size. Its colours are the
// theme tokens (styles/marketing.css, .bot-*). Decorative: always aria-hidden.

export function ChatBotIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={`bot-icon ${className ?? ""}`} aria-hidden focusable="false">
      {/* antenna */}
      <path className="bot-antenna" d="M32 13V7" strokeWidth="3" strokeLinecap="round" />
      <circle className="bot-ear" cx="32" cy="6" r="3.5" />
      {/* ear pods */}
      <rect className="bot-ear" x="4" y="25" width="9" height="16" rx="4.5" />
      <rect className="bot-ear" x="51" y="25" width="9" height="16" rx="4.5" />
      {/* head */}
      <rect className="bot-head" x="9" y="13" width="46" height="40" rx="18" />
      <ellipse className="bot-shine" cx="22" cy="19.5" rx="7" ry="3" />
      {/* visor and eyes */}
      <rect className="bot-visor" x="15" y="23" width="34" height="21" rx="10.5" />
      <path className="bot-eye" d="M22.5 35.5q3.5-4.5 7 0M34.5 35.5q3.5-4.5 7 0" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}
