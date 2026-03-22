"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { ManufacturingService, SecondaryProcess, ColorOption, MechanicalPart } from '@/types/project';
import { ServiceSelection } from './ServiceSelection';
import { FileUploadStep } from './FileUploadStep';
import { MaterialSelection } from './MaterialSelection';
import { SecondaryProcessSelection, SECONDARY_PROCESSES } from './SecondaryProcessSelection';
import { QuantityStep } from './QuantityStep';

import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Layers,
  Upload,
  Palette,
  Hash,
  X,
  Plus,
  Loader2
} from 'lucide-react';

type WizardStep = 'service' | 'file' | 'material' | 'secondary' | 'quantity';

const STEPS: { id: WizardStep; label: string; icon: React.ReactNode }[] = [
  { id: 'service', label: 'Service', icon: <Layers className="w-4 h-4" /> },
  { id: 'file', label: 'CAD File', icon: <Upload className="w-4 h-4" /> },
  { id: 'material', label: 'Material', icon: <Layers className="w-4 h-4" /> },
  { id: 'secondary', label: 'Secondary', icon: <Palette className="w-4 h-4" /> },
  { id: 'quantity', label: 'Quantity', icon: <Hash className="w-4 h-4" /> },
];

interface PartCreationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  onPartCreated: (part: MechanicalPart) => void;
}

export function PartCreationWizard({
  isOpen,
  onClose,
  projectId,
  onPartCreated
}: PartCreationWizardProps) {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState<WizardStep>('service');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [partName, setPartName] = useState('');
  const [selectedService, setSelectedService] = useState<ManufacturingService | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{ fileName: string; fileUrl: string; fileSize: number } | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<{ id: string; name: string; grade: string; thickness?: number } | null>(null);
  const [secondaryProcesses, setSecondaryProcesses] = useState<SecondaryProcess[]>([]);
  const [coatingColor, setCoatingColor] = useState<ColorOption | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [discountTier, setDiscountTier] = useState<string | null>(null);

  const currentStepIndex = STEPS.findIndex(s => s.id === currentStep);

  const canProceed = () => {
    switch (currentStep) {
      case 'service':
        return selectedService !== null && partName.trim() !== '';
      case 'file':
        return uploadedFile !== null;
      case 'material':
        return selectedMaterial !== null;
      case 'secondary':
        // Secondary processes are optional
        // But if any selected process requires color, a color must be chosen
        const needsColor = secondaryProcesses.some(pid =>
          (SECONDARY_PROCESSES as any[]).find(p => p.id === pid)?.requiresColor
        );
        if (needsColor) {
          return coatingColor !== null;
        }
        return true;
      case 'quantity':
        return quantity >= 1;
      default:
        return false;
    }
  };

  const handleNext = () => {
    let nextIndex = currentStepIndex + 1;

    // Skip secondary process step if no processes are applicable for the service
    if (STEPS[nextIndex]?.id === 'secondary' && selectedService) {
      const applicableProcesses = (SECONDARY_PROCESSES as any[]).filter(p =>
        p.applicableServices.includes(selectedService)
      );
      if (applicableProcesses.length === 0) {
        nextIndex++;
      }
    }

    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex].id);
    }
  };

  const handleBack = () => {
    let prevIndex = currentStepIndex - 1;

    // Skip secondary process step if it was skipped during 'Next'
    if (STEPS[prevIndex]?.id === 'secondary' && selectedService) {
      const applicableProcesses = (SECONDARY_PROCESSES as any[]).filter(p =>
        p.applicableServices.includes(selectedService)
      );
      if (applicableProcesses.length === 0) {
        prevIndex--;
      }
    }

    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex].id);
    }
  };

  const handleSecondaryProcessToggle = (process: SecondaryProcess) => {
    setSecondaryProcesses(prev => {
      if (prev.includes(process)) {
        // Remove process
        const updated = prev.filter(p => p !== process);
        // If removing a color-requiring process, and no other color-requiring process remains, clear color
        const remainingNeedsColor = updated.some(pid =>
          (SECONDARY_PROCESSES as any[]).find(p => p.id === pid)?.requiresColor
        );
        if (!remainingNeedsColor) {
          setCoatingColor(null);
        }
        return updated;
      } else {
        // Add process
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

      const partRef = await addDocumentNonBlocking(
        collection(db, 'projectParts'),
        partData
      );

      if (!partRef) {
        throw new Error('No part reference returned from database');
      }

      // Update project with the new part
      await updateDocumentNonBlocking(
        doc(db, 'projectRFQs', projectId),
        {
          updatedAt: new Date().toISOString(),
        }
      );

      const newPart: MechanicalPart = {
        id: partRef.id,
        ...partData,
      };

      toast({
        title: 'Part Added Successfully',
        description: `Added ${quantity} unit(s) to your project`,
      });

      onPartCreated(newPart);
      handleClose();
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

  const handleClose = () => {
    if (!isSubmitting) {
      // Reset state
      setCurrentStep('service');
      setPartName('');
      setSelectedService(null);
      setUploadedFile(null);
      setSelectedMaterial(null);
      setSecondaryProcesses([]);
      setCoatingColor(null);
      setQuantity(1);
      setDiscountTier(null);
      onClose();
    }
  };

  const renderStepContent = () => {
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
            onClearFile={() => setUploadedFile(null)}
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
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl bg-white border-slate-200 max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                <Plus className="w-5 h-5 text-[#2F5FA7]" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold uppercase tracking-wide text-slate-900">
                  Add Manufacturing Part
                </DialogTitle>
                <DialogDescription className="text-xs uppercase tracking-widest font-bold text-slate-500">
                  Step {currentStepIndex + 1} of {STEPS.length}: {STEPS[currentStepIndex].label}
                </DialogDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Step Progress */}
        <div className="flex items-center gap-2 py-2">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center gap-2 flex-1">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all ${index < currentStepIndex
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                  : index === currentStepIndex
                    ? 'bg-[#2F5FA7] text-white'
                    : 'bg-slate-100 text-slate-400'
                  }`}
              >
                {index < currentStepIndex ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  step.icon
                )}
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`h-1 flex-1 rounded-full transition-all ${index < currentStepIndex ? 'bg-emerald-200' : 'bg-slate-100'
                    }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="py-4 overflow-y-auto max-h-[calc(90vh-280px)]">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStepIndex === 0 || isSubmitting}
            className="h-11 px-6 tracking-widest uppercase text-[10px] font-bold border-slate-200 text-slate-600"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {currentStepIndex < STEPS.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed() || isSubmitting}
              className="h-11 px-6 tracking-widest uppercase text-[10px] font-bold bg-[#2F5FA7] hover:bg-[#1E3A66] text-white shadow-lg transition-all border-none"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting}
              className="h-11 px-6 tracking-widest uppercase text-[10px] font-bold bg-[#2F5FA7] hover:bg-[#1E3A66] text-white shadow-lg transition-all border-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Part
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
