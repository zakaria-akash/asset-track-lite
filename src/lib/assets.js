// Central file path for the JSON-backed dataset used in early phases.
const ASSETS_DATA_PATH = "public/data/assets.json";

// Shared helper placeholder for dataset reads in Phase 1.
export async function readAssets() {
  throw new Error("readAssets is not implemented yet. Build in Phase 1.");
}

// Shared helper placeholder for dataset writes in Phase 1.
export async function writeAssets() {
  throw new Error("writeAssets is not implemented yet. Build in Phase 1.");
}

// Shared helper placeholder for listing assets in Phase 1.
export async function listAssets() {
  throw new Error("listAssets is not implemented yet. Build in Phase 1.");
}

// Shared helper placeholder for fetching one asset in Phase 1.
export async function getAssetById() {
  throw new Error("getAssetById is not implemented yet. Build in Phase 1.");
}

// Export the dataset path so API handlers can reuse one source of truth.
export { ASSETS_DATA_PATH };
