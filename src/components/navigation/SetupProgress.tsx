import styles from "./SetupProgress.module.css";

const steps = [
  { id: "topic", label: "Topic" },
  { id: "interviewee", label: "Interviewee" },
  { id: "interview", label: "Interview" },
] as const;

type SetupStep = (typeof steps)[number]["id"];

export function SetupProgress({ currentStep }: { currentStep: SetupStep }) {
  const currentIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <nav className={styles.progress} aria-label="Interview setup progress">
      <ol className={styles.list}>
        {steps.map((step, index) => {
          const isCurrent = step.id === currentStep;
          const isComplete = index < currentIndex;

          return (
            <li
              className={`${styles.step} ${isCurrent ? styles.current : ""} ${isComplete ? styles.complete : ""}`}
              key={step.id}
              aria-current={isCurrent ? "step" : undefined}
            >
              <span className={styles.marker}>{index + 1}</span>
              <span className={styles.label}>{step.label}</span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
