
'use client';

import { useState, useEffect } from 'react';
import { LandingNav } from '@/components/LandingNav';
import { RotatingGears } from '@/components/Gears';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  Lock
} from 'lucide-react';
import Link from 'next/link';
import { MOCK_VENDORS } from './lib/mock-data';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const logo = PlaceHolderImages.find((img) => img.id === 'mechhub-logo');

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <LandingNav />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-40 overflow-hidden">
        <div className="blueprint-grid opacity-20" />
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

      {/* Services Section */}
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

      {/* How It Works */}
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

      {/* MechMasters Scrolling */}
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
            {MOCK_VENDORS.map((vendor) => (
              <div key={vendor.id} className="min-w-[320px] md:min-w-[400px] snap-center">
                <Card className="overflow-hidden border-white/5 bg-card hover:bg-card/80 transition-colors">
                  <div className="relative h-48 w-full">
                    <Image 
                      src={vendor.image} 
                      alt={vendor.name} 
                      fill 
                      className="object-cover grayscale hover:grayscale-0 transition-all duration-500" 
                      data-ai-hint="industrial factory"
                    />
                    <div className="absolute top-4 right-4 bg-background/80 backdrop-blur px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      {vendor.rating}
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-headline text-xl font-bold mb-2">{vendor.name}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                      <MapPin className="w-4 h-4" />
                      {vendor.location}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {vendor.services.map((s, i) => (
                        <Badge key={i} variant="secondary" className="bg-primary/10 text-[10px] text-white uppercase tracking-wider">
                          {s}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{vendor.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Join MechHub Section */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="blueprint-grid opacity-5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-secondary/20 text-secondary border-none">For Manufacturers</Badge>
            <h2 className="font-headline text-3xl md:text-5xl font-bold mb-4">Why Join MechHub?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Empowering local MechMasters with global opportunities and streamlined operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-20">
            {[
              {
                title: 'More Orders',
                desc: 'Receive RFQs from serious engineering teams and startups.',
                icon: TrendingUp
              },
              {
                title: 'No Marketing Cost',
                desc: 'We bring the customers to you, saving your outreach budget.',
                icon: ShieldCheck
              },
              {
                title: 'No Monthly Fees',
                desc: 'Only a small commission on confirmed and completed orders.',
                icon: CircleDollarSign
              },
              {
                title: 'Faster Payments',
                desc: 'Structured payment process designed to avoid traditional delays.',
                icon: FastForward
              },
              {
                title: 'No Middlemen',
                desc: 'Enjoy direct communication and maintain transparent pricing.',
                icon: Users2
              }
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

      {/* Bulk Enquiry */}
      <section className="py-24 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-card rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="grid md:grid-cols-2">
              <div className="p-10 bg-primary/5 flex flex-col justify-center">
                <h2 className="font-headline text-3xl font-bold mb-6">Bulk Custom Parts Enquiry</h2>
                <p className="text-muted-foreground mb-8">
                  Looking for large scale manufacturing or regular supply? Our dedicated team will handle your bulk requirements with exclusive pricing.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary font-bold">✓</div>
                    Volume discounts up to 30%
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary font-bold">✓</div>
                    Priority manufacturing slots
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary font-bold">✓</div>
                    Dedicated account manager
                  </div>
                </div>
              </div>
              <div className="p-10 bg-card">
                <form className="space-y-4">
                  <Input placeholder="Company Name" className="bg-background border-white/10" suppressHydrationWarning />
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="Phone" className="bg-background border-white/10" suppressHydrationWarning />
                    <Input placeholder="Email" className="bg-background border-white/10" suppressHydrationWarning />
                  </div>
                  <Textarea placeholder="Tell us about your project..." className="bg-background border-white/10 min-h-[100px]" suppressHydrationWarning />
                  <div className="border-2 border-dashed border-white/10 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="mx-auto mb-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Upload drawing (PDF/STEP)</span>
                  </div>
                  <Button className="w-full h-12 text-lg" suppressHydrationWarning>Send Enquiry</Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-background border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-12">
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-6">
                <div className="relative w-8 h-8 overflow-hidden rounded">
                  {logo?.imageUrl && (
                    <Image
                      src={logo.imageUrl}
                      alt="MechHub Logo"
                      width={32}
                      height={32}
                      className="object-cover"
                      data-ai-hint={logo?.imageHint}
                      suppressHydrationWarning
                    />
                  )}
                </div>
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
