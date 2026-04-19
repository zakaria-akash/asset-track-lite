"use client";

import { useEffect } from "react";

import { applySettingsToDocument, getSettings } from "@/lib/settings";

// Client-side provider applies persisted UI settings as soon as the app hydrates.
export default function SettingsProvider({ children }) {
  useEffect(() => {
    // Initial sync reads persisted preferences and applies them globally.
    const initialSettings = getSettings();
    applySettingsToDocument(initialSettings);

    // Storage listener keeps multiple tabs in sync when settings are changed elsewhere.
    function handleStorageUpdate(event) {
      if (!event.key || !event.key.startsWith("asset-track-lite.")) {
        return;
      }

      const latestSettings = getSettings();
      applySettingsToDocument(latestSettings);
    }

    window.addEventListener("storage", handleStorageUpdate);
    return () => {
      window.removeEventListener("storage", handleStorageUpdate);
    };
  }, []);

  // Provider is intentionally transparent and only handles side-effects.
  return children;
}
