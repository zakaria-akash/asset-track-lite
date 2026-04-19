import "./globals.css";
import Link from "next/link";
import SettingsProvider from "./components/SettingsProvider";

// Global metadata baseline for the MVP shell.
export const metadata = {
  title: "Asset Track Lite",
  description: "Lightweight asset management with Next.js and TailwindCSS",
};

export default function RootLayout({ children }) {
  // Central navigation map keeps the route structure explicit and maintainable.
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/assets", label: "Assets" },
    { href: "/add-asset", label: "Add Asset" },
    { href: "/maintenance", label: "Maintenance" },
    { href: "/search", label: "Search" },
    { href: "/settings", label: "Settings" },
  ];

  return (
    // Root document wrapper hosts shared chrome used by all app routes.
    <html lang="en">
      <body className="app-body">
        {/* Provider applies persisted visual settings globally on the client. */}
        <SettingsProvider>
          {/* Top bar is the single navigation source for core app pages. */}
          <header className="app-topbar">
            <Link className="app-brand" href="/">
              Asset Track Lite
            </Link>

            {/* Route links remain compact and reuse the mandatory color accents. */}
            <nav aria-label="Primary" className="app-nav">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </header>

          {/* Main container gives every page consistent spacing and readable width. */}
          <main className="app-content">{children}</main>
        </SettingsProvider>
      </body>
    </html>
  );
}
