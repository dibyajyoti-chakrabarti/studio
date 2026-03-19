"use client";

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ManufacturingService } from '@/types/project';
import { Layers3, CheckCircle, Info } from 'lucide-react';
import { MATERIAL_CATALOG, MaterialOption } from '@/lib/data/material-data';

interface MaterialSelectionProps {
  selectedService: ManufacturingService;
  selectedMaterial: { id: string; name: string; grade?: string; thickness?: number } | null;
  onSelect: (material: { id: string; name: string; grade: string; thickness?: number }) => void;
}

export function MaterialSelection({ 
  selectedService, 
  selectedMaterial, 
  onSelect 
}: MaterialSelectionProps) {
  const serviceData = MATERIAL_CATALOG[selectedService];

  if (!serviceData) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 text-sm">No materials available for this service.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold uppercase tracking-wide text-slate-900 mb-2">
          Select Material
        </h3>
        <p className="text-xs uppercase tracking-widest font-bold text-slate-500">
          Choose the appropriate material for {selectedService.replace(/_/g, ' ')}
        </p>
      </div>

      <div className="space-y-8 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {serviceData.categories.map((category) => (
          <div key={category.name} className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <div className="h-px flex-1 bg-slate-100" />
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2F5FA7] whitespace-nowrap">
                {category.name}
              </h4>
              <div className="h-px flex-1 bg-slate-100" />
            </div>

            <div className="grid grid-cols-1 gap-3">
              {category.materials.map((material: MaterialOption) => {
                const isSelected = selectedMaterial?.id === material.id;
                
                return (
                  <Card
                    key={material.id}
                    className={`cursor-pointer transition-all duration-300 overflow-hidden group ${
                      isSelected
                        ? 'bg-blue-50 border-[#2F5FA7] shadow-[0_8px_20px_rgba(47,95,167,0.12)] ring-1 ring-[#2F5FA7]/20'
                        : 'bg-white border-slate-200 hover:border-blue-200 hover:bg-slate-50'
                    }`}
                    onClick={() => onSelect({ id: material.id, name: material.name, grade: material.grade })}
                  >
                    <div className="p-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-[#2F5FA7] text-white border-[#2F5FA7]'
                            : 'bg-slate-50 text-[#2F5FA7] border-slate-100 group-hover:bg-white'
                        }`}>
                          <Layers3 className="w-5 h-5" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <p className="font-bold text-slate-900 uppercase tracking-wide text-xs">
                                {material.name}
                              </p>
                              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-0.5">
                                Grade: {material.grade}
                              </p>
                            </div>
                            {isSelected && (
                              <Badge className="bg-[#2F5FA7] text-white text-[8px] uppercase tracking-wider font-bold px-1.5 py-0 h-4 border-none">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Selected
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
        <Info className="w-4 h-4 text-[#2F5FA7] mt-0.5" />
        <p className="text-[9px] text-slate-500 uppercase tracking-wider font-bold leading-relaxed">
          Material grades specified are standard industrial grades. If you require a specific heat treatment or certification, please mention it in the negotiation phase.
        </p>
      </div>
    </div>
  );
}
