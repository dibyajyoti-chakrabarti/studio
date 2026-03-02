
"use client"

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Upload, FileText, ChevronRight, Loader2, X, Check,
  CloudUpload, Layers, Cog, ArrowRight, Paperclip, Trash2, Shield
} from 'lucide-react';
import { MANUFACTURING_PROCESSES } from '../lib/mock-data';
import { LandingNav } from '@/components/LandingNav';

interface DesignFile {
  name: string;
  size: number;
  dataUrl: string;
}

const MAX_FILES = 10;
const MAX_FILE_SIZE_MB = 10;
const ACCEPTED_FORMATS = '.step,.stp,.stl,.dxf,.pdf,.jpg,.png,.iges,.obj,.dwg';
const FORMAT_LABELS = ['STEP', 'STL', 'DXF', 'PDF', 'IGES', 'OBJ', 'DWG', 'JPG', 'PNG'];

export default function UploadPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [files, setFiles] = useState<DesignFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const processFiles = useCallback((fileList: FileList | File[]) => {
    const remaining = MAX_FILES - files.length;
    const toProcess = Array.from(fileList).slice(0, remaining);

    toProcess.forEach((file) => {
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        setFiles((prev) => {
          if (prev.some((f) => f.name === file.name)) return prev;
          if (prev.length >= MAX_FILES) return prev;
          return [...prev, { name: file.name, size: file.size, dataUrl: event.target?.result as string }];
        });
      };
      reader.readAsDataURL(file);
    });
  }, [files.length]);

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files);
    e.target.value = '';
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const removeFile = (name: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== name));
  };

  const handleNextStep = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(2);
    }, 1500);
  };

  const handleDetailsSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const designFiles = files.map((f) => ({ name: f.name, size: f.size, dataUrl: f.dataUrl }));

    const details = {
      projectName: formData.get('projectName'),
      process: formData.get('process'),
      material: formData.get('material'),
      quantity: formData.get('quantity'),
      surfaceFinish: formData.get('surfaceFinish'),
      tolerance: formData.get('tolerance'),
      deliveryDate: formData.get('deliveryDate'),
      budget: formData.get('budget'),
      location: formData.get('location'),
      designFileName: files[0]?.name ?? null,
      designFileUrl: files[0]?.dataUrl ?? null,
      designFiles,
    };

    localStorage.setItem('pendingRfqDetails', JSON.stringify(details));
    router.push('/matching');
  };

  const getFileExtension = (name: string) => {
    const ext = name.split('.').pop()?.toUpperCase() || 'FILE';
    return ext.length > 4 ? ext.slice(0, 4) : ext;
  };

  const totalSize = files.reduce((sum, f) => sum + f.size, 0);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <LandingNav />
      <div className="container mx-auto px-4 max-w-5xl">

        {/* ── Step indicator ── */}
        <div className="flex items-center justify-center gap-2 mb-14">
          {[
            { num: 1, label: 'Upload Designs', icon: CloudUpload },
            { num: 2, label: 'Requirements', icon: Cog },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center gap-2">
              {i > 0 && (
                <div className={`h-px w-12 sm:w-20 transition-colors duration-500 ${step >= s.num ? 'bg-secondary' : 'bg-white/10'}`} />
              )}
              <div className="flex items-center gap-2.5">
                <div className={`
                  w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500
                  ${step > s.num ? 'bg-secondary text-background' : step === s.num ? 'bg-secondary text-background shadow-lg shadow-secondary/30' : 'bg-white/5 text-muted-foreground border border-white/10'}
                `}>
                  {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <span className={`text-sm font-semibold hidden sm:inline transition-colors ${step >= s.num ? 'text-white' : 'text-muted-foreground'}`}>
                  {s.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ══════════════════════ STEP 1: Upload ══════════════════════ */}
        {step === 1 && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center mb-2">
              <h1 className="font-headline text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Upload Your Design Files
              </h1>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                Share your engineering drawings for instant matching with verified manufacturers.
              </p>
            </div>

            {/* Drop zone */}
            <div
              className={`
                relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer
                ${isDragging
                  ? 'border-secondary bg-secondary/10 scale-[1.01]'
                  : files.length > 0
                    ? 'border-primary/30 bg-primary/5 hover:border-primary/50'
                    : 'border-white/10 hover:border-primary/40 bg-white/[0.02]'}
              `}
              onClick={() => files.length < MAX_FILES && document.getElementById('fileInput')?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="fileInput"
                className="hidden"
                onChange={handleFilesChange}
                accept={ACCEPTED_FORMATS}
                multiple
              />

              <div className="py-16 px-8 flex flex-col items-center text-center">
                <div className={`
                  w-20 h-20 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300
                  ${isDragging ? 'bg-secondary/20' : 'bg-white/5'}
                `}>
                  <CloudUpload className={`w-9 h-9 transition-all duration-300 ${isDragging ? 'text-secondary scale-110' : 'text-muted-foreground/50'}`} />
                </div>

                <p className="text-lg font-semibold text-white mb-1">
                  {isDragging ? 'Release to upload' : files.length === 0 ? 'Drag & drop files here' : 'Add more files'}
                </p>
                <p className="text-sm text-muted-foreground mb-5">
                  or <span className="text-primary font-medium underline underline-offset-2">browse from device</span>
                </p>

                {/* Accepted formats */}
                <div className="flex flex-wrap justify-center gap-1.5">
                  {FORMAT_LABELS.map((fmt) => (
                    <span key={fmt} className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                      {fmt}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* File list */}
            {files.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-secondary" />
                    <span className="text-sm font-bold text-white">{files.length} {files.length === 1 ? 'file' : 'files'}</span>
                    <span className="text-xs text-muted-foreground">• {(totalSize / 1024 / 1024).toFixed(1)} MB total</span>
                  </div>
                  {files.length < MAX_FILES && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-primary hover:text-primary/80 gap-1.5"
                      onClick={() => document.getElementById('fileInput')?.click()}
                    >
                      <Paperclip className="w-3.5 h-3.5" /> Add more
                    </Button>
                  )}
                </div>

                <div className="space-y-1.5">
                  {files.map((f, idx) => (
                    <div
                      key={f.name}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card/80 border border-white/5 group hover:border-white/10 transition-all"
                      style={{ animationDelay: `${idx * 60}ms` }}
                    >
                      {/* Extension badge */}
                      <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-extrabold text-primary uppercase tracking-tight">
                          {getFileExtension(f.name)}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{f.name}</p>
                        <p className="text-[11px] text-muted-foreground">{(f.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-all"
                        onClick={(e) => { e.stopPropagation(); removeFile(f.name); }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security note + CTA */}
            <div className="pt-4 space-y-4">
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Shield className="w-3.5 h-3.5 text-secondary" />
                <span>Your files are encrypted and shared only with selected vendors</span>
              </div>

              <Button
                size="lg"
                className="w-full h-14 text-base font-bold gap-2 transition-all"
                disabled={files.length === 0 || isProcessing}
                onClick={handleNextStep}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Analyzing {files.length} {files.length === 1 ? 'design' : 'designs'}…
                  </>
                ) : (
                  <>
                    Continue to Requirements
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* ══════════════════════ STEP 2: Details ══════════════════════ */}
        {step === 2 && (
          <div className="max-w-3xl mx-auto">
            <Card className="bg-card border-white/5 shadow-2xl shadow-primary/5 overflow-hidden">
              {/* Header with gradient accent */}
              <div className="h-1 bg-gradient-to-r from-primary via-secondary to-primary" />
              <CardHeader className="pb-2 pt-8 px-8">
                <CardTitle className="font-headline text-2xl font-bold text-white">Manufacturing Specifications</CardTitle>
                <CardDescription className="text-sm">Configure tolerances, materials, and delivery for precision matching.</CardDescription>
              </CardHeader>

              <CardContent className="px-8 pb-8">
                <form onSubmit={handleDetailsSubmit} className="space-y-8">
                  {/* Project Name — full width, prominent */}
                  <div className="space-y-2">
                    <Label className="text-xs uppercase font-bold tracking-widest text-secondary">Project Name</Label>
                    <Input
                      name="projectName"
                      placeholder="e.g. Robot Arm Rev 2"
                      required
                      className="bg-background border-white/10 h-12 text-base font-medium placeholder:text-muted-foreground/30"
                    />
                  </div>

                  <div className="h-px bg-white/5" />

                  {/* Technical specs grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-muted-foreground">Manufacturing Process</Label>
                      <Select name="process" required>
                        <SelectTrigger className="bg-background border-white/10 h-11">
                          <SelectValue placeholder="Select process" />
                        </SelectTrigger>
                        <SelectContent>
                          {MANUFACTURING_PROCESSES.map(p => (
                            <SelectItem key={p} value={p}>{p}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-muted-foreground">Material</Label>
                      <Input name="material" placeholder="e.g. Aluminum 6061-T6" required className="bg-background border-white/10 h-11" />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-muted-foreground">Quantity</Label>
                      <Input name="quantity" type="number" min={1} placeholder="Number of units" required className="bg-background border-white/10 h-11" />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-muted-foreground">
                        Surface Finish <span className="text-muted-foreground/40">(optional)</span>
                      </Label>
                      <Input name="surfaceFinish" placeholder="e.g. Powder Coated, Anodized" className="bg-background border-white/10 h-11" />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-muted-foreground">Tolerance Requirement</Label>
                      <Input name="tolerance" placeholder="e.g. ± 0.05 mm" required className="bg-background border-white/10 h-11" />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-muted-foreground">Required Delivery Date</Label>
                      <Input name="deliveryDate" type="date" required className="bg-background border-white/10 h-11" />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-muted-foreground">
                        Budget Range <span className="text-muted-foreground/40">(optional)</span>
                      </Label>
                      <Input name="budget" placeholder="e.g. ₹10,000 – ₹50,000" className="bg-background border-white/10 h-11" />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-muted-foreground">Delivery Location</Label>
                      <Input name="location" placeholder="City, Pincode" required className="bg-background border-white/10 h-11" />
                    </div>
                  </div>

                  <div className="h-px bg-white/5" />

                  {/* Attached files summary */}
                  <div className="rounded-xl bg-background/40 border border-white/5 p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Paperclip className="w-4 h-4 text-secondary" />
                      <span className="text-xs font-bold uppercase tracking-widest text-secondary">
                        Attached Designs ({files.length})
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {files.map((f) => (
                        <div key={f.name} className="flex items-center gap-2 bg-card border border-white/10 px-3 py-2 rounded-lg">
                          <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
                            <span className="text-[8px] font-extrabold text-primary uppercase">{getFileExtension(f.name)}</span>
                          </div>
                          <span className="text-xs text-white font-medium truncate max-w-[140px]">{f.name}</span>
                          <span className="text-[10px] text-muted-foreground">{(f.size / 1024 / 1024).toFixed(1)}MB</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Submit */}
                  <Button type="submit" size="lg" className="w-full h-14 text-base font-bold gap-2">
                    Find Best-Fit MechMasters
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
