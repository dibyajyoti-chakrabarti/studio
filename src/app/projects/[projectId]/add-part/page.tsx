'use client';

import { useState, use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  useUser,
  useFirestore,
  addDocumentNonBlocking,
  updateDocumentNonBlocking,
} from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import {
  ManufacturingService,
  SecondaryProcess,
  ColorOption,
  MechanicalPart,
} from '@/types/project';
import { ServiceSelection } from '@/components/part-creation/ServiceSelection';
import { FileUploadStep } from '@/components/part-creation/FileUploadStep';
import { MaterialSelection } from '@/components/part-creation/MaterialSelection';
import {
  SecondaryProcessSelection,
  SECONDARY_PROCESSES,
} from '@/components/part-creation/SecondaryProcessSelection';
import { QuantityStep } from '@/components/part-creation/QuantityStep';
import { WizardSidebar } from '@/components/part-creation/WizardSidebar';
import { InsightsPanel } from '@/components/part-creation/InsightsPanel';
import { MATERIAL_CATALOG } from '@/lib/data/material-data';
import {
  Layers,
  Upload,
  Palette,
  Hash,
  X,
  Loader2,
  ChevronLeft,
  Save,
  CheckCircle2,
  Lock,
  Zap,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/utils';
import { isPartNameValid } from '@/lib/validation/part-name';

type WizardStep = 'service' | 'file' | 'material' | 'secondary' | 'quantity';

const STEPS: { id: WizardStep; label: string; icon: React.ReactNode }[] = [
  { id: 'service', label: 'Service', icon: <Layers className="w-4 h-4" /> },
  { id: 'file', label: 'CAD File', icon: <Upload className="w-4 h-4" /> },
  { id: 'material', label: 'Mat. Specs', icon: <Layers className="w-4 h-4" /> },
  { id: 'secondary', label: 'Coating/Finish', icon: <Palette className="w-4 h-4" /> },
  { id: 'quantity', label: 'Quantity', icon: <Hash className="w-4 h-4" /> },
];

export default function AddPartPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const router = useRouter();
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState<WizardStep>('service');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [partName, setPartName] = useState('');
  const [selectedService, setSelectedService] = useState<ManufacturingService | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{
    fileName: string;
    fileUrl: string;
    fileSize: number;
  } | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<{
    id: string;
    name: string;
    grade: string;
    thickness?: number;
    thicknesses?: number[];
  } | null>(null);
  const [secondaryProcesses, setSecondaryProcesses] = useState<SecondaryProcess[]>([]);
  const [coatingColor, setCoatingColor] = useState<ColorOption | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [discountTier, setDiscountTier] = useState<string | null>(null);

  // ── CENTRALIZED PRICING LOGIC ──
  const calculatePricing = () => {
    const basePrice =
      selectedService === 'cnc_machining'
        ? 4500
        : selectedService === 'sheet_metal_cutting'
          ? 1200
          : 800;
    const materialMultiplier = selectedMaterial?.name.toLowerCase().includes('titanium')
      ? 2.5
      : selectedMaterial?.name.toLowerCase().includes('aluminium')
        ? 1.2
        : 1;
    const processCost = secondaryProcesses.length * 800;
    const unitPrice = basePrice * (materialMultiplier || 1) + processCost / Math.max(1, quantity);
    const totalPrice = unitPrice * quantity;
    return { unitPrice, totalPrice };
  };

  const { unitPrice, totalPrice } = calculatePricing();

  const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);

  const canProceed = () => {
    switch (currentStep) {
      case 'service':
        return selectedService !== null && isPartNameValid(partName);
      case 'file':
        return uploadedFile !== null;
      case 'material':
        if (!selectedMaterial) return false;
        if (selectedMaterial.thicknesses && selectedMaterial.thicknesses.length > 0) {
          return selectedMaterial.thickness !== undefined;
        }
        return true;
      case 'secondary':
        const needsColor = secondaryProcesses.some(
          (pid) => (SECONDARY_PROCESSES as any[]).find((p) => p.id === pid)?.requiresColor
        );
        if (needsColor) return coatingColor !== null;
        return true;
      case 'quantity':
        return quantity >= 1;
      default:
        return false;
    }
  };

  const handleNext = () => {
    let nextIndex = currentStepIndex + 1;
    if (STEPS[nextIndex]?.id === 'secondary' && selectedService) {
      const applicableProcesses = (SECONDARY_PROCESSES as any[]).filter((p) =>
        p.applicableServices.includes(selectedService)
      );
      if (applicableProcesses.length === 0) nextIndex++;
    }
    if (nextIndex < STEPS.length) setCurrentStep(STEPS[nextIndex].id);
  };

  const handleBack = () => {
    let prevIndex = currentStepIndex - 1;
    if (STEPS[prevIndex]?.id === 'secondary' && selectedService) {
      const applicableProcesses = (SECONDARY_PROCESSES as any[]).filter((p) =>
        p.applicableServices.includes(selectedService)
      );
      if (applicableProcesses.length === 0) prevIndex--;
    }
    if (prevIndex >= 0) setCurrentStep(STEPS[prevIndex].id);
  };

  const handleSecondaryProcessToggle = (process: SecondaryProcess) => {
    setSecondaryProcesses((prev) => {
      if (prev.includes(process)) {
        const updated = prev.filter((p) => p !== process);
        const remainingNeedsColor = updated.some(
          (pid) => (SECONDARY_PROCESSES as any[]).find((p) => p.id === pid)?.requiresColor
        );
        if (!remainingNeedsColor) setCoatingColor(null);
        return updated;
      } else {
        return [...prev, process];
      }
    });
  };

  const handleSubmit = async () => {
    if (!user || !db || !selectedService || !uploadedFile || !selectedMaterial) {
      toast({
        title: 'Error',
        description: 'Please complete all required fields',
        variant: 'destructive',
      });
      return;
    }
    if (!isPartNameValid(partName)) {
      toast({
        title: 'Invalid part name',
        description: 'Part name must include at least one letter and cannot be only numbers.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const partData: Omit<MechanicalPart, 'id'> = {
        projectId,
        userId: user.uid,
        partName: partName.trim(),
        service: selectedService,
        cadFile: {
          fileName: uploadedFile.fileName,
          fileUrl: uploadedFile.fileUrl,
          fileSize: uploadedFile.fileSize,
          uploadedAt: new Date().toISOString(),
        },
        material: selectedMaterial,
        secondaryProcesses,
        ...(coatingColor ? { coatingColor } : {}),
        quantity,
        ...(discountTier ? { discountTier } : {}),
        status: 'ready_for_quote',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await addDocumentNonBlocking(collection(db, 'projectParts'), partData);
      await updateDocumentNonBlocking(doc(db, 'projectRFQs', projectId), {
        updatedAt: new Date().toISOString(),
      });

      toast({
        title: 'Part Added Successfully',
        description: `Added ${quantity} unit(s) to your project`,
      });
      router.push(`/projects/${projectId}`);
    } catch (error) {
      console.error('Error creating part:', error);
      toast({
        title: 'Error',
        description: 'Failed to add part. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1">
          {(() => {
            switch (currentStep) {
              case 'service':
                return (
                  <ServiceSelection
                    partName={partName}
                    onPartNameChange={setPartName}
                    selectedService={selectedService}
                    onSelect={setSelectedService}
                  />
                );
              case 'file':
                return (
                  <FileUploadStep
                    partName={partName}
                    onPartNameChange={setPartName}
                    uploadedFile={uploadedFile}
                    onFileUpload={setUploadedFile}
                    onClearFile={() => {
                      setUploadedFile(null);
                    }}
                    selectedService={selectedService}
                  />
                );
              case 'material':
                return selectedService ? (
                  <MaterialSelection
                    selectedService={selectedService}
                    selectedMaterial={selectedMaterial}
                    onSelect={setSelectedMaterial}
                  />
                ) : null;
              case 'secondary':
                return selectedService ? (
                  <SecondaryProcessSelection
                    selectedService={selectedService}
                    selectedMaterial={selectedMaterial}
                    selectedProcesses={secondaryProcesses}
                    coatingColor={coatingColor}
                    onProcessToggle={handleSecondaryProcessToggle}
                    onColorSelect={setCoatingColor}
                  />
                ) : null;
              case 'quantity':
                return (
                  <QuantityStep
                    quantity={quantity}
                    onQuantityChange={setQuantity}
                    onDiscountTierChange={setDiscountTier}
                  />
                );
              default:
                return null;
            }
          })()}
        </div>

        {/* Integrated Navigation for all steps - Fixed Mobile Layout */}
        <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={handleBack}
            className="w-full sm:w-auto h-12 px-8 tracking-[0.2em] uppercase text-[10px] font-black border-slate-200 text-slate-600 hover:bg-slate-50 transition-all rounded-xl"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            {currentStepIndex === STEPS.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed() || isSubmitting}
                className="w-full sm:w-auto h-12 px-8 tracking-[0.2em] uppercase text-[10px] font-black bg-[#2F5FA7] hover:bg-[#1E3A66] text-white shadow-xl shadow-blue-500/20 transition-all border-none rounded-xl"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Finalize & Add Part
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!canProceed() || isSubmitting}
                className="w-full sm:w-auto h-12 px-10 tracking-[0.2em] uppercase text-[10px] font-black bg-[#2F5FA7] hover:bg-[#1E3A66] text-white shadow-xl shadow-blue-500/20 transition-all border-none rounded-xl group"
              >
                Next Step
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-blue-500/30 overflow-hidden">
      {/* ── STREAMLINED TOP HUD ── */}
      <header className="h-16 md:h-20 border-b border-slate-200 bg-white flex items-center justify-between px-4 md:px-10 shrink-0 z-40 shadow-sm">
        <div className="flex items-center gap-4 md:gap-8 flex-1">
          <Link
            href={`/projects/${projectId}`}
            className="p-2 md:p-2.5 rounded-xl hover:bg-slate-100 transition-all group border border-transparent hover:border-slate-200"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-slate-400 group-hover:text-[#2F5FA7] transition-colors" />
          </Link>

          <div className="hidden sm:block h-8 md:h-10 w-px bg-slate-100" />

          {/* Horizontal Progress Tracker - Responsive */}
          <div className="flex items-center gap-3 md:gap-6 overflow-x-auto no-scrollbar py-2">
            {STEPS.map((step, idx) => (
              <div
                key={step.id}
                className={cn(
                  'flex items-center gap-2 md:gap-3 group shrink-0',
                  idx !== currentStepIndex && 'hidden lg:flex'
                )}
              >
                <div
                  className={cn(
                    'w-6 h-6 md:w-7 md:h-7 rounded-lg flex items-center justify-center text-[9px] md:text-[10px] font-black transition-all border',
                    idx <= currentStepIndex
                      ? 'bg-[#2F5FA7] text-white border-[#2F5FA7] shadow-lg shadow-blue-500/20'
                      : 'bg-white text-slate-300 border-slate-200'
                  )}
                >
                  {idx < currentStepIndex ? (
                    <CheckCircle2 className="w-3 md:w-3.5 h-3 md:h-3.5" />
                  ) : (
                    `0${idx + 1}`
                  )}
                </div>
                <span
                  className={cn(
                    'text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-colors',
                    idx === currentStepIndex ? 'text-slate-900' : 'text-slate-400'
                  )}
                >
                  {step.label}
                </span>
                {idx < STEPS.length - 1 && (
                  <div className="hidden lg:block w-8 h-px bg-slate-100 ml-2" />
                )}
              </div>
            ))}
            {/* Simple step indicator for small mobile */}
            <div className="lg:hidden flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                Step {currentStepIndex + 1} of {STEPS.length}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <Button
            variant="ghost"
            onClick={() => router.push(`/projects/${projectId}`)}
            className="hidden sm:flex h-10 md:h-11 px-3 md:px-5 tracking-[0.2em] uppercase text-[8px] md:text-[9px] font-black text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all rounded-xl"
          >
            <X className="w-4 h-4 mr-2" /> Exit
          </Button>

          <Button className="h-10 md:h-11 px-4 md:px-6 tracking-[0.2em] uppercase text-[8px] md:text-[9px] font-black bg-white border border-slate-200 text-slate-900 hover:bg-slate-50 shadow-sm transition-all rounded-xl">
            <Save className="w-4 h-4 mr-2" /> Save Draft
          </Button>
        </div>
      </header>

      {/* ── CENTERED CORE WORKSPACE ── */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-slate-50/50">
        <main className="flex-1 overflow-y-auto pb-40 pt-8 md:pt-16">
          <div className="max-w-4xl mx-auto px-4 md:px-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Step Header Context */}
            <div className="mb-8 md:mb-12 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full mb-4 md:mb-6">
                <Zap className="w-3 h-3 text-[#2F5FA7]" />
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 uppercase tracking-tighter mb-4">
                {STEPS[currentStepIndex].label}
              </h2>
              <p className="text-xs md:text-sm font-medium text-slate-500 max-w-lg mx-auto leading-relaxed lowercase first-letter:uppercase px-4">
                Technical parameters for your mechanical design. All inputs are validated in
                real-time for production readiness.
              </p>
            </div>

            {/* Main Interaction Canvas */}
            <div className="bg-white rounded-[2rem] md:rounded-[3rem] border border-slate-200 p-6 md:p-16 shadow-2xl shadow-blue-900/5 min-h-0 md:min-h-[600px] relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/0 via-[#2F5FA7]/20 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
              {renderStepContent()}
            </div>

            {/* Emotional Confidence Footer (Integrated) */}
            <div className="mt-12 flex items-center justify-center gap-8 opacity-40 hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-900">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Auto-Saving Active
              </div>
            </div>
          </div>
        </main>

        {/* Footer is now integrated into the card above */}
      </div>
    </div>
  );
}
