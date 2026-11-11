// Urdu text, anywhere on the site (2026-10-24): marked lang="ur" and dir="rtl",
// so it is set in Noto Nastaliq Urdu (styles/urdu.css) while the English
// around it keeps its own font. Nastaliq looks small, so pass a size about
// 1.1-1.15 times the English next to it (a class such as text-[17px]).

import type { ElementType, ReactNode } from "react";

export function Urdu({
  as: Tag = "span",
  className,
  children,
}: {
  /** the element: span (default, inside other text) or p, div… */
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag lang="ur" dir="rtl" className={className}>
      {children}
    </Tag>
  );
}
