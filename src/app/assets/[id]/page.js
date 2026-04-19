"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Shared formatting utility keeps all money values visually consistent.
function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

export default function AssetDetailPage() {
  // useParams is the canonical client-side source for dynamic route segments.
  const params = useParams();
  const router = useRouter();
  const assetId = params?.id;

  // State tracks loaded record and request lifecycle for clear rendering branches.
  const [asset, setAsset] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusDraft, setStatusDraft] = useState("");
  const [isSavingStatus, setIsSavingStatus] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionFeedback, setActionFeedback] = useState({ type: "", message: "" });

  useEffect(() => {
    let isMounted = true;

    // Fetch one asset by ID to populate full detail views.
    async function loadAssetDetail() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch(`/api/assets/${assetId}`, { cache: "no-store" });
        const result = await response.json();

        if (!response.ok || result.ok !== true) {
          throw new Error(result.error || "Failed to load asset detail.");
        }

        if (isMounted) {
          setAsset(result.data || null);
          setStatusDraft(result.data?.status || "");
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error instanceof Error ? error.message : "Failed to load asset detail."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (assetId) {
      loadAssetDetail();
    }

    return () => {
      isMounted = false;
    };
  }, [assetId]);

  return (
    <section className="view-stack">
      {/* Header provides context and navigation back to inventory view. */}
      <header className="panel panel-header-row">
        <div>
          <p className="eyebrow">Asset Detail</p>
          <h1 className="view-title">{asset?.name || `Asset ${assetId}`}</h1>
          <p className="muted-text">ID: {assetId}</p>
        </div>
        <Link className="accent-button" href="/assets">
          Back to Assets
        </Link>
      </header>

      {/* Explicit load and error states avoid ambiguous blank pages. */}
      {isLoading ? <p className="panel muted-text">Loading asset detail...</p> : null}
      {errorMessage ? <p className="panel error-text">{errorMessage}</p> : null}

      {/* Main detail layout groups metadata, depreciation, and logs by concern. */}
      {asset && !isLoading && !errorMessage ? (
        <>
          {/* Action panel adds controlled update/delete flows with user confirmation. */}
          <article className="panel">
            <h2>Actions</h2>
            <p className="muted-text">
              Update asset status or permanently delete this asset record.
            </p>

            <div className="row-actions">
              <label>
                Status
                <select
                  value={statusDraft}
                  onChange={(event) => setStatusDraft(event.target.value)}
                  disabled={isSavingStatus || isDeleting}
                >
                  <option value="in-use">in-use</option>
                  <option value="in-maintenance">in-maintenance</option>
                  <option value="available">available</option>
                  <option value="retired">retired</option>
                </select>
              </label>

              <button
                className="accent-button"
                type="button"
                disabled={isSavingStatus || isDeleting || statusDraft === asset.status}
                onClick={async () => {
                  // Confirmation guard prevents accidental status changes.
                  const shouldProceed = window.confirm(
                    `Update asset status to "${statusDraft}"?`
                  );
                  if (!shouldProceed) {
                    return;
                  }

                  setIsSavingStatus(true);
                  setActionFeedback({ type: "", message: "" });

                  try {
                    const response = await fetch(`/api/assets/${assetId}`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ status: statusDraft }),
                    });

                    const result = await response.json();
                    if (!response.ok || result.ok !== true) {
                      throw new Error(result.error || "Failed to update status.");
                    }

                    setAsset(result.data);
                    setStatusDraft(result.data.status);
                    setActionFeedback({
                      type: "success",
                      message: "Asset status updated successfully.",
                    });
                  } catch (error) {
                    setActionFeedback({
                      type: "error",
                      message:
                        error instanceof Error ? error.message : "Failed to update status.",
                    });
                  } finally {
                    setIsSavingStatus(false);
                  }
                }}
              >
                {isSavingStatus ? "Saving..." : "Save Status"}
              </button>

              <button
                className="accent-button danger-button"
                type="button"
                disabled={isSavingStatus || isDeleting}
                onClick={async () => {
                  // Confirmation guard blocks accidental destructive operations.
                  const shouldDelete = window.confirm(
                    "Delete this asset permanently? This action cannot be undone."
                  );
                  if (!shouldDelete) {
                    return;
                  }

                  setIsDeleting(true);
                  setActionFeedback({ type: "", message: "" });

                  try {
                    const response = await fetch(`/api/assets/${assetId}`, {
                      method: "DELETE",
                    });

                    const result = await response.json();
                    if (!response.ok || result.ok !== true) {
                      throw new Error(result.error || "Failed to delete asset.");
                    }

                    setActionFeedback({
                      type: "success",
                      message: "Asset deleted. Redirecting to asset list...",
                    });

                    setTimeout(() => {
                      router.push("/assets");
                    }, 500);
                  } catch (error) {
                    setActionFeedback({
                      type: "error",
                      message:
                        error instanceof Error ? error.message : "Failed to delete asset.",
                    });
                  } finally {
                    setIsDeleting(false);
                  }
                }}
              >
                {isDeleting ? "Deleting..." : "Delete Asset"}
              </button>
            </div>

            {actionFeedback.message ? (
              <p className={actionFeedback.type === "error" ? "error-text" : "success-text"}>
                {actionFeedback.message}
              </p>
            ) : null}
          </article>

          <div className="card-grid">
            <article className="panel compact-panel">
              <h2>Core Info</h2>
              <p className="muted-text">Category: {asset.category}</p>
              <p className="muted-text">Status: {asset.status}</p>
              <p className="muted-text">Code: {asset.code}</p>
              <p className="muted-text">Serial: {asset.serial}</p>
            </article>

            <article className="panel compact-panel">
              <h2>Purchase and Validity</h2>
              <p className="muted-text">Purchase Date: {asset.purchaseDate}</p>
              <p className="muted-text">Validity Date: {asset.validity}</p>
              <p className="muted-text">Purchase Price: {formatMoney(asset.purchasePrice)}</p>
              <p className="muted-text">Useful Years: {asset.usefulYears}</p>
            </article>

            <article className="panel compact-panel">
              <h2>Depreciation Summary</h2>
              <p className="muted-text">
                Annual: {formatMoney(asset?.depreciation?.annualDepreciation)}
              </p>
              <p className="muted-text">
                Total: {formatMoney(asset?.depreciation?.totalDepreciation)}
              </p>
              <p className="muted-text">
                Current Value: {formatMoney(asset?.depreciation?.currentValue)}
              </p>
              <p className="muted-text">Years Passed: {asset?.depreciation?.yearsPassed}</p>
            </article>
          </div>

          <article className="panel">
            <h2>Assignment History</h2>
            {asset.assignmentHistory?.length ? (
              <ul className="detail-list">
                {asset.assignmentHistory.map((history) => (
                  <li key={history.id}>
                    <span>{history.employee}</span>
                    <span>{history.location}</span>
                    <span>
                      {history.from} to {history.to || "Present"}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted-text">No assignment history available.</p>
            )}
          </article>

          <article className="panel">
            <h2>Maintenance Logs</h2>
            {asset.maintenance?.length ? (
              <ul className="detail-list">
                {asset.maintenance.map((entry) => (
                  <li key={entry.id}>
                    <span>{entry.date}</span>
                    <span>{entry.type}</span>
                    <span>{formatMoney(entry.cost)}</span>
                    <span>{entry.note || "No notes"}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted-text">No maintenance logs available.</p>
            )}
          </article>
        </>
      ) : null}
    </section>
  );
}
