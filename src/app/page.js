import Link from "next/link";

export default function Home() {
  // Dashboard quick actions focus on the routes delivered in this phase.
  const quickActions = [
    {
      href: "/assets",
      title: "Browse Assets",
      description: "View the full asset inventory with live depreciation values.",
    },
    {
      href: "/add-asset",
      title: "Register Asset",
      description: "Create a new asset record using the core business form.",
    },
    {
      href: "/assets/A001",
      title: "Open Detail View",
      description: "Inspect assignment and maintenance history for one asset.",
    },
  ];

  return (
    <section className="view-stack">
      {/* Intro block communicates scope and confirms the active phase objective. */}
      <header className="panel">
        <p className="eyebrow">Phase 2 - Core UI Pages and Navigation</p>
        <h1 className="view-title">Asset Track Lite</h1>
        <p className="muted-text">
          Core UI routes are now connected to the backend contracts with the
          required brown-green visual system.
        </p>
      </header>

      {/* Action cards provide a fast starting point for testers and reviewers. */}
      <div className="card-grid">
        {quickActions.map((action) => (
          <article key={action.href} className="panel compact-panel">
            <h2>{action.title}</h2>
            <p className="muted-text">{action.description}</p>
            <Link className="accent-button" href={action.href}>
              Open
            </Link>
          </article>
        ))}
      </div>

      {/* Secondary links keep future-phase routes discoverable from the home view. */}
      <div className="chip-row">
        {["/maintenance", "/search", "/settings"].map((href) => (
          <Link key={href} className="accent-chip home-bottom-button" href={href}>
            {href.replace("/", "").replace("-", " ")}
          </Link>
        ))}
      </div>
    </section>
  );
}
