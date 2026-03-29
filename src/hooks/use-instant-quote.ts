'use client';

// ═══════════════════════════════════════════════════
// use-instant-quote — Manages full quoting state
// Component uses hook → hook owns fetch logic (rules.md)
// ═══════════════════════════════════════════════════

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import type {
  FinishType, TurnaroundType, ParsedGeometry,
  QuoteResult, QuantityTier, DFMIssue,
} from '@/types/quoting';
import { generateQuote } from '@/lib/quoting/pricing-engine';
import {
  getActiveMaterials, getAvailableThicknesses,
  getAvailableFinishes, getFinishRate, TURNAROUND_OPTIONS,
} from '@/lib/quoting/materials';
import { getVisualTierTable, getSavingsPercent } from '@/lib/quoting/quantity-tiers';
import { isOk } from '@/utils/result';

export interface QuoteState {
  materialId: string;
  thicknessMm: number;
  finishType: FinishType;
  quantity: number;
  turnaround: TurnaroundType;
}

export interface UseInstantQuoteReturn {
  // State
  state: QuoteState;
  // Setters
  setMaterialId: (id: string) => void;
  setThicknessMm: (mm: number) => void;
  setFinishType: (type: FinishType) => void;
  setQuantity: (qty: number) => void;
  setTurnaround: (type: TurnaroundType) => void;
  // Derived data
  materials: ReturnType<typeof getActiveMaterials>;
  availableThicknesses: readonly number[];
  availableFinishes: ReadonlyArray<{ type: FinishType; label: string }>;
  turnaroundOptions: typeof TURNAROUND_OPTIONS;
  // Quote result
  quoteResult: QuoteResult | null;
  dfmIssues: readonly DFMIssue[];
  hasBlockingIssues: boolean;
  isCalculating: boolean;
  error: string | null;
  // Tier pricing
  tierPricing: readonly QuantityTier[];
  savingsPercent: number;
  // Actions
  recalculate: () => void;
}

export function useInstantQuote(geometry: ParsedGeometry | null): UseInstantQuoteReturn {
  const materials = useMemo(() => getActiveMaterials(), []);

  const [state, setState] = useState<QuoteState>({
    materialId: materials[0]?.id ?? '',
    thicknessMm: materials[0]?.availableThicknesses[0] ?? 1.0,
    finishType: 'none',
    quantity: 1,
    turnaround: 'standard_3d',
  });

  const [quoteResult, setQuoteResult] = useState<QuoteResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // ── Derived filtered options ──
  const availableThicknesses = useMemo(
    () => getAvailableThicknesses(state.materialId),
    [state.materialId]
  );

  const availableFinishes = useMemo(
    () => getAvailableFinishes(state.materialId).map((f) => ({
      type: f,
      label: getFinishRate(f).label,
    })),
    [state.materialId]
  );

  // ── Setters that auto-cascade filters ──
  const setMaterialId = useCallback((id: string) => {
    const thicknesses = getAvailableThicknesses(id);
    const finishes = getAvailableFinishes(id);
    setState((prev) => ({
      ...prev,
      materialId: id,
      thicknessMm: thicknesses[0] ?? prev.thicknessMm,
      finishType: finishes.includes(prev.finishType) ? prev.finishType : 'none',
    }));
  }, []);

  const setThicknessMm = useCallback((mm: number) => {
    setState((prev) => ({ ...prev, thicknessMm: mm }));
  }, []);

  const setFinishType = useCallback((type: FinishType) => {
    setState((prev) => ({ ...prev, finishType: type }));
  }, []);

  const setQuantity = useCallback((qty: number) => {
    setState((prev) => ({ ...prev, quantity: Math.max(1, Math.min(10000, qty)) }));
  }, []);

  const setTurnaround = useCallback((type: TurnaroundType) => {
    setState((prev) => ({ ...prev, turnaround: type }));
  }, []);

  // ── Calculate quote (debounced 300ms) ──
  const recalculate = useCallback(() => {
    if (!geometry) {
      setQuoteResult(null);
      return;
    }

    setIsCalculating(true);
    setError(null);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      const result = generateQuote(
        state.materialId,
        state.thicknessMm,
        state.finishType,
        state.quantity,
        state.turnaround,
        geometry
      );

      if (result.success) {
        setQuoteResult(result.data);
        setError(null);
      } else {
        setQuoteResult(null);
        setError(result.error.message);
      }

      setIsCalculating(false);
    }, 300);
  }, [geometry, state]);

  // ── Auto-recalculate on every state change ──
  useEffect(() => {
    recalculate();
  }, [recalculate]);

  // ── Tier pricing based on current base price ──
  const tierPricing = useMemo(() => {
    if (!quoteResult) return [];
    // Base price = single unit price without quantity discount
    const singleUnitPrice = quoteResult.pricePerPart / (quoteResult.breakdown.quantityMultiplier || 1);
    return getVisualTierTable(singleUnitPrice);
  }, [quoteResult]);

  const savingsPercent = useMemo(
    () => getSavingsPercent(state.quantity),
    [state.quantity]
  );

  return {
    state,
    setMaterialId,
    setThicknessMm,
    setFinishType,
    setQuantity,
    setTurnaround,
    materials,
    availableThicknesses,
    availableFinishes,
    turnaroundOptions: TURNAROUND_OPTIONS,
    quoteResult,
    dfmIssues: quoteResult?.dfmIssues ?? [],
    hasBlockingIssues: quoteResult?.hasBlockingIssues ?? false,
    isCalculating,
    error,
    tierPricing,
    savingsPercent,
    recalculate,
  };
}
