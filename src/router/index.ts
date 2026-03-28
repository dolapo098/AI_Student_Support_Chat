import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "chat",
      component: () => import("@/views/ChatView.vue"),
      meta: { title: "Kay — Kent Student Support" },
    },
  ],
});

router.afterEach((to) => {
  document.title = (to.meta.title as string) ?? "Kay";
});

export default router;
