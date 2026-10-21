import "server-only";

import type { ChatProvider } from "./chat-provider";

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

const fallbackResponse =
  "I’m not sure how to answer that yet. Could you ask me something more specific about how I currently manage my money or what tends to go wrong?";

export const mockChatProvider: ChatProvider = {
  async generateReply({ messages }) {
    const latestQuestion = messages.findLast((message) => message.speaker === "learner")?.text;

    if (!latestQuestion) {
      return fallbackResponse;
    }

    const normalizedQuestion = latestQuestion.toLowerCase();
    const match = cannedResponses.find(({ keywords }) =>
      keywords.some((keyword) => normalizedQuestion.includes(keyword)),
    );

    return match?.response ?? fallbackResponse;
  },
};
