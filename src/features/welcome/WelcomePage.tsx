import Link from "next/link";
import styles from "./WelcomePage.module.css";

const previewMessages = [
  {
    id: "participant-one",
    speaker: "participant",
    text: "Prices changing without warning made the booking stressful.",
  },
  {
    id: "interviewer-one",
    speaker: "interviewer",
    text: "Could you walk me through what happened?",
  },
  {
    id: "participant-two",
    speaker: "participant",
    text: "I was organising tickets for six friends and kept losing track of the final cost.",
  },
] as const;

export function WelcomePage() {
  return (
    <main className={styles.welcome}>
      <section className={styles.introduction} aria-labelledby="welcome-title">
        <p className={styles.productName}>Requirements Gathering Simulator</p>
        <h1 className={styles.title} id="welcome-title">
          Welcome to <span>RGS</span>
        </h1>
        <p className={styles.tagline}>Practise better requirements gathering.</p>
        <p className={styles.description}>
          Interview realistic virtual participants, uncover needs and pain points,
          and build confidence before conducting real research.
        </p>

        <Link className={styles.beginButton} href="/setup/topic">
          <span>Begin</span>
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </section>

      <section className={styles.previewArea} aria-label="Example requirements-gathering conversation">
        <div className={styles.glow} aria-hidden="true" />
        <div className={`${styles.tip} ${styles.tipTop}`} aria-hidden="true">
          <strong>Ask openly</strong>
          <span>Discover what matters</span>
        </div>

        <div className={styles.chatCard}>
          <header className={styles.chatHeader}>
            <div className={styles.avatar} aria-hidden="true">
              M
            </div>
            <div>
              <p className={styles.personName}>Maya, 31</p>
              <p className={styles.personRole}>Events coordinator</p>
            </div>
            <div className={styles.readyStatus}>
              <span aria-hidden="true" /> Ready
            </div>
          </header>

          <div className={styles.messages}>
            {previewMessages.map((message) => (
              <p
                className={`${styles.message} ${message.speaker === "interviewer" ? styles.interviewerMessage : ""}`}
                key={message.id}
              >
                {message.text}
              </p>
            ))}
          </div>

          <div className={styles.composer} aria-hidden="true">
            <span>Ask a follow-up question…</span>
            <span className={styles.sendIcon}>
              <svg viewBox="0 0 24 24">
                <path d="M12 19V5M6 11l6-6 6 6" />
              </svg>
            </span>
          </div>
        </div>

        <div className={`${styles.tip} ${styles.tipBottom}`} aria-hidden="true">
          <strong>Listen closely</strong>
          <span>Follow the evidence</span>
        </div>
      </section>
    </main>
  );
}
