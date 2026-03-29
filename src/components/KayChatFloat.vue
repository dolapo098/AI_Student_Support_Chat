<template>
  <div class="kay-float" :class="{ 'is-open': isOpen }">
    <button
      v-if="!isOpen"
      type="button"
      class="chat-bubble"
      title="Open Kay - student support chat"
      aria-label="Open chat"
      @click="toggleChat"
    >
      <span class="bubble-icon" aria-hidden="true">💬</span>
      <span class="bubble-pulse" aria-hidden="true" />
    </button>

    <div v-else class="chat-window" role="dialog" aria-label="Kay chat">
      <div class="chat-header">
        <div class="header-info">
          <span class="header-icon" aria-hidden="true">🎓</span>
          <div class="header-text">
            <h2 class="header-title">Kay</h2>
            <p class="header-sub">Kent Advice for You</p>
          </div>
        </div>
        <div class="header-actions">
          <button
            type="button"
            class="icon-btn"
            title="Clear conversation"
            @click="onClearServerSession"
          >
            ↻
          </button>
          <button type="button" class="close-btn" aria-label="Close chat" @click="toggleChat">
            ×
          </button>
        </div>
      </div>

      <div v-if="errorBanner" class="chat-banner" role="alert">
        {{ errorBanner }}
      </div>

      <div ref="listEl" class="chat-messages">
        <div
          v-for="m in messages"
          :key="m.id"
          class="message-row"
          :class="m.role"
        >
          <div class="message-content">
            <div class="message-head">
              <span class="who">{{ m.role === 'user' ? 'You' : 'Kay' }}</span>
              <span v-if="m.isWellbeing" class="pill">Wellbeing</span>
              <time class="message-time" :datetime="messageIso(m.createdAt)">{{
                formatTime(m.createdAt)
              }}</time>
            </div>
            <div
              v-if="m.role === 'assistant'"
              class="message-text message-md"
              v-html="assistantHtml(m.content)"
            />
            <p v-else class="message-text">{{ m.content }}</p>
          </div>
        </div>

        <div v-if="loading" class="message-row assistant">
          <div class="message-content thinking">
            <span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>
          </div>
        </div>
      </div>

      <div v-if="topics.length" class="chips-wrap">
        <button
          v-for="(t, i) in topics"
          :key="i"
          type="button"
          class="chip"
          @click="sendChip(t)"
        >
          {{ t }}
        </button>
      </div>

      <div class="chat-input-area">
        <input
          v-model="userInput"
          type="text"
          autocomplete="off"
          placeholder="Ask Kay anything…"
          :disabled="loading"
          @keyup.enter="send"
        />
        <button
          type="button"
          class="send-btn"
          :disabled="!userInput.trim() || loading"
          aria-label="Send message"
          @click="send"
        >
          <span class="send-icon" aria-hidden="true">➤</span>
        </button>
      </div>

      <p class="session-hint" :title="sessionId">Session {{ sessionId.slice(0, 8) }}…</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-facing-decorator";
import type { ChatModuleState } from "@/store/modules/chat";
import { namespace } from "@/store/StoreDecorators";
import { Modules } from "@/store/StoreModuleTypes";
import { ChatActionTypes, ChatMutationTypes } from "@/store/modules/chat/ChatTypes";
import type { UiChatMessage } from "@/types/chat";
import { renderAssistantMarkdown } from "@/utils/assistantMarkdown";

const ChatStore = namespace(Modules.Chat);

@Component({
  name: "KayChatFloat",
})
export default class KayChatFloat extends Vue {
  public userInput = "";

  declare $refs: {
    listEl: HTMLElement;
  };

  @ChatStore.State((s: ChatModuleState) => s.isOpen)
  public readonly isOpen!: boolean;

  @ChatStore.State((s: ChatModuleState) => s.messages)
  public readonly messages!: UiChatMessage[];

