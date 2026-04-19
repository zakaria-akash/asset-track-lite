"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

// Currency formatting keeps maintenance cost values readable and consistent.
function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

// Form defaults map directly to API payload requirements for /api/maintenance.
const INITIAL_FORM = {
  assetId: "",
  date: "",
  type: "",
  cost: "",
  note: "",
};

export default function MaintenancePage() {
  // Asset list is needed for dropdown selection and recent-log context.
  const [assets, setAssets] = useState([]);

  // Form and request state track user input and submit lifecycle.
  const [formValues, setFormValues] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingAssets, setIsLoadingAssets] = useState(true);
  const [feedback, setFeedback] = useState({ type: "", message: "", details: [] });

  // Loads assets once so users can target any asset when creating entries.
  useEffect(() => {
    let isMounted = true;

    async function loadAssets() {
      setIsLoadingAssets(true);

      try {
        const response = await fetch("/api/assets", { cache: "no-store" });
        const result = await response.json();

        if (!response.ok || result.ok !== true) {
          throw new Error(result.error || "Failed to load assets.");
        }

        if (isMounted) {
          setAssets(result.data || []);
        }
      } catch (error) {
        if (isMounted) {
          setFeedback({
            type: "error",
            message: error instanceof Error ? error.message : "Failed to load assets.",
            details: [],
          });
        }
      } finally {
        if (isMounted) {
          setIsLoadingAssets(false);
        }
      }
    }

    loadAssets();
    return () => {
      isMounted = false;
    };
  }, []);

  // Builds a flattened recent-log list for quick operational visibility.
  const recentLogs = useMemo(() => {
    return assets
      .flatMap((asset) =>
        (asset.maintenance || []).map((entry) => ({
          ...entry,
          assetId: asset.id,
          assetName: asset.name,
        }))
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 12);
  }, [assets]);

  // Generic form change handler reduces duplicate logic for each field.
  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  }

  // Refresh helper is reused after successful submit to render fresh maintenance data.
  async function refreshAssets() {
    const response = await fetch("/api/assets", { cache: "no-store" });
    const result = await response.json();
    if (!response.ok || result.ok !== true) {
      throw new Error(result.error || "Failed to refresh assets.");
    }

    setAssets(result.data || []);
  }

  // Submits maintenance payload, validates response, and refreshes the visible log list.
  async function handleSubmit(event) {
    event.preventDefault();

    setIsSubmitting(true);
    setFeedback({ type: "", message: "", details: [] });

    try {
      const payload = {
        ...formValues,
        cost: Number(formValues.cost),
      };

      const response = await fetch("/api/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok || result.ok !== true) {
        const message = result.error || "Failed to add maintenance entry.";
        const details = Array.isArray(result.details) ? result.details : [];
        throw new Error(JSON.stringify({ message, details }));
      }

      // Keep UX responsive by resetting form and reloading latest data after success.
      setFormValues(INITIAL_FORM);
      setFeedback({
        type: "success",
        message: `Maintenance logged for asset ${result.data.asset.id}.`,
        details: [],
      });
      await refreshAssets();
    } catch (error) {
      // Parse structured API errors so field-level maintenance issues are actionable.
      let message = "Failed to add maintenance entry.";
      let details = [];

      if (error instanceof Error) {
        try {
          const parsed = JSON.parse(error.message);
          message = parsed.message || message;
          details = Array.isArray(parsed.details) ? parsed.details : [];
        } catch {
          message = error.message;
        }
      }

      setFeedback({
        type: "error",
        message,
        details,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="view-stack">
      {/* Header clarifies purpose and links search for complementary workflows. */}
      <header className="panel panel-header-row">
        <div>
          <p className="eyebrow">Phase 3 Delivery</p>
          <h1 className="view-title">Maintenance</h1>
          <p className="muted-text">
            Add maintenance logs and review the latest entries across assets.
          </p>
        </div>
        <Link className="accent-button" href="/search">
          Go to Search
        </Link>
      </header>

      {/* Form panel handles creation of new maintenance entries. */}
      <form className="panel form-grid" onSubmit={handleSubmit}>
        <label>
          Asset *
          <select
            name="assetId"
            value={formValues.assetId}
            onChange={handleInputChange}
            required
            disabled={isLoadingAssets || isSubmitting}
          >
            <option value="">Select asset</option>
            {assets.map((asset) => (
              <option key={asset.id} value={asset.id}>
                {asset.id} - {asset.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Date *
          <input
            type="date"
            name="date"
            value={formValues.date}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
          />
        </label>

        <label>
          Type *
          <input
            name="type"
            value={formValues.type}
            onChange={handleInputChange}
            placeholder="inspection, repair, replacement"
            required
            disabled={isSubmitting}
          />
        </label>

        <label>
          Cost *
          <input
            type="number"
            min="0"
            step="0.01"
            name="cost"
            value={formValues.cost}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
          />
        </label>

        <label className="full-width-field">
          Note
          <input
            name="note"
            value={formValues.note}
            onChange={handleInputChange}
            placeholder="Optional detail for maintenance work"
            disabled={isSubmitting}
          />
        </label>

        {/* Feedback row reports success and error outcomes directly beneath controls. */}
        <div className="form-actions row-actions">
          <button className="accent-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Add Maintenance Log"}
          </button>

          {/* Primary feedback line summarizes the latest request outcome. */}
          {feedback.message ? (
            <p className={feedback.type === "error" ? "error-text" : "success-text"}>
              {feedback.message}
            </p>
          ) : null}

          {/* Validation details list provides field-level guidance from API responses. */}
          {feedback.type === "error" && feedback.details?.length > 0 ? (
            <ul className="validation-list error-text">
              {feedback.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </form>

      {/* Recent list gives quick operational visibility without leaving the page. */}
      <article className="panel">
        <h2>Recent Maintenance Entries</h2>
        {!isLoadingAssets && assets.length === 0 ? (
          <p className="muted-text">
            No assets found. Create an asset before logging maintenance.
          </p>
        ) : null}
        {recentLogs.length > 0 ? (
          <ul className="detail-list">
            {recentLogs.map((entry) => (
              <li key={`${entry.assetId}-${entry.id}`}>
                <span>{entry.date}</span>
                <span>{entry.assetName}</span>
                <span>{entry.type}</span>
                <span>{formatMoney(entry.cost)}</span>
                <span>{entry.note || "No note"}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted-text">No maintenance entries available yet.</p>
        )}
      </article>
    </section>
  );
}
