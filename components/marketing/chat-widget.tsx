"use client";

// The floating dock (2026-10-27): one teal pill at the bottom right that
// holds both ways to reach us: "Ask Chatbot" (the chatbot, with its robot)
// and, after a thin divider, WhatsApp. It replaces the separate WhatsApp
// button. Not on /contact (which lists both), and out of the way while a form
// field elsewhere has focus (styles/marketing.css). The chat panel's code
// loads on the first open (chat-panel.tsx) and then stays, hidden, so a
// closed chat keeps its conversation (in React state only, never in storage).

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { X } from "lucide-react";
import { ChatBotIcon } from "@/components/marketing/chat-bot-icon";
import { WHATSAPP_CHAT_URL, WhatsAppIcon } from "@/components/marketing/whatsapp-float";

const ChatPanel = dynamic(() => import("@/components/marketing/chat-panel").then((m) => m.ChatPanel), { ssr: false });

export function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  if (pathname === "/contact") return null;

  const close = () => {
    setOpen(false);
    button.current?.focus();
  };

  return (
    <>
      <div className="chat-dock" data-open={open}>
        <button
          ref={button}
          type="button"
          onClick={() => {
            setLoaded(true);
            if (open) close();
            else setOpen(true);
          }}
          aria-expanded={open}
          aria-controls="chat-panel"
          className="chat-dock-ask"
        >
          <span className="chat-dock-bot" aria-hidden>
            {open ? <X className="size-5" /> : <ChatBotIcon className="chat-launcher-bot size-[34px]" />}
          </span>
          <span className="chat-dock-label">{open ? "Close chat" : "Ask Chatbot"}</span>
        </button>
        <span className="chat-dock-divider" aria-hidden />
        <a
          href={WHATSAPP_CHAT_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          title="Chat with us on WhatsApp"
          className="chat-dock-wa"
        >
          <WhatsAppIcon className="size-[22px]" />
        </a>
      </div>
      {loaded && <ChatPanel open={open} onClose={close} />}
    </>
  );
}
