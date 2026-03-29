'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { SecondaryProcess, ColorOption, ManufacturingService } from '@/types/project';
import {
  Paintbrush,
  CornerUpRight,
  Sparkles,
  Shield,
  Chrome,
  Wind,
  CheckCircle,
  Flame,
  Zap,
} from 'lucide-react';
import { ExpertCTA } from './ExpertCTA';

export interface SecondaryProcessOption {
  id: SecondaryProcess;
  name: string;
  description: string;
  icon: React.ReactNode;
  requiresColor?: boolean;
  applicableServices: ManufacturingService[];
}

export const SECONDARY_PROCESSES: SecondaryProcessOption[] = [
  {
    id: 'powder_coating',
    name: 'Powder Coating',
    description: 'Durable, eco-friendly coating in various colors',
    icon: <Paintbrush className="w-5 h-5" />,
    requiresColor: true,
    applicableServices: ['sheet_metal_cutting', 'cnc_turning'],
  },
  {
    id: 'bending',
    name: 'Bending',
    description: 'Sheet metal forming and folding',
    icon: <CornerUpRight className="w-5 h-5" />,
    applicableServices: ['sheet_metal_cutting'],
  },
  {
    id: 'anodizing',
    name: 'Anodizing',
    description: 'Electrochemical process for aluminum',
    icon: <Sparkles className="w-5 h-5" />,
    requiresColor: true,
    applicableServices: ['cnc_turning', 'sheet_metal_cutting'],
  },
  {
    id: 'chrome_plating',
    name: 'Chrome Plating',
    description: 'Decorative and protective chrome finish',
    icon: <Chrome className="w-5 h-5" />,
    applicableServices: ['cnc_turning'],
  },
  {
    id: 'sand_blasting',
    name: 'Sand Blasting',
    description: 'Surface texturing and cleaning',
    icon: <Wind className="w-5 h-5" />,
    applicableServices: ['cnc_turning', '3d_printing'],
  },
  {
    id: 'heat_treatment',
    name: 'Heat Treatment',
    description: 'Hardening or softening the material',
    icon: <Flame className="w-5 h-5" />,
    applicableServices: ['cnc_turning', 'wire_edm'],
  },
  {
    id: 'nickel_plating',
    name: 'Nickel Plating',
    description: 'Wear and corrosion resistance',
    icon: <Zap className="w-5 h-5" />,
    applicableServices: ['cnc_turning'],
  },
];

const COLOR_OPTIONS: {
  id: ColorOption;
  name: string;
  color: string;
  applicableProcesses: SecondaryProcess[];
}[] = [
  {
    id: 'black',
    name: 'Black',
    color: '#1a1a1a',
    applicableProcesses: ['powder_coating', 'anodizing'],
  },
  { id: 'white', name: 'White', color: '#f5f5f5', applicableProcesses: ['powder_coating'] },
  {
    id: 'red',
    name: 'Red',
    color: '#dc2626',
    applicableProcesses: ['powder_coating', 'anodizing'],
  },
  {
    id: 'blue',
    name: 'Blue',
    color: '#2563eb',
    applicableProcesses: ['powder_coating', 'anodizing'],
  },
  { id: 'green', name: 'Green', color: '#16a34a', applicableProcesses: ['powder_coating'] },
  { id: 'yellow', name: 'Yellow', color: '#ca8a04', applicableProcesses: ['powder_coating'] },
  { id: 'grey', name: 'Grey', color: '#6b7280', applicableProcesses: ['powder_coating'] },
  { id: 'clear', name: 'Clear/Natural', color: '#e2e8f0', applicableProcesses: ['anodizing'] },
  { id: 'gold', name: 'Gold', color: '#fbbf24', applicableProcesses: ['anodizing'] },
  { id: 'bronze', name: 'Bronze', color: '#92400e', applicableProcesses: ['anodizing'] },
  { id: 'custom', name: 'Custom Color', color: '#9333ea', applicableProcesses: ['powder_coating'] },
];

interface SecondaryProcessSelectionProps {
  selectedService: ManufacturingService;
  selectedMaterial: {
    id: string;
    name: string;
    grade?: string;
    thickness?: number;
    canBend?: boolean;
    canPowderCoat?: boolean;
    canAnodize?: boolean;
    maxThicknessForBending?: number;
  } | null;
  selectedProcesses: SecondaryProcess[];
  coatingColor: ColorOption | null;
  onProcessToggle: (process: SecondaryProcess) => void;
  onColorSelect: (color: ColorOption) => void;
}

