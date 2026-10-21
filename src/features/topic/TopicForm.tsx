"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ChangeEvent, type FormEvent } from "react";
import { useSetupState, type TopicDraft } from "@/features/setup/SetupStateProvider";
import styles from "./TopicForm.module.css";

type TopicField = keyof TopicDraft;

export function TopicForm() {
  const { topicDraft, setTopicDraft } = useSetupState();
  const router = useRouter();
  const canContinue = topicDraft.topic.trim().length > 0;

  function updateField(
    field: TopicField,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setTopicDraft({
      ...topicDraft,
      [field]: event.target.value,
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canContinue) {
      return;
    }

    router.push("/setup/interviewee");
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="topic">What would you like to explore?</label>
        <p id="topic-help">
          Name the product, service, process, or experience you want to investigate.
        </p>
        <input
          aria-describedby="topic-help"
          autoComplete="off"
          id="topic"
          name="topic"
          onChange={(event) => updateField("topic", event)}
          placeholder="For example, buying tickets for a live event"
          required
          type="text"
          value={topicDraft.topic}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="objective">
          What do you want to learn? <span>Optional for now</span>
        </label>
        <p id="objective-help">
          Describe the behaviours, difficulties, or needs you want the interview to uncover.
        </p>
        <textarea
          aria-describedby="objective-help"
          id="objective"
          name="objective"
          onChange={(event) => updateField("objective", event)}
          placeholder="For example, understand where people lose confidence during checkout"
          rows={4}
          value={topicDraft.objective}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="context">
          Additional context <span>Optional</span>
        </label>
        <p id="context-help">
          Add any background that would help define the boundaries of the interview.
        </p>
        <textarea
          aria-describedby="context-help"
          id="context"
          name="context"
          onChange={(event) => updateField("context", event)}
          placeholder="For example, focus on people coordinating purchases for a group"
          rows={4}
          value={topicDraft.context}
        />
      </div>

      <div className={styles.actions}>
        <Link className={styles.backButton} href="/">
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M19 12H5M11 18l-6-6 6-6" />
          </svg>
          Back
        </Link>
        <button className={styles.nextButton} disabled={!canContinue} type="submit">
          Next
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </form>
  );
}
