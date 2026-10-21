import type {
  InterviewErrorResponse,
  InterviewMessage,
  InterviewReplyRequest,
} from "@/features/interview/interview-types";
import {
  generateInterviewReply,
  UnknownScenarioError,
} from "@/server/chatbot/generate-interview-reply";

const maximumMessageCount = 100;
const maximumMessageLength = 2_000;

function isInterviewMessage(value: unknown): value is InterviewMessage {
  if (!value || typeof value !== "object") {
    return false;
  }

  const message = value as Partial<InterviewMessage>;

  return (
    typeof message.id === "string" &&
    (message.speaker === "learner" || message.speaker === "persona") &&
    typeof message.text === "string" &&
    message.text.trim().length > 0 &&
    message.text.length <= maximumMessageLength
  );
}

function isInterviewReplyRequest(value: unknown): value is InterviewReplyRequest {
  if (!value || typeof value !== "object") {
    return false;
  }

  const request = value as Partial<InterviewReplyRequest>;

  return (
    typeof request.scenarioId === "string" &&
    Array.isArray(request.messages) &&
    request.messages.length > 0 &&
    request.messages.length <= maximumMessageCount &&
    request.messages.every(isInterviewMessage)
  );
}

function errorResponse(error: string, status: number) {
  const body: InterviewErrorResponse = { error };
  return Response.json(body, { status });
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return errorResponse("The request body must be valid JSON.", 400);
  }

  if (!isInterviewReplyRequest(body)) {
    return errorResponse("The interview request is invalid.", 400);
  }

  try {
    const response = await generateInterviewReply(body);
    return Response.json(response);
  } catch (error) {
    if (error instanceof UnknownScenarioError) {
      return errorResponse("The requested interview scenario does not exist.", 404);
    }

    console.error("Unable to generate an interview reply", error);
    return errorResponse("The virtual user could not respond.", 500);
  }
}
