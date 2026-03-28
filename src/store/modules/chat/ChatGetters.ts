import type { GetterTree } from "vuex";
import type { ChatState } from "./ChatTypes";
import type { RootState } from "../../rootState";

export const getters: GetterTree<ChatState, RootState> = {
  shortSessionId: (state) => state.sessionId.slice(0, 8),

  hasSuggestedTopics: (state) => state.suggestedTopics.length > 0,

  errorBanner: (state): string | null => state.error,
};
