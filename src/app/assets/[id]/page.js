// Phase 0 scaffold page for a single asset detail route.
export default async function AssetDetailPage({ params }) {
  // Keep route params wiring in place so Phase 2 can attach data loading directly.
  const { id } = await params;

  return (
    <main className="page-shell">
      <h1>Asset Detail</h1>
      <p>Phase 0 scaffold for asset id: {id}</p>
    </main>
  );
}
