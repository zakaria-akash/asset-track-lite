// Central status list to keep asset lifecycle values consistent across APIs and UI.
const ALLOWED_ASSET_STATUSES = [
  "in-use",
  "in-maintenance",
  "retired",
  "available",
];

// Shared lightweight error type so route handlers can map failures to HTTP status codes.
class AppValidationError extends Error {
  constructor(message, details = []) {
    super(message);
    this.name = "AppValidationError";
    this.status = 400;
    this.details = details;
  }
}

// Normalizes unknown input into a trimmed string for safe comparisons and persistence.
function normalizeString(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

// Validates strict YYYY-MM-DD strings used by purchase, validity, and maintenance dates.
function isValidDateString(value) {
  const normalized = normalizeString(value);
  const formatMatches = /^\d{4}-\d{2}-\d{2}$/.test(normalized);

  if (!formatMatches) {
    return false;
  }

  const date = new Date(`${normalized}T00:00:00Z`);
  return !Number.isNaN(date.getTime());
}

// Ensures numeric fields are valid non-negative numbers used by pricing and costs.
function parseNonNegativeNumber(value) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue) || numericValue < 0) {
    return null;
  }

  return numericValue;
}

// Validates create/update payloads and returns a normalized object for data persistence.
function validateAssetPayload(payload, options = {}) {
  const { partial = false } = options;
  const errors = [];
  const normalized = {};

  if (payload === null || typeof payload !== "object" || Array.isArray(payload)) {
    throw new AppValidationError("Asset payload must be a JSON object.");
  }

  const requiredKeys = [
    "name",
    "category",
    "purchaseDate",
    "purchasePrice",
    "usefulYears",
    "validity",
    "status",
  ];

  requiredKeys.forEach((key) => {
    const hasValue = payload[key] !== undefined && payload[key] !== null;
    if (!partial && !hasValue) {
      errors.push(`Missing required field: ${key}.`);
    }
  });

  const stringFields = [
    "id",
    "code",
    "name",
    "category",
    "serial",
    "validity",
    "status",
    "assignedTo",
    "assignedLocation",
  ];

  stringFields.forEach((fieldName) => {
    if (payload[fieldName] === undefined) {
      return;
    }

    const value = normalizeString(payload[fieldName]);
    if (["name", "category", "status"].includes(fieldName) && value.length === 0) {
      errors.push(`${fieldName} must be a non-empty string.`);
      return;
    }

    normalized[fieldName] = value;
  });

  if (payload.purchaseDate !== undefined) {
    const value = normalizeString(payload.purchaseDate);
    if (!isValidDateString(value)) {
      errors.push("purchaseDate must use YYYY-MM-DD format.");
    } else {
      normalized.purchaseDate = value;
    }
  }

  if (payload.validity !== undefined) {
    const value = normalizeString(payload.validity);
    if (!isValidDateString(value)) {
      errors.push("validity must use YYYY-MM-DD format.");
    } else {
      normalized.validity = value;
    }
  }

  if (payload.status !== undefined) {
    const value = normalizeString(payload.status);
    if (!ALLOWED_ASSET_STATUSES.includes(value)) {
      errors.push(
        `status must be one of: ${ALLOWED_ASSET_STATUSES.join(", ")}.`
      );
    } else {
      normalized.status = value;
    }
  }

  if (payload.purchasePrice !== undefined) {
    const value = parseNonNegativeNumber(payload.purchasePrice);
    if (value === null) {
      errors.push("purchasePrice must be a non-negative number.");
    } else {
      normalized.purchasePrice = value;
    }
  }

  if (payload.usefulYears !== undefined) {
    const yearsValue = Number(payload.usefulYears);
    if (!Number.isInteger(yearsValue) || yearsValue <= 0) {
      errors.push("usefulYears must be a positive integer.");
    } else {
      normalized.usefulYears = yearsValue;
    }
  }

  if (payload.maintenance !== undefined) {
    if (!Array.isArray(payload.maintenance)) {
      errors.push("maintenance must be an array when provided.");
    } else {
      normalized.maintenance = payload.maintenance;
    }
  }

  if (payload.assignmentHistory !== undefined) {
    if (!Array.isArray(payload.assignmentHistory)) {
      errors.push("assignmentHistory must be an array when provided.");
    } else {
      normalized.assignmentHistory = payload.assignmentHistory;
    }
  }

  if (errors.length > 0) {
    throw new AppValidationError("Asset payload validation failed.", errors);
  }

  if (!partial) {
    normalized.maintenance = normalized.maintenance ?? [];
    normalized.assignmentHistory = normalized.assignmentHistory ?? [];
    normalized.assignedTo = normalized.assignedTo ?? "Unassigned";
    normalized.assignedLocation = normalized.assignedLocation ?? "Unknown";
    normalized.serial = normalized.serial ?? "N/A";
    normalized.code = normalized.code ?? "";
  }

  return normalized;
}

// Validates a maintenance payload and returns a normalized record payload.
function validateMaintenancePayload(payload) {
  const errors = [];

  if (payload === null || typeof payload !== "object" || Array.isArray(payload)) {
    throw new AppValidationError("Maintenance payload must be a JSON object.");
  }

  const assetId = normalizeString(payload.assetId);
  const date = normalizeString(payload.date);
  const type = normalizeString(payload.type);
  const note = normalizeString(payload.note);
  const cost = parseNonNegativeNumber(payload.cost);

  if (!assetId) {
    errors.push("assetId is required.");
  }

  if (!isValidDateString(date)) {
    errors.push("date must use YYYY-MM-DD format.");
  }

  if (!type) {
    errors.push("type is required.");
  }

  if (cost === null) {
    errors.push("cost must be a non-negative number.");
  }

  if (errors.length > 0) {
    throw new AppValidationError("Maintenance payload validation failed.", errors);
  }

  return {
    assetId,
    date,
    type,
    cost,
    note,
  };
}

// Normalizes search filters so handlers can run deterministic matching logic.
function validateSearchPayload(payload) {
  if (payload === null || payload === undefined) {
    return {
      query: "",
      category: "",
      status: "",
      code: "",
      serial: "",
    };
  }

  if (typeof payload !== "object" || Array.isArray(payload)) {
    throw new AppValidationError("Search payload must be a JSON object.");
  }

  return {
    query: normalizeString(payload.query),
    category: normalizeString(payload.category),
    status: normalizeString(payload.status),
    code: normalizeString(payload.code),
    serial: normalizeString(payload.serial),
  };
}

export {
  ALLOWED_ASSET_STATUSES,
  AppValidationError,
  isValidDateString,
  validateAssetPayload,
  validateMaintenancePayload,
  validateSearchPayload,
};
