import type { ActionTree } from "vuex";
import type { RootState } from "../../rootState";
import type { ChatState } from "./ChatTypes";
import { ChatMutationTypes } from "./ChatTypes";
import kayApi from "@/services/api";
import { newMessageId } from "./ChatState";

const WELCOME_ASSISTANT_COPY =
  "Hi! 👋 I'm **Kay** (*Kent Advice for You*) — here for admissions, courses, fees and funding, " +
  "deadlines and assessments, wellbeing, and everyday student life at Kent.\n\n" +
  "Ask in your own words, even if it's vague — I'll help narrow down what you need. " +
  "Or try *“What can you help me with?”* for a quick tour.";

export const actions: ActionTree<ChatState, RootState> = {
  /**
   * Seeds the first assistant message when the panel opens and there is no history yet.
   */
  initializeChat({ state, commit }) {
    if (state.messages.length > 0) return;
    commit(ChatMutationTypes.ADD_MESSAGE, {
      id: newMessageId(),
      role: "assistant",
      content: WELCOME_ASSISTANT_COPY,
      createdAt: Date.now(),
    });
  },

  /**
   * Clears messages and topics locally and issues a new client session id.
   */
  resetSession({ commit }) {
    commit(ChatMutationTypes.CLEAR_MESSAGES);
    commit(ChatMutationTypes.SET_SESSION_ID, newMessageId());
  },

  /**
   * Deletes the server-side session for the current id, then resets local state.
   */
  async clearServerSession({ state, dispatch }) {
    await kayApi.deleteChatSession(state.sessionId);
    dispatch("resetSession");
  },

  /**
   * Sends the user message to the Kent API and applies the reply (or a formatted error) to the store.
   */
  async sendMessage({ state, commit }, text: string) {
    const trimmed = text.trim();
    if (!trimmed || state.loading) return;

    commit(ChatMutationTypes.SET_ERROR, null);
    commit(ChatMutationTypes.ADD_MESSAGE, {
      id: newMessageId(),
      role: "user",
      content: trimmed,
      createdAt: Date.now(),
    });
    commit(ChatMutationTypes.SET_LOADING, true);

    const result = await kayApi.sendChatMessage({
      message: trimmed,
      session_id: state.sessionId,
    });

    commit(ChatMutationTypes.SET_LOADING, false);

    if (!result.ok) {
      commit(ChatMutationTypes.SET_ERROR, result.userMessage);
      commit(ChatMutationTypes.ADD_MESSAGE, {
        id: newMessageId(),
        role: "assistant",
        content: result.userMessage,
        createdAt: Date.now(),
      });
      return;
    }

    const { data } = result;
    commit(ChatMutationTypes.ADD_MESSAGE, {
      id: newMessageId(),
      role: "assistant",
      content: data.answer,
      createdAt: Date.now(),
      isWellbeing: data.is_wellbeing,
    });
    commit(ChatMutationTypes.SET_SUGGESTED_TOPICS, data.suggested_topics ?? []);
  },
};
