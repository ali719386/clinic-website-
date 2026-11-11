"use client"

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-3 p-6 text-center">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <button className="text-primary underline underline-offset-4" onClick={reset}>Try again</button>
    </main>
  )
}
