// Safe storage key map for persisted client-side UI settings.
const SETTINGS_KEYS = {
  displayMode: "asset-track-lite.displayMode",
  tableDensity: "asset-track-lite.tableDensity",
  fontSize: "asset-track-lite.fontSize",
};

// Enumerated options are centralized so UI controls and validation stay synchronized.
const DISPLAY_MODES = ["standard", "high-contrast"];
const TABLE_DENSITIES = ["compact", "comfortable", "spacious"];
const FONT_SIZES = ["small", "medium", "large"];

// Default settings shape used when localStorage has no saved preferences.
const DEFAULT_SETTINGS = {
  displayMode: "standard",
  tableDensity: "comfortable",
  fontSize: "medium",
};

// Shared environment guard avoids localStorage/document access during SSR rendering.
function canUseBrowserStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

// Utility returns only valid option values and falls back to defaults when needed.
function normalizeSettings(candidate) {
  const safeCandidate = candidate && typeof candidate === "object" ? candidate : {};

  const displayMode = DISPLAY_MODES.includes(safeCandidate.displayMode)
    ? safeCandidate.displayMode
    : DEFAULT_SETTINGS.displayMode;

  const tableDensity = TABLE_DENSITIES.includes(safeCandidate.tableDensity)
    ? safeCandidate.tableDensity
    : DEFAULT_SETTINGS.tableDensity;

  const fontSize = FONT_SIZES.includes(safeCandidate.fontSize)
    ? safeCandidate.fontSize
    : DEFAULT_SETTINGS.fontSize;

  return {
    displayMode,
    tableDensity,
    fontSize,
  };
}

// Reads persisted settings from localStorage and guarantees a valid settings shape.
export function getSettings() {
  if (!canUseBrowserStorage()) {
    return DEFAULT_SETTINGS;
  }

  const persisted = {
    displayMode: window.localStorage.getItem(SETTINGS_KEYS.displayMode),
    tableDensity: window.localStorage.getItem(SETTINGS_KEYS.tableDensity),
    fontSize: window.localStorage.getItem(SETTINGS_KEYS.fontSize),
  };

  return normalizeSettings(persisted);
}

// Persists merged settings and returns the normalized values that were saved.
export function setSettings(partialSettings) {
  const mergedSettings = normalizeSettings({
    ...getSettings(),
    ...partialSettings,
  });

  if (!canUseBrowserStorage()) {
    return mergedSettings;
  }

  window.localStorage.setItem(SETTINGS_KEYS.displayMode, mergedSettings.displayMode);
  window.localStorage.setItem(
    SETTINGS_KEYS.tableDensity,
    mergedSettings.tableDensity
  );
  window.localStorage.setItem(SETTINGS_KEYS.fontSize, mergedSettings.fontSize);

  return mergedSettings;
}

// Applies settings to the document body so visual preferences affect all route pages.
export function applySettingsToDocument(settingsInput) {
  if (typeof document === "undefined") {
    return;
  }

  const settings = normalizeSettings(settingsInput);
  const { body } = document;

  // Data attribute drives color mode variants without changing layout structure.
  body.dataset.displayMode = settings.displayMode;

  // Class cleanup ensures only one density and one font-size mode are active.
  body.classList.remove("density-compact", "density-comfortable", "density-spacious");
  body.classList.remove("font-small", "font-medium", "font-large");

  body.classList.add(`density-${settings.tableDensity}`);
  body.classList.add(`font-${settings.fontSize}`);
}

// Resets persisted values and returns defaults for immediate UI rehydration.
export function resetSettings() {
  if (canUseBrowserStorage()) {
    window.localStorage.removeItem(SETTINGS_KEYS.displayMode);
    window.localStorage.removeItem(SETTINGS_KEYS.tableDensity);
    window.localStorage.removeItem(SETTINGS_KEYS.fontSize);
  }

  return DEFAULT_SETTINGS;
}

// Export constants so pages can render option groups from one source of truth.
export {
  DEFAULT_SETTINGS,
  DISPLAY_MODES,
  FONT_SIZES,
  SETTINGS_KEYS,
  TABLE_DENSITIES,
};
