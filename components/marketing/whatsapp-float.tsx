// WhatsApp on the marketing pages (Part 1, 2026-10-22). Since 2026-10-27 the
// floating WhatsApp button is part of the chat dock
// (components/marketing/chat-widget.tsx); this file keeps the link, the
// brand green and the logo they share. WhatsApp's own green is a fixed
// colour, not a theme token (allowed in test/unit/marketing-tokens.test.ts).
export const WHATSAPP_CHAT_URL = `https://wa.me/923071118812?text=${encodeURIComponent("Hi, I'm interested in Clinics by Prob N Tech")}`

/** WhatsApp's own green: a brand colour, not a theme token (the chatbot uses it as --wa) */
export const WHATSAPP_GREEN = "#25d366"

/** WhatsApp's logo, in the current text colour (also used by the chatbot) */
export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.23-9.43 9.44-9.43a9.37 9.37 0 0 1 6.67 2.77 9.37 9.37 0 0 1 2.76 6.67c0 5.2-4.24 9.43-9.44 9.43m8.03-17.46A11.27 11.27 0 0 0 12.05.72C5.8.72.7 5.82.7 12.08c0 2 .52 3.95 1.52 5.67L.6 23.28l5.67-1.49a11.32 11.32 0 0 0 5.78 1.47h.01c6.26 0 11.35-5.1 11.36-11.36 0-3.03-1.18-5.88-3.33-8.03" />
    </svg>
  )
}
