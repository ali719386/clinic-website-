// STAND-IN for the real app's helper (not included in this copy). The real
// one turns a failed network call into a message instead of an error screen.
// Here it just calls the function. Keep the name and signature.

export async function submitForm<A extends unknown[], R>(
  _label: string,
  fn: (...args: A) => Promise<R>,
  args: A,
  _opts: { write?: boolean; unconfirmed?: string } = {},
): Promise<R | { error: string }> {
  try {
    return await fn(...args)
  } catch {
    return { error: "Something went wrong. Please try again." }
  }
}
