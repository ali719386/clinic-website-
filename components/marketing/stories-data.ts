// The sample stories on /success-stories (2026-10-27). Every story here is an
// illustration, not a customer: no clinic names, quotes, numbers or results.
// Only the plan limits are confirmed (DMS 1 doctor and 1 receptionist; CMS up
// to 10 doctors; ECMS 10+), so the workflows are written as proposals to
// confirm in a demo, never as features a plan is sure to include.

export type StoryProduct = "DMS" | "CMS" | "ECMS";
export type StoryMockup = "queue" | "rx" | "team" | "plan";

export interface Story {
  id: string;
  product: StoryProduct;
  /** the team context after the product, "Single-doctor practice" */
  team: string;
  title: string;
  summary: string;
  mockup: StoryMockup;
  challenge: string;
  workflow: string[];
  verify: string[];
}

export const FEATURED: Story = {
  id: "featured",
  product: "DMS",
  team: "Sample single-doctor practice · 1 doctor · 1 receptionist",
  title: "A busy reception. A clearer path from arrival to care.",
  summary:
    "An illustrative look at a single-doctor practice moving from a paper list to a shared view of the day.",
  mockup: "queue",
  challenge:
    "Imagine a practice where the receptionist keeps the day on a paper list. Patients ask how long they still have to wait, and the doctor only learns who is next when someone walks in.",
  workflow: [
    "The receptionist registers each patient on arrival and gives them a token.",
    "The doctor and the receptionist look at the same list of today’s patients.",
    "When the doctor calls the next token, the list changes for both of them.",
  ],
  verify: [
    "How this practice’s day really runs, from the first patient to the last.",
    "Which of these steps the product supports for this practice, shown in a demo.",
    "Any change in waiting or workload, measured and confirmed by the clinic before it is shared.",
  ],
};

export const STORIES: Story[] = [
  {
    id: "dms-consultation",
    product: "DMS",
    team: "Single-doctor practice",
    title: "More clarity between each consultation.",
    summary: "A sample journey through reception, the waiting queue and the doctor’s desk.",
    mockup: "rx",
    challenge:
      "Picture a doctor who sees one patient after another and writes every prescription by hand, with little time to look back at a patient’s earlier visits.",
    workflow: [
      "The patient’s earlier visits are open on screen when the consultation starts.",
      "The doctor writes the prescription on screen and prints it for the patient.",
      "The next token is called when the doctor is ready.",
    ],
    verify: [
      "Which parts of this journey fit the doctor’s own way of working.",
      "Which of these steps the product supports, shown in a demo.",
      "Any effect on the doctor’s day, confirmed by the clinic before it is shared.",
    ],
  },
  {
    id: "cms-queues",
    product: "CMS",
    team: "Up to 10 doctors",
    title: "One reception. Different doctor queues.",
    summary: "An illustrative multi-doctor clinic organising the flow of patients across its team.",
    mockup: "team",
    challenge:
      "Imagine a front desk serving several doctors at once. Each doctor has their own patients waiting, and the receptionists have to keep track of who is waiting for whom.",
    workflow: [
      "Reception registers each patient for the doctor they came to see.",
      "Each doctor sees their own list of waiting patients.",
      "Receptionists can see every doctor’s list from the front desk.",
    ],
    verify: [
      "How many doctors and receptionists the clinic has, and how they share the work.",
      "Which of these steps the product supports for this clinic, shown in a demo.",
      "Any change at the front desk, measured and confirmed by the clinic before it is shared.",
    ],
  },
  {
    id: "ecms-planning",
    product: "ECMS",
    team: "Larger teams",
    title: "A bigger team. A considered next step.",
    summary: "A sample planning story for a practice with more than ten doctors and evolving needs.",
    mockup: "plan",
    challenge:
      "Consider a practice with more than ten doctors, several receptionists and needs that change as it grows. Moving everyone to a new way of working at once is a big decision.",
    workflow: [
      "Start with a conversation about the teams, the rooms and the way the day runs.",
      "Agree which parts of the day to begin with, and who will use them first.",
      "Prepare a custom quote for the practice’s size and needs.",
    ],
    verify: [
      "The practice’s own requirements, in its own words.",
      "What the product can support for a team of this size, shown and agreed in writing.",
      "Any outcome, published only once the practice has confirmed the evidence.",
    ],
  },
];

export const ALL_STORIES = [FEATURED, ...STORIES];
