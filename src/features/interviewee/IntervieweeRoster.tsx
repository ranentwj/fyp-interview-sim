"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSetupState } from "@/features/setup/SetupStateProvider";
import type { PreparedInterviewee } from "./interviewee-types";
import { preparedInterviewees } from "./prepared-interviewees";
import styles from "./IntervieweeRoster.module.css";

export function IntervieweeRoster() {
  const { selectedIntervieweeId, setSelectedIntervieweeId } = useSetupState();
  const [openInterviewee, setOpenInterviewee] = useState<PreparedInterviewee | null>(null);
  const [selectionMessage, setSelectionMessage] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (openInterviewee && !dialog.open) {
      dialog.showModal();
    } else if (!openInterviewee && dialog.open) {
      dialog.close();
    }
  }, [openInterviewee]);

  function closeDialog() {
    setOpenInterviewee(null);
  }

  function confirmInterviewee() {
    if (!openInterviewee) {
      return;
    }

    setSelectedIntervieweeId(openInterviewee.id);
    setSelectionMessage(
      `${openInterviewee.name} is selected. The interview workspace will be connected in the next frontend milestone.`,
    );
    closeDialog();
  }

  return (
    <>
      <div className={styles.roster}>
        {preparedInterviewees.map((interviewee) => {
          const isSelected = selectedIntervieweeId === interviewee.id;

          return (
            <button
              aria-haspopup="dialog"
              className={`${styles.card} ${isSelected ? styles.selectedCard : ""}`}
              key={interviewee.id}
              onClick={() => {
                setSelectionMessage("");
                setOpenInterviewee(interviewee);
              }}
              type="button"
            >
              <Image
                alt=""
                className={styles.portrait}
                fill
                sizes="(max-width: 620px) 100vw, (max-width: 980px) 50vw, 33vw"
                src={interviewee.portrait}
              />
              <span className={styles.cardOverlay}>
                <span className={styles.cardHeading}>
                  <span>
                    <strong>{interviewee.name}</strong>
                    <small>{interviewee.occupation}</small>
                  </span>
                  <span className={styles.age}>Age {interviewee.age}</span>
                </span>
                <span className={styles.hoverBackground}>{interviewee.shortBackground}</span>
                {isSelected && <span className={styles.selectedLabel}>Selected</span>}
              </span>
            </button>
          );
        })}
      </div>

      <div className={styles.footerRow}>
        <Link className={styles.backLink} href="/setup/topic">
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M19 12H5M11 18l-6-6 6-6" />
          </svg>
          Back to topic
        </Link>
        <p className={styles.selectionMessage} aria-live="polite">
          {selectionMessage}
        </p>
      </div>

      <dialog
        aria-labelledby="interviewee-dialog-title"
        className={styles.dialog}
        onCancel={closeDialog}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            closeDialog();
          }
        }}
        ref={dialogRef}
      >
        {openInterviewee && (
          <div className={styles.dialogBody}>
            <button
              aria-label="Close interviewee details"
              className={styles.closeButton}
              onClick={closeDialog}
              type="button"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>

            <div className={styles.dialogPortrait}>
              <Image
                alt={`Portrait of ${openInterviewee.name}`}
                fill
                sizes="(max-width: 680px) 100vw, 320px"
                src={openInterviewee.portrait}
              />
            </div>

            <div className={styles.dialogContent}>
              <p className={styles.dialogEyebrow}>Prepared interviewee</p>
              <h2 id="interviewee-dialog-title">{openInterviewee.name}</h2>
              <p className={styles.dialogRole}>
                {openInterviewee.age} · {openInterviewee.occupation}
              </p>

              <dl className={styles.details}>
                <div>
                  <dt>Ethnicity</dt>
                  <dd>{openInterviewee.ethnicity}</dd>
                </div>
                <div>
                  <dt>Gender</dt>
                  <dd>{openInterviewee.gender}</dd>
                </div>
                <div>
                  <dt>Location</dt>
                  <dd>{openInterviewee.location}</dd>
                </div>
              </dl>

              <section className={styles.detailSection}>
                <h3>Background</h3>
                <p>{openInterviewee.background}</p>
              </section>

              <div className={styles.dialogActions}>
                <button className={styles.secondaryButton} onClick={closeDialog} type="button">
                  Back
                </button>
                <button
                  className={styles.primaryButton}
                  onClick={confirmInterviewee}
                  type="button"
                >
                  Continue with {openInterviewee.name.split(" ")[0]}
                </button>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}


