/**
 * Unified Financial Utility for MechHub
 *
 * WHY THIS FILE EXISTS:
 * Multiple parts of the app need to calculate prices (dashboard, project page,
 * payment API, admin panel). If each one did its own math, prices could show
 * differently in different places. This single file is the "source of truth"
 * for all price calculations — change it once, and every page updates.
 *
 * HOW PRICING WORKS:
 * 1. Start with the base price (the manufacturing quote)
 * 2. Add 18% GST tax
 * 3. Add a flat shipping fee
 * 4. Split the total 50/50 into advance and balance payments
 */

// GST (Goods and Services Tax) rate in India — 18%
export const GST_RATE = 0.18;

// Flat shipping cost for Standard Ground delivery (in INR ₹)
export const DEFAULT_SHIPPING_COST = 150;

/**
 * Shape of the financial breakdown returned by calculateProjectFinances().
 * Every field is a number representing an amount in INR (₹).
 */
export interface ProjectFinances {
  subtotal: number; // The raw manufacturing cost (before tax & shipping)
  gst: number; // 18% GST tax amount
  shipping: number; // Flat shipping fee
  total: number; // Grand total = subtotal + gst + shipping
  advance: number; // 50% of total — paid upfront to start production
  balance: number; // Remaining 50% — paid after delivery
}

/**
 * Calculates the full financial breakdown for a project.
 *
 * EXAMPLE:
 *   calculateProjectFinances(1000)
 *   → { subtotal: 1000, gst: 180, shipping: 150, total: 1330, advance: 665, balance: 665 }
 *
 * @param basePrice - The raw quoted or final price. Accepts number, string, or undefined.
 *                    If undefined or empty, defaults to 0.
 * @returns A ProjectFinances object with all amounts calculated.
 */
export function calculateProjectFinances(
  basePrice: number | string | undefined,
  customShippingCost?: number
): ProjectFinances {
  // Convert to a number safely — if basePrice is undefined, "", or NaN, default to 0
  const subtotal = Number(basePrice || 0);

  // Step 1: Calculate GST (18% of the base price, rounded to nearest rupee)
  const gst = Math.round(subtotal * GST_RATE);

  // Step 2: Add flat shipping cost
  const shipping = customShippingCost !== undefined ? customShippingCost : DEFAULT_SHIPPING_COST;

  // Step 3: Calculate grand total (base + tax + shipping)
  const total = subtotal + gst + shipping;

  // Step 4: Split into two equal milestone payments (50/50)
  const advance = Math.round(total * 0.5);
  const balance = total - advance; // Use subtraction (not * 0.5) to avoid rounding errors

  return {
    subtotal,
    gst,
    shipping,
    total,
    advance,
    balance,
  };
}
