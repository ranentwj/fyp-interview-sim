export type Speaker = "learner" | "persona";

export type DemoMessage = {
  id: string;
  speaker: Speaker;
  text: string;
};

export const demoScenario = {
  title: "Managing irregular income",
  category: "Personal finance",
  duration: "10–15 min",
  objective:
    "Understand how Alex currently plans, tracks, and adjusts spending when monthly income changes.",
  brief:
    "A delivery rider wants a less stressful way to manage everyday finances. Interview Alex to uncover routines, frustrations, constraints, and priorities before suggesting any solution.",
};

export const demoPersona = {
  name: "Alex Tan",
  initials: "AT",
  age: 28,
  role: "Freelance delivery rider",
  location: "Singapore",
  traits: ["Friendly", "Practical", "Initially vague"],
};

export const initialMessages: DemoMessage[] = [
  {
    id: "welcome",
    speaker: "persona",
    text: "Hi, I’m Alex. Thanks for speaking with me. Managing my money has become harder since I started doing delivery work full-time, but I’m not completely sure what would make it easier.",
  },
];

const cannedResponses = [
  {
    keywords: ["income", "earn", "salary", "paid", "month"],
    response:
      "My income changes quite a lot. Some weeks are busy, but during quieter periods or when it rains heavily, I can earn much less than I expected.",
  },
  {
    keywords: ["track", "spend", "expense", "record", "budget"],
    response:
      "I mostly check my banking app and keep rough notes on my phone. I usually start with a budget, but I stop updating it when work gets busy.",
  },
  {
    keywords: ["difficult", "hard", "frustrat", "problem", "stress"],
    response:
      "The stressful part is not knowing how much I can safely spend. A good week can make me feel comfortable, then a slow week catches me off guard.",
  },
  {
    keywords: ["goal", "want", "important", "priority", "save"],
    response:
      "I want to put aside enough for bike repairs and emergencies without constantly calculating everything myself. I still need some flexibility for everyday expenses.",
  },
  {
    keywords: ["app", "phone", "tool", "technology", "use"],
    response:
      "I use my phone for almost everything while working. I would try a simple tool, but I would probably give up if it needed lots of manual entries every day.",
  },
];

export function getDemoResponse(question: string): string {
  const normalizedQuestion = question.toLowerCase();
  const match = cannedResponses.find(({ keywords }) =>
    keywords.some((keyword) => normalizedQuestion.includes(keyword)),
  );

  return (
    match?.response ??
    "I’m not sure how to answer that yet. Could you ask me something more specific about how I currently manage my money or what tends to go wrong?"
  );
}
