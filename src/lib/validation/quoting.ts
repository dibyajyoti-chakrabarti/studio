// ═══════════════════════════════════════════════════
// Quoting Validation — Zod schemas
// Every API input validated before touching business logic
// ═══════════════════════════════════════════════════

import { z } from 'zod';

export const finishTypeSchema = z.enum([
  'none', 'deburr', 'anodize_clear', 'anodize_color',
  'powder_coat', 'zinc_plate', 'chrome_plate',
  'nickel_plate', 'black_oxide', 'mirror_polish', 'sand_blasting',
]);

export const turnaroundSchema = z.enum([
  'economy_7d', 'standard_3d', 'express_2d', 'rush_1d', 'same_day',
]);

export const boundingBoxSchema = z.object({
  widthMm: z.number().positive().max(3000),
  heightMm: z.number().positive().max(3000),
  aspectRatio: z.number().positive(),
});

export const parsedGeometrySchema = z.object({
  cutLengthMm: z.number().nonnegative(),
  areaMm2: z.number().positive(),
  boundingBox: boundingBoxSchema,
  holeCount: z.number().int().nonnegative(),
  complexityScore: z.number().min(0).max(10),
  nodeCount: z.number().int().nonnegative(),
  minFeatureSizeMm: z.number().nonnegative(),
  minSlotWidthMm: z.number().nonnegative(),
  edgeToHoleDistanceMm: z.number().nonnegative(),
  hasOpenPaths: z.boolean(),
});

export const quoteRequestSchema = z.object({
  materialId: z.string().min(1),
  thicknessMm: z.number().positive().max(100),
  finishType: finishTypeSchema,
  quantity: z.number().int().min(1).max(10000),
  turnaround: turnaroundSchema,
  geometry: parsedGeometrySchema,
});

export const materialSelectionSchema = z.object({
  materialId: z.string().min(1),
  thicknessMm: z.number().positive(),
  finishType: finishTypeSchema,
});

export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;
export type MaterialSelectionInput = z.infer<typeof materialSelectionSchema>;
