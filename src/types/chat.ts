export type ChatRole = "user" | "assistant";

export interface UiChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
  /** Copy of server flag for this turn (assistant messages). */
  isWellbeing?: boolean;
}

export interface ChatApiResponse {
  answer: string;
  session_id: string;
  is_wellbeing: boolean;
  suggested_topics: string[];
}
