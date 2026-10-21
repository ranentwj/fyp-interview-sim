import "server-only";

import { demoPersona, demoScenario } from "@/features/interview/demo-data";
import type {
  InterviewReplyRequest,
  InterviewReplyResponse,
} from "@/features/interview/interview-types";
import { mockChatProvider } from "./mock-chat-provider";

export class UnknownScenarioError extends Error {}

export async function generateInterviewReply(
  request: InterviewReplyRequest,
): Promise<InterviewReplyResponse> {
  if (request.scenarioId !== demoScenario.id) {
    throw new UnknownScenarioError(`Unknown scenario: ${request.scenarioId}`);
  }

  const text = await mockChatProvider.generateReply({
    scenario: demoScenario,
    persona: demoPersona,
    messages: request.messages,
  });

  return {
    reply: {
      id: crypto.randomUUID(),
      speaker: "persona",
      text,
    },
  };
}
