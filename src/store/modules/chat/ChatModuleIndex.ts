import type { Module } from "vuex";
import type { RootState } from "../../rootState";
import type { ChatState } from "./ChatTypes";
import { state } from "./ChatState";
import { mutations } from "./ChatMutations";
import { actions } from "./ChatActions";
import { getters } from "./ChatGetters";

export const chatModule: Module<ChatState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
