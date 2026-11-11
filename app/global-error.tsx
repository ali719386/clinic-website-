"use client"

import "@workspace/ui/globals.css"

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body className="flex min-h-svh flex-col items-center justify-center gap-3 p-6 text-center">
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <button className="underline underline-offset-4" onClick={reset}>Try again</button>
      </body>
    </html>
  )
}
