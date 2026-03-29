<template>
  <div class="landing">
    <div class="landing-bg" aria-hidden="true" />
    <div class="landing-inner">
      <header class="top-bar">
        <div class="brand-mark">
          <span class="mark">K</span>
          <span class="brand-name">University of Kent</span>
        </div>
        <button type="button" class="ghost-btn" @click="openKay">Open chat</button>
      </header>

      <section class="hero">
        <p class="eyebrow">Student support</p>
        <h1>
          Meet <em>Kay</em><span class="dot">.</span>
        </h1>
        <p class="lead">
          Kent <strong>Advice</strong> for <strong>You</strong> - your first stop for admissions,
          deadlines, wellbeing, funding, and campus life. Answers are grounded in Kent sources;
          we’ll signpost you to the right team when you need a human.
        </p>
        <div class="cta-row">
          <button type="button" class="primary-btn" @click="openKay">
            <span class="btn-icon" aria-hidden="true">💬</span>
            Chat with Kay
          </button>
          <a
            class="secondary-btn"
            href="https://www.kent.ac.uk/studentservices"
            target="_blank"
            rel="noopener noreferrer"
          >
            Student Services →
          </a>
        </div>
      </section>

      <section class="cards" aria-label="Topics Kay can help with">
        <article class="card">
          <span class="card-emoji" aria-hidden="true">📚</span>
          <h3>Study &amp; assessments</h3>
          <p>Deadlines, extenuating circumstances, and where to get academic guidance.</p>
        </article>
        <article class="card">
          <span class="card-emoji" aria-hidden="true">🧠</span>
          <h3>Wellbeing</h3>
          <p>Support options and signposting when things feel difficult.</p>
        </article>
        <article class="card">
          <span class="card-emoji" aria-hidden="true">🎓</span>
          <h3>Admissions &amp; finance</h3>
          <p>Courses, fees, and practical next steps - with links to official pages.</p>
        </article>
      </section>

      <footer class="foot">
        <p>
          Kay uses a retrieval-augmented pipeline over University of Kent content. Always confirm
          critical details with official services. Use the <strong>floating chat button</strong> at
          the bottom-right anytime.
        </p>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import { namespace } from "@/store/StoreDecorators";
import { Modules } from "@/store/StoreModuleTypes";
import { ChatMutationTypes } from "@/store/modules/chat/ChatTypes";

const ChatStore = namespace(Modules.Chat);

@Component({
  name: "ChatView",
})
export default class ChatView extends Vue {
  @ChatStore.Mutation(ChatMutationTypes.SET_CHAT_OPEN)
  public setChatOpen!: (open: boolean) => void;

  public openKay(): void {
    this.setChatOpen(true);
  }
}
</script>

<style scoped>
.landing {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

.landing-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 120% 80% at 10% -20%, rgba(102, 126, 234, 0.35), transparent 50%),
    radial-gradient(ellipse 90% 70% at 100% 10%, rgba(118, 75, 162, 0.25), transparent 45%),
    radial-gradient(ellipse 60% 40% at 50% 100%, rgba(0, 101, 179, 0.12), transparent 50%),
    linear-gradient(180deg, #f8fafc 0%, #eef2ff 45%, #f1f5f9 100%);
  pointer-events: none;
}

.landing-bg::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(148, 163, 184, 0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(148, 163, 184, 0.07) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: linear-gradient(180deg, black 0%, transparent 92%);
}

.landing-inner {
  position: relative;
  max-width: 920px;
  margin: 0 auto;
  padding: 1.5rem 1.5rem 3rem;
}

.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2.5rem;
}

.brand-mark {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.mark {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  font-weight: 800;
  font-size: 1.1rem;
  display: grid;
  place-items: center;
  box-shadow: 0 4px 14px rgba(102, 126, 234, 0.35);
}

.brand-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: #334155;
}

.ghost-btn {
  border: 1px solid #cbd5e1;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  padding: 0.45rem 1rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  color: #5b21b6;
  font-family: inherit;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.ghost-btn:hover {
  border-color: #667eea;
  box-shadow: 0 2px 12px rgba(102, 126, 234, 0.2);
}

.hero {
  margin-bottom: 2.75rem;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.72rem;
  font-weight: 700;
  color: #64748b;
  margin: 0 0 0.5rem;
}

h1 {
  font-size: clamp(2.25rem, 6vw, 3.25rem);
  font-weight: 800;
  line-height: 1.1;
  margin: 0 0 1rem;
  color: #0f172a;
  letter-spacing: -0.03em;
}

h1 em {
  font-style: normal;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.dot {
  color: #667eea;
}

.lead {
  font-size: 1.08rem;
  line-height: 1.65;
  color: #475569;
  max-width: 38rem;
  margin: 0 0 1.75rem;
}

.cta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.primary-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  padding: 0.75rem 1.35rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  font-family: inherit;
  color: #fff;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 8px 28px rgba(102, 126, 234, 0.4);
  transition: transform 0.15s, box-shadow 0.15s;
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.45);
}

.btn-icon {
  font-size: 1.15rem;
}

.secondary-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  color: #475569;
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid #e2e8f0;
  transition: border-color 0.15s, color 0.15s;
}

.secondary-btn:hover {
  border-color: #667eea;
  color: #5b21b6;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2.5rem;
}

.card {
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 16px;
  padding: 1.35rem 1.25rem;
  box-shadow: 0 4px 24px rgba(15, 23, 42, 0.06);
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 36px rgba(102, 126, 234, 0.12);
}

.card-emoji {
  font-size: 1.75rem;
  display: block;
  margin-bottom: 0.6rem;
}

.card h3 {
  margin: 0 0 0.4rem;
  font-size: 1rem;
  color: #1e293b;
}

.card p {
  margin: 0;
  font-size: 0.88rem;
  line-height: 1.5;
  color: #64748b;
}

.foot {
  text-align: center;
  max-width: 36rem;
  margin: 0 auto;
}

.foot p {
  margin: 0;
  font-size: 0.8rem;
  line-height: 1.55;
  color: #64748b;
}
</style>
