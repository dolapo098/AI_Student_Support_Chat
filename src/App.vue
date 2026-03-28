<template>
  <router-view />
  <KayChatFloat />
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import KayChatFloat from "@/components/KayChatFloat.vue";

@Component({
  name: "App",
  components: {
    KayChatFloat,
  },
})
export default class App extends Vue {}
</script>
