import Link from "next/link";
import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import styles from "./AppShell.module.css";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="RGS home">
          <span className={styles.brandMark} aria-hidden="true">
            <span className={styles.primaryBubble} />
            <span className={styles.secondaryBubble} />
          </span>
          <span>
            <span className={styles.brandName}>RGS</span>
            <span className={styles.brandDescription}>
              Requirements Gathering Simulator
            </span>
          </span>
        </Link>

        <ThemeToggle />
      </header>

      <div className={styles.page}>{children}</div>
    </div>
  );
}
