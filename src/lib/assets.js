import fs from "node:fs/promises";
import path from "node:path";

import {
  AppValidationError,
  validateAssetPayload,
  validateMaintenancePayload,
  validateSearchPayload,
} from "@/lib/validation";

// Relative dataset path is exported for operational visibility and diagnostics.
const ASSETS_DATA_PATH = "public/data/assets.json";

// Root-level error type lets API handlers map domain failures to HTTP status codes.
class AssetDomainError extends Error {
  constructor(message, status = 500, details = []) {
    super(message);
    this.name = "AssetDomainError";
    this.status = status;
    this.details = details;
  }
}

// Resolves dataset location at runtime so dev/prod environments stay aligned.
function resolveDatasetPath() {
  return path.join(process.cwd(), ASSETS_DATA_PATH);
}

// Generates deterministic IDs with prefix-aware incrementing (A001, M004, etc.).
function generateNextId(records, prefix) {
  const maxValue = records.reduce((max, record) => {
    if (!record?.id || typeof record.id !== "string") {
      return max;
    }

    const numericPart = Number(record.id.replace(prefix, ""));
    if (!Number.isInteger(numericPart)) {
      return max;
    }

    return Math.max(max, numericPart);
  }, 0);

  return `${prefix}${String(maxValue + 1).padStart(3, "0")}`;
}

// Reads and parses the full dataset while enforcing expected array structure.
export async function readAssets() {
  const datasetPath = resolveDatasetPath();
  const rawData = await fs.readFile(datasetPath, "utf-8");
  const parsedData = JSON.parse(rawData);

  if (!Array.isArray(parsedData)) {
    throw new AssetDomainError("Asset dataset is not a valid array.", 500);
  }

  return parsedData;
}

// Persists the entire dataset with stable formatting for readable version control.
export async function writeAssets(assets) {
  if (!Array.isArray(assets)) {
    throw new AssetDomainError("Assets payload must be an array.", 500);
  }

  const datasetPath = resolveDatasetPath();
  const jsonData = `${JSON.stringify(assets, null, 2)}\n`;
  await fs.writeFile(datasetPath, jsonData, "utf-8");
}

// Returns all assets in stored order, used by list and search endpoints.
export async function listAssets() {
  return readAssets();
}

// Returns one asset by id and throws a typed not-found error when missing.
export async function getAssetById(assetId) {
  const normalizedId = String(assetId || "").trim();
  if (!normalizedId) {
    throw new AssetDomainError("assetId is required.", 400);
  }

  const assets = await readAssets();
  const asset = assets.find((item) => item.id === normalizedId);

  if (!asset) {
    throw new AssetDomainError(`Asset not found: ${normalizedId}.`, 404);
  }

  return asset;
}

// Creates a new asset record with validation, defaults, and generated identifiers.
export async function createAsset(payload) {
  let normalized;
  try {
    normalized = validateAssetPayload(payload, { partial: false });
  } catch (error) {
    if (error instanceof AppValidationError) {
      throw new AssetDomainError(error.message, 400, error.details);
    }
    throw error;
  }

  const assets = await readAssets();
  const assetId = normalized.id || generateNextId(assets, "A");

  if (assets.some((item) => item.id === assetId)) {
    throw new AssetDomainError(`Asset id already exists: ${assetId}.`, 409);
  }

  const assetCode = normalized.code || `AST-${assetId}`;
  const newAsset = {
    ...normalized,
    id: assetId,
    code: assetCode,
  };

  assets.push(newAsset);
  await writeAssets(assets);
  return newAsset;
}