  @ChatStore.State((s: ChatModuleState) => s.loading)
  public readonly loading!: boolean;

  @ChatStore.State((s: ChatModuleState) => s.suggestedTopics)
  public readonly topics!: string[];

  @ChatStore.State((s: ChatModuleState) => s.sessionId)
  public readonly sessionId!: string;

  @ChatStore.State((s: ChatModuleState) => s.error)
  public readonly errorBanner!: string | null;

  @ChatStore.Mutation(ChatMutationTypes.TOGGLE_CHAT)
  public toggleChat!: () => void;

  @ChatStore.Action(ChatActionTypes.INITIALIZE_CHAT)
  public initializeChat!: () => Promise<void>;

  @ChatStore.Action(ChatActionTypes.CLEAR_SERVER_SESSION)
  public clearServerSession!: () => Promise<void>;

  @ChatStore.Action(ChatActionTypes.SEND_MESSAGE)
  public sendMessage!: (text: string) => Promise<void>;

  @Watch("isOpen")
  public onIsOpenChange(open: boolean): void {
    if (open) {
      void this.initializeChat();
    }
  }

  @Watch("messages", { deep: true })
  public async onMessagesChange(): Promise<void> {
    await this.$nextTick();
    const el = this.$refs.listEl;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }

  public send(): void {
    const t = this.userInput;
    this.userInput = "";
    void this.sendMessage(t);
  }

  public sendChip(text: string): void {
    this.userInput = text;
    this.send();
  }

  public onClearServerSession(): void {
    void this.clearServerSession();
  }

  public formatTime(ts: number): string {
    return new Date(ts).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  public messageIso(ts: number): string {
    return new Date(ts).toISOString();
  }

  public assistantHtml(content: string): string {
    return renderAssistantMarkdown(content);
  }
}
</script>

<style scoped>
.kay-float {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 1000;
  font-family: inherit;
}

.chat-bubble {
  position: relative;
  width: 62px;
  height: 62px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 6px 24px rgba(102, 126, 234, 0.45), 0 2px 8px rgba(0, 0, 0, 0.12);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.chat-bubble:hover {
  transform: scale(1.08);
  box-shadow: 0 8px 28px rgba(102, 126, 234, 0.55), 0 4px 12px rgba(0, 0, 0, 0.15);
}

.bubble-icon {
  font-size: 1.6rem;
  z-index: 1;
}

.bubble-pulse {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 2px solid rgba(102, 126, 234, 0.5);
  animation: pulse-ring 2s ease-out infinite;
}

@keyframes pulse-ring {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.35);
    opacity: 0;
  }
}

.chat-window {
  width: min(100vw - 2rem, 380px);
  height: min(88vh, 540px);
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 16px 48px rgba(15, 23, 42, 0.18), 0 0 0 1px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0.9rem 1rem;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  min-width: 0;
}

.header-icon {
  font-size: 1.35rem;
  line-height: 1;
}

.header-text {
  min-width: 0;
}

.header-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.header-sub {
  margin: 0.1rem 0 0;
  font-size: 0.72rem;
  opacity: 0.92;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.icon-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: #fff;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  transition: background 0.15s;
}

.icon-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.close-btn {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  line-height: 1;
  padding: 0 0.2rem;
  opacity: 0.95;
}

.close-btn:hover {
  opacity: 1;
}

