import { LandingNav } from '@/components/LandingNav';
import { MaterialsSection } from '@/components/MaterialsSection';
import { Footer } from '@/components/Footer';

export default function MaterialsPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNav />
      <MaterialsSection />
      <Footer />
    </div>
  );
}
