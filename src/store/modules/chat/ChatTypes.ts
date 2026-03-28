import type { UiChatMessage } from "@/types/chat";

/** Chat module state shape (DSH `DatasetsState` style). */
export interface ChatState {
  isOpen: boolean;
  sessionId: string;
  messages: UiChatMessage[];
  loading: boolean;
  suggestedTopics: string[];
  error: string | null;
}

/** Alias for existing imports; prefer `ChatState`. */
export type ChatModuleState = ChatState;

export enum ChatMutationTypes {
  TOGGLE_CHAT = "TOGGLE_CHAT",
  SET_CHAT_OPEN = "SET_CHAT_OPEN",
  SET_SESSION_ID = "SET_SESSION_ID",
  SET_LOADING = "SET_LOADING",
  SET_ERROR = "SET_ERROR",
  ADD_MESSAGE = "ADD_MESSAGE",
  SET_SUGGESTED_TOPICS = "SET_SUGGESTED_TOPICS",
  CLEAR_MESSAGES = "CLEAR_MESSAGES",
}

export enum ChatActionTypes {
  INITIALIZE_CHAT = "initializeChat",
  RESET_SESSION = "resetSession",
  CLEAR_SERVER_SESSION = "clearServerSession",
  SEND_MESSAGE = "sendMessage",
}
