// ═══════════════════════════════════════════════════
// Quantity Tier Pricing — interpolated, not step function
// Pure functions. Zero dependencies.
// ═══════════════════════════════════════════════════

import type { QuantityTier } from '@/types/quoting';

const QTY_TIERS: readonly [number, number][] = [
  [1,    1.000],
  [5,    0.920],
  [10,   0.855],
  [25,   0.790],
  [50,   0.740],
  [100,  0.695],
  [250,  0.650],
  [500,  0.615],
  [1000, 0.580],
];

/**
 * Returns the per-unit price multiplier for a given quantity.
 * Interpolates between tiers (smooth curve, not step function).
 * Beyond 1000: logarithmic decay, floor at 55%.
 */
export function calcQuantityMultiplier(quantity: number): number {
  if (quantity <= 0) {
    return 1.0;
  }

  for (let i = 0; i < QTY_TIERS.length - 1; i++) {
    const [qLow, mLow] = QTY_TIERS[i];
    const [qHigh, mHigh] = QTY_TIERS[i + 1];

    if (quantity >= qLow && quantity <= qHigh) {
      const t = (quantity - qLow) / (qHigh - qLow);
      return mLow + t * (mHigh - mLow);
    }
  }

  // Beyond 1000: logarithmic decay, floor at 55%
  return Math.max(0.550, 0.580 - 0.03 * Math.log10(quantity / 1000));
}

/**
 * Generates a visual tier pricing table showing price at key quantities.
 * Used to display "1 pc = ₹280, 10 pcs = ₹241 each, 25 pcs = ₹210 each".
 */
export function getVisualTierTable(basePricePerPart: number): readonly QuantityTier[] {
  const displayQuantities = [1, 5, 10, 25, 50, 100, 250, 500, 1000];
  const baseMultiplier = calcQuantityMultiplier(1);

  return displayQuantities.map((qty) => {
    const multiplier = calcQuantityMultiplier(qty);
    const pricePerPart = Math.round(basePricePerPart * multiplier);
    const totalPrice = pricePerPart * qty;
    const savingsPercent = Math.round((1 - multiplier / baseMultiplier) * 100);

    return {
      quantity: qty,
      multiplier,
      pricePerPart,
      totalPrice,
      savingsPercent,
    };
  });
}

/**
 * Returns savings percentage for the given quantity vs single unit.
 */
export function getSavingsPercent(quantity: number): number {
  const singleMultiplier = calcQuantityMultiplier(1);
  const qtyMultiplier = calcQuantityMultiplier(quantity);
  return Math.round((1 - qtyMultiplier / singleMultiplier) * 100);
}
