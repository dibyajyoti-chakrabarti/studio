// ═══════════════════════════════════════════════════
// Pricing Engine — Core IP. Exact formulas from Architecture.md
// Adapted for INR pricing and Indian manufacturing.
// Pure functions. Zero framework dependencies. Fully testable.
// ═══════════════════════════════════════════════════

import type {
  Material, Machine, ParsedGeometry, FinishType,
  TurnaroundType, QuoteResult, QuoteBreakdown,
} from '@/types/quoting';
import { type Result, ok, err } from '@/utils/result';
import { AppError, ErrorCode } from '@/utils/errors';
import { getMaterialById, getFinishRate, getTurnaroundOption, LASER_MACHINE } from './materials';
import { calcQuantityMultiplier } from './quantity-tiers';
import { runDFMChecks, hasBlockingIssues } from './dfm-checks';

// ═══ Configuration constants ═══

const TARGET_MARGIN = 0.42;
const MIN_ORDER_INR = 2900;
const BASE_SETUP_COST_INR = 1200;
const COMPLEX_SURCHARGE_INR = 500;
const LEAD_IN_TIME_S = 2.5;

const MIN_UNIT_PRICE: Record<string, number> = {
  laser_cut_fiber: 180,
  laser_cut_co2: 120,
  waterjet: 500,
  plasma: 100,
  cnc_machining_3axis: 400,
  cnc_machining_5axis: 800,
  sheet_metal_bending: 250,
  cnc_turning: 300,
};

// ═══ Cost Component Calculations ═══

/**
 * Material cost per part.
 * Volume → mass → raw cost + waste surcharge from nesting efficiency.
 */
export function calcMaterialCost(
  geometry: ParsedGeometry,
  material: Material,
  thicknessMm: number,
  quantity: number
): number {
  const volumeCm3 = (geometry.areaMm2 * thicknessMm) / 1000;
  const massKg = (volumeCm3 * material.densityGCm3) / 1000;
  const rawCost = massKg * material.pricePerKg;

  const sheetArea = material.sheetWidthMm * material.sheetHeightMm;
  const boundingArea = geometry.boundingBox.widthMm * geometry.boundingBox.heightMm;

  // Nesting efficiency improves with quantity
  const nestingEfficiency = Math.min(0.85, 0.45 + quantity * 0.004);
  const effectiveArea = boundingArea / nestingEfficiency;
  const sheetsPerPart = effectiveArea / sheetArea;
  const sheetCost = sheetsPerPart * material.pricePerSheet;
  const wasteSurcharge = Math.max(0, sheetCost - rawCost);

  return rawCost + wasteSurcharge;
}

/**
 * Cut time cost per part.
 * Speed factor from thickness, complexity penalty, pierce time.
 */
export function calcCutCost(
  geometry: ParsedGeometry,
  material: Material,
  thicknessMm: number,
  machine: Machine
): number {
  const speedFactor = 1.0 / (1 + 0.28 * thicknessMm);
  const effectiveSpeed = machine.maxSpeedMmS * speedFactor;
  const complexityPenalty = 1.0 + geometry.complexityScore * 0.12;
  const cutTimeS = (geometry.cutLengthMm / effectiveSpeed) * complexityPenalty;
  const pierceTimeS = geometry.holeCount * machine.pierceTimeS;
  const totalTimeS = cutTimeS + pierceTimeS + LEAD_IN_TIME_S;

  let cutCost = (totalTimeS / 3600) * machine.hourlyRate;

  // Complexity surcharge for high node count
  if (geometry.nodeCount > 500) {
    const complexitySurcharge = ((geometry.nodeCount - 500) / 100) * 0.025;
    cutCost *= 1 + complexitySurcharge;
  }

  // Bulk nesting credit for 100+ identical parts with good aspect ratio
  if (geometry.boundingBox.aspectRatio < 3.0 && geometry.boundingBox.aspectRatio > 0) {
    // Credit increases gradually from 0% at 1pc to 8% at 100+pc
    const nestingCreditPct = Math.min(0.08, Math.max(0, (100 - 1) * 0.0008));
    cutCost *= 1 - nestingCreditPct;
  }

  return cutCost;
}

/**
 * Setup cost per part. Fixed per job, amortized by quantity.
 */
export function calcSetupCost(
  quantity: number,
  complexityScore: number
): number {
  let setupTotal = BASE_SETUP_COST_INR;

  if (complexityScore > 5) {
    setupTotal += COMPLEX_SURCHARGE_INR;
  }

  return setupTotal / quantity;
}

/**
 * Finish cost per part.
 * Surface area × rate, with batch discounts.
 */
export function calcFinishCost(
  geometry: ParsedGeometry,
  finishType: FinishType,
  quantity: number
): number {
  const finish = getFinishRate(finishType);

  if (finishType === 'none') {
    return 0;
  }

  // Surface area = both faces (edge area negligible for sheet metal)
  const surfaceAreaMm2 = geometry.areaMm2 * 2;
  let costPerPart = Math.max(finish.minCost, surfaceAreaMm2 * finish.costPerMm2);

  // Batch discounts for finishing
  if (quantity >= 50) {
    costPerPart *= 0.70;
  } else if (quantity >= 10) {
    costPerPart *= 0.82;
  }

  return costPerPart;
}

