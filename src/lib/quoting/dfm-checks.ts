// ═══════════════════════════════════════════════════
// DFM Checks — Design for Manufacturing rule engine
// Pure functions. Returns DFMIssue[] for geometry.
// ═══════════════════════════════════════════════════

import type { ParsedGeometry, DFMIssue, Material, Machine } from '@/types/quoting';

/**
 * Runs all DFM checks for given geometry, material, and machine.
 * Returns array of issues (empty = all checks pass).
 * Blocking issues prevent quoting; warnings are advisory.
 */
export function runDFMChecks(
  geometry: ParsedGeometry,
  material: Material,
  thicknessMm: number,
  machine: Machine
): readonly DFMIssue[] {
  const issues: DFMIssue[] = [];

  issues.push(...checkMinFeatureSize(geometry, material, thicknessMm));
  issues.push(...checkMinSlotWidth(geometry, thicknessMm));
  issues.push(...checkEdgeToHoleDistance(geometry, thicknessMm));
  issues.push(...checkPartSize(geometry, machine));
  issues.push(...checkTinyFeatures(geometry));
  issues.push(...checkOpenGeometry(geometry));

  return issues;
}

/** Has any blocking DFM issues? */
export function hasBlockingIssues(issues: readonly DFMIssue[]): boolean {
  return issues.some((issue) => issue.blocking);
}

// ═══ Individual Rule Checks ═══

function checkMinFeatureSize(
  geometry: ParsedGeometry,
  material: Material,
  thicknessMm: number
): DFMIssue[] {
  const minAllowed = material.kerfWidthMm * 1.5;

  if (geometry.minFeatureSizeMm > 0 && geometry.minFeatureSizeMm < minAllowed) {
    return [
      {
        code: 'MIN_FEATURE_VIOLATION',
        severity: 'error',
        message: `Smallest feature (${geometry.minFeatureSizeMm.toFixed(2)}mm) is below minimum for ${material.name} at ${thicknessMm}mm (min: ${minAllowed.toFixed(2)}mm).`,
        fixSuggestion: `Increase the smallest hole diameter to at least ${minAllowed.toFixed(2)}mm, or choose a thinner material.`,
        blocking: true,
        affectedFeature: 'hole/feature',
      },
    ];
  }

  return [];
}

function checkMinSlotWidth(geometry: ParsedGeometry, thicknessMm: number): DFMIssue[] {
  const minSlot = thicknessMm * 1.5;

  if (geometry.minSlotWidthMm > 0 && geometry.minSlotWidthMm < minSlot) {
    return [
      {
        code: 'MIN_SLOT_WIDTH',
        severity: 'error',
        message: `Slot width (${geometry.minSlotWidthMm.toFixed(2)}mm) is narrower than ${minSlot.toFixed(2)}mm minimum for ${thicknessMm}mm material.`,
        fixSuggestion: `Widen slots to at least ${minSlot.toFixed(2)}mm (1.5× material thickness).`,
        blocking: true,
        affectedFeature: 'slot',
      },
    ];
  }

  return [];
}

function checkEdgeToHoleDistance(geometry: ParsedGeometry, thicknessMm: number): DFMIssue[] {
  if (geometry.edgeToHoleDistanceMm > 0 && geometry.edgeToHoleDistanceMm < thicknessMm) {
    return [
      {
        code: 'EDGE_TO_HOLE_DISTANCE',
        severity: 'warning',
        message: `Edge-to-hole distance (${geometry.edgeToHoleDistanceMm.toFixed(2)}mm) is less than material thickness (${thicknessMm}mm). May cause deformation.`,
        fixSuggestion: `Move holes at least ${thicknessMm.toFixed(1)}mm from the nearest edge.`,
        blocking: false,
        affectedFeature: 'hole placement',
      },
    ];
  }

  return [];
}

function checkPartSize(geometry: ParsedGeometry, machine: Machine): DFMIssue[] {
  const { widthMm, heightMm } = geometry.boundingBox;

  if (widthMm > machine.bedWidthMm || heightMm > machine.bedHeightMm) {
    return [
      {
        code: 'PART_TOO_LARGE',
        severity: 'error',
        message: `Part (${widthMm.toFixed(0)}×${heightMm.toFixed(0)}mm) exceeds machine bed (${machine.bedWidthMm}×${machine.bedHeightMm}mm).`,
        fixSuggestion: `Reduce part dimensions to fit within ${machine.bedWidthMm}×${machine.bedHeightMm}mm, or contact us for waterjet cutting on larger beds.`,
        blocking: true,
        affectedFeature: 'bounding box',
      },
    ];
  }

  return [];
}

function checkTinyFeatures(geometry: ParsedGeometry): DFMIssue[] {
  if (geometry.minFeatureSizeMm > 0 && geometry.minFeatureSizeMm < 0.5) {
    return [
      {
        code: 'TINY_FEATURE',
        severity: 'warning',
        message: `Feature size ${geometry.minFeatureSizeMm.toFixed(2)}mm is below 0.5mm — may cause laser kerf issues.`,
        fixSuggestion: 'Increase feature size to at least 0.5mm for reliable cutting.',
        blocking: false,
        affectedFeature: 'small feature',
      },
    ];
  }

  return [];
}

function checkOpenGeometry(geometry: ParsedGeometry): DFMIssue[] {
  if (geometry.hasOpenPaths) {
    return [
      {
        code: 'OPEN_GEOMETRY',
        severity: 'error',
        message:
          'File contains unclosed geometry. All cut paths must form closed loops for laser cutting.',
        fixSuggestion: 'Close all open paths in your CAD file. Check for disconnected endpoints.',
        blocking: true,
        affectedFeature: 'geometry',
      },
    ];
  }

  return [];
}
