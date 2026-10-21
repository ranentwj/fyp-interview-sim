import type { Metadata } from "next";
import { SetupProgress } from "@/components/navigation/SetupProgress";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Choose an interviewee | RGS",
  description: "Choose a virtual participant for a requirements-gathering practice interview.",
};

export default function IntervieweePage() {
  return (
    <main className={styles.page}>
      <SetupProgress currentStep="interviewee" />
    </main>
  );
}
