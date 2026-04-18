// Safe storage key map for persisted client-side UI settings.
const SETTINGS_KEYS = {
  displayMode: "asset-track-lite.displayMode",
  tableDensity: "asset-track-lite.tableDensity",
  fontSize: "asset-track-lite.fontSize",
};

// Default settings shape used when localStorage has no saved preferences.
const DEFAULT_SETTINGS = {
  displayMode: "dark",
  tableDensity: "comfortable",
  fontSize: "medium",
};

// Getter placeholder for Phase 3 localStorage-backed settings retrieval.
export function getSettings() {
  return DEFAULT_SETTINGS;
}

// Setter placeholder for Phase 3 localStorage-backed settings persistence.
export function setSettings() {
  throw new Error("setSettings is not implemented yet. Build in Phase 3.");
}

// Export constants so both UI and utilities can stay in sync.
export { DEFAULT_SETTINGS, SETTINGS_KEYS };
