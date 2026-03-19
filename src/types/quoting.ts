// ═══════════════════════════════════════════════════
// Quoting Domain Types
// ═══════════════════════════════════════════════════

/** Material definition with pricing data */
export interface Material {
  readonly id: string;
  readonly name: string;
  readonly alloy: string;
  readonly process: ProcessType;
  readonly densityGCm3: number;
  readonly pricePerKg: number;       // INR
  readonly pricePerSheet: number;    // INR
  readonly sheetWidthMm: number;
  readonly sheetHeightMm: number;
  readonly availableThicknesses: readonly number[];  // mm
  readonly kerfWidthMm: number;
  readonly availableFinishes: readonly FinishType[];
  readonly hardnessFactor: number;
  readonly isActive: boolean;
}

/** Manufacturing process types */
export type ProcessType =
  | 'laser_cut_fiber'
  | 'laser_cut_co2'
  | 'waterjet'
  | 'plasma'
  | 'cnc_machining_3axis'
  | 'cnc_machining_5axis'
  | 'sheet_metal_bending'
  | 'cnc_turning';

/** Available surface finishes */
export type FinishType =
  | 'none'
  | 'deburr'
  | 'anodize_clear'
  | 'anodize_color'
  | 'powder_coat'
  | 'zinc_plate'
  | 'chrome_plate'
  | 'nickel_plate'
  | 'black_oxide'
  | 'mirror_polish'
  | 'sand_blasting';

/** Finish metadata for pricing */
export interface FinishRate {
  readonly type: FinishType;
  readonly label: string;
  readonly costPerMm2: number;
  readonly minCost: number;       // INR
}

/** Turnaround options */
export type TurnaroundType =
  | 'economy_7d'
  | 'standard_3d'
  | 'express_2d'
  | 'rush_1d'
  | 'same_day';

export interface TurnaroundOption {
  readonly type: TurnaroundType;
  readonly label: string;
  readonly days: number;
  readonly multiplier: number;
  readonly description: string;
}

/** Parsed geometry from uploaded file */
export interface ParsedGeometry {
  readonly cutLengthMm: number;
  readonly areaMm2: number;
  readonly boundingBox: BoundingBox;
  readonly holeCount: number;
  readonly complexityScore: number;   // 0–10
  readonly nodeCount: number;
  readonly minFeatureSizeMm: number;
  readonly minSlotWidthMm: number;
  readonly edgeToHoleDistanceMm: number;
  readonly hasOpenPaths: boolean;
}

export interface BoundingBox {
  readonly widthMm: number;
  readonly heightMm: number;
  readonly aspectRatio: number;
}

/** DFM check results */
export type DFMSeverity = 'warning' | 'error';

export interface DFMIssue {
  readonly code: string;
  readonly severity: DFMSeverity;
  readonly message: string;
  readonly fixSuggestion: string;
  readonly blocking: boolean;
  readonly affectedFeature?: string;
}

/** Machine data for cost calculation */
export interface Machine {
  readonly id: string;
  readonly process: ProcessType;
  readonly maxSpeedMmS: number;
  readonly pierceTimeS: number;
  readonly hourlyRate: number;      // INR
  readonly bedWidthMm: number;
  readonly bedHeightMm: number;
}

/** Quote pricing breakdown */
export interface QuoteBreakdown {
  readonly materialCost: number;
  readonly cutCost: number;
  readonly setupCost: number;
  readonly finishCost: number;
  readonly quantityMultiplier: number;
  readonly rushMultiplier: number;
  readonly marginPct: number;
}

/** Complete quote result */
export interface QuoteResult {
  readonly pricePerPart: number;
  readonly totalPrice: number;
  readonly leadTimeDays: number;
  readonly breakdown: QuoteBreakdown;
  readonly dfmIssues: readonly DFMIssue[];
  readonly hasBlockingIssues: boolean;
  readonly expiresAt: number;       // Unix timestamp
  readonly quoteRef: string;
  readonly parameters: Omit<QuoteRequest, 'geometry'>;
  readonly geometry: ParsedGeometry;
}

/** Input for generating a quote */
export interface QuoteRequest {
  readonly materialId: string;
  readonly thicknessMm: number;
  readonly finishType: FinishType;
  readonly quantity: number;
  readonly turnaround: TurnaroundType;
  readonly geometry: ParsedGeometry;
}

/** Quantity tier for visual display */
export interface QuantityTier {
  readonly quantity: number;
  readonly multiplier: number;
  readonly pricePerPart: number;
  readonly totalPrice: number;
  readonly savingsPercent: number;
}

/** Cart item for multi-part orders */
export interface QuoteCartItem {
  readonly id: string;
  readonly fileName: string;
  readonly filePreviewUrl?: string;
  readonly quote: QuoteResult;
}

/** Uploaded file tracking */
export type FileStatus = 'uploading' | 'queued' | 'parsing' | 'dfm_check' | 'ready' | 'error';

export interface UploadedFile {
  readonly id: string;
  readonly fileName: string;
  readonly fileSizeBytes: number;
  readonly sha256Hash: string;
  readonly status: FileStatus;
  readonly geometry?: ParsedGeometry;
  readonly dfmIssues?: readonly DFMIssue[];
  readonly previewSvg?: string;
  readonly uploadProgress: number;
  readonly error?: string;
}
