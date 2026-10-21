"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type TopicDraft = {
  topic: string;
  objective: string;
  context: string;
};

const emptyTopicDraft: TopicDraft = {
  topic: "",
  objective: "",
  context: "",
};

const setupStorageKey = "rgs-setup-draft";

type StoredSetupState = {
  topicDraft: TopicDraft;
  selectedIntervieweeId: string | null;
};

function isStoredSetupState(value: unknown): value is StoredSetupState {
  if (!value || typeof value !== "object") {
    return false;
  }

  const storedState = value as Partial<StoredSetupState>;
  const topicDraft = storedState.topicDraft;

  return (
    !!topicDraft &&
    typeof topicDraft.topic === "string" &&
    typeof topicDraft.objective === "string" &&
    typeof topicDraft.context === "string" &&
    (storedState.selectedIntervieweeId === null ||
      typeof storedState.selectedIntervieweeId === "string")
  );
}

function readStoredSetupState(): StoredSetupState {
  const emptyState: StoredSetupState = {
    topicDraft: emptyTopicDraft,
    selectedIntervieweeId: null,
  };

  if (typeof window === "undefined") {
    return emptyState;
  }

  try {
    const storedValue = window.sessionStorage.getItem(setupStorageKey);

    if (!storedValue) {
      return emptyState;
    }

    const storedState: unknown = JSON.parse(storedValue);
    return isStoredSetupState(storedState) ? storedState : emptyState;
  } catch {
    return emptyState;
  }
}

type SetupState = {
  topicDraft: TopicDraft;
  setTopicDraft: (draft: TopicDraft) => void;
  selectedIntervieweeId: string | null;
  setSelectedIntervieweeId: (intervieweeId: string | null) => void;
};

const SetupStateContext = createContext<SetupState | null>(null);

export function SetupStateProvider({ children }: { children: ReactNode }) {
  const [setupState, setSetupState] = useState<StoredSetupState>(readStoredSetupState);
  const { topicDraft, selectedIntervieweeId } = setupState;

  const setTopicDraft = useCallback((draft: TopicDraft) => {
    setSetupState((currentState) => ({ ...currentState, topicDraft: draft }));
  }, []);

  const setSelectedIntervieweeId = useCallback((intervieweeId: string | null) => {
    setSetupState((currentState) => ({
      ...currentState,
      selectedIntervieweeId: intervieweeId,
    }));
  }, []);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(setupStorageKey, JSON.stringify(setupState));
    } catch {
      // The setup still works in memory when browser storage is unavailable.
    }
  }, [setupState]);

  const value = useMemo(
    () => ({
      topicDraft,
      setTopicDraft,
      selectedIntervieweeId,
      setSelectedIntervieweeId,
    }),
    [selectedIntervieweeId, setSelectedIntervieweeId, setTopicDraft, topicDraft],
  );

  return (
    <SetupStateContext.Provider value={value}>
      {children}
    </SetupStateContext.Provider>
  );
}

export function useSetupState() {
  const state = useContext(SetupStateContext);

  if (!state) {
    throw new Error("useSetupState must be used within SetupStateProvider.");
  }

  return state;
}
