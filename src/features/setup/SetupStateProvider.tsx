"use client";

import {
  createContext,
  type ReactNode,
  useContext,
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

type SetupState = {
  topicDraft: TopicDraft;
  setTopicDraft: (draft: TopicDraft) => void;
};

const SetupStateContext = createContext<SetupState | null>(null);

export function SetupStateProvider({ children }: { children: ReactNode }) {
  const [topicDraft, setTopicDraft] = useState<TopicDraft>(emptyTopicDraft);
  const value = useMemo(
    () => ({ topicDraft, setTopicDraft }),
    [topicDraft],
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
