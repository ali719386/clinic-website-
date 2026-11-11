"use client";

// "Book a Demo" opens the short form in a pop-up (Part 1, 2026-10-22), so the
// visitor stays on the page. Without JavaScript the button is a plain link to
// /contact, which has the same form.

import { createContext, useCallback, useContext, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@workspace/ui/components/dialog";
import { DemoForm } from "./demo-form";

const DemoDialogContext = createContext<{ open: () => void } | null>(null);

export function useDemoDialog() {
  return useContext(DemoDialogContext);
}

export function DemoDialogProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [round, setRound] = useState(0); // a fresh form each time it opens
  const open = useCallback(() => {
    setRound((r) => r + 1);
    setIsOpen(true);
  }, []);
  return (
    <DemoDialogContext.Provider value={{ open }}>
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg max-h-[92svh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Book your free demo</DialogTitle>
            <DialogDescription>Tell us how to reach you. We reply within 24 hours.</DialogDescription>
          </DialogHeader>
          <DemoForm key={round} idPrefix={`demo-dialog-${round}`} onDone={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>
    </DemoDialogContext.Provider>
  );
}

export function BookDemoButton({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  const dialog = useDemoDialog();
  return (
    <a
      href="/contact"
      className={className}
      onClick={(e) => {
        onClick?.();
        if (!dialog) return; // no provider: the link goes to /contact
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return; // a new tab or window: /contact
        e.preventDefault();
        dialog.open();
      }}
    >
      {children}
    </a>
  );
}
