import type {
  InterviewMessage,
  InterviewPersona,
  InterviewScenario,
} from "./interview-types";

export const demoScenario: InterviewScenario = {
  id: "managing-irregular-income",
  title: "Managing irregular income",
  category: "Personal finance",
  duration: "10–15 min",
  objective:
    "Understand how Alex currently plans, tracks, and adjusts spending when monthly income changes.",
  brief:
    "A delivery rider wants a less stressful way to manage everyday finances. Interview Alex to uncover routines, frustrations, constraints, and priorities before suggesting any solution.",
};

export const demoPersona: InterviewPersona = {
  name: "Alex Tan",
  initials: "AT",
  age: 28,
  role: "Freelance delivery rider",
  location: "Singapore",
  traits: ["Friendly", "Practical", "Initially vague"],
};

export const initialMessages: InterviewMessage[] = [
  {
    id: "welcome",
    speaker: "persona",
    text: "Hi, I’m Alex. Thanks for speaking with me. Managing my money has become harder since I started doing delivery work full-time, but I’m not completely sure what would make it easier.",
  },
];
