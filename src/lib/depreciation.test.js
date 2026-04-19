import { describe, expect, it } from "vitest";

import {
  calculateCurrentValue,
  calculateStraightLineDepreciation,
  getAssetDepreciationSnapshot,
  getYearsPassed,
} from "./depreciation";

// Depreciation utility tests verify the core finance math used by APIs/UI.
describe("depreciation utilities", () => {
  // Year-delta calculation should respect month/day anniversary boundaries.
  it("computes completed years correctly", () => {
    const years = getYearsPassed("2021-08-15", new Date("2024-08-14"));
    expect(years).toBe(2);
  });

  // Straight-line depreciation must cap by useful life and preserve numeric stability.
  it("caps straight-line depreciation at useful life", () => {
    const value = calculateStraightLineDepreciation(1000, 4, 10);
    expect(value).toBe(1000);
  });

  // Current value should never become negative after heavy depreciation.
  it("floors current value at zero", () => {
    const value = calculateCurrentValue(100, 500);
    expect(value).toBe(0);
  });

  // Snapshot helper should aggregate all depreciation outputs for one asset object.
  it("returns a full depreciation snapshot", () => {
    const snapshot = getAssetDepreciationSnapshot(
      {
        purchaseDate: "2020-01-01",
        purchasePrice: 1200,
        usefulYears: 4,
      },
      new Date("2023-01-01")
    );

    expect(snapshot).toEqual({
      yearsPassed: 3,
      annualDepreciation: 300,
      totalDepreciation: 900,
      currentValue: 300,
    });
  });
});
