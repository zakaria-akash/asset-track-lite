import { describe, expect, it } from "vitest";

import {
  AppValidationError,
  validateAssetPayload,
  validateMaintenancePayload,
  validateSearchPayload,
} from "./validation";

// Validation utility tests guard core backend input rules and error contracts.
describe("validation utilities", () => {
  // Asset payload validation should accept valid full payloads and normalize defaults.
  it("validates and normalizes full asset payloads", () => {
    const payload = validateAssetPayload({
      name: "Laptop",
      category: "Electronics",
      purchaseDate: "2024-01-01",
      purchasePrice: 1200,
      usefulYears: 4,
      validity: "2028-01-01",
      status: "in-use",
    });

    expect(payload.assignedTo).toBe("Unassigned");
    expect(payload.maintenance).toEqual([]);
    expect(payload.assignmentHistory).toEqual([]);
  });

  // Invalid asset payloads should throw structured validation errors.
  it("throws AppValidationError for invalid asset payload", () => {
    expect(() =>
      validateAssetPayload({
        name: "",
        category: "",
      })
    ).toThrow(AppValidationError);
  });

  // Maintenance validation should enforce required keys and numeric/date sanity.
  it("validates maintenance payload", () => {
    const payload = validateMaintenancePayload({
      assetId: "A001",
      date: "2026-04-19",
      type: "inspection",
      cost: 15,
      note: "checked",
    });

    expect(payload.assetId).toBe("A001");
    expect(payload.cost).toBe(15);
  });

  // Search payload validation should normalize missing inputs to empty strings.
  it("normalizes empty search payload", () => {
    const filters = validateSearchPayload();
    expect(filters).toEqual({
      query: "",
      category: "",
      status: "",
      code: "",
      serial: "",
    });
  });
});