// Applies a validated partial update and returns the updated persisted record.
export async function updateAsset(assetId, payload) {
  let normalizedPatch;
  try {
    normalizedPatch = validateAssetPayload(payload, { partial: true });
  } catch (error) {
    if (error instanceof AppValidationError) {
      throw new AssetDomainError(error.message, 400, error.details);
    }
    throw error;
  }

  const normalizedId = String(assetId || "").trim();
  if (!normalizedId) {
    throw new AssetDomainError("assetId is required.", 400);
  }

  const assets = await readAssets();
  const assetIndex = assets.findIndex((item) => item.id === normalizedId);

  if (assetIndex < 0) {
    throw new AssetDomainError(`Asset not found: ${normalizedId}.`, 404);
  }

  // Prevent id rewrites to keep route identifiers stable over time.
  if (Object.prototype.hasOwnProperty.call(normalizedPatch, "id")) {
    delete normalizedPatch.id;
  }

  const updatedAsset = {
    ...assets[assetIndex],
    ...normalizedPatch,
  };

  assets[assetIndex] = updatedAsset;
  await writeAssets(assets);
  return updatedAsset;
}

// Removes an asset record and returns the deleted object for API confirmation.
export async function deleteAsset(assetId) {
  const normalizedId = String(assetId || "").trim();
  if (!normalizedId) {
    throw new AssetDomainError("assetId is required.", 400);
  }

  const assets = await readAssets();
  const assetIndex = assets.findIndex((item) => item.id === normalizedId);

  if (assetIndex < 0) {
    throw new AssetDomainError(`Asset not found: ${normalizedId}.`, 404);
  }

  const [removedAsset] = assets.splice(assetIndex, 1);
  await writeAssets(assets);
  return removedAsset;
}

// Appends one maintenance record to an existing asset and persists the mutation.
export async function addMaintenanceEntry(payload) {
  let normalized;
  try {
    normalized = validateMaintenancePayload(payload);
  } catch (error) {
    if (error instanceof AppValidationError) {
      throw new AssetDomainError(error.message, 400, error.details);
    }
    throw error;
  }

  const assets = await readAssets();
  const assetIndex = assets.findIndex((item) => item.id === normalized.assetId);

  if (assetIndex < 0) {
    throw new AssetDomainError(`Asset not found: ${normalized.assetId}.`, 404);
  }

  const maintenance = Array.isArray(assets[assetIndex].maintenance)
    ? assets[assetIndex].maintenance
    : [];

  const newMaintenanceEntry = {
    id: generateNextId(maintenance, "M"),
    date: normalized.date,
    type: normalized.type,
    cost: normalized.cost,
    note: normalized.note,
  };

  assets[assetIndex] = {
    ...assets[assetIndex],
    maintenance: [...maintenance, newMaintenanceEntry],
  };

  await writeAssets(assets);
  return {
    asset: assets[assetIndex],
    maintenanceEntry: newMaintenanceEntry,
  };
}

// Performs case-insensitive query and field-filter matching for the search endpoint.
export async function searchAssets(payload) {
  let filters;
  try {
    filters = validateSearchPayload(payload);
  } catch (error) {
    if (error instanceof AppValidationError) {
      throw new AssetDomainError(error.message, 400, error.details);
    }
    throw error;
  }

  const assets = await readAssets();
  const normalizedQuery = filters.query.toLowerCase();

  return assets.filter((asset) => {
    const queryCandidates = [
      asset.id,
      asset.name,
      asset.category,
      asset.code,
      asset.serial,
      asset.assignedTo,
      asset.assignedLocation,
    ]
      .filter(Boolean)
      .map((value) => String(value).toLowerCase());

    const matchesQuery =
      !normalizedQuery ||
      queryCandidates.some((candidate) => candidate.includes(normalizedQuery));

    const matchesCategory =
      !filters.category ||
      String(asset.category || "")
        .toLowerCase()
        .includes(filters.category.toLowerCase());

    const matchesStatus =
      !filters.status ||
      String(asset.status || "")
        .toLowerCase()
        .includes(filters.status.toLowerCase());

    const matchesCode =
      !filters.code ||
      String(asset.code || "")
        .toLowerCase()
        .includes(filters.code.toLowerCase());

    const matchesSerial =
      !filters.serial ||
      String(asset.serial || "")
        .toLowerCase()
        .includes(filters.serial.toLowerCase());

    return (
      matchesQuery &&
      matchesCategory &&
      matchesStatus &&
      matchesCode &&
      matchesSerial
    );
  });
}

export { ASSETS_DATA_PATH, AssetDomainError };
