import type { ReactNode } from "react";
import { SetupStateProvider } from "@/features/setup/SetupStateProvider";

export default function SetupLayout({ children }: { children: ReactNode }) {
  return <SetupStateProvider>{children}</SetupStateProvider>;
}
