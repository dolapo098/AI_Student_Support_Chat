import type { AxiosInstance } from "axios";
import type { ChatApiResponse } from "@/types/chat";
import { kentApiClient } from "./axiosClient";
import { mapAxiosErrorToUserMessage } from "./httpErrorFormatter";

export { kentApiClient as api } from "./axiosClient";

// Kent AI Service (FastAPI): base URL = import.meta.env.VITE_API_BASE_URL (e.g. .../api/v1)

export interface ChatSendPayload {
  message: string;
  session_id: string;
}

export type ChatSendResult =
  | { ok: true; data: ChatApiResponse }
  | { ok: false; userMessage: string };

/**
 * Single HTTP façade for Kay UI → Kent student-support backend (mirrors large-app `*ApiHttp` pattern).
 * Errors are normalized here; Vuex only commits results.
 */
export class KayStudentSupportApi {
  private readonly http: AxiosInstance;

  constructor(http: AxiosInstance = kentApiClient) {
    this.http = http;
  }

  public async sendChatMessage(
    payload: ChatSendPayload,
  ): Promise<ChatSendResult> {
    const base = this.http.defaults.baseURL ?? "";
    try {
      const { data } = await this.http.post<ChatApiResponse>("/chat", payload);
      return { ok: true, data };
    } catch (e: unknown) {
      if (import.meta.env.DEV) console.error("[Kay UI] /chat", e);
      return {
        ok: false,
        userMessage: mapAxiosErrorToUserMessage(e, base),
      };
    }
  }

  public async deleteChatSession(sessionId: string): Promise<void> {
    try {
      await this.http.delete(`/chat/session/${encodeURIComponent(sessionId)}`);
    } catch {
      /* best-effort; caller still resets local session */
    }
  }
}

export default new KayStudentSupportApi();
