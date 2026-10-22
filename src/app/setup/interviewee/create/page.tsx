import type { Metadata } from "next";
import { SetupProgress } from "@/components/navigation/SetupProgress";
import { CustomIntervieweeBuilder } from "@/features/interviewee/CustomIntervieweeBuilder";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Create an interviewee | RGS",
  description: "Create a custom virtual participant for a practice interview.",
};

export default function CreateIntervieweePage() {
  return (
    <main className={styles.page}>
      <SetupProgress currentStep="interviewee" />

      <section className={styles.introduction} aria-labelledby="create-interviewee-title">
        <p className={styles.eyebrow}>Custom interviewee</p>
        <h1 id="create-interviewee-title">Create someone for your scenario</h1>
        <p className={styles.description}>
          Define the public information an interviewer can know before the conversation,
          then review the profile before selecting it.
        </p>
      </section>

      <CustomIntervieweeBuilder />
    </main>
  );
}
