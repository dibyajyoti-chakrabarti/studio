import { describe, it, expect } from 'vitest';
import { runDFMChecks } from './dfm-checks';
import { ParsedGeometry } from '@/types/quoting';

// ═══════════════════════════════════════════════════
// DFM Check Tests
// ═══════════════════════════════════════════════════

const baseGeometry: ParsedGeometry = {
  cutLengthMm: 1000,
  areaMm2: 5000,
  boundingBox: { widthMm: 100, heightMm: 100, aspectRatio: 1 },
  holeCount: 0,
  complexityScore: 1,
  nodeCount: 10,
  minFeatureSizeMm: 10.0,
  minSlotWidthMm: 10.0,
  edgeToHoleDistanceMm: 10.0,
  hasOpenPaths: false,
};

import { getMaterialById, LASER_MACHINE } from './materials';

const testMaterial = getMaterialById('al_6061')!;
const testMachine = LASER_MACHINE;

describe('DFM Check Engine', () => {
  it('should pass for a simple 100x100mm square', () => {
    const issues = runDFMChecks(baseGeometry, testMaterial, 2.0, testMachine);
    expect(issues.some((i) => i.blocking)).toBe(false);
  });

  it('should fail for extremely small features (e.g. 0.1mm)', () => {
    const badGeometry = { ...baseGeometry, minFeatureSizeMm: 0.1 };
    const issues = runDFMChecks(badGeometry, testMaterial, 2.0, testMachine);
    expect(
      issues.some((i) => i.message.includes('feature size') || i.message.includes('Feature size'))
    ).toBe(true);
  });

  it('should fail for parts larger than sheet size (e.g. >3000mm)', () => {
    const hugeGeometry = {
      ...baseGeometry,
      boundingBox: { widthMm: 4000, heightMm: 1000, aspectRatio: 4 },
    };
    const issues = runDFMChecks(hugeGeometry, testMaterial, 2.0, testMachine);
    expect(issues.some((i) => i.message.includes('exceeds'))).toBe(true);
  });

  it('should warn for open paths in DXF/STEP', () => {
    const openGeometry = { ...baseGeometry, hasOpenPaths: true };
    const issues = runDFMChecks(openGeometry, testMaterial, 2.0, testMachine);
    expect(issues.some((i) => i.message.includes('geometry') || i.message.includes('paths'))).toBe(
      true
    );
    expect(issues.find((i) => i.blocking)?.blocking).toBe(true);
  });

  it('should flag issues for thin slots', () => {
    const thinSlotGeometry = { ...baseGeometry, minSlotWidthMm: 0.4 };
    const issues = runDFMChecks(thinSlotGeometry, testMaterial, 2.0, testMachine);
    expect(issues.some((i) => i.message.includes('Slot width'))).toBe(true);
  });
});
