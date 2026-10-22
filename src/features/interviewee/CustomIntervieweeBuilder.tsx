"use client";

import Link from "next/link";
import { type ChangeEvent, type FormEvent, useState } from "react";
import { useSetupState } from "@/features/setup/SetupStateProvider";
import {
  emptyCustomIntervieweeDraft,
  type CustomIntervieweeDraft,
} from "./interviewee-types";
import styles from "./CustomIntervieweeBuilder.module.css";

type CustomField = keyof CustomIntervieweeDraft;

function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return initials || "?";
}

export function CustomIntervieweeBuilder() {
  const {
    customIntervieweeDraft,
    selectedIntervieweeId,
    setCustomIntervieweeDraft,
    setSelectedIntervieweeId,
    topicDraft,
  } = useSetupState();
  const hasRequiredDetails =
    customIntervieweeDraft.name.trim().length > 0 &&
    customIntervieweeDraft.age.trim().length > 0 &&
    customIntervieweeDraft.occupation.trim().length > 0 &&
    customIntervieweeDraft.background.trim().length > 0;
  const [viewMode, setViewMode] = useState<"auto" | "form" | "review">("auto");
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const isReviewing =
    viewMode === "review" ||
    (viewMode === "auto" && selectedIntervieweeId === "custom" && hasRequiredDetails);

  function updateField(
    field: CustomField,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setCustomIntervieweeDraft({
      ...customIntervieweeDraft,
      [field]: event.target.value,
    });

    if (selectedIntervieweeId === "custom") {
      setSelectedIntervieweeId(null);
    }

    setStatusMessage("");
  }

  function showReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!hasRequiredDetails) {
      return;
    }

    setViewMode("review");
    setStatusMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function selectCustomInterviewee() {
    setSelectedIntervieweeId("custom");
    setStatusMessage(
      `${customIntervieweeDraft.name.trim()} is selected. The interview workspace will be connected in a later frontend milestone.`,
    );
  }

  function resetDraft() {
    setCustomIntervieweeDraft(emptyCustomIntervieweeDraft);
    setSelectedIntervieweeId(null);
    setViewMode("form");
    setIsConfirmingReset(false);
    setStatusMessage("");
  }

  if (isReviewing) {
    const optionalDetails = [
      { label: "Gender", value: customIntervieweeDraft.gender.trim() },
      { label: "Ethnicity or culture", value: customIntervieweeDraft.ethnicity.trim() },
      { label: "Location", value: customIntervieweeDraft.location.trim() },
    ].filter((detail) => detail.value);

    return (
      <section className={styles.reviewPanel} aria-labelledby="custom-review-title">
        <div className={styles.reviewHeader}>
          <div className={styles.avatar} aria-hidden="true">
            {getInitials(customIntervieweeDraft.name)}
          </div>
          <div>
            <p className={styles.eyebrow}>Review public profile</p>
            <h2 id="custom-review-title">{customIntervieweeDraft.name.trim()}</h2>
            <p>
              Age {customIntervieweeDraft.age} · {customIntervieweeDraft.occupation.trim()}
            </p>
          </div>
        </div>

        {optionalDetails.length > 0 && (
          <dl className={styles.reviewDetails}>
            {optionalDetails.map((detail) => (
              <div key={detail.label}>
                <dt>{detail.label}</dt>
                <dd>{detail.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className={styles.backgroundReview}>
          <h3>Background</h3>
          <p>{customIntervieweeDraft.background.trim()}</p>
        </div>

        <aside className={styles.privacyNote}>
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M12 8v4m0 4h.01M10.3 4.5 3.6 16.1A2 2 0 0 0 5.3 19h13.4a2 2 0 0 0 1.7-2.9L13.7 4.5a2 2 0 0 0-3.4 0Z" />
          </svg>
          <p>
            This review contains public information only. Private motivations, needs, and
            interview behaviour will be designed separately and should not be revealed here.
          </p>
        </aside>

        <p className={styles.status} aria-live="polite">
          {statusMessage}
        </p>

        {isConfirmingReset && (
          <div className={styles.resetConfirmation} role="alert">
            <p>Clear every field and start this custom interviewee again?</p>
            <div>
              <button onClick={() => setIsConfirmingReset(false)} type="button">
                Keep details
              </button>
              <button onClick={resetDraft} type="button">
                Clear and start again
              </button>
            </div>
          </div>
        )}

        <div className={styles.reviewActions}>
          <button
            className={styles.textButton}
            onClick={() => setIsConfirmingReset(true)}
            type="button"
          >
            Start again
          </button>
          <div>
            <button
              className={styles.secondaryButton}
              onClick={() => {
                setViewMode("form");
                setStatusMessage("");
              }}
              type="button"
            >
              Edit details
            </button>
            <button
              className={styles.primaryButton}
              onClick={selectCustomInterviewee}
              type="button"
            >
              Use this interviewee
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <form className={styles.formPanel} onSubmit={showReview}>
      {topicDraft.topic.trim() && (
        <div className={styles.topicContext}>
          <span>Creating for</span>
          <strong>{topicDraft.topic.trim()}</strong>
        </div>
      )}

      <div className={styles.formIntroduction}>
        <h2>Public profile</h2>
        <p>
          Enter what the interviewer is allowed to know before the conversation begins.
        </p>
      </div>

      <div className={styles.formGrid}>
        <div className={styles.field}>
          <label htmlFor="custom-name">Name</label>
          <input
            autoComplete="off"
            id="custom-name"
            maxLength={80}
            name="name"
            onChange={(event) => updateField("name", event)}
            placeholder="For example, Jordan Reyes"
            required
            type="text"
            value={customIntervieweeDraft.name}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="custom-age">Age</label>
          <input
            id="custom-age"
            max={110}
            min={1}
            name="age"
            onChange={(event) => updateField("age", event)}
            placeholder="For example, 31"
            required
            type="number"
            value={customIntervieweeDraft.age}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="custom-occupation">Occupation or role</label>
          <input
            autoComplete="off"
            id="custom-occupation"
            maxLength={100}
            name="occupation"
            onChange={(event) => updateField("occupation", event)}
            placeholder="For example, freelance stage technician"
            required
            type="text"
            value={customIntervieweeDraft.occupation}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="custom-location">
            Location <span>Optional</span>
          </label>
          <input
            autoComplete="off"
            id="custom-location"
            maxLength={100}
            name="location"
            onChange={(event) => updateField("location", event)}
            placeholder="For example, Jurong East, Singapore"
            type="text"
            value={customIntervieweeDraft.location}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="custom-gender">
            Gender <span>Optional</span>
          </label>
          <input
            autoComplete="off"
            id="custom-gender"
            maxLength={80}
            name="gender"
            onChange={(event) => updateField("gender", event)}
            placeholder="Use the person’s own description"
            type="text"
            value={customIntervieweeDraft.gender}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="custom-ethnicity">
            Ethnicity or cultural background <span>Optional</span>
          </label>
          <input
            autoComplete="off"
            id="custom-ethnicity"
            maxLength={120}
            name="ethnicity"
            onChange={(event) => updateField("ethnicity", event)}
            placeholder="Describe this in the person’s own terms"
            type="text"
            value={customIntervieweeDraft.ethnicity}
          />
        </div>

        <div className={`${styles.field} ${styles.fullWidthField}`}>
          <label htmlFor="custom-background">Short background</label>
          <p id="custom-background-help">
            Include relevant life circumstances or experience, without prescribing hidden
            needs or answers for the interview.
          </p>
          <textarea
            aria-describedby="custom-background-help"
            id="custom-background"
            maxLength={800}
            name="background"
            onChange={(event) => updateField("background", event)}
            placeholder="For example, Jordan works irregular hours across different venues and often coordinates travel at short notice."
            required
            rows={6}
            value={customIntervieweeDraft.background}
          />
          <span className={styles.characterCount}>
            {customIntervieweeDraft.background.length}/800
          </span>
        </div>
      </div>

      <div className={styles.formActions}>
        <Link className={styles.backLink} href="/setup/interviewee">
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M19 12H5M11 18l-6-6 6-6" />
          </svg>
          Back to roster
        </Link>
        <button className={styles.primaryButton} disabled={!hasRequiredDetails} type="submit">
          Review interviewee
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </form>
  );
}
