/**
 * Unified Financial Utility for MechHub
 * 
 * This utility centralizes the logic for calculating taxes, shipping, 
 * and payment milestones (advance/balance) to ensure data integrity 
 * and consistency across Admin, Customer, and Backend modules.
 */

export const GST_RATE = 0.18;
export const DEFAULT_SHIPPING_COST = 150; // Standard Ground

export interface ProjectFinances {
  subtotal: number;
  gst: number;
  shipping: number;
  total: number;
  advance: number;
  balance: number;
}

/**
 * Calculates the full financial breakdown for a project based on its base price.
 * 
 * @param basePrice The raw quoted or final price of the project
 * @returns A structured ProjectFinances object
 */
export function calculateProjectFinances(basePrice: number | string | undefined): ProjectFinances {
  const subtotal = Number(basePrice || 0);
  
  // 1. Calculate GST (Standard 18%)
  const gst = Math.round(subtotal * GST_RATE);
  
  // 2. Shipping Cost (Standard Ground)
  const shipping = DEFAULT_SHIPPING_COST;
  
  // 3. Grand Total
  const total = subtotal + gst + shipping;
  
  // 4. Milestone Payments (50/50 split)
  const advance = Math.round(total * 0.5);
  const balance = total - advance; // Ensure exact total parity

  return {
    subtotal,
    gst,
    shipping,
    total,
    advance,
    balance
  };
}
