import type { Metadata } from "next";
import { SetupProgress } from "@/components/navigation/SetupProgress";
import { TopicForm } from "@/features/topic/TopicForm";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Choose a topic | RGS",
  description: "Define the topic and objective for a requirements-gathering practice interview.",
};

export default function TopicPage() {
  return (
    <main className={styles.page}>
      <SetupProgress currentStep="topic" />

      <section className={styles.panel} aria-labelledby="topic-page-title">
        <div className={styles.introduction}>
          <p className={styles.eyebrow}>Interview setup</p>
          <h1 id="topic-page-title">What would you like to explore?</h1>
          <p>
            Give the interview a clear starting point. You can keep this broad for now
            and refine how topics work in a later milestone.
          </p>
        </div>

        <TopicForm />
      </section>
    </main>
  );
}
