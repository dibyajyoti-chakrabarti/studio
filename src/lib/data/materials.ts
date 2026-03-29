export const CATEGORIES = [
  'ALL',
  'ALUMINUM',
  'STEEL',
  'STAINLESS',
  'COMPOSITES',
  'PLASTICS',
  'WOODS',
  '3D PRINTING',
];

export const MATERIALS = [
  // ALUMINUM
  {
    name: 'Aluminium 5052',
    category: 'aluminum',
    processes: ['Sheet Cutting', 'Bending'],
    thicknesses: '1, 1.6, 2, 2.3, 2.5, 3.2, 4.7, 6.3, 8, 9.5 mm',
    notes: '>5mm not for bending, powder coating available',
    colors: { base: '#C0C7CF', alt: '#A8B0B8', hover: '#D6DBE1' },
  },
  {
    name: 'Aluminium 6061',
    category: 'aluminum',
    processes: ['Sheet Cutting', 'CNC Milling/Turning'],
    thicknesses: '1, 1.6, 2, 2.5, 3.2, 4.7, 6.3, 8, 9.5 mm',
    notes: 'not for bending, powder coating available',
    colors: { base: '#B0B7BF', alt: '#9AA3AB' },
  },

  // STEEL
  {
    name: 'CRCA Mild Steel',
    category: 'steel',
    processes: ['Sheet Cutting', 'Bending'],
    thicknesses: '0.8, 1.2, 1.5, 1.9, 2.6, 3, 3.4, 4.8, 6.3, 8, 9.5 mm',
    notes: '>5mm not for bending, powder coating available',
    colors: { base: '#6E6E6E', alt: '#4B4B4B' },
  },

  // STAINLESS STEEL
  {
    name: 'Stainless Steel 304',
    category: 'stainless',
    processes: ['Sheet Cutting', 'Bending'],
    thicknesses: '0.8, 1.2, 1.5, 1.9, 2.5, 3.2, 4.7, 6.3, 9.5 mm',
    notes: '>5mm not for bending, powder coating available',
    colors: { base: '#D9DEE3', alt: '#BFC5CC', highlight: '#8E959C' },
  },

  // COMPOSITES
  {
    name: 'Carbon Fiber Plate',
    category: 'composites',
    processes: ['Sheet Cutting'],
    thicknesses: '1, 1.6, 2, 3, 4, 5 mm',
    notes: 'not for bending, not for powder coating',
    colors: { base: '#1C1C1E', pattern: '#2A2A2D' },
  },

  // PLASTICS
  {
    name: 'Acrylic',
    category: 'plastics',
    processes: ['Sheet Cutting'],
    thicknesses: '1.6, 3, 4.5, 5.4, 9.5, 12.7 mm',
    notes: 'not for bending, not for powder coating',
    colors: { base: 'rgba(200, 220, 255, 0.25)', frosted: '#E6F0FF', edge: '#BFD7FF' },
  },

  // WOODS
  {
    name: 'MDF',
    category: 'woods',
    processes: ['Sheet Cutting', 'CNC Milling/Turning'],
    thicknesses: '3.2, 6.3, 9.5, 12.7 mm',
    notes: 'not for bending, not for powder coating',
    colors: { base: '#C49A6C', alt: '#A67C52' },
  },
  {
    name: 'Plywood',
    category: 'woods',
    processes: ['Sheet Cutting'],
    thicknesses: '3.2, 6.3, 9, 12 mm',
    notes: 'not for bending, not for powder coating',
    colors: { base: '#D2A679', alt: '#B98A5A' },
  },
  {
    name: 'Balsa Wood',
    category: 'woods',
    processes: ['Sheet Cutting'],
    thicknesses: '1, 3, 5 mm',
    notes: 'not for bending, not for powder coating',
    colors: { base: '#E6CFA8' },
  },

  // 3D PRINTING
  {
    name: 'PLA',
    category: '3d_printing',
    processes: ['3D Printing'],
    thicknesses: 'Any geometry',
    colors: { base: '#E8E8E8' },
  },
  {
    name: 'TPU',
    category: '3d_printing',
    processes: ['3D Printing'],
    thicknesses: 'Any geometry',
    colors: { base: '#2E2E2E', alt: '#3A3A3A' },
  },
  {
    name: 'ABS',
    category: '3d_printing',
    processes: ['3D Printing'],
    thicknesses: 'Any geometry',
    colors: { base: '#D6D6D6', alt: '#2F2F30' },
  },
  {
    name: 'PETG',
    category: '3d_printing',
    processes: ['3D Printing'],
    thicknesses: 'Any geometry',
    colors: { base: '#DFF3FF', translucent: 'rgba(180, 220, 255, 0.35)' },
  },
  {
    name: 'ASA',
    category: '3d_printing',
    processes: ['3D Printing'],
    thicknesses: 'Any geometry',
    colors: { base: '#C8CDD2' },
  },
];
