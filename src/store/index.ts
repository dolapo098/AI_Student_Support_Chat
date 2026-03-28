import { createStore } from "vuex";
import type { RootState } from "./rootState";
import { chatModule } from "./modules/chat";

const store = createStore<RootState>({
  modules: {
    chat: chatModule,
  },
});

export default store;
export type { RootState };
