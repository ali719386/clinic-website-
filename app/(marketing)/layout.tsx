import "@/styles/marketing.css"
import { ForgetPreviousSession } from "@/components/forget-previous-session"
import { DemoDialogProvider } from "@/components/marketing/demo-dialog"
import { SmoothScroll } from "@/components/marketing/smooth-scroll"
import { ChatWidget } from "@/components/marketing/chat-widget"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="scroll-smooth">
      {/* privacy G2: a tab that showed signed-in pages and came here without a page load is loaded again */}
      <ForgetPreviousSession />
      <SmoothScroll />
      <DemoDialogProvider>{children}</DemoDialogProvider>
      <ChatWidget />
    </div>
  )
}