.chat-banner {
  padding: 0.45rem 0.75rem;
  font-size: 0.75rem;
  background: #fff8e6;
  color: #7a5a00;
  border-bottom: 1px solid #f5e0a8;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background: linear-gradient(180deg, #f1f5f9 0%, #f8fafc 100%);
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.message-row {
  display: flex;
  max-width: 92%;
}

.message-row.user {
  align-self: flex-end;
}

.message-row.assistant {
  align-self: flex-start;
}

.message-content {
  padding: 0.65rem 0.9rem;
  border-radius: 14px;
  font-size: 0.9rem;
  line-height: 1.45;
}

.user .message-content {
  background: linear-gradient(135deg, #667eea 0%, #5a67d8 100%);
  color: #fff;
  border-bottom-right-radius: 4px;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.25);
}

.assistant .message-content {
  background: #fff;
  color: #1e293b;
  border: 1px solid #e2e8f0;
  border-bottom-left-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.message-head {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin-bottom: 0.25rem;
  font-size: 0.68rem;
}

.user .message-head {
  color: rgba(255, 255, 255, 0.85);
}

.assistant .message-head {
  color: #64748b;
}

.who {
  font-weight: 700;
}

.assistant .who {
  color: #475569;
}

.pill {
  background: rgba(139, 41, 66, 0.15);
  color: #8b2942;
  padding: 0.05rem 0.4rem;
  border-radius: 999px;
  font-size: 0.6rem;
  font-weight: 700;
}

.message-time {
  margin-left: auto;
  opacity: 0.75;
}

.message-text {
  margin: 0;
  white-space: pre-wrap;
}

.message-md {
  white-space: normal;
}

.message-md :deep(p) {
  margin: 0 0 0.45rem;
}

.message-md :deep(p:last-child) {
  margin-bottom: 0;
}

.message-md :deep(ul),
.message-md :deep(ol) {
  margin: 0.35rem 0 0.5rem;
  padding-left: 1.2rem;
}

.message-md :deep(li) {
  margin: 0.2rem 0;
}

.message-md :deep(strong) {
  font-weight: 700;
}

.message-md :deep(em) {
  font-style: italic;
}

.message-md :deep(a) {
  color: #5b21b6;
  text-decoration: underline;
  word-break: break-word;
}

.message-md :deep(hr) {
  border: none;
  border-top: 1px solid #e2e8f0;
  margin: 0.5rem 0;
}

.message-md :deep(code) {
  font-size: 0.86em;
  background: #f1f5f9;
  padding: 0.1em 0.35em;
  border-radius: 4px;
}

.message-md :deep(pre) {
  margin: 0.45rem 0;
  padding: 0.45rem 0.55rem;
  background: #f1f5f9;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 0.82em;
}

.message-md :deep(pre code) {
  background: none;
  padding: 0;
}

.thinking .dot {
  animation: blink 1.4s infinite both;
  font-size: 1.4rem;
  line-height: 0.5;
  color: #94a3b8;
}

.thinking .dot:nth-child(2) {
  animation-delay: 0.2s;
}
.thinking .dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes blink {
  0% {
    opacity: 0.2;
  }
  20% {
    opacity: 1;
  }
  100% {
    opacity: 0.2;
  }
}

.chips-wrap {
  padding: 0.5rem 0.75rem 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  background: #fff;
  border-top: 1px solid #f1f5f9;
}

.chip {
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  border-radius: 999px;
  padding: 0.3rem 0.65rem;
  font-size: 0.72rem;
  cursor: pointer;
  font-family: inherit;
  color: #5b21b6;
  transition: border-color 0.15s, background 0.15s;
}

.chip:hover {
  border-color: #667eea;
  background: #eef2ff;
}

.chat-input-area {
  padding: 0.85rem 1rem 0.65rem;
  background: #fff;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.chat-input-area input {
  flex: 1;
  padding: 0.55rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 22px;
  font-size: 0.9rem;
  outline: none;
  font-family: inherit;
}

.chat-input-area input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
}

.send-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.1s;
}

.send-btn:hover:not(:disabled) {
  transform: scale(1.05);
}

.send-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.send-icon {
  font-size: 0.95rem;
  margin-left: 2px;
}

.session-hint {
  margin: 0;
  padding: 0.35rem 1rem 0.65rem;
  font-size: 0.65rem;
  color: #94a3b8;
  text-align: center;
  background: #fff;
  font-variant-numeric: tabular-nums;
}
</style>
