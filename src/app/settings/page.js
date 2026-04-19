"use client";

import { useState } from "react";

import {
  applySettingsToDocument,
  DEFAULT_SETTINGS,
  DISPLAY_MODES,
  FONT_SIZES,
  getSettings,
  resetSettings,
  setSettings,
  TABLE_DENSITIES,
} from "@/lib/settings";

// Human-readable labels help keep select options understandable for end users.
const LABELS = {
  standard: "Standard",
  "high-contrast": "High Contrast",
  compact: "Compact",
  comfortable: "Comfortable",
  spacious: "Spacious",
  small: "Small",
  medium: "Medium",
  large: "Large",
};

export default function SettingsPage() {
  // Draft settings state allows edits before persisting and applying globally.
  const [draft, setDraft] = useState(() => getSettings());

  // Feedback state keeps persistence outcomes visible to the user.
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  // Generic change handler keeps settings form concise and maintainable.
  function handleFieldChange(event) {
    const { name, value } = event.target;
    setDraft((current) => ({ ...current, [name]: value }));
  }

  // Saves settings to localStorage and applies them globally in the current session.
  function handleSave(event) {
    event.preventDefault();
    const persisted = setSettings(draft);
    applySettingsToDocument(persisted);
    setDraft(persisted);
    setFeedback({
      type: "success",
      message: "Settings saved and applied across the app.",
    });
  }

  // Restores default settings and immediately reapplies baseline visual behavior.
  function handleReset() {
    const defaults = resetSettings();
    applySettingsToDocument(defaults);
    setDraft(defaults);
    setFeedback({
      type: "success",
      message: "Settings reset to defaults.",
    });
  }

  return (
    <section className="view-stack">
      {/* Header communicates that persistence is active and app-wide. */}
      <header className="panel">
        <p className="eyebrow">Phase 3 Delivery</p>
        <h1 className="view-title">Settings</h1>
        <p className="muted-text">
          Manage display mode, table density, and font size. Preferences are
          persisted in localStorage and applied globally.
        </p>
      </header>

      {/* Form controls map directly to settings utility options and storage keys. */}
      <form className="panel form-grid" onSubmit={handleSave}>
        <label>
          Display Mode
          <select
            name="displayMode"
            value={draft.displayMode}
            onChange={handleFieldChange}
          >
            {DISPLAY_MODES.map((mode) => (
              <option key={mode} value={mode}>
                {LABELS[mode]}
              </option>
            ))}
          </select>
        </label>

        <label>
          Table Density
          <select
            name="tableDensity"
            value={draft.tableDensity}
            onChange={handleFieldChange}
          >
            {TABLE_DENSITIES.map((density) => (
              <option key={density} value={density}>
                {LABELS[density]}
              </option>
            ))}
          </select>
        </label>

        <label>
          Font Size
          <select name="fontSize" value={draft.fontSize} onChange={handleFieldChange}>
            {FONT_SIZES.map((size) => (
              <option key={size} value={size}>
                {LABELS[size]}
              </option>
            ))}
          </select>
        </label>

        {/* Action row provides explicit save and reset controls for settings changes. */}
        <div className="form-actions row-actions">
          <button className="accent-button" type="submit">
            Save Settings
          </button>
          <button
            className="accent-button ghost-button"
            type="button"
            onClick={handleReset}
          >
            Reset Defaults
          </button>
          {feedback.message ? (
            <p className={feedback.type === "error" ? "error-text" : "success-text"}>
              {feedback.message}
            </p>
          ) : null}
        </div>
      </form>

      {/* Preview panel reflects active draft values so users can verify intent quickly. */}
      <article className="panel compact-panel">
        <h2>Current Draft</h2>
        <p className="muted-text">Display Mode: {LABELS[draft.displayMode]}</p>
        <p className="muted-text">Table Density: {LABELS[draft.tableDensity]}</p>
        <p className="muted-text">Font Size: {LABELS[draft.fontSize]}</p>
      </article>
    </section>
  );
}
