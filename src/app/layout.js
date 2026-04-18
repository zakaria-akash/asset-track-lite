import "./globals.css";

export const metadata = {
  title: "Asset Track Lite",
  description: "Asset Track Lite",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
