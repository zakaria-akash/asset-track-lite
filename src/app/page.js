import Link from "next/link";

export default function Home() {
  // Central route map helps developers quickly verify all scaffolded pages.
  const phaseZeroLinks = [
    { href: "/assets", label: "Assets" },
    { href: "/add-asset", label: "Add Asset" },
    { href: "/maintenance", label: "Maintenance" },
    { href: "/search", label: "Search" },
    { href: "/settings", label: "Settings" },
  ];

  return (
    <main className="home">
      {/* Brand header remains at the top center on a black screen as requested. */}
      <h1>Asset Track Lite</h1>

      {/* Phase 0 scaffold links provide quick navigation during setup validation. */}
      <nav aria-label="Phase 0 navigation" className="phase-links">
        {phaseZeroLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
    </main>
  );
}
