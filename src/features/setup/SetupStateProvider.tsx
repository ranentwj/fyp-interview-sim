"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  emptyCustomIntervieweeDraft,
  type CustomIntervieweeDraft,
} from "@/features/interviewee/interviewee-types";

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
  customIntervieweeDraft: CustomIntervieweeDraft;
};

type StoredSetupSnapshot = Omit<StoredSetupState, "customIntervieweeDraft"> & {
  customIntervieweeDraft?: CustomIntervieweeDraft;
};

const emptyStoredSetupState: StoredSetupState = {
  topicDraft: emptyTopicDraft,
  selectedIntervieweeId: null,
  customIntervieweeDraft: emptyCustomIntervieweeDraft,
};
const emptySetupSnapshot = JSON.stringify(emptyStoredSetupState);
const setupListeners = new Set<() => void>();
let memorySetupSnapshot = emptySetupSnapshot;

function isCustomIntervieweeDraft(value: unknown): value is CustomIntervieweeDraft {
  if (!value || typeof value !== "object") {
    return false;
  }

  const draft = value as Partial<CustomIntervieweeDraft>;

  return (
    typeof draft.name === "string" &&
    typeof draft.age === "string" &&
    typeof draft.gender === "string" &&
    typeof draft.ethnicity === "string" &&
    typeof draft.occupation === "string" &&
    typeof draft.location === "string" &&
    typeof draft.background === "string"
  );
}

function isStoredSetupState(value: unknown): value is StoredSetupSnapshot {
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

function parseSetupSnapshot(storedValue: string): StoredSetupState {
  try {
    const storedState: unknown = JSON.parse(storedValue);

    if (!isStoredSetupState(storedState)) {
      return emptyStoredSetupState;
    }

    return {
      topicDraft: storedState.topicDraft,
      selectedIntervieweeId: storedState.selectedIntervieweeId,
      customIntervieweeDraft: isCustomIntervieweeDraft(storedState.customIntervieweeDraft)
        ? storedState.customIntervieweeDraft
        : emptyCustomIntervieweeDraft,
    };
  } catch {
    return emptyStoredSetupState;
  }
}

function getBrowserSetupSnapshot() {
  try {
    return window.sessionStorage.getItem(setupStorageKey) ?? memorySetupSnapshot;
  } catch {
    return memorySetupSnapshot;
  }
}

function getServerSetupSnapshot() {
  return emptySetupSnapshot;
}

function subscribeToSetupState(listener: () => void) {
  setupListeners.add(listener);
  return () => setupListeners.delete(listener);
}

function writeSetupState(state: StoredSetupState) {
  memorySetupSnapshot = JSON.stringify(state);

  try {
    window.sessionStorage.setItem(setupStorageKey, memorySetupSnapshot);
  } catch {
    // The setup still works in memory when browser storage is unavailable.
  }

  setupListeners.forEach((listener) => listener());
}

type SetupState = {
  topicDraft: TopicDraft;
  setTopicDraft: (draft: TopicDraft) => void;
  selectedIntervieweeId: string | null;
  setSelectedIntervieweeId: (intervieweeId: string | null) => void;
  customIntervieweeDraft: CustomIntervieweeDraft;
  setCustomIntervieweeDraft: (draft: CustomIntervieweeDraft) => void;
};

const SetupStateContext = createContext<SetupState | null>(null);

export function SetupStateProvider({ children }: { children: ReactNode }) {
  const setupSnapshot = useSyncExternalStore(
    subscribeToSetupState,
    getBrowserSetupSnapshot,
    getServerSetupSnapshot,
  );
  const setupState = useMemo(() => parseSetupSnapshot(setupSnapshot), [setupSnapshot]);
  const { topicDraft, selectedIntervieweeId, customIntervieweeDraft } = setupState;

  const setTopicDraft = useCallback((draft: TopicDraft) => {
    writeSetupState({
      ...parseSetupSnapshot(getBrowserSetupSnapshot()),
      topicDraft: draft,
    });
  }, []);

  const setSelectedIntervieweeId = useCallback((intervieweeId: string | null) => {
    writeSetupState({
      ...parseSetupSnapshot(getBrowserSetupSnapshot()),
      selectedIntervieweeId: intervieweeId,
    });
  }, []);

  const setCustomIntervieweeDraft = useCallback((draft: CustomIntervieweeDraft) => {
    writeSetupState({
      ...parseSetupSnapshot(getBrowserSetupSnapshot()),
      customIntervieweeDraft: draft,
    });
  }, []);

  const value = useMemo(
    () => ({
      topicDraft,
      setTopicDraft,
      selectedIntervieweeId,
      setSelectedIntervieweeId,
      customIntervieweeDraft,
      setCustomIntervieweeDraft,
    }),
    [
      customIntervieweeDraft,
      selectedIntervieweeId,
      setCustomIntervieweeDraft,
      setSelectedIntervieweeId,
      setTopicDraft,
      topicDraft,
    ],
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
