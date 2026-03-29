export type Vendor = {
  id: string;
  name: string;
  rating: number;
  services: string[];
  location: string;
  description: string;
  active: boolean;
  image: string;
};

export const MOCK_VENDORS: Vendor[] = [
  {
    id: 'v1',
    name: 'Precision MechMasters Pune',
    rating: 4.8,
    services: ['CNC Milling/Turning', 'Laser Cutting'],
    location: 'Pune, Maharashtra',
    description: 'Specialists in high-precision aerospace components with ISO 9001 certification.',
    active: true,
    image: 'https://picsum.photos/seed/pune-mech/400/300',
  },
  {
    id: 'v2',
    name: 'Bharat Fabrication & Works',
    rating: 4.5,
    services: ['Welding & Fabrication', 'Sheet Metal'],
    location: 'Chennai, Tamil Nadu',
    description:
      'Expert sheet metal works and heavy industrial fabrication for automotive sectors.',
    active: true,
    image: 'https://picsum.photos/seed/bharat-fab/400/300',
  },
  {
    id: 'v3',
    name: 'Innovation Prototypes Delhi',
    rating: 4.9,
    services: ['Prototype Manufacturing', '3D Printing'],
    location: 'Gurugram, Haryana',
    description:
      'Fast-track prototyping for startups and R&D divisions using multi-material options.',
    active: true,
    image: 'https://picsum.photos/seed/delhi-proto/400/300',
  },
  {
    id: 'v4',
    name: 'Royal Machining Hub',
    rating: 4.2,
    services: ['CNC Milling/Turning', 'Small Batch Production'],
    location: 'Bengaluru, Karnataka',
    description:
      'Quality small batch manufacturing with rapid turnaround times for engineering tools.',
    active: true,
    image: 'https://picsum.photos/seed/royal-hub/400/300',
  },
  {
    id: 'v5',
    name: 'Gujarat Laser Tech',
    rating: 4.7,
    services: ['Laser Cutting', 'Sheet Metal'],
    location: 'Ahmedabad, Gujarat',
    description: 'High-speed fiber laser cutting for complex architectural and industrial parts.',
    active: true,
    image: 'https://picsum.photos/seed/gj-laser/400/300',
  },
  {
    id: 'v6',
    name: 'Elite Mechanical Solutions',
    rating: 4.6,
    services: ['CNC Milling/Turning', 'Welding & Fabrication'],
    location: 'Hyderabad, Telangana',
    description: 'End-to-end mechanical solutions from design review to final surface treatment.',
    active: true,
    image: 'https://picsum.photos/seed/elite-mech/400/300',
  },
];

export const MANUFACTURING_PROCESSES = [
  'CNC Milling/Turning',
  'Laser Cutting',
  'Welding & Fabrication',
  'Sheet Metal',
  'Prototype Manufacturing',
  'Small Batch Production',
  '3D Printing',
];

export const MATERIALS = [
  'MS (Mild Steel)',
  'SS 304',
  'SS 316',
  'Aluminium 6061',
  'Aluminium 5052',
  'Copper',
  'Brass',
  'EN8 Steel',
  'EN24 Steel',
];

export const FINISHES = [
  'Raw / As Machined',
  'Powder Coating',
  'Anodizing',
  'Zinc Plating',
  'Chrome Plating',
  'Nickel Plating',
  'Sand Blasting',
  'Mirror Polish',
  'Black Oxide',
];

export const TOLERANCES = [
  'Standard ±0.5mm',
  'Medium ±0.2mm',
  'Fine ±0.1mm',
  'Precision ±0.05mm',
  'Ultra ±0.02mm',
];
