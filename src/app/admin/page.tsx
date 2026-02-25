
"use client"

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ClipboardList, 
  Send,
  Eye,
  Loader2,
  CheckCircle2,
  LogOut,
  ShieldCheck,
  Factory,
  User as UserIcon,
  DollarSign,
  Download,
  UserCheck,
  History,
  TrendingUp,
  AlertCircle,
  Clock,
  Plus,
  Trash2,
  Edit3,
  MapPin,
  Star,
  Upload,
  Image as ImageIcon,
  X,
  FileText,
  ChevronRight,
  ChevronLeft,
  Building2,
  Contact2,
  Settings2,
  FileCheck2
} from 'lucide-react';
import { useFirestore, useCollection, useUser, useMemoFirebase, updateDocumentNonBlocking, addDocumentNonBlocking, useAuth, setDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { collection, query, orderBy, doc, getDoc, where } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import Image from 'next/image';

const STATUS_OPTIONS = [
  { value: 'rfq_submitted', label: 'RFQ Submitted' },
  { value: 'quotation_sent', label: 'Quotation Sent' },
  { value: 'negotiation', label: 'Negotiation' },
  { value: 'order_confirmed', label: 'Order Confirmed' },
  { value: 'shipping', label: 'Shipping' },
  { value: 'delivered', label: 'Delivered' },
];

const SPECIALIZATIONS = [
  'CNC Machining',
  'Laser Cutting',
  'Welding & Fabrication',
  'Sheet Metal',
  'Prototype Manufacturing',
  '3D Printing',
  'Small Batch Production'
];

export default function AdminPanel() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const [isAdminConfirmed, setIsAdminConfirmed] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState('rfqs');
  
  // Vendor Form Stepper State
  const [vendorStep, setVendorStep] = useState(1);
  const totalVendorSteps = 4;
  
  // Modals
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showVendorModal, setShowVendorModal] = useState(false);
  
  const [selectedRfq, setSelectedRfq] = useState<any>(null);
  const [selectedVendorProfile, setSelectedVendorProfile] = useState<any>(null);
  
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);
  const [isSubmittingVendor, setIsSubmittingVendor] = useState(false);
  
  const [isRevising, setIsRevising] = useState(false);
  const [revisingQuote, setRevisingQuote] = useState<any>(null);
  const [revPrice, setRevPrice] = useState('');
  const [revLeadTime, setRevLeadTime] = useState('');
  const [revMessage, setRevMessage] = useState('');

  // Image Upload State
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const db = useFirestore();
  const { toast } = useToast();

  useEffect(() => {
    async function verifyAdmin() {
      if (!isUserLoading) {
        if (!user) {
          router.push('/login?redirect=/admin');
        } else if (db) {
          try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists() && userDoc.data()?.role === 'admin') {
              setIsAdminConfirmed(true);
            } else {
              setIsAdminConfirmed(false);
              router.push('/dashboard');
            }
          } catch (err) {
            setIsAdminConfirmed(false);
            router.push('/dashboard');
          }
        }
      }
    }
    verifyAdmin();
  }, [user, isUserLoading, db, router]);

  const buyersQuery = useMemoFirebase(() => (db && user && isAdminConfirmed) ? query(collection(db, 'users'), where('role', '==', 'user')) : null, [db, user, isAdminConfirmed]);
  const vendorsQuery = useMemoFirebase(() => (db && user && isAdminConfirmed) ? query(collection(db, 'users'), where('role', '==', 'vendor')) : null, [db, user, isAdminConfirmed]);
  const rfqsQuery = useMemoFirebase(() => (db && user && isAdminConfirmed) ? query(collection(db, 'rfqs'), orderBy('createdAt', 'desc')) : null, [db, user, isAdminConfirmed]);

  const quotationsQuery = useMemoFirebase(() => {
    if (!db || !isAdminConfirmed || !selectedRfq) return null;
    return query(collection(db, 'quotations'), where('rfqId', '==', selectedRfq.id));
  }, [db, isAdminConfirmed, selectedRfq?.id]);

  const { data: buyers } = useCollection(buyersQuery);
  const { data: vendors } = useCollection(vendorsQuery);
  const { data: rfqs, isLoading: isRfqsLoading } = useCollection(rfqsQuery);
  const { data: selectedRfqQuotes } = useCollection(quotationsQuery);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({ title: "File too large", description: "Please upload an image smaller than 2MB.", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateStatus = (rfqId: string, newStatus: string) => {
    if (!db) return;
    updateDocumentNonBlocking(doc(db, 'rfqs', rfqId), {
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });
    toast({ title: "Status Updated", description: `Project is now in ${newStatus.replace('_', ' ')} phase.` });
  };

  const handleToggleVendorStatus = (vendor: any, field: 'isActive' | 'isVerified') => {
    if (!db) return;
    updateDocumentNonBlocking(doc(db, 'users', vendor.id), {
      [field]: !vendor[field],
      updatedAt: new Date().toISOString(),
      updatedBy: user?.uid
    });
    toast({ title: "Vendor Updated", description: `${field} status has been toggled.` });
  };

  const handleDeleteVendor = (vendorId: string) => {
    if (!db || !confirm("Are you sure you want to delete this vendor profile?")) return;
    deleteDocumentNonBlocking(doc(db, 'users', vendorId));
    toast({ title: "Vendor Deleted", description: "The profile has been removed from the system." });
  };

  const handleSaveVendor = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!db || !user) return;
    setIsSubmittingVendor(true);
    
    const formData = new FormData(e.currentTarget);
    const vendorId = selectedVendorProfile?.id || Math.random().toString(36).substring(2, 11);
    
    const specs: string[] = [];
    SPECIALIZATIONS.forEach(s => {
      // Checkboxes only exist in FormData if they are checked
      if (formData.get(`spec_${s}`)) specs.push(s);
    });

    const vendorData = {
      fullName: formData.get('fullName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      teamName: formData.get('teamName') as string,
      location: formData.get('location') as string,
      experienceYears: Number(formData.get('experienceYears')),
      rating: Number(formData.get('rating')),
      portfolio: formData.get('portfolio') as string,
      adminNotes: formData.get('adminNotes') as string,
      imageUrl: profileImage,
      specializations: specs,
      role: 'vendor',
      onboarded: true,
      isActive: formData.get('isActive') === 'on',
      isVerified: formData.get('isVerified') === 'on',
      updatedAt: new Date().toISOString(),
      updatedBy: user.uid,
      ...(selectedVendorProfile ? {} : { createdAt: new Date().toISOString() })
    };

    setDocumentNonBlocking(doc(db, 'users', vendorId), vendorData, { merge: true });
    
    setIsSubmittingVendor(false);
    setShowVendorModal(false);
    setSelectedVendorProfile(null);
    setProfileImage(null);
    setVendorStep(1);
    toast({ 
      title: selectedVendorProfile ? "Vendor Updated" : "Vendor Created", 
      description: `MechMaster ${vendorData.fullName} profile saved.` 
    });
  };

  const handleSendQuotation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedRfq || !db) return;
    setIsSubmittingQuote(true);
    const formData = new FormData(e.currentTarget);
    const vendorId = formData.get('vendorId') as string;
    const vendor = vendors?.find(v => v.id === vendorId);

    const quotationData = {
      rfqId: selectedRfq.id,
      userId: selectedRfq.userId,
      vendorId: vendorId,
      vendorName: vendor?.fullName || 'MechMaster',
      vendorRating: vendor?.rating || 4.5,
      quotedPrice: Number(formData.get('price')),
      leadTimeDays: Number(formData.get('leadTime')),
      notes: formData.get('notes') as string,
      status: 'sent',
      negotiationHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addDocumentNonBlocking(collection(db, 'quotations'), quotationData)
      .then(() => {
        updateDocumentNonBlocking(doc(db, 'rfqs', selectedRfq.id), {
          status: 'quotation_sent',
          updatedAt: new Date().toISOString(),
        });
        toast({ title: "Quotation Sent", description: "Sent to client and assigned to vendor." });
        setShowQuoteModal(false);
      })
      .finally(() => setIsSubmittingQuote(false));
  };

  const handleAdminReviseQuote = () => {
    if (!db || !revisingQuote) return;

    const historyItem = {
      party: 'admin',
      price: Number(revPrice),
      leadTime: Number(revLeadTime),
      message: revMessage,
      createdAt: new Date().toISOString(),
    };

    const newHistory = [...(revisingQuote.negotiationHistory || []), historyItem];

    updateDocumentNonBlocking(doc(db, 'quotations', revisingQuote.id), {
      status: 'negotiating',
      quotedPrice: Number(revPrice),
      leadTimeDays: Number(revLeadTime),
      negotiationHistory: newHistory,
      updatedAt: new Date().toISOString()
    });

    setIsRevising(false);
    setRevisingQuote(null);
    toast({ title: "Quotation Revised", description: "Revised terms sent to vendor for confirmation." });
  };

  const downloadFile = (dataUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isAdminConfirmed === null || isUserLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  if (!isAdminConfirmed) return null;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-card">
        <div className="flex items-center gap-3">
          <Image
            src="/mechhub.jpg"
            alt="MechHub Logo"
            width={60}
            height={60}
          />
          <span className="font-headline font-bold text-xl text-white">MechHub Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 border-white/10 hover:bg-white/5">
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="w-64 border-r border-white/5 bg-card flex flex-col p-4 space-y-2">
          <Button variant={activeTab === 'rfqs' ? 'secondary' : 'ghost'} className="justify-start gap-3" onClick={() => setActiveTab('rfqs')}><ClipboardList className="w-4 h-4" /> RFQs</Button>
          <Button variant={activeTab === 'users' ? 'secondary' : 'ghost'} className="justify-start gap-3" onClick={() => setActiveTab('users')}><UserIcon className="w-4 h-4" /> Buyers</Button>
          <Button variant={activeTab === 'vendors' ? 'secondary' : 'ghost'} className="justify-start gap-3" onClick={() => setActiveTab('vendors')}><Factory className="w-4 h-4" /> MechMasters</Button>
        </aside>

        <main className="flex-1 p-8 overflow-y-auto">
          {activeTab === 'rfqs' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-headline font-bold text-white">Project Management</h1>
                <Badge variant="outline" className="px-3 py-1 border-white/10 text-white">{rfqs?.length || 0} Total Requests</Badge>
              </div>
              
              <Card className="bg-card border-white/5">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="text-white">Project & User</TableHead>
                      <TableHead className="text-white">Details</TableHead>
                      <TableHead className="text-white">Requested Vendors</TableHead>
                      <TableHead className="text-white">Status</TableHead>
                      <TableHead className="text-white">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isRfqsLoading ? (
                      <TableRow><TableCell colSpan={5} className="text-center py-8"><Loader2 className="animate-spin mx-auto text-primary" /></TableCell></TableRow>
                    ) : rfqs?.map((rfq) => (
                      <TableRow key={rfq.id} className="border-b border-white/5">
                        <TableCell>
                          <div className="font-bold text-white">{rfq.projectName || 'Untitled'}</div>
                          <div className="text-sm text-muted-foreground">{rfq.userName} ({rfq.teamName})</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs text-white">{rfq.manufacturingProcess}</div>
                          <div className="text-[10px] text-muted-foreground uppercase">{rfq.material} • Qty: {rfq.quantity}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {rfq.selectedVendors?.map((v: string, i: number) => (
                              <Badge key={i} variant="outline" className="text-[9px] border-white/10 bg-white/5 text-white">{v}</Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select 
                            value={rfq.status} 
                            onValueChange={(val) => handleUpdateStatus(rfq.id, val)}
                          >
                            <SelectTrigger className="w-[140px] h-8 text-xs bg-background border-white/10">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {STATUS_OPTIONS.map(opt => (
                                <SelectItem key={opt.value} value={opt.value} className="text-xs">{opt.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="icon" variant="ghost" className="w-8 h-8" onClick={() => { setSelectedRfq(rfq); setShowDetailsModal(true); }}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            {rfq.status === 'rfq_submitted' && (
                              <Button size="sm" onClick={() => { setSelectedRfq(rfq); setShowQuoteModal(true); }}>
                                <DollarSign className="w-3 h-3 mr-1" /> Initial Quote
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-headline font-bold text-white">Buyer Directory</h1>
              <Card className="bg-card border-white/5">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="text-white">Name</TableHead>
                      <TableHead className="text-white">Contact</TableHead>
                      <TableHead className="text-white">Organization</TableHead>
                      <TableHead className="text-white">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {buyers?.map((u) => (
                      <TableRow key={u.id} className="border-b border-white/5">
                        <TableCell className="font-bold text-white">{u.fullName}</TableCell>
                        <TableCell>
                          <div className="text-sm text-white">{u.email}</div>
                          <div className="text-xs text-muted-foreground">{u.phone}</div>
                        </TableCell>
                        <TableCell className="text-white">{u.teamName}</TableCell>
                        <TableCell><Badge variant="outline" className="border-white/10 text-white">{u.onboarded ? 'Onboarded' : 'Pending'}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          )}

          {activeTab === 'vendors' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-headline font-bold text-white">MechMaster Registry</h1>
                <Button onClick={() => { setSelectedVendorProfile(null); setProfileImage(null); setVendorStep(1); setShowVendorModal(true); }} className="gap-2 font-bold uppercase tracking-widest text-[11px]">
                  <Plus className="w-4 h-4" /> Register New MechMaster
                </Button>
              </div>
              
              <Card className="bg-card border-white/5">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="text-white">Logo</TableHead>
                      <TableHead className="text-white">Vendor & Rating</TableHead>
                      <TableHead className="text-white">Capabilities</TableHead>
                      <TableHead className="text-white">Location</TableHead>
                      <TableHead className="text-white">Verification</TableHead>
                      <TableHead className="text-white">Status</TableHead>
                      <TableHead className="text-white">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendors?.map((v) => (
                      <TableRow key={v.id} className="border-b border-white/5">
                        <TableCell>
                          <div className="relative w-10 h-10 rounded overflow-hidden bg-muted">
                            <Image 
                              src={v.imageUrl || "/mechhub.jpg"} 
                              alt={v.fullName || 'Vendor Logo'} 
                              fill 
                              className="object-cover" 
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-bold flex items-center gap-2 text-white">
                            {v.fullName}
                            {v.isVerified && <ShieldCheck className="w-3 h-3 text-secondary" />}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
                            {v.rating || 0} • {v.experienceYears || 0} yrs exp
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {v.specializations?.map((s: string, i: number) => (
                              <Badge key={i} variant="outline" className="rounded-full bg-secondary/5 text-secondary border-secondary/20 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider">
                                {s}
                              </Badge>
                            )) || <span className="text-[10px] italic opacity-50">None listed</span>}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-white">
                          <div className="flex items-center gap-1"><MapPin className="w-3 h-3 text-muted-foreground" /> {v.location || 'Unknown'}</div>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`h-7 text-[10px] gap-1 ${v.isVerified ? 'text-green-500' : 'text-muted-foreground'}`}
                            onClick={() => handleToggleVendorStatus(v, 'isVerified')}
                          >
                            {v.isVerified ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                            {v.isVerified ? 'Verified' : 'Unverified'}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Badge variant={v.isActive ? 'default' : 'secondary'} className="text-[10px] font-bold uppercase tracking-widest px-2">
                            {v.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { 
                              setSelectedVendorProfile(v); 
                              setProfileImage(v.imageUrl || null);
                              setVendorStep(1);
                              setShowVendorModal(true); 
                            }}>
                              <Edit3 className="w-3.5 h-3.5" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDeleteVendor(v.id)}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          )}
        </main>
      </div>

      {showVendorModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/90 backdrop-blur-sm overflow-y-auto">
          <Card className="w-full max-w-2xl bg-card border-white/10 shadow-2xl overflow-hidden my-8">
            <div className="bg-primary/10 px-8 py-6 border-b border-white/5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-headline font-bold text-white">{selectedVendorProfile ? 'Edit MechMaster' : 'Register New MechMaster'}</h2>
                <p className="text-sm text-muted-foreground">Step {vendorStep} of {totalVendorSteps}: {
                  vendorStep === 1 ? 'Brand Identity' : 
                  vendorStep === 2 ? 'Contact & Logistics' : 
                  vendorStep === 3 ? 'Technical Capabilities' : 'Review & Oversight'
                }</p>
              </div>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4].map(s => (
                  <div key={s} className={`w-3 h-3 rounded-full ${vendorStep === s ? 'bg-secondary' : vendorStep > s ? 'bg-primary' : 'bg-white/10'}`} />
                ))}
              </div>
            </div>
            
            <form onSubmit={handleSaveVendor}>
              <div className="p-8">
                {vendorStep === 1 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="space-y-4">
                      <Label className="text-secondary font-bold uppercase tracking-widest text-[10px]">Company Branding</Label>
                      <div className="flex items-center gap-6">
                        <div className="relative w-32 h-32 rounded-lg border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden bg-background group">
                          {profileImage ? (
                            <>
                              <Image src={profileImage} alt="Profile Logo Preview" fill className="object-cover" />
                              <Button 
                                type="button" 
                                variant="destructive" 
                                size="icon" 
                                className="absolute top-1 right-1 w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => setProfileImage(null)}
                              >
                                <X size={12} />
                              </Button>
                            </>
                          ) : (
                            <div className="flex flex-col items-center gap-2 text-muted-foreground opacity-30">
                              <ImageIcon className="w-8 h-8" />
                              <span className="text-[8px] font-bold">LOGO</span>
                            </div>
                          )}
                        </div>
                        <div className="space-y-2 flex-1">
                          <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="image/*" 
                            onChange={handleImageChange}
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => fileInputRef.current?.click()}
                            className="gap-2 w-full h-12 border-white/10 hover:bg-white/5 font-bold uppercase tracking-widest text-[10px]"
                          >
                            <Upload size={16} /> Upload Official Logo
                          </Button>
                          <p className="text-[10px] text-muted-foreground leading-relaxed">High resolution square JPG/PNG recommended. Max file size: 2MB.</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-white"><Building2 className="w-4 h-4 text-secondary" /> Company Name</Label>
                        <Input name="teamName" defaultValue={selectedVendorProfile?.teamName} placeholder="e.g. Precision Engineering Ltd" className="bg-background h-12" required />
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-white"><Contact2 className="w-4 h-4 text-secondary" /> Contact Person</Label>
                        <Input name="fullName" defaultValue={selectedVendorProfile?.fullName} placeholder="e.g. John Wick" className="bg-background h-12" required />
                      </div>
                    </div>
                  </div>
                )}

                {vendorStep === 2 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-2 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-white">Official Email Address</Label>
                        <Input name="email" type="email" defaultValue={selectedVendorProfile?.email} placeholder="vendor@mechhub.com" className="bg-background h-12" required />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">Direct Phone Number</Label>
                        <Input name="phone" defaultValue={selectedVendorProfile?.phone} placeholder="+91 00000 00000" className="bg-background h-12" required />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label className="flex items-center gap-2 text-white"><MapPin className="w-4 h-4 text-secondary" /> Workshop Location</Label>
                        <Input name="location" defaultValue={selectedVendorProfile?.location} placeholder="City, State, Country (e.g. Pune, Maharashtra, India)" className="bg-background h-12" required />
                      </div>
                    </div>
                  </div>
                )}

                {vendorStep === 3 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-2 duration-300">
                    <div className="space-y-4">
                      <Label className="text-secondary font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                        <Settings2 className="w-4 h-4" /> Machine Capabilities
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {SPECIALIZATIONS.map(s => (
                          <div key={s} className="flex items-center gap-3 bg-background p-3 rounded-lg border border-white/5 hover:border-secondary/20 transition-all cursor-pointer">
                            <Checkbox id={`spec_${s}`} name={`spec_${s}`} defaultChecked={selectedVendorProfile?.specializations?.includes(s)} />
                            <label htmlFor={`spec_${s}`} className="text-xs font-bold cursor-pointer select-none text-white">{s}</label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/5">
                      <div className="space-y-2">
                        <Label className="text-white">Manufacturing Experience (Years)</Label>
                        <Input name="experienceYears" type="number" defaultValue={selectedVendorProfile?.experienceYears || 0} className="bg-background h-12" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">Initial Marketplace Rating (0-5)</Label>
                        <Input name="rating" type="number" step="0.1" max="5" defaultValue={selectedVendorProfile?.rating || 4.5} className="bg-background h-12" />
                      </div>
                    </div>
                  </div>
                )}

                {vendorStep === 4 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-2 duration-300">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-white"><FileCheck2 className="w-4 h-4 text-secondary" /> Portfolio & Facility Description</Label>
                      <Textarea name="portfolio" defaultValue={selectedVendorProfile?.portfolio} placeholder="Describe workshop capacity, major machinery, and past clients..." className="bg-background min-h-[100px] text-sm text-white" />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Internal Admin Notes</Label>
                      <Textarea name="adminNotes" defaultValue={selectedVendorProfile?.adminNotes} placeholder="Confidential verification notes, payment terms, or lead source..." className="bg-background h-24 text-sm text-white" />
                    </div>

                    <div className="flex flex-wrap items-center gap-8 pt-6 border-t border-white/5">
                      <div className="flex items-center gap-3">
                        <Checkbox id="isActive" name="isActive" defaultChecked={selectedVendorProfile ? selectedVendorProfile.isActive : true} />
                        <div className="grid gap-0.5">
                          <Label htmlFor="isActive" className="text-sm font-bold text-white">Active Status</Label>
                          <p className="text-[10px] text-muted-foreground">Visible to innovators in marketplace</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Checkbox id="isVerified" name="isVerified" defaultChecked={selectedVendorProfile?.isVerified} />
                        <div className="grid gap-0.5">
                          <Label htmlFor="isVerified" className="text-sm font-bold text-secondary flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Verified Hub Partner</Label>
                          <p className="text-[10px] text-muted-foreground">Trust badge displayed on vendor card</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-muted/30 px-8 py-6 border-t border-white/5 flex items-center justify-between">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => {
                    if (vendorStep === 1) {
                      setShowVendorModal(false);
                      setVendorStep(1);
                    } else {
                      setVendorStep(prev => prev - 1);
                    }
                  }}
                  className="gap-2 border-white/10 hover:bg-white/5 font-bold uppercase tracking-widest text-[10px] h-12 px-6"
                >
                  <ChevronLeft size={16} /> {vendorStep === 1 ? 'Discard' : 'Back'}
                </Button>

                <div className="flex gap-3">
                  {vendorStep < totalVendorSteps ? (
                    <Button 
                      type="button" 
                      onClick={() => setVendorStep(prev => prev + 1)}
                      className="gap-2 font-bold px-10 h-12 uppercase tracking-widest text-[10px]"
                    >
                      Continue <ChevronRight size={16} />
                    </Button>
                  ) : (
                    <Button 
                      type="submit" 
                      disabled={isSubmittingVendor}
                      className="gap-2 font-bold px-10 h-12 bg-secondary text-background hover:bg-secondary/90 uppercase tracking-widest text-[10px]"
                    >
                      {isSubmittingVendor ? <Loader2 className="animate-spin" /> : (selectedVendorProfile ? 'Commit Changes' : 'Finalize Registration')}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </Card>
        </div>
      )}

      {showQuoteModal && selectedRfq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <Card className="w-full max-w-lg bg-card border-white/10 shadow-2xl p-6">
            <h2 className="text-xl font-headline font-bold mb-4 text-white">Create Initial Quote</h2>
            <form onSubmit={handleSendQuotation} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Assign MechMaster</Label>
                <Select name="vendorId" required>
                  <SelectTrigger className="bg-background border-white/10 text-white">
                    <SelectValue placeholder="Select a vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendors?.filter(v => v.isActive).map(v => (
                      <SelectItem key={v.id} value={v.id} className="text-white">{v.fullName} ({v.email})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-muted-foreground">User requested: {selectedRfq.selectedVendors?.join(', ')}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label className="text-white">Price (INR)</Label><Input name="price" type="number" required className="text-white" /></div>
                <div className="space-y-2"><Label className="text-white">Lead Time (Days)</Label><Input name="leadTime" type="number" required className="text-white" /></div>
              </div>
              <div className="space-y-2"><Label className="text-white">Notes</Label><textarea name="notes" className="w-full bg-background border border-white/10 rounded-md p-3 min-h-[100px] text-white text-sm" /></div>
              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1 font-bold" disabled={isSubmittingQuote}>{isSubmittingQuote ? <Loader2 className="animate-spin" /> : 'Confirm & Send Quote'}</Button>
                <Button variant="outline" className="flex-1 border-white/10 hover:bg-white/5 font-bold" onClick={() => { setShowQuoteModal(false); setSelectedRfq(null); }}>Cancel</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {showDetailsModal && selectedRfq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto">
          <Card className="w-full max-w-4xl bg-card border-white/10 shadow-2xl p-6 my-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-headline font-bold text-white">{selectedRfq.projectName}</h2>
                <p className="text-muted-foreground">Detailed project specifications & bid management</p>
              </div>
              <Badge className="text-lg px-4 py-1 bg-primary text-white border-none">{selectedRfq.status.replace('_', ' ')}</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
              <div className="space-y-6">
                <div><h3 className="font-bold text-secondary mb-2 uppercase tracking-widest text-[10px]">Technical Requirements</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-muted-foreground">Process:</span><span className="text-white">{selectedRfq.manufacturingProcess}</span></div>
                    <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-muted-foreground">Material:</span><span className="text-white">{selectedRfq.material}</span></div>
                    <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-muted-foreground">Tolerance:</span><span className="text-white">{selectedRfq.tolerance}</span></div>
                    <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-muted-foreground">Finish:</span><span className="text-white">{selectedRfq.surfaceFinish || 'Standard'}</span></div>
                  </div>
                </div>
                <div><h3 className="font-bold text-secondary mb-2 uppercase tracking-widest text-[10px]">Technical Documents</h3>
                  {selectedRfq.designFileUrl ? (
                    <div className="p-3 bg-background border border-white/5 rounded-lg flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-primary" />
                        <div className="overflow-hidden max-w-[150px]">
                          <p className="font-bold truncate text-white">{selectedRfq.designFileName || 'Design_File'}</p>
                          <p className="text-[10px] text-muted-foreground">Engineering Drawing</p>
                        </div>
                      </div>
                      <Button size="icon" variant="ghost" className="hover:text-secondary" onClick={() => downloadFile(selectedRfq.designFileUrl, selectedRfq.designFileName || 'design.png')}>
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">No design files attached.</p>
                  )}
                </div>
                <div><h3 className="font-bold text-secondary mb-2 uppercase tracking-widest text-[10px]">Logistics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-muted-foreground">Quantity:</span><span className="text-white">{selectedRfq.quantity} units</span></div>
                    <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-muted-foreground">Delivery:</span><span className="text-white">{new Date(selectedRfq.deliveryDate).toLocaleDateString()}</span></div>
                    <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-muted-foreground">Location:</span><span className="text-white">{selectedRfq.deliveryLocation}</span></div>
                    <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-muted-foreground">Budget:</span><span className="text-white">{selectedRfq.budgetRange || 'Unspecified'}</span></div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div><h3 className="font-bold text-primary mb-2 uppercase tracking-widest text-[10px] flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Active Bids & Negotiations</h3>
                  {selectedRfqQuotes && selectedRfqQuotes.length > 0 ? (
                    <div className="space-y-4">
                      {selectedRfqQuotes.map((quote) => {
                        const lastNeg = quote.negotiationHistory?.[quote.negotiationHistory.length - 1];
                        const isUserWaiting = lastNeg?.party === 'user';
                        
                        return (
                          <Card key={quote.id} className="bg-background border-white/10 p-4 space-y-3 relative overflow-hidden">
                            {isUserWaiting && <div className="absolute top-0 right-0 p-1 bg-yellow-500 text-[8px] font-bold uppercase px-2 text-black">User Action Requested</div>}
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-bold text-white">{quote.vendorName}</p>
                                <p className="text-[10px] text-muted-foreground">Status: {quote.status.toUpperCase()}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-secondary">₹{quote.quotedPrice}</p>
                                <p className="text-[10px] text-muted-foreground">{quote.leadTimeDays} Days</p>
                              </div>
                            </div>
                            
                            {quote.negotiationHistory?.length > 0 && (
                              <div className="space-y-2 mt-2 pt-2 border-t border-white/5">
                                <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest">Latest Update</p>
                                <div className={`p-2 rounded text-[10px] ${lastNeg.party === 'user' ? 'bg-primary/5 border-l-2 border-primary' : 'bg-secondary/5 border-l-2 border-secondary'}`}>
                                  <p className="font-bold text-white capitalize mb-1">{lastNeg.party} Proposal:</p>
                                  <p className="text-white">₹{lastNeg.price} • {lastNeg.leadTime} Days</p>
                                  {lastNeg.message && <p className="italic text-muted-foreground mt-1">"{lastNeg.message}"</p>}
                                </div>
                              </div>
                            )}
                            
                            <div className="flex gap-2 pt-2">
                              <Button variant="outline" size="sm" className="h-7 text-xs flex-1 border-white/10 hover:bg-white/5 font-bold" onClick={() => {
                                setRevisingQuote(quote);
                                setRevPrice(quote.quotedPrice.toString());
                                setRevLeadTime(quote.leadTimeDays.toString());
                                setIsRevising(true);
                              }}>
                                <History className="w-3 h-3 mr-1" /> Oversee / Revise
                              </Button>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-background/50 rounded-xl border border-dashed border-white/10">
                      <Clock className="w-8 h-8 mx-auto text-muted-foreground opacity-30 mb-2" />
                      <p className="text-xs text-muted-foreground italic">No bids submitted for this RFQ yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-white/5">
              <Button onClick={() => { setShowDetailsModal(false); setSelectedRfq(null); }} className="font-bold px-8">Close Specifications</Button>
            </div>
          </Card>
        </div>
      )}

      {isRevising && revisingQuote && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/90 backdrop-blur-md">
          <Card className="w-full max-w-md bg-card border-white/10 p-6 shadow-2xl">
            <h2 className="text-xl font-headline font-bold mb-4 text-white">Admin Intervention: Revise Quotation</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Revised Price (₹)</Label>
                  <Input value={revPrice} onChange={(e) => setRevPrice(e.target.value)} type="number" className="bg-background text-white" />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Revised Lead Time (Days)</Label>
                  <Input value={revLeadTime} onChange={(e) => setRevLeadTime(e.target.value)} type="number" className="bg-background text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white">Admin Instructions / Message to Vendor</Label>
                <Textarea 
                  value={revMessage} 
                  onChange={(e) => setRevMessage(e.target.value)} 
                  placeholder="Explain the changes to the vendor..." 
                  className="bg-background h-24 text-white text-sm"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button className="flex-1 font-bold h-12" onClick={handleAdminReviseQuote}>Update & Issue Terms</Button>
                <Button variant="outline" className="flex-1 border-white/10 hover:bg-white/5 h-12 font-bold" onClick={() => setIsRevising(false)}>Cancel</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
