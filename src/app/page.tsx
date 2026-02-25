
'use client';

import { useState, useEffect } from 'react';
import { LandingNav } from '@/components/LandingNav';
import { RotatingGears } from '@/components/Gears';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Logo } from '@/components/Logo';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Settings, 
  Zap, 
  Flame, 
  Layers, 
  Cpu, 
  Boxes, 
  ArrowRight,
  Upload,
  Search,
  CheckCircle2,
  Star,
  MapPin,
  TrendingUp,
  ShieldCheck,
  CircleDollarSign,
  FastForward,
  Users2,
  Lock,
  LayoutDashboard,
  ClipboardCheck,
  MessageSquare,
  Loader2,
  Check,
  Factory
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useFirestore, setDocumentNonBlocking, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection, query, where, limit } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const db = useFirestore();

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  // Fetch a subset of active vendors for the landing page showcase
  const landingVendorsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(
      collection(db, 'users'),
      where('role', '==', 'vendor'),
      where('isActive', '==', true),
      limit(6)
    );
  }, [db]);
  const { data: landingVendors } = useCollection(landingVendorsQuery);

  async function handleConsultationSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!db) return;

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const id = Math.random().toString(36).substring(2, 11);
    
    const requestData = {
      id,
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
      consultationOptions: [],
      requestDate: new Date().toISOString(),
    };

    const docRef = doc(db, 'consultationRequests', id);
    
    try {
      setDocumentNonBlocking(docRef, requestData, { merge: true });
      setIsSubmitted(true);
      setIsSubmitting(false);
      setTimeout(() => {
        setDialogOpen(false);
        setIsSubmitted(false);
      }, 2000);
    } catch (err) {
      setIsSubmitting(false);
      toast({
        title: "Submission failed",
        description: "Something went wrong while sending your request.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden" suppressHydrationWarning>
      <LandingNav />
      
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-40 overflow-hidden">
        <div className="blueprint-grid opacity-20" suppressHydrationWarning />
        <RotatingGears />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <Badge variant="outline" className="mb-4 border-secondary/50 text-secondary bg-secondary/5">
              Revolutionizing Industrial Manufacturing
            </Badge>
            <h1 className="font-headline text-5xl md:text-7xl font-bold leading-tight mb-6">
              From CAD to Reality – <span className="text-secondary">Faster.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-xl leading-relaxed">
              Upload your design and get matched with trusted MechMasters near you. Precision manufacturing at your fingertips.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/upload">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white h-14 px-10 text-lg group" suppressHydrationWarning>
                  Upload Your Design
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-white/20 hover:bg-white/5" suppressHydrationWarning>
                Become a MechMaster
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-24 bg-card/30 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">What We Offer</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our network of MechMasters covers a wide range of industrial processes to meet your specific requirements.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'CNC Machining', icon: Settings, desc: 'High precision multi-axis milling and turning.' },
              { title: 'Laser Cutting', icon: Zap, desc: 'Sharp edges and complex patterns on various metals.' },
              { title: 'Welding & Fabrication', icon: Flame, desc: 'Durable assembly of industrial components.' },
              { title: 'Sheet Metal', icon: Layers, desc: 'Expert bending, punching, and forming solutions.' },
              { title: 'Prototype Manufacturing', icon: Cpu, desc: 'Quick-turn prototypes to validate your designs.' },
              { title: 'Small Batch Production', icon: Boxes, desc: 'Cost-effective manufacturing for limited runs.' },
            ].map((service, idx) => (
              <Card key={idx} className="bg-card hover:bg-card/80 border-white/5 transition-all duration-300 group hover:-translate-y-2">
                <CardContent className="p-8">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <service.icon className="text-secondary w-6 h-6" />
                  </div>
                  <h3 className="font-headline text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{service.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-px border-t border-dashed border-white/20 -z-10" />
            
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-background border-2 border-primary flex items-center justify-center mx-auto mb-6 text-2xl font-bold">1</div>
              <h3 className="font-headline text-xl font-bold mb-3">Upload Design</h3>
              <p className="text-muted-foreground">Upload your STEP, STL, or PDF drawings securely.</p>
              <Upload className="mx-auto mt-6 text-secondary opacity-50" />
            </div>

            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-background border-2 border-primary flex items-center justify-center mx-auto mb-6 text-2xl font-bold">2</div>
              <h3 className="font-headline text-xl font-bold mb-3">Get Matched</h3>
              <p className="text-muted-foreground">We connect you with the best-suited MechMasters.</p>
              <Search className="mx-auto mt-6 text-secondary opacity-50" />
            </div>

            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-background border-2 border-primary flex items-center justify-center mx-auto mb-6 text-2xl font-bold">3</div>
              <h3 className="font-headline text-xl font-bold mb-3">Track Production</h3>
              <p className="text-muted-foreground">Monitor progress from dashboard to delivery.</p>
              <CheckCircle2 className="mx-auto mt-6 text-secondary opacity-50" />
            </div>
          </div>
        </div>
      </section>

      <section id="vendors" className="py-24 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">Meet Our MechMasters</h2>
              <p className="text-muted-foreground">Trusted partners across India providing world-class manufacturing.</p>
            </div>
            <Link href="/upload" className="text-secondary hover:underline hidden sm:block">View All MechMasters →</Link>
          </div>
          
          <div className="flex gap-6 overflow-x-auto pb-8 snap-x no-scrollbar">
            {landingVendors?.length ? landingVendors.map((vendor) => (
              <div key={vendor.id} className="min-w-[320px] md:min-w-[400px] snap-center">
                <Card className="overflow-hidden border-white/5 bg-card hover:bg-card/80 transition-colors">
                  <div className="relative h-48 w-full bg-muted/20">
                    {vendor.imageUrl ? (
                      <Image 
                        src={vendor.imageUrl} 
                        alt={vendor.fullName} 
                        fill 
                        className="object-cover grayscale hover:grayscale-0 transition-all duration-500" 
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-muted-foreground/20"><Factory size={64} /></div>
                    )}
                    <div className="absolute top-4 right-4 bg-background/80 backdrop-blur px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      {vendor.rating}
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-headline text-xl font-bold truncate pr-2">{vendor.fullName}</h3>
                      {vendor.isVerified && <ShieldCheck className="w-4 h-4 text-secondary shrink-0" />}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                      <MapPin className="w-4 h-4" />
                      {vendor.location || vendor.teamName || 'Manufacturing Hub'}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(vendor.specializations || ['CNC Machining', 'Fabrication']).map((s: string, i: number) => (
                        <Badge key={i} variant="secondary" className="bg-primary/10 text-[10px] text-white uppercase tracking-wider">
                          {s}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {vendor.portfolio || 'Verified high-precision manufacturing facility within our trusted network.'}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )) : (
              <div className="py-12 text-center w-full opacity-50">Discovering verified production partners...</div>
            )}
          </div>
        </div>
      </section>

      <section className="py-24 bg-background relative overflow-hidden">
        <div className="blueprint-grid opacity-5" suppressHydrationWarning />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-headline text-3xl md:text-5xl font-bold mb-6">Why Join MechHub?</h2>
            
            <Tabs defaultValue="innovators" className="w-full">
              <div className="flex justify-center mb-16">
                <TabsList className="bg-card border border-white/10 p-1 h-12">
                  <TabsTrigger value="innovators" className="px-8 font-bold data-[state=active]:bg-primary">For Innovators</TabsTrigger>
                  <TabsTrigger value="manufacturers" className="px-8 font-bold data-[state=active]:bg-primary">For Manufacturers</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="innovators">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-20">
                  {[
                    { title: 'Faster Quotation', desc: 'No more chasing vendors on WhatsApp. Get quotes in record time.', icon: Zap },
                    { title: 'Verified Vendors', desc: 'Every MechMaster is screened for capability, quality, and delivery consistency.', icon: ShieldCheck },
                    { title: 'Structured Pricing', desc: 'Clear cost breakdown with no hidden surprises. Compare options easily.', icon: CircleDollarSign },
                    { title: 'Quality Layer', desc: 'Production updates, QC checklists, and part inspection images before delivery.', icon: ClipboardCheck },
                    { title: 'End-to-End Tracking', desc: 'From upload to delivery, manage everything in one integrated dashboard.', icon: LayoutDashboard }
                  ].map((benefit, i) => (
                    <div key={i} className="flex flex-col items-center text-center p-6 rounded-xl border border-white/5 bg-card/50 hover:bg-card transition-colors">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                        <benefit.icon className="text-secondary w-7 h-7" />
                      </div>
                      <h3 className="font-headline font-bold text-lg mb-2">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{benefit.desc}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="manufacturers">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-20">
                  {[
                    { title: 'More Orders', desc: 'Receive RFQs from serious engineering teams and startups.', icon: TrendingUp },
                    { title: 'No Marketing Cost', desc: 'We bring the customers to you, saving your outreach budget.', icon: ShieldCheck },
                    { title: 'No Monthly Fees', desc: 'Only a small commission on confirmed and completed orders.', icon: CircleDollarSign },
                    { title: 'Faster Payments', desc: 'Structured payment process designed to avoid traditional delays.', icon: FastForward },
                    { title: 'No Middlemen', desc: 'Enjoy direct communication and maintain transparent pricing.', icon: Users2 }
                  ].map((benefit, i) => (
                    <div key={i} className="flex flex-col items-center text-center p-6 rounded-xl border border-white/5 bg-card/50 hover:bg-card transition-colors">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                        <benefit.icon className="text-secondary w-7 h-7" />
                      </div>
                      <h3 className="font-headline font-bold text-lg mb-2">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{benefit.desc}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="max-w-3xl mx-auto bg-primary/5 border border-primary/10 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
              <Lock className="text-secondary w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                We protect your IP
                <ShieldCheck className="w-5 h-5 text-secondary" />
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Innovation is your greatest asset. We sign a strictly binding NDA with all our MechMasters to ensure your designs and intellectual property are fully protected at every stage.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white text-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto border-l-4 border-primary pl-8 md:pl-16 py-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">Need Expert Manufacturing Guidance?</h2>
                <p className="text-lg text-muted-foreground mb-10">
                  Get your design reviewed, optimized, or fully engineered by our experts.
                </p>
                <div className="grid grid-cols-2 gap-6 mb-10">
                  {["Design Optimization", "Cost Reduction Suggestions", "DFM Analysis", "Complete Design Support"].map((option, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm font-medium">{option}</span>
                    </div>
                  ))}
                </div>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="h-14 px-10 text-lg bg-primary hover:bg-primary/90 text-white" suppressHydrationWarning>
                      Book Consultation
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] bg-card text-foreground">
                    <DialogHeader>
                      <DialogTitle className="font-headline text-2xl">Expert Consultation</DialogTitle>
                      <DialogDescription>
                        Share your project details and our experts will get back to you.
                      </DialogDescription>
                    </DialogHeader>
                    {isSubmitted ? (
                      <div className="py-12 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                          <Check className="w-8 h-8 text-green-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Request Sent!</h3>
                        <p className="text-muted-foreground">Our experts will contact you shortly.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleConsultationSubmit} className="space-y-4 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium">Name</label>
                            <Input id="name" name="name" required className="bg-background" suppressHydrationWarning />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                            <Input id="phone" name="phone" required className="bg-background" suppressHydrationWarning />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium">Email</label>
                          <Input id="email" name="email" type="email" required className="bg-background" suppressHydrationWarning />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="message" className="text-sm font-medium">Message</label>
                          <Textarea id="message" name="message" required className="bg-background min-h-[100px]" suppressHydrationWarning />
                        </div>
                        <div className="border-2 border-dashed border-white/10 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                          <Upload className="mx-auto mb-2 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Upload design (optional)</span>
                        </div>
                        <Button type="submit" className="w-full h-12" disabled={isSubmitting} suppressHydrationWarning>
                          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Request"}
                        </Button>
                      </form>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
              <div className="hidden md:block relative h-[400px]">
                <Image 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800"
                  alt="Engineering Consultation"
                  fill
                  className="object-cover rounded-2xl grayscale"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 bg-background border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-12">
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-6">
                <Logo size={40} />
                <span className="font-headline font-bold text-xl tracking-tight">MechHub</span>
              </Link>
              <p className="text-muted-foreground text-sm max-w-sm">
                The hub for custom mechanical parts. Bridging the gap between engineering design and quality manufacturing.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-widest text-secondary">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Career</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-widest text-secondary">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Refund Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-widest text-secondary">For Vendors</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-white transition-colors">Onboarding</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Seller Portal</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <div>© {currentYear || ''} MechHub. All rights reserved.</div>
            <div className="font-bold text-white/50">A Unit of Synchubb Innovations Pvt Ltd</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
