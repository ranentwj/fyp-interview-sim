import Image from "next/image";
import { preparedInterviewees } from "./prepared-interviewees";
import styles from "./IntervieweeRoster.module.css";

export function IntervieweeRoster() {
  return (
    <div className={styles.roster}>
      {preparedInterviewees.map((interviewee) => (
        <div
          aria-labelledby={`${interviewee.id}-name`}
          className={styles.card}
          key={interviewee.id}
          tabIndex={0}
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
                <strong id={`${interviewee.id}-name`}>{interviewee.name}</strong>
                <small>{interviewee.occupation}</small>
              </span>
              <span className={styles.age}>Age {interviewee.age}</span>
            </span>
            <span className={styles.hoverBackground}>{interviewee.shortBackground}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
