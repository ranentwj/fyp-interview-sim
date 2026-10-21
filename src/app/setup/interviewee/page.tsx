import type { Metadata } from "next";
import { SetupProgress } from "@/components/navigation/SetupProgress";
import { IntervieweeRoster } from "@/features/interviewee/IntervieweeRoster";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Choose an interviewee | RGS",
  description: "Choose a virtual participant for a requirements-gathering practice interview.",
};

export default function IntervieweePage() {
  return (
    <main className={styles.page}>
      <SetupProgress currentStep="interviewee" />

      <section className={styles.introduction} aria-labelledby="interviewee-page-title">
        <div>
          <p className={styles.eyebrow}>Interview setup</p>
          <h1 id="interviewee-page-title">Choose your interviewee</h1>
        </div>
        <p>
          Select a prepared interviewee to review their background and communication style,
          or create someone tailored to your research topic.
        </p>
      </section>

      <IntervieweeRoster />
    </main>
  );
}
