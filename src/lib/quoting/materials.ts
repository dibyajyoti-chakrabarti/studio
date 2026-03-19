// ═══════════════════════════════════════════════════
// Material Catalog — Indian manufacturing rate cards
// Pure data. Zero framework dependencies.
// ═══════════════════════════════════════════════════

import type { Material, FinishRate, FinishType, TurnaroundOption, TurnaroundType, Machine } from '@/types/quoting';

/** Complete material catalog with Indian pricing */
export const MATERIAL_CATALOG: readonly Material[] = [
  {
    id: 'ms_a36',
    name: 'Mild Steel',
    alloy: 'A36 / IS 2062',
    process: 'laser_cut_fiber',
    densityGCm3: 7.85,
    pricePerKg: 65,
    pricePerSheet: 4800,
    sheetWidthMm: 1250,
    sheetHeightMm: 2500,
    availableThicknesses: [0.8, 1.0, 1.2, 1.5, 2.0, 3.0, 4.0, 5.0, 6.0, 8.0, 10.0, 12.0],
    kerfWidthMm: 0.15,
    availableFinishes: ['none', 'deburr', 'powder_coat', 'zinc_plate', 'black_oxide', 'sand_blasting'],
    hardnessFactor: 1.0,
    isActive: true,
  },
  {
    id: 'ss_304',
    name: 'Stainless Steel 304',
    alloy: '304 / AISI 304',
    process: 'laser_cut_fiber',
    densityGCm3: 8.0,
    pricePerKg: 280,
    pricePerSheet: 14500,
    sheetWidthMm: 1250,
    sheetHeightMm: 2500,
    availableThicknesses: [0.5, 0.8, 1.0, 1.2, 1.5, 2.0, 3.0, 4.0, 5.0, 6.0, 8.0],
    kerfWidthMm: 0.12,
    availableFinishes: ['none', 'deburr', 'mirror_polish', 'sand_blasting'],
    hardnessFactor: 1.8,
    isActive: true,
  },
  {
    id: 'ss_316',
    name: 'Stainless Steel 316',
    alloy: '316 / AISI 316',
    process: 'laser_cut_fiber',
    densityGCm3: 8.0,
    pricePerKg: 380,
    pricePerSheet: 19800,
    sheetWidthMm: 1250,
    sheetHeightMm: 2500,
    availableThicknesses: [0.8, 1.0, 1.5, 2.0, 3.0, 4.0, 5.0, 6.0],
    kerfWidthMm: 0.12,
    availableFinishes: ['none', 'deburr', 'mirror_polish', 'sand_blasting'],
    hardnessFactor: 2.0,
    isActive: true,
  },
  {
    id: 'al_6061',
    name: 'Aluminium 6061-T6',
    alloy: '6061-T6',
    process: 'laser_cut_fiber',
    densityGCm3: 2.7,
    pricePerKg: 320,
    pricePerSheet: 8900,
    sheetWidthMm: 1220,
    sheetHeightMm: 2440,
    availableThicknesses: [0.5, 0.8, 1.0, 1.5, 2.0, 3.0, 4.0, 5.0, 6.0, 8.0, 10.0],
    kerfWidthMm: 0.10,
    availableFinishes: ['none', 'deburr', 'anodize_clear', 'anodize_color', 'powder_coat', 'sand_blasting'],
    hardnessFactor: 0.7,
    isActive: true,
  },
  {
    id: 'al_5052',
    name: 'Aluminium 5052',
    alloy: '5052-H32',
    process: 'laser_cut_fiber',
    densityGCm3: 2.68,
    pricePerKg: 295,
    pricePerSheet: 8200,
    sheetWidthMm: 1220,
    sheetHeightMm: 2440,
    availableThicknesses: [0.5, 0.8, 1.0, 1.5, 2.0, 3.0, 4.0, 5.0, 6.0],
    kerfWidthMm: 0.10,
    availableFinishes: ['none', 'deburr', 'anodize_clear', 'anodize_color', 'powder_coat', 'sand_blasting'],
    hardnessFactor: 0.65,
    isActive: true,
  },
  {
    id: 'copper',
    name: 'Copper',
    alloy: 'C110 ETP',
    process: 'laser_cut_fiber',
    densityGCm3: 8.96,
    pricePerKg: 750,
    pricePerSheet: 32000,
    sheetWidthMm: 1000,
    sheetHeightMm: 2000,
    availableThicknesses: [0.5, 0.8, 1.0, 1.5, 2.0, 3.0],
    kerfWidthMm: 0.18,
    availableFinishes: ['none', 'deburr', 'nickel_plate', 'mirror_polish'],
    hardnessFactor: 1.5,
    isActive: true,
  },
  {
    id: 'brass',
    name: 'Brass',
    alloy: 'C260 Cartridge',
    process: 'laser_cut_fiber',
    densityGCm3: 8.5,
    pricePerKg: 600,
    pricePerSheet: 25000,
    sheetWidthMm: 1000,
    sheetHeightMm: 2000,
    availableThicknesses: [0.5, 0.8, 1.0, 1.5, 2.0, 3.0],
    kerfWidthMm: 0.15,
    availableFinishes: ['none', 'deburr', 'nickel_plate', 'chrome_plate', 'mirror_polish'],
    hardnessFactor: 1.3,
    isActive: true,
  },
  {
    id: 'en8',
    name: 'EN8 Steel',
    alloy: 'EN8 / C45',
    process: 'laser_cut_fiber',
    densityGCm3: 7.85,
    pricePerKg: 95,
    pricePerSheet: 7200,
    sheetWidthMm: 1250,
    sheetHeightMm: 2500,
    availableThicknesses: [2.0, 3.0, 4.0, 5.0, 6.0, 8.0, 10.0, 12.0],
    kerfWidthMm: 0.18,
    availableFinishes: ['none', 'deburr', 'zinc_plate', 'black_oxide', 'powder_coat'],
    hardnessFactor: 1.2,
    isActive: true,
  },
  {
    id: 'en24',
    name: 'EN24 Steel',
    alloy: 'EN24 / 817M40',
    process: 'laser_cut_fiber',
    densityGCm3: 7.85,
    pricePerKg: 140,
    pricePerSheet: 10800,
    sheetWidthMm: 1250,
    sheetHeightMm: 2500,
    availableThicknesses: [3.0, 4.0, 5.0, 6.0, 8.0, 10.0, 12.0],
    kerfWidthMm: 0.20,
    availableFinishes: ['none', 'deburr', 'zinc_plate', 'black_oxide', 'chrome_plate'],
    hardnessFactor: 1.6,
    isActive: true,
  },
] as const;