/**
 * Rush multiplier with dynamic surge pricing.
 */
export function calcRushMultiplier(
  turnaround: TurnaroundType,
  shopUtilization: number = 0.65
): number {
  const option = getTurnaroundOption(turnaround);
  if (!option) {
    return 1.0;
  }

  const base = option.multiplier;

  // Dynamic surge when shop is busy
  if (shopUtilization > 0.85 && (turnaround === 'rush_1d' || turnaround === 'same_day')) {
    const surge = 1.0 + (shopUtilization - 0.85) * 2.0;
    return base * surge;
  }

  return base;
}

// ═══ Master Quote Generation ═══

/**
 * Generates a complete quote from inputs.
 * Returns Result<QuoteResult, AppError> — never throws.
 */
export function generateQuote(
  materialId: string,
  thicknessMm: number,
  finishType: FinishType,
  quantity: number,
  turnaround: TurnaroundType,
  geometry: ParsedGeometry,
  shopUtilization: number = 0.65
): Result<QuoteResult, AppError> {
  // ── Validate material exists ──
  const material = getMaterialById(materialId);
  if (!material) {
    return err(new AppError({
      code: ErrorCode.INVALID_MATERIAL,
      message: `Material not found: ${materialId}`,
      statusCode: 400,
      context: { materialId },
    }));
  }

  // ── Validate thickness ──
  if (!material.availableThicknesses.includes(thicknessMm)) {
    return err(new AppError({
      code: ErrorCode.INVALID_THICKNESS,
      message: `Thickness ${thicknessMm}mm not available for ${material.name}`,
      statusCode: 400,
      context: { materialId, thicknessMm, available: material.availableThicknesses },
    }));
  }

  // ── Validate finish ──
  if (!material.availableFinishes.includes(finishType)) {
    return err(new AppError({
      code: ErrorCode.INVALID_FINISH,
      message: `Finish "${finishType}" not available for ${material.name}`,
      statusCode: 400,
      context: { materialId, finishType, available: material.availableFinishes },
    }));
  }

  // ── Run DFM checks ──
  const machine = LASER_MACHINE;
  const dfmIssues = runDFMChecks(geometry, material, thicknessMm, machine);
  const blocking = hasBlockingIssues(dfmIssues);

  // ── Core cost components ──
  const materialCost = calcMaterialCost(geometry, material, thicknessMm, quantity);
  const cutCost = calcCutCost(geometry, material, thicknessMm, machine);
  const setupCost = calcSetupCost(quantity, geometry.complexityScore);
  const finishCost = calcFinishCost(geometry, finishType, quantity);

  const baseCostPerPart = materialCost + cutCost + setupCost + finishCost;

  // ── Modifiers ──
  const qtyMultiplier = calcQuantityMultiplier(quantity);
  const rushMultiplier = calcRushMultiplier(turnaround, shopUtilization);

  let pricePerPart = baseCostPerPart * qtyMultiplier * rushMultiplier * (1 + TARGET_MARGIN);

  // ── Minimum unit price ──
  const minPrice = MIN_UNIT_PRICE[material.process] ?? 180;
  pricePerPart = Math.max(pricePerPart, minPrice);

  // ── Minimum order value ──
  let totalPrice = pricePerPart * quantity;
  if (totalPrice < MIN_ORDER_INR) {
    totalPrice = MIN_ORDER_INR;
    pricePerPart = MIN_ORDER_INR / quantity;
  }

  // ── Lead time ──
  const turnaroundOption = getTurnaroundOption(turnaround);
  const leadTimeDays = turnaroundOption?.days ?? 3;

  // ── Build quote reference ──
  const quoteRef = `MH-${Date.now().toString(36).toUpperCase().slice(-6)}`;

  const breakdown: QuoteBreakdown = {
    materialCost: Math.round(materialCost * 100) / 100,
    cutCost: Math.round(cutCost * 100) / 100,
    setupCost: Math.round(setupCost * 100) / 100,
    finishCost: Math.round(finishCost * 100) / 100,
    quantityMultiplier: Math.round(qtyMultiplier * 10000) / 10000,
    rushMultiplier: Math.round(rushMultiplier * 10000) / 10000,
    marginPct: TARGET_MARGIN,
  };

  const result: QuoteResult = {
    pricePerPart: Math.round(pricePerPart),
    totalPrice: Math.round(totalPrice),
    leadTimeDays,
    breakdown,
    dfmIssues,
    hasBlockingIssues: blocking,
    expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
    quoteRef,
    parameters: {
      materialId,
      thicknessMm,
      finishType,
      quantity,
      turnaround,
    },
    geometry,
  };

  return ok(result);
}
