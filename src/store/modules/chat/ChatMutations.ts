import type { MutationTree } from "vuex";
import type { UiChatMessage } from "@/types/chat";
import { ChatMutationTypes, type ChatState } from "./ChatTypes";

export const mutations: MutationTree<ChatState> = {
  [ChatMutationTypes.TOGGLE_CHAT](state) {
    state.isOpen = !state.isOpen;
  },
  [ChatMutationTypes.SET_CHAT_OPEN](state, open: boolean) {
    state.isOpen = open;
  },
  [ChatMutationTypes.SET_SESSION_ID](state, id: string) {
    state.sessionId = id;
  },
  [ChatMutationTypes.SET_LOADING](state, v: boolean) {
    state.loading = v;
  },
  [ChatMutationTypes.SET_ERROR](state, msg: string | null) {
    state.error = msg;
  },
  [ChatMutationTypes.ADD_MESSAGE](state, msg: UiChatMessage) {
    state.messages.push(msg);
  },
  [ChatMutationTypes.SET_SUGGESTED_TOPICS](state, topics: string[]) {
    state.suggestedTopics = topics;
  },
  [ChatMutationTypes.CLEAR_MESSAGES](state) {
    state.messages = [];
    state.suggestedTopics = [];
    state.error = null;
  },
};
