import "./globals.css";

// Global metadata baseline for the MVP shell.
export const metadata = {
  title: "Asset Track Lite",
  description: "Lightweight asset management with Next.js and TailwindCSS",
};

export default function RootLayout({ children }) {
  return (
    // Root document wrapper kept intentionally minimal for App Router pages.
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
