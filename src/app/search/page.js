"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

// Currency formatter is shared so financial values stay consistent across result cards.
function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

// Initial filter shape mirrors the API request contract for /api/search.
const INITIAL_FILTERS = {
  query: "",
  category: "",
  code: "",
  serial: "",
  status: "",
};

export default function SearchPage() {
  // Filter state captures all supported fields exposed by the search API.
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  // Request-state values support clear loading and error feedback.
  const [isSearching, setIsSearching] = useState(false);
  const [errorState, setErrorState] = useState({ message: "", details: [] });
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Small derived value communicates how much data was returned without extra markup.
  const resultSummary = useMemo(
    () => ({
      count: results.length,
      totalCurrent: results.reduce(
        (sum, asset) => sum + Number(asset?.depreciation?.currentValue || 0),
        0
      ),
    }),
    [results]
  );

  // Generic change handler keeps form logic concise and maintainable.
  function handleFilterChange(event) {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  }

  // Resets filters and clears previous server results for a fresh search run.
  function clearFilters() {
    setFilters(INITIAL_FILTERS);
    setResults([]);
    setErrorState({ message: "", details: [] });
    setHasSearched(false);
  }

  // Executes API search using current filter state and handles success/error responses.
  async function handleSearch(event) {
    event.preventDefault();
    setIsSearching(true);
    setErrorState({ message: "", details: [] });
    setHasSearched(true);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters),
      });

      const result = await response.json();
      if (!response.ok || result.ok !== true) {
        const message = result.error || "Search request failed.";
        const details = Array.isArray(result.details) ? result.details : [];
        throw new Error(JSON.stringify({ message, details }));
      }

      setResults(result.data || []);
    } catch (error) {
      // Structured parsing ensures server validation details are visible to users.
      let message = "Search request failed.";
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

      setErrorState({ message, details });
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <section className="view-stack">
      {/* Header clarifies purpose and confirms this route is now fully operational. */}
      <header className="panel">
        <p className="eyebrow">Phase 3 Delivery</p>
        <h1 className="view-title">Search</h1>
        <p className="muted-text">
          Search assets by free text and targeted filters such as category,
          code, serial, and status.
        </p>
      </header>

      {/* Search form reflects supported API filters and keeps controls grouped. */}
      <form className="panel form-grid" onSubmit={handleSearch}>
        <label>
          Query
          <input
            name="query"
            value={filters.query}
            onChange={handleFilterChange}
            placeholder="name, code, serial, assignee"
          />
        </label>

        <label>
          Category
          <input
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            placeholder="Electronics"
          />
        </label>

        <label>
          Code
          <input
            name="code"
            value={filters.code}
            onChange={handleFilterChange}
            placeholder="AST-LAP-001"
          />
        </label>

        <label>
          Serial
          <input
            name="serial"
            value={filters.serial}
            onChange={handleFilterChange}
            placeholder="DX13-91A2-44Q1"
          />
        </label>

        <label>
          Status
          <select name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">All statuses</option>
            <option value="in-use">in-use</option>
            <option value="in-maintenance">in-maintenance</option>
            <option value="available">available</option>
            <option value="retired">retired</option>
          </select>
        </label>

        {/* Form actions include search submit and reset to improve iterative exploration. */}
        <div className="form-actions row-actions">
          <button className="accent-button" type="submit" disabled={isSearching}>
            {isSearching ? "Searching..." : "Search Assets"}
          </button>
          <button
            className="accent-button ghost-button"
            type="button"
            onClick={clearFilters}
            disabled={isSearching}
          >
            Clear
          </button>
        </div>
      </form>

      {/* Status row communicates request outcome and aggregate values. */}
      <div className="chip-row">
        <span className="accent-chip">Matches: {resultSummary.count}</span>
        <span className="accent-chip">
          Total Current Value: {formatMoney(resultSummary.totalCurrent)}
        </span>
      </div>

      {/* Error feedback is shown in-place to keep context near the search controls. */}
      {errorState.message ? <p className="panel error-text">{errorState.message}</p> : null}
      {errorState.details?.length > 0 ? (
        <ul className="panel validation-list error-text">
          {errorState.details.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
      ) : null}

      {/* Clear empty state helps users understand when search has no matches. */}
      {hasSearched && !isSearching && !errorState.message && results.length === 0 ? (
        <p className="panel muted-text">
          No assets matched your filters. Try broadening your search criteria.
        </p>
      ) : null}

      {/* Result cards provide quick scan + direct navigation to asset details. */}
      <div className="card-grid">
        {results.map((asset) => (
          <article key={asset.id} className="panel compact-panel">
            <h2>{asset.name}</h2>
            <p className="muted-text">Category: {asset.category}</p>
            <p className="muted-text">Code: {asset.code}</p>
            <p className="muted-text">Serial: {asset.serial}</p>
            <p className="muted-text">Status: {asset.status}</p>
            <p className="muted-text">
              Current Value: {formatMoney(asset?.depreciation?.currentValue)}
            </p>
            <Link className="text-link" href={`/assets/${asset.id}`}>
              Open Details
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
