
"use client"

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
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
  FileCheck2,
  Gavel
} from 'lucide-react';
import { useFirestore, useCollection, useUser, useMemoFirebase, updateDocumentNonBlocking, addDocumentNonBlocking, useAuth, setDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { collection, query, orderBy, doc, getDoc, where } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import Image from 'next/image';

const STATUS_OPTIONS = [
  { value: 'submitted', label: 'RFQ Submitted' },
  { value: 'quotations_received', label: 'Quotations Received' },
  { value: 'under_negotiation', label: 'Under Negotiation' },
  { value: 'assigned', label: 'Vendor Assigned' },
  { value: 'in_progress', label: 'In Production' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
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
  
  const [vendorStep, setVendorStep] = useState(1);
  const totalVendorSteps = 4;
  
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

  const buyersQuery = useMemoFirebase(() => (db && isAdminConfirmed) ? query(collection(db, 'users'), where('role', '==', 'customer')) : null, [db, isAdminConfirmed]);
  const vendorsQuery = useMemoFirebase(() => (db && isAdminConfirmed) ? query(collection(db, 'users'), where('role', '==', 'vendor')) : null, [db, isAdminConfirmed]);
  const rfqsQuery = useMemoFirebase(() => (db && isAdminConfirmed) ? query(collection(db, 'rfqs'), orderBy('createdAt', 'desc')) : null, [db, isAdminConfirmed]);

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
        toast({ title: "File too large", description: "Max 2MB logo allowed.", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => setProfileImage(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateStatus = (rfqId: string, newStatus: string) => {
    if (!db) return;
    updateDocumentNonBlocking(doc(db, 'rfqs', rfqId), {
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });
    toast({ title: "Status Updated", description: `Project lifecycle updated to ${newStatus}.` });
  };

  const handleShortlistVendor = (rfqId: string, vendorId: string) => {
    if (!db || !selectedRfq) return;
    const currentList = selectedRfq.shortlistedVendorIds || [];
    const newList = currentList.includes(vendorId) 
      ? currentList.filter((id: string) => id !== vendorId)
      : [...currentList, vendorId];
    
    updateDocumentNonBlocking(doc(db, 'rfqs', rfqId), { shortlistedVendorIds: newList });
    toast({ title: "Shortlist Updated", description: "MechMaster selection refined." });
  };

  const handleAssignVendor = (rfqId: string, vendorId: string) => {
    if (!db || !confirm("Assign this project to this vendor and finalize negotiations?")) return;
    updateDocumentNonBlocking(doc(db, 'rfqs', rfqId), { 
      assignedVendorId: vendorId,
      status: 'assigned',
      updatedAt: new Date().toISOString()
    });
    toast({ title: "Vendor Assigned", description: "Project has been officially assigned." });
  };

  const handleSaveVendor = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!db || !user) return;
    setIsSubmittingVendor(true);
    const formData = new FormData(e.currentTarget);
    const vendorId = selectedVendorProfile?.id || Math.random().toString(36).substring(2, 11);
    const specs: string[] = [];
    SPECIALIZATIONS.forEach(s => { if (formData.get(`spec_${s}`)) specs.push(s); });

    const vendorData = {
      fullName: formData.get('fullName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      teamName: formData.get('teamName') as string,
      location: formData.get('location') as string,
      experienceYears: Number(formData.get('experienceYears')),
      rating: Number(formData.get('rating')),
      portfolio: formData.get('portfolio') as string,
      imageUrl: profileImage,
      specializations: specs,
      role: 'vendor',
      status: 'active',
      onboarded: true,
      isActive: formData.get('isActive') === 'on',
      isVerified: formData.get('isVerified') === 'on',
      updatedAt: new Date().toISOString(),
      ...(selectedVendorProfile ? {} : { createdAt: new Date().toISOString() })
    };

    setDocumentNonBlocking(doc(db, 'users', vendorId), vendorData, { merge: true });
    setIsSubmittingVendor(false);
    setShowVendorModal(false);
    setSelectedVendorProfile(null);
    setProfileImage(null);
    setVendorStep(1);
    toast({ title: "Vendor Registry Updated" });
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
      status: 'revised',
      quotedPrice: Number(revPrice),
      leadTimeDays: Number(revLeadTime),
      negotiationHistory: newHistory,
      updatedAt: new Date().toISOString()
    });

    setIsRevising(false);
    toast({ title: "Quotation Revised", description: "Intervention logged." });
  };

  if (isAdminConfirmed === null || isUserLoading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="animate-spin text-primary" /></div>;
  if (!isAdminConfirmed) return null;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-card sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Image src="/mechhub.jpg" alt="MechHub Logo" width={60} height={60} />
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
                <h1 className="text-3xl font-headline font-bold text-white">Project Lifecycle Control</h1>
                <Badge variant="outline" className="px-3 py-1 border-white/10 text-white">{rfqs?.length || 0} RFQs</Badge>
              </div>
              
              <Card className="bg-card border-white/5">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="text-white">Project & Buyer</TableHead>
                      <TableHead className="text-white">Requirements</TableHead>
                      <TableHead className="text-white">Lifecycle Stage</TableHead>
                      <TableHead className="text-white">Assignment</TableHead>
                      <TableHead className="text-white">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isRfqsLoading ? (
                      <TableRow><TableCell colSpan={5} className="text-center py-8"><Loader2 className="animate-spin mx-auto text-primary" /></TableCell></TableRow>
                    ) : rfqs?.map((rfq) => (
                      <TableRow key={rfq.id} className="border-b border-white/5">
                        <TableCell>
                          <div className="font-bold text-white">{rfq.projectName}</div>
                          <div className="text-sm text-muted-foreground">{rfq.userName}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs text-white">{rfq.manufacturingProcess}</div>
                          <div className="text-[10px] text-muted-foreground uppercase">{rfq.material} • Qty: {rfq.quantity}</div>
                        </TableCell>
                        <TableCell>
                          <Select value={rfq.status} onValueChange={(val) => handleUpdateStatus(rfq.id, val)}>
                            <SelectTrigger className="w-[180px] h-8 text-xs bg-background border-white/10">
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
                          {rfq.assignedVendorId ? (
                            <Badge className="bg-green-500/20 text-green-500 border-none">Assigned</Badge>
                          ) : (
                            <Badge variant="outline" className="border-white/10 text-muted-foreground">Pending Selection</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button size="icon" variant="ghost" className="w-8 h-8" onClick={() => { setSelectedRfq(rfq); setShowDetailsModal(true); }}>
                            <Eye className="w-4 h-4" />
                          </Button>
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
              <h1 className="text-3xl font-headline font-bold text-white">Innovator Directory</h1>
              <Card className="bg-card border-white/5">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="text-white">Full Name</TableHead>
                      <TableHead className="text-white">Organization</TableHead>
                      <TableHead className="text-white">Contact</TableHead>
                      <TableHead className="text-white">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {buyers?.map((u) => (
                      <TableRow key={u.id} className="border-b border-white/5">
                        <TableCell className="font-bold text-white">{u.fullName}</TableCell>
                        <TableCell className="text-white">{u.teamName}</TableCell>
                        <TableCell>
                          <div className="text-sm text-white">{u.email}</div>
                          <div className="text-xs text-muted-foreground">{u.phone}</div>
                        </TableCell>
                        <TableCell><Badge className="bg-primary/20 text-primary">{u.status}</Badge></TableCell>
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
                <Button onClick={() => { setSelectedVendorProfile(null); setShowVendorModal(true); }} className="gap-2">
                  <Plus className="w-4 h-4" /> Add MechMaster
                </Button>
              </div>
              <Card className="bg-card border-white/5">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="text-white">Company</TableHead>
                      <TableHead className="text-white">Capabilities</TableHead>
                      <TableHead className="text-white">Rating</TableHead>
                      <TableHead className="text-white">Location</TableHead>
                      <TableHead className="text-white">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendors?.map((v) => (
                      <TableRow key={v.id} className="border-b border-white/5">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded overflow-hidden bg-muted">
                              <Image src={v.imageUrl || "/mechhub.jpg"} alt={v.fullName} fill className="object-cover" />
                            </div>
                            <div>
                              <div className="font-bold text-white flex items-center gap-1">{v.fullName} {v.isVerified && <ShieldCheck className="w-3 h-3 text-secondary" />}</div>
                              <div className="text-[10px] text-muted-foreground">{v.teamName}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {v.specializations?.map((s: string, i: number) => (
                              <Badge key={i} className="text-[8px] uppercase border-secondary/20 bg-secondary/5 text-secondary">{s}</Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-yellow-500 font-bold text-xs"><Star className="w-3 h-3 fill-yellow-500" /> {v.rating}</div>
                        </TableCell>
                        <TableCell className="text-xs text-white"><MapPin className="w-3 h-3 inline mr-1" />{v.location}</TableCell>
                        <TableCell>
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setSelectedVendorProfile(v); setProfileImage(v.imageUrl); setShowVendorModal(true); }}>
                            <Edit3 className="w-3.5 h-3.5" />
                          </Button>
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

      {showDetailsModal && selectedRfq && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/90 backdrop-blur-md overflow-y-auto">
          <Card className="w-full max-w-5xl bg-card border-white/10 shadow-2xl p-8 my-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-3xl font-headline font-bold text-white">{selectedRfq.projectName}</h2>
                <p className="text-muted-foreground">Admin Oversight • Project ID: {selectedRfq.id}</p>
              </div>
              <Badge className="text-lg px-6 py-2 bg-primary text-white border-none">{selectedRfq.status.replace('_', ' ')}</Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-5 space-y-8">
                <div>
                  <h3 className="text-xs font-bold text-secondary uppercase tracking-widest mb-4">Core Specifications</h3>
                  <div className="space-y-3 text-sm bg-background/50 p-5 rounded-xl border border-white/5">
                    <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-muted-foreground">Process:</span><span className="text-white">{selectedRfq.manufacturingProcess}</span></div>
                    <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-muted-foreground">Material:</span><span className="text-white">{selectedRfq.material}</span></div>
                    <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-muted-foreground">Quantity:</span><span className="text-white">{selectedRfq.quantity} units</span></div>
                    <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-muted-foreground">Deadline:</span><span className="text-white">{new Date(selectedRfq.deliveryDate).toLocaleDateString()}</span></div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-secondary uppercase tracking-widest mb-4">Vendor Invitation List</h3>
                  <div className="space-y-2">
                    {vendors?.filter(v => selectedRfq.selectedVendorIds?.includes(v.id)).map(v => (
                      <div key={v.id} className="p-3 bg-background border border-white/5 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8"><AvatarImage src={v.imageUrl} /><AvatarFallback>{v.fullName[0]}</AvatarFallback></Avatar>
                          <div className="text-xs">
                            <p className="font-bold text-white">{v.fullName}</p>
                            <p className="text-muted-foreground">{v.teamName}</p>
                          </div>
                        </div>
                        <Checkbox 
                          checked={selectedRfq.shortlistedVendorIds?.includes(v.id)} 
                          onCheckedChange={() => handleShortlistVendor(selectedRfq.id, v.id)}
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2 italic">* Check to shortlist for final review.</p>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-8">
                <div>
                  <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Bidding & Negotiations
                  </h3>
                  <div className="space-y-4">
                    {selectedRfqQuotes?.map(quote => (
                      <Card key={quote.id} className="bg-background border-white/10 p-5 group">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="font-bold text-white text-lg">{quote.vendorName}</p>
                            <Badge variant="outline" className="text-[10px] uppercase">{quote.status}</Badge>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-secondary">₹{quote.quotedPrice}</p>
                            <p className="text-xs text-muted-foreground">{quote.leadTimeDays} Days</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1 font-bold" onClick={() => { setRevisingQuote(quote); setIsRevising(true); }}>
                            <History className="w-3 h-3 mr-1" /> Oversee
                          </Button>
                          <Button size="sm" variant="secondary" className="flex-1 font-bold" onClick={() => handleAssignVendor(selectedRfq.id, quote.vendorId)}>
                            <UserCheck className="w-3 h-3 mr-1" /> Assign Build
                          </Button>
                        </div>
                      </Card>
                    ))}
                    {(!selectedRfqQuotes || selectedRfqQuotes.length === 0) && (
                      <div className="p-12 text-center bg-background/30 rounded-2xl border border-dashed border-white/10">
                        <Clock className="w-10 h-10 mx-auto text-muted-foreground opacity-20 mb-3" />
                        <p className="text-sm text-muted-foreground italic">No active bids for this project lifecycle phase.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 flex justify-end gap-3 pt-8 border-t border-white/5">
              <Button variant="outline" className="px-10 border-white/10" onClick={() => setShowDetailsModal(false)}>Close Oversight</Button>
            </div>
          </Card>
        </div>
      )}

      {showVendorModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-background/95 backdrop-blur-md overflow-y-auto">
          <Card className="w-full max-w-2xl bg-card border-white/10 shadow-2xl">
            <div className="bg-primary/10 p-6 border-b border-white/5 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-headline font-bold text-white">MechMaster Wizard</h2>
                <p className="text-sm text-muted-foreground">Step {vendorStep} of {totalVendorSteps}</p>
              </div>
              <div className="flex gap-1.5">
                {[1,2,3,4].map(s => <div key={s} className={`w-2 h-2 rounded-full ${vendorStep >= s ? 'bg-secondary' : 'bg-white/10'}`} />)}
              </div>
            </div>

            <form onSubmit={handleSaveVendor}>
              <div className="p-8">
                {vendorStep === 1 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-center gap-6">
                      <div className="relative w-24 h-24 rounded-lg bg-background border border-white/10 overflow-hidden flex items-center justify-center">
                        {profileImage ? <Image src={profileImage} alt="Preview" fill className="object-cover" /> : <ImageIcon className="opacity-10 w-8 h-8" />}
                      </div>
                      <div className="space-y-2 flex-1">
                        <Label className="text-xs uppercase font-bold text-secondary">MechMaster Identity</Label>
                        <Button type="button" variant="outline" className="w-full border-white/10 gap-2 h-10" onClick={() => fileInputRef.current?.click()}>
                          <Upload className="w-4 h-4" /> Upload Brand Logo
                        </Button>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Company Name</Label><Input name="teamName" defaultValue={selectedVendorProfile?.teamName} required className="bg-background" /></div>
                      <div className="space-y-2"><Label>Primary Contact</Label><Input name="fullName" defaultValue={selectedVendorProfile?.fullName} required className="bg-background" /></div>
                    </div>
                  </div>
                )}

                {vendorStep === 2 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Work Email</Label><Input name="email" type="email" defaultValue={selectedVendorProfile?.email} required className="bg-background" /></div>
                      <div className="space-y-2"><Label>Direct Phone</Label><Input name="phone" defaultValue={selectedVendorProfile?.phone} required className="bg-background" /></div>
                      <div className="space-y-2 col-span-2"><Label>Workshop Location</Label><Input name="location" defaultValue={selectedVendorProfile?.location} placeholder="City, State" className="bg-background" /></div>
                    </div>
                  </div>
                )}

                {vendorStep === 3 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
                    <Label className="text-xs uppercase font-bold text-secondary">Core Specializations</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {SPECIALIZATIONS.map(s => (
                        <div key={s} className="flex items-center gap-3 p-3 bg-background border border-white/5 rounded-lg">
                          <Checkbox id={s} name={`spec_${s}`} defaultChecked={selectedVendorProfile?.specializations?.includes(s)} />
                          <label htmlFor={s} className="text-xs font-bold text-white cursor-pointer">{s}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {vendorStep === 4 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
                    <div className="space-y-2"><Label>Facility Portfolio</Label><Textarea name="portfolio" defaultValue={selectedVendorProfile?.portfolio} className="bg-background h-32" /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Experience (Yrs)</Label><Input name="experienceYears" type="number" defaultValue={selectedVendorProfile?.experienceYears || 5} className="bg-background" /></div>
                      <div className="space-y-2"><Label>Registry Rating</Label><Input name="rating" type="number" step="0.1" defaultValue={selectedVendorProfile?.rating || 4.5} className="bg-background" /></div>
                    </div>
                    <div className="flex gap-4 pt-4">
                      <div className="flex items-center gap-2"><Checkbox id="isActive" name="isActive" defaultChecked={true} /><Label htmlFor="isActive">Public Profile</Label></div>
                      <div className="flex items-center gap-2"><Checkbox id="isVerified" name="isVerified" defaultChecked={selectedVendorProfile?.isVerified} /><Label htmlFor="isVerified" className="text-secondary">Verified Hub Partner</Label></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 bg-muted/20 border-t border-white/5 flex justify-between">
                <Button type="button" variant="ghost" onClick={() => vendorStep > 1 ? setVendorStep(v => v-1) : setShowVendorModal(false)}>
                  {vendorStep === 1 ? 'Discard' : 'Back'}
                </Button>
                {vendorStep < totalVendorSteps ? (
                  <Button type="button" onClick={() => setVendorStep(v => v+1)} className="gap-2">Continue <ChevronRight className="w-4 h-4" /></Button>
                ) : (
                  <Button type="submit" className="bg-secondary text-background hover:bg-secondary/90 font-bold" disabled={isSubmittingVendor}>
                    {isSubmittingVendor ? <Loader2 className="animate-spin" /> : 'Commit to Registry'}
                  </Button>
                )}
              </div>
            </form>
          </Card>
        </div>
      )}

      {isRevising && revisingQuote && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-background/90 backdrop-blur-md">
          <Card className="w-full max-w-md bg-card border-white/10 p-8 shadow-2xl">
            <h2 className="text-xl font-headline font-bold mb-6 text-white flex items-center gap-2"><Gavel className="w-5 h-5 text-secondary" /> Administrative Revision</h2>
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Price Override (₹)</Label><Input value={revPrice} onChange={e => setRevPrice(e.target.value)} type="number" className="bg-background" /></div>
                <div className="space-y-2"><Label>Lead Time Override</Label><Input value={revLeadTime} onChange={e => setRevLeadTime(e.target.value)} type="number" className="bg-background" /></div>
              </div>
              <div className="space-y-2"><Label>Internal Justification</Label><Textarea value={revMessage} onChange={e => setRevMessage(e.target.value)} className="bg-background h-24" /></div>
              <div className="flex gap-3 pt-6">
                <Button className="flex-1 font-bold h-12" onClick={handleAdminReviseQuote}>Update Quotation</Button>
                <Button variant="outline" className="flex-1 border-white/10 h-12" onClick={() => setIsRevising(false)}>Cancel</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
