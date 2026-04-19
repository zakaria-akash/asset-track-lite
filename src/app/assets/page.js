"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

// Formats currency values once in a predictable locale-friendly style.
function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

export default function AssetsPage() {
  // Data and UI state are split for clear loading/error rendering branches.
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    // Fetches server-enriched asset records, including depreciation snapshots.
    async function loadAssets() {
      setIsLoading(true);
      setErrorMessage("");

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
          setErrorMessage(
            error instanceof Error ? error.message : "Failed to load assets."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadAssets();
    return () => {
      isMounted = false;
    };
  }, []);

  // Create simple roll-up metrics to make list page immediately informative.
  const summary = useMemo(() => {
    const totalPurchase = assets.reduce(
      (sum, asset) => sum + Number(asset.purchasePrice || 0),
      0
    );

    const totalCurrent = assets.reduce(
      (sum, asset) => sum + Number(asset?.depreciation?.currentValue || 0),
      0
    );

    return {
      count: assets.length,
      totalPurchase,
      totalCurrent,
    };
  }, [assets]);

  return (
    <section className="view-stack">
      {/* Section header establishes purpose and links to the create flow. */}
      <header className="panel panel-header-row">
        <div>
          <p className="eyebrow">Asset Inventory</p>
          <h1 className="view-title">Assets</h1>
          <p className="muted-text">
            Review asset status, purchase value, and computed depreciation.
          </p>
        </div>
        <Link className="accent-button" href="/add-asset">
          Add Asset
        </Link>
      </header>

      {/* Summary chips keep key metrics visible on all screen sizes. */}
      <div className="chip-row">
        <span className="accent-chip">Count: {summary.count}</span>
        <span className="accent-chip">
          Purchase Total: {formatMoney(summary.totalPurchase)}
        </span>
        <span className="accent-chip">
          Current Total: {formatMoney(summary.totalCurrent)}
        </span>
      </div>

      {/* Render explicit load/error states before showing the data tables. */}
      {isLoading ? <p className="panel muted-text">Loading assets...</p> : null}
      {errorMessage ? <p className="panel error-text">{errorMessage}</p> : null}
      {!isLoading && !errorMessage && assets.length === 0 ? (
        <p className="panel muted-text">
          No assets found. Create your first asset to get started.
        </p>
      ) : null}

      {/* Desktop table provides dense scanning for finance and operations teams. */}
      {!isLoading && !errorMessage && assets.length > 0 ? (
        <div className="panel table-scroll">
          <table className="asset-table" aria-label="Asset list table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Status</th>
                <th>Purchase Price</th>
                <th>Current Value</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
                <tr key={asset.id}>
                  <td>{asset.name}</td>
                  <td>{asset.category}</td>
                  <td>
                    <span className="accent-chip compact-chip">{asset.status}</span>
                  </td>
                  <td>{formatMoney(asset.purchasePrice)}</td>
                  <td>{formatMoney(asset?.depreciation?.currentValue)}</td>
                  <td>
                    <Link className="text-link" href={`/assets/${asset.id}`}>
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {/* Mobile cards mirror the same data in a touch-friendly stacked layout. */}
      {!isLoading && !errorMessage && assets.length > 0 ? (
        <div className="card-grid mobile-only-grid">
          {assets.map((asset) => (
            <article className="panel compact-panel" key={asset.id}>
              <h2>{asset.name}</h2>
              <p className="muted-text">{asset.category}</p>
              <p className="muted-text">Purchase: {formatMoney(asset.purchasePrice)}</p>
              <p className="muted-text">
                Current: {formatMoney(asset?.depreciation?.currentValue)}
              </p>
              <div className="chip-row">
                <span className="accent-chip compact-chip">{asset.status}</span>
                <Link className="text-link" href={`/assets/${asset.id}`}>
                  Open Details
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
