import { describe, it, expect } from 'vitest';
import { generateQuote } from './pricing-engine';
import { ParsedGeometry } from '@/types/quoting';

// ═══════════════════════════════════════════════════
// Pricing Engine Tests
// ═══════════════════════════════════════════════════

const mockGeometry: ParsedGeometry = {
  cutLengthMm: 1000,
  areaMm2: 5000,
  boundingBox: {
    widthMm: 100,
    heightMm: 50,
    aspectRatio: 2,
  },
  holeCount: 4,
  complexityScore: 1,
  nodeCount: 50,
  minFeatureSizeMm: 2.0,
  minSlotWidthMm: 2.0,
  edgeToHoleDistanceMm: 5.0,
  hasOpenPaths: false,
};

describe('Pricing Engine', () => {
  it('should calculate a valid quote for standard aluminum', () => {
    const result = generateQuote(
      'al_6061', // Material ID
      2.0, // Thickness
      'none', // Finish
      1, // Quantity
      'standard_3d', // Turnaround
      mockGeometry
    );

    if (result.success) {
      expect(result.data.totalPrice).toBeGreaterThan(0);
      expect(result.data.breakdown.materialCost).toBeGreaterThan(0);
      expect(result.data.breakdown.cutCost).toBeGreaterThan(0);
      expect(result.data.leadTimeDays).toBe(3);
    } else {
      throw new Error(`Quote generation failed: ${result.error.message}`);
    }
  });

  it('should apply quantity discounts correctly', () => {
    const quote1 = generateQuote('al_6061', 2.0, 'none', 1, 'standard_3d', mockGeometry);
    const quote50 = generateQuote('al_6061', 2.0, 'none', 50, 'standard_3d', mockGeometry);

    if (quote1.success && quote50.success) {
      // Price per part for 50 should be significantly lower than for 1
      expect(quote50.data.pricePerPart).toBeLessThan(quote1.data.pricePerPart);
      expect(quote50.data.breakdown.quantityMultiplier).toBeLessThan(1);
    } else {
      throw new Error('One or both quotes failed');
    }
  });

  it('should apply rush surcharges for same-day delivery', () => {
    const standard = generateQuote('al_6061', 2.0, 'none', 1, 'standard_3d', mockGeometry);
    const sameDay = generateQuote('al_6061', 2.0, 'none', 1, 'same_day', mockGeometry);

    if (standard.success && sameDay.success) {
      expect(sameDay.data.totalPrice).toBeGreaterThan(standard.data.totalPrice);
      expect(sameDay.data.breakdown.rushMultiplier).toBeGreaterThan(1);
      expect(sameDay.data.leadTimeDays).toBe(0);
    } else {
      throw new Error('One or both quotes failed');
    }
  });

  it('should flag blocking DFM issues for oversized parts', () => {
    const hugeGeometry = {
      ...mockGeometry,
      boundingBox: { widthMm: 5000, heightMm: 5000, aspectRatio: 1 },
    };

    const result = generateQuote('al_6061', 2.0, 'none', 1, 'standard_3d', hugeGeometry);

    if (result.success) {
      expect(result.data.hasBlockingIssues).toBe(true);
      expect(result.data.dfmIssues.some((i) => i.blocking)).toBe(true);
    } else {
      throw new Error('Quote generation failed');
    }
  });
});
