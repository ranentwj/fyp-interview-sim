import type {
  InterviewMessage,
  InterviewPersona,
  InterviewScenario,
} from "@/features/interview/interview-types";

export type ChatProviderRequest = {
  scenario: InterviewScenario;
  persona: InterviewPersona;
  messages: InterviewMessage[];
};

export interface ChatProvider {
  generateReply(request: ChatProviderRequest): Promise<string>;
}
