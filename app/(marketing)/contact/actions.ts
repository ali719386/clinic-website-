"use server";

// STAND-IN for the real app (not included in this copy). In the real website
// this saves the demo request for our team to follow up. Here it
// saves nothing: it only checks the form the same basic way and answers, so
// the form can be designed and tested. Keep the exported names and types.

export type DemoRequestState = {
  success: boolean;
  message: string;
} | null;

export async function submitDemoRequest(
  _prevState: DemoRequestState,
  formData: FormData
): Promise<DemoRequestState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  if (name.length < 2) return { success: false, message: "Please tell us your name." };
  if (!email && !phone) return { success: false, message: "Please give us an email or a phone number, so we can reach you." };
  await new Promise((r) => setTimeout(r, 600)); // feels like a real request
  return { success: true, message: "Thank you! We'll contact you within one working day to book your demo. (Demo copy: nothing was sent.)" };
}
