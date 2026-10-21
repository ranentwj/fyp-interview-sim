export type InterviewSpeaker = "learner" | "persona";

export type InterviewMessage = {
  id: string;
  speaker: InterviewSpeaker;
  text: string;
};

export type InterviewScenario = {
  id: string;
  title: string;
  category: string;
  duration: string;
  objective: string;
  brief: string;
};

export type InterviewPersona = {
  name: string;
  initials: string;
  age: number;
  role: string;
  location: string;
  traits: string[];
};

export type InterviewReplyRequest = {
  scenarioId: string;
  messages: InterviewMessage[];
};

export type InterviewReplyResponse = {
  reply: InterviewMessage;
};

export type InterviewErrorResponse = {
  error: string;
};