export function SecondaryProcessSelection({
  selectedService,
  selectedMaterial,
  selectedProcesses,
  coatingColor,
  onProcessToggle,
  onColorSelect,
}: SecondaryProcessSelectionProps) {
  const filteredProcesses = SECONDARY_PROCESSES.filter((p) => {
    // Basic service check
    if (!p.applicableServices.includes(selectedService)) return false;

    // Capability-based checks
    if (selectedMaterial) {
      if (p.id === 'bending') {
        if (selectedMaterial.canBend === false) return false;
        if (
          selectedMaterial.maxThicknessForBending &&
          selectedMaterial.thickness &&
          selectedMaterial.thickness > selectedMaterial.maxThicknessForBending
        ) {
          return false;
        }
      }
      if (p.id === 'powder_coating' && selectedMaterial.canPowderCoat === false) return false;
      if (p.id === 'anodizing' && selectedMaterial.canAnodize === false) return false;
    }

    return true;
  });

  const needsColor = selectedProcesses.some(
    (pid) => SECONDARY_PROCESSES.find((p) => p.id === pid)?.requiresColor
  );

  const activeColorProcesses = selectedProcesses.filter(
    (pid) => SECONDARY_PROCESSES.find((p) => p.id === pid)?.requiresColor
  );

  const availableColors = COLOR_OPTIONS.filter((color) =>
    color.applicableProcesses.some((ap) => activeColorProcesses.includes(ap))
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold uppercase tracking-wide text-slate-900 mb-2">
          Secondary Processes
        </h3>
        <p className="text-xs uppercase tracking-widest font-bold text-slate-500">
          Optional treatments for your {selectedService.replace(/_/g, ' ')} part
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {filteredProcesses.map((process) => {
          const isSelected = selectedProcesses.includes(process.id);

          return (
            <Card
              key={process.id}
              className={`cursor-pointer transition-all duration-300 overflow-hidden ${
                isSelected
                  ? 'bg-blue-50 border-[#2F5FA7] ring-1 ring-[#2F5FA7]/20'
                  : 'bg-white border-slate-200 hover:border-blue-200 hover:bg-slate-50'
              }`}
              onClick={() => onProcessToggle(process.id)}
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onProcessToggle(process.id)}
                    className="mt-1 data-[state=checked]:bg-[#2F5FA7] data-[state=checked]:border-[#2F5FA7]"
                  />
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-[#2F5FA7] text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {process.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 uppercase tracking-wide text-xs">
                      {process.name}
                    </p>
                    <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">
                      {process.description}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {needsColor && (
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <Badge className="bg-[#2F5FA7] text-white text-[10px] uppercase tracking-wider font-bold px-2 py-1 border-none">
              <Paintbrush className="w-3 h-3 mr-1" />
              Finish Color Required
            </Badge>
          </div>

          <div>
            <Label className="text-[10px] uppercase text-[#2F5FA7] font-bold tracking-widest mb-3 block">
              Selection ({activeColorProcesses.map((p) => p.replace('_', ' ')).join(' & ')})
            </Label>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
              {availableColors.map((colorOption) => (
                <button
                  key={colorOption.id}
                  type="button"
                  onClick={() => onColorSelect(colorOption.id)}
                  className={`group relative w-full aspect-square rounded-xl border-2 transition-all duration-200 ${
                    coatingColor === colorOption.id
                      ? 'border-[#2F5FA7] ring-2 ring-[#2F5FA7]/20 scale-105'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  style={{ backgroundColor: colorOption.color }}
                >
                  {coatingColor === colorOption.id && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white drop-shadow-md" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {coatingColor && (
              <p className="mt-4 text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                Selected: {COLOR_OPTIONS.find((c) => c.id === coatingColor)?.name}
              </p>
            )}
          </div>
        </div>
      )}

      {filteredProcesses.length === 0 && (
        <div className="text-center py-6">
          <p className="text-xs text-slate-500 italic uppercase tracking-wider">
            No secondary processes available for this service.
          </p>
        </div>
      )}

      <ExpertCTA
        description="Need a specialized surface treatment or plating not listed? Our engineering experts handle complex custom finishing requirements."
        buttonText="Consult Finishing"
      />
    </div>
  );
}
