"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface WindowState {
  isMinimized: boolean;
  content: any; // Store the content/state for each window
}

interface WindowContextType {
  windowStates: Record<string, WindowState>;
  minimizeWindow: (windowId: string, content?: any) => void;
  restoreWindow: (windowId: string) => void;
  isWindowMinimized: (windowId: string) => boolean;
}

const WindowContext = createContext<WindowContextType | undefined>(undefined);

export function WindowProvider({ children }: { children: ReactNode }) {
  const [windowStates, setWindowStates] = useState<Record<string, WindowState>>({});

  const minimizeWindow = (windowId: string, content?: any) => {
    setWindowStates(prev => ({
      ...prev,
      [windowId]: {
        isMinimized: true,
        content: content || prev[windowId]?.content
      }
    }));
  };

  const restoreWindow = (windowId: string) => {
    setWindowStates(prev => ({
      ...prev,
      [windowId]: {
        ...prev[windowId],
        isMinimized: false
      }
    }));
  };

  const isWindowMinimized = (windowId: string) => {
    return windowStates[windowId]?.isMinimized || false;
  };

  return (
    <WindowContext.Provider value={{
      windowStates,
      minimizeWindow,
      restoreWindow,
      isWindowMinimized
    }}>
      {children}
    </WindowContext.Provider>
  );
}

export function useWindowContext() {
  const context = useContext(WindowContext);
  if (context === undefined) {
    throw new Error('useWindowContext must be used within a WindowProvider');
  }
  return context;
}
