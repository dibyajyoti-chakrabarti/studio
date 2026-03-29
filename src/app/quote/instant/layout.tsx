import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Instant Quote — MechHub',
  description:
    'Upload your DXF or STEP file and get an instant manufacturing quote with live pricing, DFM feedback, and tier discounts.',
};

export default function InstantQuoteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
