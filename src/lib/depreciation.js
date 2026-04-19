// Normalizes date-like input and throws explicit errors for invalid values.
function toDateOrThrow(value, fieldName) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`${fieldName} is not a valid date.`);
  }

  return date;
}

// Returns completed years between purchase and reference date using calendar logic.
export function getYearsPassed(purchaseDate, referenceDate = new Date()) {
  const purchase = toDateOrThrow(purchaseDate, "purchaseDate");
  const reference = toDateOrThrow(referenceDate, "referenceDate");

  let years = reference.getUTCFullYear() - purchase.getUTCFullYear();
  const hasNotReachedAnniversary =
    reference.getUTCMonth() < purchase.getUTCMonth() ||
    (reference.getUTCMonth() === purchase.getUTCMonth() &&
      reference.getUTCDate() < purchase.getUTCDate());

  if (hasNotReachedAnniversary) {
    years -= 1;
  }

  return Math.max(0, years);
}

// Computes capped straight-line depreciation so values never exceed purchase price.
export function calculateStraightLineDepreciation(
  purchasePrice,
  usefulYears,
  yearsPassed
) {
  const normalizedPrice = Number(purchasePrice);
  const normalizedUsefulYears = Number(usefulYears);
  const normalizedYearsPassed = Number(yearsPassed);

  if (!Number.isFinite(normalizedPrice) || normalizedPrice < 0) {
    throw new Error("purchasePrice must be a non-negative number.");
  }

  if (!Number.isInteger(normalizedUsefulYears) || normalizedUsefulYears <= 0) {
    throw new Error("usefulYears must be a positive integer.");
  }

  if (!Number.isFinite(normalizedYearsPassed) || normalizedYearsPassed < 0) {
    throw new Error("yearsPassed must be a non-negative number.");
  }

  const annualDepreciation = normalizedPrice / normalizedUsefulYears;
  const cappedYears = Math.min(normalizedUsefulYears, normalizedYearsPassed);
  const totalDepreciation = annualDepreciation * cappedYears;

  return Number(totalDepreciation.toFixed(2));
}

// Computes current value after depreciation and floors at zero for safety.
export function calculateCurrentValue(purchasePrice, depreciationAmount) {
  const normalizedPrice = Number(purchasePrice);
  const normalizedDepreciation = Number(depreciationAmount);

  if (!Number.isFinite(normalizedPrice) || normalizedPrice < 0) {
    throw new Error("purchasePrice must be a non-negative number.");
  }

  if (!Number.isFinite(normalizedDepreciation) || normalizedDepreciation < 0) {
    throw new Error("depreciationAmount must be a non-negative number.");
  }

  return Number(Math.max(0, normalizedPrice - normalizedDepreciation).toFixed(2));
}

// Returns a full depreciation snapshot to enrich API list/detail payloads.
export function getAssetDepreciationSnapshot(asset, referenceDate = new Date()) {
  const yearsPassed = getYearsPassed(asset.purchaseDate, referenceDate);
  const annualDepreciation = Number(
    (asset.purchasePrice / asset.usefulYears).toFixed(2)
  );
  const totalDepreciation = calculateStraightLineDepreciation(
    asset.purchasePrice,
    asset.usefulYears,
    yearsPassed
  );
  const currentValue = calculateCurrentValue(
    asset.purchasePrice,
    totalDepreciation
  );

  return {
    yearsPassed,
    annualDepreciation,
    totalDepreciation,
    currentValue,
  };
}
