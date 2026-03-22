import { ManufacturingService } from '@/types/project';

export interface MaterialOption {
  id: string;
  name: string;
  grade: string;
  category: string;
  thicknesses?: number[];
  canBend?: boolean;
  canPowderCoat?: boolean;
  canAnodize?: boolean;
  maxThicknessForBending?: number;
}

export const MATERIAL_CATALOG: Record<ManufacturingService, { categories: { name: string; materials: MaterialOption[] }[] }> = {
  'cnc_machining': {
    categories: [
      {
        name: 'Metals',
        materials: [
          { id: 'al-5052', name: 'Aluminium', grade: '5052', category: 'Metals', thicknesses: [1, 1.6, 2, 2.3, 2.5, 3.2, 4.7, 6.3, 8, 9.5], canPowderCoat: true, canBend: true, maxThicknessForBending: 5 },
          { id: 'al-6061', name: 'Aluminium', grade: '6061', category: 'Metals', thicknesses: [1, 1.6, 2, 2.5, 3.2, 4.7, 6.3, 8, 9.5], canPowderCoat: true, canAnodize: true, canBend: false },
          { id: 'ms-crca', name: 'CRCA Mild Steel', grade: 'Standard', category: 'Metals', thicknesses: [0.8, 1.2, 1.5, 1.9, 2.6, 3, 3.4, 4.8, 6.3, 8, 9.5], canPowderCoat: true, canBend: true, maxThicknessForBending: 5 },
          { id: 'ss-304', name: 'Stainless Steel', grade: '304', category: 'Metals', thicknesses: [0.8, 1.2, 1.5, 1.9, 2.5, 3.2, 4.7, 6.3, 9.5], canPowderCoat: true, canBend: true, maxThicknessForBending: 5 },
        ],
      },
      {
        name: 'Plastics & Composites',
        materials: [
          { id: 'cf-plate', name: 'Carbon Fiber Plate', grade: '3K Twill', category: 'Composites', thicknesses: [1, 1.6, 2, 3, 4, 5], canBend: false, canPowderCoat: false },
          { id: 'acrylic', name: 'Acrylic', grade: 'Cast/Extruded', category: 'Plastics', thicknesses: [1.6, 3, 4.5, 5.4, 9.5, 12.7], canBend: false, canPowderCoat: false },
        ]
      }
    ],
  },
  'sheet_metal_cutting': {
    categories: [
      {
        name: 'Metals',
        materials: [
          { id: 'al-5052-sm', name: 'Aluminium', grade: '5052', category: 'Metals', thicknesses: [1, 1.6, 2, 2.3, 2.5, 3.2, 4.7, 6.3, 8, 9.5], canPowderCoat: true, canBend: true, maxThicknessForBending: 5 },
          { id: 'al-6061-sm', name: 'Aluminium', grade: '6061', category: 'Metals', thicknesses: [1, 1.6, 2, 2.5, 3.2, 4.7, 6.3, 8, 9.5], canPowderCoat: true, canAnodize: true, canBend: false },
          { id: 'ms-crca-sm', name: 'CRCA Mild Steel', grade: 'Standard', category: 'Metals', thicknesses: [0.8, 1.2, 1.5, 1.9, 2.6, 3, 3.4, 4.8, 6.3, 8, 9.5], canPowderCoat: true, canBend: true, maxThicknessForBending: 5 },
          { id: 'ss-304-sm', name: 'Stainless Steel', grade: '304', category: 'Metals', thicknesses: [0.8, 1.2, 1.5, 1.9, 2.5, 3.2, 4.7, 6.3, 9.5], canPowderCoat: true, canBend: true, maxThicknessForBending: 5 },
        ],
      },
      {
        name: 'Wood & Others',
        materials: [
          { id: 'mdf', name: 'MDF', grade: 'Standard', category: 'Woods', thicknesses: [3.2, 6.3, 9.5, 12.7], canBend: false, canPowderCoat: false },
          { id: 'plywood', name: 'Plywood', grade: 'Standard', category: 'Woods', thicknesses: [3.2, 6.3, 9, 12], canBend: false, canPowderCoat: false },
          { id: 'balsa', name: 'Balsa Wood', grade: 'Standard', category: 'Woods', thicknesses: [1, 3, 5], canBend: false, canPowderCoat: false },
        ]
      }
    ],
  },
  '3d_printing': {
    categories: [
      {
        name: 'Filaments (FDM)',
        materials: [
          { id: 'fdm-pla', name: 'PLA', grade: 'Standard', category: 'FDM' },
          { id: 'fdm-tpu', name: 'TPU', grade: 'Flexible', category: 'FDM' },
          { id: 'fdm-abs', name: 'ABS', grade: 'Engineering', category: 'FDM' },
          { id: 'fdm-petg', name: 'PETG', grade: 'Standard', category: 'FDM' },
          { id: 'fdm-asa', name: 'ASA', grade: 'Weather Resistant', category: 'FDM' },
        ],
      },
    ],
  },
  'cnc_turning': { categories: [] },
  'wire_edm': { categories: [] },
};
