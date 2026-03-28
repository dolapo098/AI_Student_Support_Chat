import type { ChatState } from "./ChatTypes";

export function newMessageId(): string {
  return crypto.randomUUID();
}

export const state: ChatState = {
  isOpen: false,
  sessionId: newMessageId(),
  messages: [],
  loading: false,
  suggestedTopics: [],
  error: null,
};
