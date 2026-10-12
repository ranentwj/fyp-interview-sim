"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";
import styles from "./ThemeToggle.module.css";

type ThemePreference = "system" | "light" | "dark";

const STORAGE_KEY = "interview-sim-theme";
const THEME_CHANGE_EVENT = "interview-sim-theme-change";
const preferences: ThemePreference[] = ["system", "light", "dark"];

function isThemePreference(value: string | null): value is ThemePreference {
  return value === "system" || value === "light" || value === "dark";
}

function getStoredPreference(): ThemePreference {
  if (typeof window === "undefined") {
    return "system";
  }

  try {
    const storedPreference = window.localStorage.getItem(STORAGE_KEY);
    return isThemePreference(storedPreference) ? storedPreference : "system";
  } catch {
    return "system";
  }
}

function resolveTheme(preference: ThemePreference): "light" | "dark" {
  if (preference !== "system") {
    return preference;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(preference: ThemePreference) {
  const resolvedTheme = resolveTheme(preference);
  const root = document.documentElement;

  root.dataset.theme = resolvedTheme;
  root.dataset.themePreference = preference;
  root.style.colorScheme = resolvedTheme;
}

function subscribe(onStoreChange: () => void) {
  const colorScheme = window.matchMedia("(prefers-color-scheme: dark)");

  function handlePreferenceChange() {
    applyTheme(getStoredPreference());
    onStoreChange();
  }

  function handleSystemThemeChange() {
    if (getStoredPreference() === "system") {
      applyTheme("system");
    }
  }

  window.addEventListener("storage", handlePreferenceChange);
  window.addEventListener(THEME_CHANGE_EVENT, handlePreferenceChange);
  colorScheme.addEventListener("change", handleSystemThemeChange);

  return () => {
    window.removeEventListener("storage", handlePreferenceChange);
    window.removeEventListener(THEME_CHANGE_EVENT, handlePreferenceChange);
    colorScheme.removeEventListener("change", handleSystemThemeChange);
  };
}

function ThemeIcon({ preference }: { preference: ThemePreference }) {
  if (preference === "light") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3.5" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
      </svg>
    );
  }

  if (preference === "dark") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M20.3 15.4A8.4 8.4 0 0 1 8.6 3.7 8.5 8.5 0 1 0 20.3 15.4Z" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

export function ThemeToggle() {
  const preference = useSyncExternalStore(subscribe, getStoredPreference, () => "system");

  useLayoutEffect(() => {
    applyTheme(getStoredPreference());
  }, []);

  function selectTheme(nextPreference: ThemePreference) {
    try {
      window.localStorage.setItem(STORAGE_KEY, nextPreference);
    } catch {
      // The visual theme still changes when browser storage is unavailable.
    }
    applyTheme(nextPreference);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }

  return (
    <div className={styles.control} role="group" aria-label="Colour theme">
      {preferences.map((option) => (
        <button
          aria-label={`Use ${option} theme`}
          aria-pressed={preference === option}
          className={`${styles.option} ${preference === option ? styles.active : ""}`}
          key={option}
          onClick={() => selectTheme(option)}
          title={`${option[0].toUpperCase()}${option.slice(1)} theme`}
          type="button"
        >
          <ThemeIcon preference={option} />
          <span>{option}</span>
        </button>
      ))}
    </div>
  );
}
