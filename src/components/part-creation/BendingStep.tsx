'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  CornerUpRight,
  Info,
  CheckCircle2,
  AlertCircle,
  Layers,
  Loader2,
  ArrowUp,
  ArrowDown,
  Ruler,
  AlertTriangle,
} from 'lucide-react';
import { ConversionResult, BendAnalysisResult, BendFeature } from '@/types/viewer';
import { ManufacturingService } from '@/types/project';

interface BendingStepProps {
  selectedService: ManufacturingService;
  isBendingEnabled: boolean;
  onToggle: () => void;
  conversionResult: ConversionResult | null;
  selectedMaterial: {
    id: string;
    name: string;
    grade?: string;
    thickness?: number;
    canBend?: boolean;
    maxThicknessForBending?: number;
    [key: string]: any;
  } | null;
  /** V2 bend analysis result from /analyze-bends endpoint */
  bendAnalysis: BendAnalysisResult | null;
  /** Whether bend analysis is currently loading */
  isAnalyzing?: boolean;
  /** Hovered bend index (shared with FlatPatternViewer) */
  hoveredBendIndex?: number;
  /** Callback when user hovers a bend in the table */
  onBendHover?: (index: number | undefined) => void;
}

export function BendingStep({
  selectedService,
  isBendingEnabled,
  onToggle,
  conversionResult,
  selectedMaterial,
  bendAnalysis,
  isAnalyzing = false,
  hoveredBendIndex,
  onBendHover,
}: BendingStepProps) {
  // Use V2 bends if available, fallback to legacy conversion result
  const bends: BendFeature[] = bendAnalysis?.bends ?? conversionResult?.bends ?? [];
  const bendCount = bends.length;
  const detectedThickness = bendAnalysis?.detectedThickness ?? null;
  const hasFlatPattern = !!bendAnalysis?.flatPattern;

  // Capability check
  const cannotBend = !!(selectedMaterial?.canBend === false || (
    selectedMaterial?.maxThicknessForBending &&
    selectedMaterial?.thickness &&
    selectedMaterial?.thickness > selectedMaterial?.maxThicknessForBending
  ));

  // Thickness mismatch warning
  const thicknessMismatch = detectedThickness !== null &&
    selectedMaterial?.thickness !== undefined &&
    Math.abs(detectedThickness - selectedMaterial.thickness) > 0.3;

  // Bend stats
  const upBends = bends.filter((b) => b.direction === 'UP');
  const downBends = bends.filter((b) => b.direction === 'DOWN');
  const angles = bends.map((b) => b.angle);
  const minAngle = angles.length > 0 ? Math.min(...angles) : 0;
  const maxAngle = angles.length > 0 ? Math.max(...angles) : 0;

  if (selectedService !== 'sheet_metal_cutting') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mb-4">
          <CornerUpRight className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2">Bending Not Applicable</h3>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
          Bending is only available for Sheet Metal Cutting services.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="mb-6">
        <h3 className="text-lg font-black uppercase tracking-wide text-slate-900 mb-1">
          Bending Configuration
        </h3>
        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
          Define sheet metal forming and folding requirements
        </p>
      </div>

      <Card
        className={`p-6 transition-all duration-500 overflow-hidden relative border-2 ${isBendingEnabled
          ? 'bg-blue-50/50 border-[#2F5FA7] ring-4 ring-blue-500/5'
          : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'
          }`}
      >
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${isBendingEnabled ? 'bg-[#2F5FA7] text-white shadow-lg shadow-blue-500/20 rotate-0' : 'bg-slate-100 text-slate-400 rotate-[-5deg]'
              }`}>
              <CornerUpRight className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-900 uppercase tracking-widest mb-1">Enable Bending</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {isBendingEnabled ? 'Forming Service Active' : 'Select to enable folding'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {cannotBend && (
              <Badge variant="destructive" className="text-[9px] uppercase tracking-tighter h-6">
                Material Limit
              </Badge>
            )}
            <Switch
              checked={isBendingEnabled}
              onCheckedChange={onToggle}
              disabled={cannotBend}
              className="data-[state=checked]:bg-[#2F5FA7]"
            />
          </div>
        </div>

        {isBendingEnabled && (
          <div className="mt-8 pt-6 border-t border-blue-100 animate-in zoom-in-95 fade-in duration-300">
            {/* ── Analysis Status ── */}
            {isAnalyzing && (
              <div className="flex items-center gap-3 mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <Loader2 className="w-4 h-4 text-[#2F5FA7] animate-spin" />
                <p className="text-[10px] font-black text-[#2F5FA7] uppercase tracking-widest">
                  Running V2 bend topology analysis...
                </p>
              </div>
            )}

            {/* ── Stats Grid ── */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-blue-100 shadow-sm">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Bends</p>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-black text-[#2F5FA7] leading-none">{bendCount}</span>
                  <span className="text-[9px] font-black text-slate-500 uppercase pb-1">Total</span>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-blue-100 shadow-sm">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Direction</p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <ArrowUp className="w-3 h-3 text-blue-500" />
                    <span className="text-sm font-black text-blue-600">{upBends.length}</span>
                  </div>
                  <span className="text-slate-300">/</span>
                  <div className="flex items-center gap-1">
                    <ArrowDown className="w-3 h-3 text-orange-500" />
                    <span className="text-sm font-black text-orange-600">{downBends.length}</span>
                  </div>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-blue-100 shadow-sm">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  {detectedThickness ? 'Thickness' : 'Analysis'}
                </p>
                {detectedThickness ? (
                  <div className="flex items-end gap-1">
                    <span className="text-xl font-black text-slate-900 leading-none">{detectedThickness}</span>
                    <span className="text-[9px] font-black text-slate-500 uppercase pb-0.5">mm</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-slate-700 uppercase">Auto</span>
                  </div>
                )}
              </div>
            </div>

            {/* ── Thickness Mismatch Warning ── */}
            {thicknessMismatch && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2 duration-300">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-black text-amber-900 uppercase tracking-widest mb-1">
                    Thickness Mismatch
                  </p>
                  <p className="text-[9px] font-bold text-amber-700 uppercase tracking-widest leading-relaxed">
                    CAD detected {detectedThickness}mm but material is {selectedMaterial?.thickness}mm.
                    Verify your material selection matches the design intent.
                  </p>
                </div>
              </div>
            )}

            {/* ── Bend Details Table ── */}
            {bendCount > 0 && (
              <div className="mb-6">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                  Bend Schedule
                </p>
                <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
                  {/* Table Header */}
                  <div className="grid grid-cols-4 gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">#</span>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Angle</span>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Dir</span>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Radius</span>
                  </div>
                  {/* Table Body */}
                  <div className="max-h-[180px] overflow-y-auto custom-scrollbar">
                    {bends.map((bend, idx) => {
                      const isHovered = hoveredBendIndex === idx;
                      return (
                        <div
                          key={idx}
                          className={`grid grid-cols-4 gap-2 px-4 py-2.5 border-b border-slate-50 transition-all duration-200 cursor-pointer ${
                            isHovered
                              ? 'bg-blue-50 border-blue-100'
                              : 'hover:bg-slate-50'
                          }`}
                          onMouseEnter={() => onBendHover?.(idx)}
                          onMouseLeave={() => onBendHover?.(undefined)}
                        >
                          <span className="text-[10px] font-black text-slate-400">{idx + 1}</span>
                          <span className="text-[10px] font-black text-slate-900 font-mono">{bend.angle.toFixed(1)}°</span>
                          <div className="flex items-center gap-1">
                            {bend.direction === 'UP' ? (
                              <ArrowUp className="w-3 h-3 text-blue-500" />
                            ) : (
                              <ArrowDown className="w-3 h-3 text-orange-500" />
                            )}
                            <span className={`text-[9px] font-black uppercase ${
                              bend.direction === 'UP' ? 'text-blue-600' : 'text-orange-600'
                            }`}>
                              {bend.direction}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-600">
                            {bend.radius > 0 ? `R${bend.radius.toFixed(1)}` : 'Sharp'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ── Flat Pattern Status ── */}
            <div className="p-4 bg-white/60 border border-blue-100/50 rounded-xl flex items-start gap-3">
              <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
              <p className="text-[9px] font-bold text-slate-600 uppercase tracking-wider leading-relaxed">
                {hasFlatPattern
                  ? 'A 2D flat pattern preview is shown on the left. Blue lines = UP bends, orange dashed lines = DOWN bends. Hover any line or row for details.'
                  : 'Our system has analyzed your STEP file. Blue lines indicate "UP" bends, while orange lines indicate "DOWN" bends in the technical preview.'
                }
              </p>
            </div>
          </div>
        )}
      </Card>

      {!isBendingEnabled && !cannotBend && (
        <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-relaxed">
            Note: Bending is optional. If your part is flat, you can skip this step and proceed to quantity selection.
          </p>
        </div>
      )}

      {cannotBend && (
        <Card className="p-6 bg-red-50 border-red-100 border flex items-start gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-black text-red-900 uppercase tracking-widest mb-1">Material Restriction</p>
            <p className="text-[9px] font-bold text-red-700 uppercase tracking-widest leading-relaxed">
              Selected material ({selectedMaterial?.name}) exceeds the maximum bending thickness of {selectedMaterial?.maxThicknessForBending}mm.
            </p>
          </div>
        </Card>
      )}

      <div className="mt-12 flex flex-col gap-4">
        <div className="flex items-center gap-3 px-2">
          <Layers className="w-4 h-4 text-[#2F5FA7]" />
          <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Why specify bending?</p>
        </div>
        <p className="text-[10px] font-medium text-slate-500 leading-relaxed px-2">
          Bending adds significant structural value but increases production complexity. Specifying it here ensures your quote is generated with industrial precision.
        </p>
      </div>
    </div>
  );
}
