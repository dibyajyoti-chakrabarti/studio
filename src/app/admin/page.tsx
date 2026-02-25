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
  FileText
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

  if (isAdminConfirmed === null || isUserLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
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
          <span className="font-headline font-bold text-xl">MechHub Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 border-white/10">
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
                <h1 className="text-3xl font-headline font-bold">Project Management</h1>
                <Badge variant="outline" className="px-3 py-1">{rfqs?.length || 0} Total Requests</Badge>
              </div>
              
              <Card className="bg-card border-white/5">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead>Project & User</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Requested Vendors</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isRfqsLoading ? (
                      <TableRow><TableCell colSpan={5} className="text-center py-8"><Loader2 className="animate-spin mx-auto" /></TableCell></TableRow>
                    ) : rfqs?.map((rfq) => (
                      <TableRow key={rfq.id} className="border-b border-white/5">
                        <TableCell>
                          <div className="font-bold">{rfq.projectName || 'Untitled'}</div>
                          <div className="text-xs text-muted-foreground">{rfq.userName} ({rfq.teamName})</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs">{rfq.manufacturingProcess}</div>
                          <div className="text-[10px] text-muted-foreground uppercase">{rfq.material} • Qty: {rfq.quantity}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {rfq.selectedVendors?.map((v: string, i: number) => (
                              <Badge key={i} variant="outline" className="text-[9px] border-white/10">{v}</Badge>
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
              <h1 className="text-3xl font-headline font-bold">Buyer Directory</h1>
              <Card className="bg-card border-white/5">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Organization</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {buyers?.map((u) => (
                      <TableRow key={u.id} className="border-b border-white/5">
                        <TableCell className="font-bold">{u.fullName}</TableCell>
                        <TableCell>
                          <div className="text-sm">{u.email}</div>
                          <div className="text-xs text-muted-foreground">{u.phone}</div>
                        </TableCell>
                        <TableCell>{u.teamName}</TableCell>
                        <TableCell><Badge variant="outline">{u.onboarded ? 'Onboarded' : 'Pending'}</Badge></TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            variant="secondary" 
                            className="h-8 text-xs font-bold gap-1"
                            onClick={() => {
                              setSelectedVendorProfile(u);
                              setProfileImage(u.imageUrl || null);
                              setShowVendorModal(true);
                            }}
                          >
                            <UserCheck className="w-3 h-3" /> Convert to Vendor
                          </Button>
                        </TableCell>
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
                <h1 className="text-3xl font-headline font-bold">MechMaster Registry</h1>
                <Button onClick={() => { setSelectedVendorProfile(null); setProfileImage(null); setShowVendorModal(true); }} className="gap-2">
                  <Plus className="w-4 h-4" /> Register New MechMaster
                </Button>
              </div>
              
              <Card className="bg-card border-white/5">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead>Logo</TableHead>
                      <TableHead>Vendor & Rating</TableHead>
                      <TableHead>Capabilities</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Verification</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendors?.map((v) => (
                      <TableRow key={v.id} className="border-b border-white/5">
                        <TableCell>
                          <div className="relative w-10 h-10 rounded overflow-hidden bg-muted">
                            {v.imageUrl ? (
                              <Image src={v.imageUrl} alt={v.fullName} fill className="object-cover" />
                            ) : (
                              <div className="flex items-center justify-center w-full h-full text-muted-foreground"><ImageIcon size={16} /></div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-bold flex items-center gap-2">
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
                              <Badge key={i} variant="outline" className="text-[9px] bg-primary/5">{s}</Badge>
                            )) || <span className="text-[10px] italic opacity-50">None listed</span>}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs">
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
                          <Badge variant={v.isActive ? 'default' : 'secondary'} className="text-[10px]">
                            {v.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { 
                              setSelectedVendorProfile(v); 
                              setProfileImage(v.imageUrl || null);
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
          <Card className="w-full max-w-2xl bg-card border-white/10 shadow-2xl p-6 my-8">
            <h2 className="text-2xl font-headline font-bold mb-6">{selectedVendorProfile ? 'Edit Vendor Profile' : 'Register New MechMaster'}</h2>
            <form onSubmit={handleSaveVendor} className="space-y-6">
              <div className="space-y-4">
                <Label>Company Logo / Profile Image</Label>
                <div className="flex items-center gap-6">
                  <div className="relative w-24 h-24 rounded-lg border border-dashed border-white/20 flex items-center justify-center overflow-hidden bg-background group">
                    {profileImage ? (
                      <>
                        <Image src={profileImage} alt="Preview" fill className="object-cover" />
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
                      <ImageIcon className="w-8 h-8 text-muted-foreground opacity-30" />
                    )}
                  </div>
                  <div className="space-y-2">
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
                      className="gap-2 h-10 border-white/10"
                    >
                      <Upload size={16} /> Select Image
                    </Button>
                    <p className="text-[10px] text-muted-foreground">Recommended: Square aspect ratio, max 2MB.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input name="fullName" defaultValue={selectedVendorProfile?.fullName} required placeholder="Contact Person Name" />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input name="email" type="email" defaultValue={selectedVendorProfile?.email} required placeholder="vendor@example.com" />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input name="phone" defaultValue={selectedVendorProfile?.phone} placeholder="+91..." />
                </div>
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input name="teamName" defaultValue={selectedVendorProfile?.teamName} placeholder="Official Business Name" />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input name="location" defaultValue={selectedVendorProfile?.location} placeholder="City, State, Country" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Exp. Years</Label>
                    <Input name="experienceYears" type="number" defaultValue={selectedVendorProfile?.experienceYears || 0} />
                  </div>
                  <div className="space-y-2">
                    <Label>Initial Rating</Label>
                    <Input name="rating" type="number" step="0.1" max="5" defaultValue={selectedVendorProfile?.rating || 4.5} />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Work Specializations</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {SPECIALIZATIONS.map(s => (
                    <div key={s} className="flex items-center gap-2 bg-background p-2 rounded border border-white/5">
                      <Checkbox id={`spec_${s}`} name={`spec_${s}`} defaultChecked={selectedVendorProfile?.specializations?.includes(s)} />
                      <label htmlFor={`spec_${s}`} className="text-[10px] font-bold cursor-pointer">{s}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Portfolio / Description</Label>
                <Textarea name="portfolio" defaultValue={selectedVendorProfile?.portfolio} placeholder="Describe past projects or capabilities..." className="h-20" />
              </div>

              <div className="space-y-2">
                <Label>Admin Notes (Internal)</Label>
                <Textarea name="adminNotes" defaultValue={selectedVendorProfile?.adminNotes} placeholder="Internal verification details..." className="h-20" />
              </div>

              <div className="flex items-center gap-8 pt-2">
                <div className="flex items-center gap-2">
                  <Checkbox id="isActive" name="isActive" defaultChecked={selectedVendorProfile ? selectedVendorProfile.isActive : true} />
                  <Label htmlFor="isActive" className="text-sm font-bold">Active in Marketplace</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="isVerified" name="isVerified" defaultChecked={selectedVendorProfile?.isVerified} />
                  <Label htmlFor="isVerified" className="text-sm font-bold">Verified Status</Label>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/5">
                <Button type="submit" className="flex-1 font-bold h-12" disabled={isSubmittingVendor}>
                  {isSubmittingVendor ? <Loader2 className="animate-spin" /> : (selectedVendorProfile ? 'Update Profile' : 'Create MechMaster Account')}
                </Button>
                <Button variant="outline" type="button" className="flex-1 h-12 border-white/10" onClick={() => { setShowVendorModal(false); setSelectedVendorProfile(null); setProfileImage(null); }}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {showQuoteModal && selectedRfq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <Card className="w-full max-w-lg bg-card border-white/10 shadow-2xl p-6">
            <h2 className="text-xl font-headline font-bold mb-4">Create Initial Quote</h2>
            <form onSubmit={handleSendQuotation} className="space-y-4">
              <div className="space-y-2">
                <Label>Assign MechMaster</Label>
                <Select name="vendorId" required>
                  <SelectTrigger className="bg-background border-white/10">
                    <SelectValue placeholder="Select a vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendors?.filter(v => v.isActive).map(v => (
                      <SelectItem key={v.id} value={v.id}>{v.fullName} ({v.email})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-muted-foreground">User requested: {selectedRfq.selectedVendors?.join(', ')}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Price (INR)</Label><Input name="price" type="number" required /></div>
                <div className="space-y-2"><Label>Lead Time (Days)</Label><Input name="leadTime" type="number" required /></div>
              </div>
              <div className="space-y-2"><Label>Notes</Label><textarea name="notes" className="w-full bg-background border border-white/10 rounded-md p-3 min-h-[100px]" /></div>
              <div className="flex gap-3">
                <Button type="submit" className="flex-1" disabled={isSubmittingQuote}>{isSubmittingQuote ? <Loader2 className="animate-spin" /> : 'Confirm & Send Quote'}</Button>
                <Button variant="outline" className="flex-1" onClick={() => setShowQuoteModal(false)}>Cancel</Button>
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
                <h2 className="text-2xl font-headline font-bold">{selectedRfq.projectName}</h2>
                <p className="text-muted-foreground">Detailed project specifications & bid management</p>
              </div>
              <Badge className="text-lg px-4 py-1">{selectedRfq.status.replace('_', ' ')}</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
              <div className="space-y-6">
                <div><h3 className="font-bold text-secondary mb-2 uppercase tracking-widest text-[10px]">Technical Requirements</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-muted-foreground">Process:</span><span>{selectedRfq.manufacturingProcess}</span></div>
                    <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-muted-foreground">Material:</span><span>{selectedRfq.material}</span></div>
                    <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-muted-foreground">Tolerance:</span><span>{selectedRfq.tolerance}</span></div>
                    <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-muted-foreground">Finish:</span><span>{selectedRfq.surfaceFinish || 'Standard'}</span></div>
                  </div>
                </div>
                <div><h3 className="font-bold text-secondary mb-2 uppercase tracking-widest text-[10px]">Technical Documents</h3>
                  {selectedRfq.designFileUrl ? (
                    <div className="p-3 bg-background border border-white/5 rounded-lg flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-primary" />
                        <div className="overflow-hidden max-w-[150px]">
                          <p className="font-bold truncate">{selectedRfq.designFileName || 'Design_File'}</p>
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
                    <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-muted-foreground">Quantity:</span><span>{selectedRfq.quantity} units</span></div>
                    <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-muted-foreground">Delivery:</span><span>{new Date(selectedRfq.deliveryDate).toLocaleDateString()}</span></div>
                    <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-muted-foreground">Location:</span><span>{selectedRfq.deliveryLocation}</span></div>
                    <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-muted-foreground">Budget:</span><span>{selectedRfq.budgetRange || 'Unspecified'}</span></div>
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
                                  <p className="font-bold capitalize mb-1">{lastNeg.party} Proposal:</p>
                                  <p>₹{lastNeg.price} • {lastNeg.leadTime} Days</p>
                                  {lastNeg.message && <p className="italic text-muted-foreground mt-1">"{lastNeg.message}"</p>}
                                </div>
                              </div>
                            )}
                            
                            <div className="flex gap-2 pt-2">
                              <Button variant="outline" size="sm" className="h-7 text-xs flex-1 border-white/10" onClick={() => {
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
                    <div className="p-8 text-center bg-background/50 rounded-xl border border-dashed border-white/5">
                      <Clock className="w-8 h-8 mx-auto text-muted-foreground opacity-30 mb-2" />
                      <p className="text-xs text-muted-foreground italic">No bids submitted for this RFQ yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end gap-3">
              <Button onClick={() => setShowDetailsModal(false)}>Close Specifications</Button>
            </div>
          </Card>
        </div>
      )}

      {isRevising && revisingQuote && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/90 backdrop-blur-md">
          <Card className="w-max-w-md bg-card border-white/10 p-6 shadow-2xl">
            <h2 className="text-xl font-headline font-bold mb-4">Admin Intervention: Revise Quotation</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Revised Price (₹)</Label>
                  <Input value={revPrice} onChange={(e) => setRevPrice(e.target.value)} type="number" className="bg-background" />
                </div>
                <div className="space-y-2">
                  <Label>Revised Lead Time (Days)</Label>
                  <Input value={revLeadTime} onChange={(e) => setRevLeadTime(e.target.value)} type="number" className="bg-background" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Admin Instructions / Message to Vendor</Label>
                <Textarea 
                  value={revMessage} 
                  onChange={(e) => setRevMessage(e.target.value)} 
                  placeholder="Explain the changes to the vendor..." 
                  className="bg-background h-24"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button className="flex-1 font-bold" onClick={handleAdminReviseQuote}>Update & Issue Terms</Button>
                <Button variant="outline" className="flex-1 border-white/10" onClick={() => setIsRevising(false)}>Cancel</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}