/** Finish rate card */
export const FINISH_RATES: Record<FinishType, FinishRate> = {
  none:           { type: 'none',           label: 'Raw / As Cut',      costPerMm2: 0,        minCost: 0 },
  deburr:         { type: 'deburr',         label: 'Deburr',            costPerMm2: 0.0006,   minCost: 150 },
  anodize_clear:  { type: 'anodize_clear',  label: 'Anodize (Clear)',   costPerMm2: 0.0035,   minCost: 500 },
  anodize_color:  { type: 'anodize_color',  label: 'Anodize (Color)',   costPerMm2: 0.0048,   minCost: 750 },
  powder_coat:    { type: 'powder_coat',    label: 'Powder Coating',    costPerMm2: 0.0030,   minCost: 800 },
  zinc_plate:     { type: 'zinc_plate',     label: 'Zinc Plating',      costPerMm2: 0.0022,   minCost: 400 },
  chrome_plate:   { type: 'chrome_plate',   label: 'Chrome Plating',    costPerMm2: 0.0065,   minCost: 1200 },
  nickel_plate:   { type: 'nickel_plate',   label: 'Nickel Plating',    costPerMm2: 0.0055,   minCost: 1000 },
  black_oxide:    { type: 'black_oxide',    label: 'Black Oxide',       costPerMm2: 0.0018,   minCost: 300 },
  mirror_polish:  { type: 'mirror_polish',  label: 'Mirror Polish',     costPerMm2: 0.0070,   minCost: 600 },
  sand_blasting:  { type: 'sand_blasting',  label: 'Sand Blasting',     costPerMm2: 0.0012,   minCost: 200 },
};

/** Turnaround options */
export const TURNAROUND_OPTIONS: readonly TurnaroundOption[] = [
  { type: 'economy_7d',  label: 'Economy (7 days)',  days: 7, multiplier: 0.82, description: '18% discount — frees up capacity' },
  { type: 'standard_3d', label: 'Standard (3 days)', days: 3, multiplier: 1.00, description: 'Baseline turnaround' },
  { type: 'express_2d',  label: 'Express (2 days)',  days: 2, multiplier: 1.35, description: '+35% rush fee' },
  { type: 'rush_1d',     label: 'Rush (1 day)',      days: 1, multiplier: 1.75, description: '+75% rush fee' },
  { type: 'same_day',    label: 'Same Day',          days: 0, multiplier: 2.40, description: '+140% — subject to capacity' },
];

/** Default machine (fiber laser) */
/** LASER Machine export for tests and service */
export const LASER_MACHINE: Machine = {
  id: 'laser_2kw',
  process: 'laser_cut_fiber',
  maxSpeedMmS: 150,
  pierceTimeS: 0.8,
  hourlyRate: 12000, // INR/hr for 2kW fiber laser in India
  bedWidthMm: 1250,
  bedHeightMm: 2500,
};

// ═══ Lookup functions ═══

export function getMaterialById(id: string): Material | undefined {
  return MATERIAL_CATALOG.find((m) => m.id === id);
}

export function getActiveMaterials(): readonly Material[] {
  return MATERIAL_CATALOG.filter((m) => m.isActive);
}

export function getAvailableThicknesses(materialId: string): readonly number[] {
  const material = getMaterialById(materialId);
  return material?.availableThicknesses ?? [];
}

export function getAvailableFinishes(materialId: string): readonly FinishType[] {
  const material = getMaterialById(materialId);
  return material?.availableFinishes ?? ['none'];
}

export function getFinishRate(finishType: FinishType): FinishRate {
  return FINISH_RATES[finishType];
}

export function getTurnaroundOption(type: TurnaroundType): TurnaroundOption | undefined {
  return TURNAROUND_OPTIONS.find((t) => t.type === type);
}
