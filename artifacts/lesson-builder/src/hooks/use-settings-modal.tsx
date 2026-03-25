import { createContext, useContext, useState, useCallback } from "react";
import { SettingsModal } from "@/components/settings-modal";

interface SettingsModalContextValue {
  openSettings: () => void;
}

const SettingsModalContext = createContext<SettingsModalContextValue>({ openSettings: () => {} });

export function SettingsModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const openSettings = useCallback(() => setOpen(true), []);

  return (
    <SettingsModalContext.Provider value={{ openSettings }}>
      {children}
      <SettingsModal open={open} onClose={() => setOpen(false)} />
    </SettingsModalContext.Provider>
  );
}

export function useSettingsModal() {
  return useContext(SettingsModalContext);
}
