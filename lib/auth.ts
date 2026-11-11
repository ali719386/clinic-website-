// STAND-IN for the real app (not included in this copy). In the real website a
// signed-in member of staff who opens the home page is sent to their dashboard.
// Here nobody is ever signed in.

export async function checkSession(): Promise<
  { status: "valid"; session: { role: string } } | { status: "invalid" } | { status: "none" }
> {
  return { status: "none" }
}
