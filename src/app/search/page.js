import Link from "next/link";

// Phase 2 keeps this route navigable while search interactions are delivered in Phase 3.
export default function SearchPage() {
  return (
    <section className="view-stack">
      {/* Informational block clarifies current route status and next delivery phase. */}
      <article className="panel">
        <p className="eyebrow">Phase 3 Preview</p>
        <h1 className="view-title">Search</h1>
        <p className="muted-text">
          Advanced search and filter interactions will be implemented in Phase 3.
          Core navigation is active in Phase 2.
        </p>
      </article>

      {/* Quick links keep user movement smooth while this page is pending full scope. */}
      <div className="chip-row">
        <Link className="accent-chip" href="/assets">
          Open Assets
        </Link>
        <Link className="accent-chip" href="/add-asset">
          Add Asset
        </Link>
      </div>
    </section>
  );
}
