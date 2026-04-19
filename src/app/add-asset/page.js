"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

// Form defaults encode the expected payload structure for a new asset record.
const INITIAL_FORM = {
  name: "",
  category: "",
  serial: "",
  purchaseDate: "",
  purchasePrice: "",
  usefulYears: "",
  validity: "",
  status: "in-use",
  assignedTo: "",
  assignedLocation: "",
};

export default function AddAssetPage() {
  const router = useRouter();

  // Form state, processing flag, and feedback message are split for clarity.
  const [formValues, setFormValues] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  // Keep required-field checks close to the form state for immediate UI feedback.
  const requiredFieldsMissing = useMemo(() => {
    const requiredKeys = [
      "name",
      "category",
      "purchaseDate",
      "purchasePrice",
      "usefulYears",
      "validity",
      "status",
    ];

    return requiredKeys.some((key) => String(formValues[key]).trim().length === 0);
  }, [formValues]);

  // Generic field change handler avoids repetitive handlers for each input.
  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  }

  // Creates a backend-ready payload with numeric fields converted explicitly.
  function buildPayload() {
    return {
      ...formValues,
      purchasePrice: Number(formValues.purchasePrice),
      usefulYears: Number(formValues.usefulYears),
    };
  }

  // Submits the new asset to API and redirects to its detail page on success.
  async function handleSubmit(event) {
    event.preventDefault();

    if (requiredFieldsMissing) {
      setFeedback({
        type: "error",
        message: "Please fill all required fields before submitting.",
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback({ type: "", message: "" });

    try {
      const response = await fetch("/api/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });

      const result = await response.json();
      if (!response.ok || result.ok !== true) {
        throw new Error(result.error || "Asset creation failed.");
      }

      setFeedback({
        type: "success",
        message: `Asset created successfully: ${result.data.id}. Redirecting...`,
      });

      // Short delay makes success feedback visible before navigation.
      setTimeout(() => {
        router.push(`/assets/${result.data.id}`);
      }, 600);
    } catch (error) {
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Asset creation failed.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="view-stack">
      {/* Header establishes context and expected usage for this page. */}
      <header className="panel">
        <p className="eyebrow">Create Asset</p>
        <h1 className="view-title">Add Asset</h1>
        <p className="muted-text">
          Register a new asset with the minimum required business metadata.
        </p>
      </header>

      {/* Form groups all required fields used by Phase 1 API validation rules. */}
      <form className="panel form-grid" onSubmit={handleSubmit}>
        <label>
          Name *
          <input
            name="name"
            value={formValues.name}
            onChange={handleInputChange}
            placeholder="Dell Latitude 7440"
            required
          />
        </label>

        <label>
          Category *
          <input
            name="category"
            value={formValues.category}
            onChange={handleInputChange}
            placeholder="Electronics"
            required
          />
        </label>

        <label>
          Serial
          <input
            name="serial"
            value={formValues.serial}
            onChange={handleInputChange}
            placeholder="SER-12345"
          />
        </label>

        <label>
          Purchase Date *
          <input
            type="date"
            name="purchaseDate"
            value={formValues.purchaseDate}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Purchase Price *
          <input
            type="number"
            min="0"
            step="0.01"
            name="purchasePrice"
            value={formValues.purchasePrice}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Useful Years *
          <input
            type="number"
            min="1"
            step="1"
            name="usefulYears"
            value={formValues.usefulYears}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Validity Date *
          <input
            type="date"
            name="validity"
            value={formValues.validity}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Status *
          <select name="status" value={formValues.status} onChange={handleInputChange}>
            <option value="in-use">in-use</option>
            <option value="in-maintenance">in-maintenance</option>
            <option value="available">available</option>
            <option value="retired">retired</option>
          </select>
        </label>

        <label>
          Assigned To
          <input
            name="assignedTo"
            value={formValues.assignedTo}
            onChange={handleInputChange}
            placeholder="Employee name"
          />
        </label>

        <label>
          Assigned Location
          <input
            name="assignedLocation"
            value={formValues.assignedLocation}
            onChange={handleInputChange}
            placeholder="HQ - Floor 2"
          />
        </label>

        {/* Submission area surfaces validation and server responses in place. */}
        <div className="form-actions">
          <button className="accent-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Asset"}
          </button>
          {feedback.message ? (
            <p className={feedback.type === "error" ? "error-text" : "success-text"}>
              {feedback.message}
            </p>
          ) : null}
        </div>
      </form>
    </section>
  );
}
