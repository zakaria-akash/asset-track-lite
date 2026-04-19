import Link from "next/link";

// Phase 2 keeps this route navigable while settings persistence is delivered in Phase 3.
export default function SettingsPage() {
  return (
    <section className="view-stack">
      {/* Informational block clarifies current route status and next delivery phase. */}
      <article className="panel">
        <p className="eyebrow">Phase 3 Preview</p>
        <h1 className="view-title">Settings</h1>
        <p className="muted-text">
          Display mode, density, and font-size persistence will be implemented
          in Phase 3. Core navigation is active in Phase 2.
        </p>
      </article>

      {/* Quick links keep user movement smooth while this page is pending full scope. */}
      <div className="chip-row">
        <Link className="accent-chip" href="/assets">
          Open Assets
        </Link>
        <Link className="accent-chip" href="/maintenance">
          Open Maintenance
        </Link>
      </div>
    </section>
  );
}
