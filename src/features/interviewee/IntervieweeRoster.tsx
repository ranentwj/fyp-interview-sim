import Image from "next/image";
import { preparedInterviewees } from "./prepared-interviewees";
import styles from "./IntervieweeRoster.module.css";

export function IntervieweeRoster() {
  return (
    <div className={styles.roster}>
      {preparedInterviewees.map((interviewee) => (
        <div
          aria-label={`View ${interviewee.name}`}
          className={styles.card}
          key={interviewee.id}
        >
          <Image
            alt={`Portrait of ${interviewee.name}`}
            className={styles.portrait}
            fill
            sizes="(max-width: 620px) 100vw, (max-width: 980px) 50vw, 33vw"
            src={interviewee.portrait}
          />
        </div>
      ))}
    </div>
  );
}
