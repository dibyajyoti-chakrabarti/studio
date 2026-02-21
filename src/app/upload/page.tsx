"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Upload, FileText, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';
import { MANUFACTURING_PROCESSES } from '../lib/mock-data';
import { LandingNav } from '@/components/LandingNav';

export default function UploadPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = () => {
    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false);
      setStep(2);
    }, 1500);
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/matching');
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <LandingNav />
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Progress Tracker */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-secondary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-secondary text-background' : 'bg-muted'}`}>1</div>
            <span className="font-bold">Upload Design</span>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-secondary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-secondary text-background' : 'bg-muted'}`}>2</div>
            <span className="font-bold">Manufacturing Details</span>
          </div>
        </div>

        {step === 1 && (
          <Card className="bg-card border-white/5 overflow-hidden">
            <CardHeader className="text-center">
              <CardTitle className="font-headline text-3xl font-bold">Upload Your Design</CardTitle>
              <CardDescription>Drag and drop your engineering files or browse. (STEP, STL, DXF, PDF, JPG, PNG)</CardDescription>
            </CardHeader>
            <CardContent className="p-10">
              <div 
                className={`border-2 border-dashed rounded-xl p-16 text-center transition-all cursor-pointer ${file ? 'border-primary bg-primary/5' : 'border-white/10 hover:border-primary/50'}`}
                onClick={() => document.getElementById('fileInput')?.click()}
              >
                <input 
                  type="file" 
                  id="fileInput" 
                  className="hidden" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  accept=".step,.stl,.dxf,.pdf,.jpg,.png"
                />
                {!file ? (
                  <>
                    <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
                    <p className="text-lg text-muted-foreground mb-2">Drop your files here</p>
                    <p className="text-sm text-muted-foreground/50">Maximum file size: 50MB</p>
                  </>
                ) : (
                  <div className="flex flex-col items-center">
                    <FileText className="w-16 h-16 text-primary mb-4" />
                    <p className="text-xl font-bold mb-1">{file.name}</p>
                    <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                )}
              </div>
              <div className="mt-10 flex justify-center">
                <Button 
                  size="lg" 
                  className="px-12 h-14 text-lg" 
                  disabled={!file || isUploading}
                  onClick={handleUpload}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    'Next Step'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="bg-card border-white/5">
            <CardHeader>
              <CardTitle className="font-headline text-2xl font-bold">Manufacturing Details</CardTitle>
              <CardDescription>Specify your requirements for an accurate match with MechMasters.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDetailsSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label>Manufacturing Process</Label>
                  <Select required>
                    <SelectTrigger className="bg-background border-white/10">
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
                  <Label>Material</Label>
                  <Input placeholder="e.g. Aluminum 6061-T6, SS304" required className="bg-background border-white/10" />
                </div>

                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input type="number" placeholder="Number of units" required className="bg-background border-white/10" />
                </div>

                <div className="space-y-2">
                  <Label>Surface Finish (Optional)</Label>
                  <Input placeholder="e.g. Powder Coated, Anodized" className="bg-background border-white/10" />
                </div>

                <div className="space-y-2">
                  <Label>Tolerance Requirement</Label>
                  <Input placeholder="e.g. +/- 0.05mm" required className="bg-background border-white/10" />
                </div>

                <div className="space-y-2">
                  <Label>Required Delivery Date</Label>
                  <Input type="date" required className="bg-background border-white/10" />
                </div>

                <div className="space-y-2">
                  <Label>Budget Range (Optional)</Label>
                  <Input placeholder="e.g. ₹10,000 - ₹50,000" className="bg-background border-white/10" />
                </div>

                <div className="space-y-2">
                  <Label>Delivery Location (City + Pincode)</Label>
                  <Input placeholder="e.g. Pune, 411001" required className="bg-background border-white/10" />
                </div>

                <div className="md:col-span-2 pt-6">
                  <Button type="submit" size="lg" className="w-full h-14 text-lg bg-primary hover:bg-primary/90">
                    Find MechMasters
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}