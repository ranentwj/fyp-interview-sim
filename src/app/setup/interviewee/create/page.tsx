import type { Metadata } from "next";
import Link from "next/link";
import { SetupProgress } from "@/components/navigation/SetupProgress";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Create an interviewee | RGS",
  description: "Create a custom virtual participant for a practice interview.",
};

export default function CreateIntervieweePage() {
  return (
    <main className={styles.page}>
      <SetupProgress currentStep="interviewee" />

      <section className={styles.panel} aria-labelledby="create-interviewee-title">
        <div className={styles.icon} aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M12 20v-8m-4 4h8M7.5 10a4.5 4.5 0 1 1 9 0" />
          </svg>
        </div>
        <p className={styles.eyebrow}>Custom interviewee</p>
        <h1 id="create-interviewee-title">Create someone for your scenario</h1>
        <p className={styles.description}>
          This page is now reserved for custom interviewee creation. We will design its
          fields and review step as the next focused frontend slice, rather than guessing
          at details that have not yet been agreed.
        </p>
        <Link className={styles.backLink} href="/setup/interviewee">
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M19 12H5M11 18l-6-6 6-6" />
          </svg>
          Back to prepared interviewees
        </Link>
      </section>
    </main>
  );
}
