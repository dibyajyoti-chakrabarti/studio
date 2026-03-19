import { ManufacturingService } from '@/types/project';

export interface MaterialOption {
  id: string;
  name: string;
  grade: string;
  category: string;
  subcategory?: string;
}

export const MATERIAL_CATALOG: Record<ManufacturingService, { categories: { name: string; materials: MaterialOption[] }[] }> = {
  'cnc_machining': {
    categories: [
      {
        name: 'Metals',
        materials: [
          { id: 'al-6061', name: 'Aluminum', grade: '6061', category: 'Metals' },
          { id: 'al-7075', name: 'Aluminum', grade: '7075', category: 'Metals' },
          { id: 'ss-304', name: 'Stainless Steel', grade: '304', category: 'Metals' },
          { id: 'ss-316', name: 'Stainless Steel', grade: '316', category: 'Metals' },
          { id: 'mild-steel', name: 'Mild Steel', grade: 'Generic', category: 'Metals' },
          { id: 'brass', name: 'Brass', grade: 'C360', category: 'Metals' },
          { id: 'copper', name: 'Copper', grade: 'C101', category: 'Metals' },
        ],
      },
    ],
  },
  'laser_cutting': {
    categories: [
      {
        name: 'Metals',
        materials: [
          { id: 'lc-ms', name: 'Mild Steel (MS)', grade: 'Generic', category: 'Metals' },
          { id: 'lc-ss', name: 'Stainless Steel (SS)', grade: '304/316', category: 'Metals' },
          { id: 'lc-al', name: 'Aluminum', grade: 'Generic', category: 'Metals' },
        ],
      },
    ],
  },
  'sheet_metal_fabrication': {
    categories: [
      {
        name: 'Metals',
        materials: [
          { id: 'sm-ms', name: 'Mild Steel', grade: 'Generic', category: 'Metals' },
          { id: 'sm-ss', name: 'Stainless Steel', grade: '304', category: 'Metals' },
          { id: 'sm-al', name: 'Aluminum', grade: '6061', category: 'Metals' },
          { id: 'sm-gi', name: 'Galvanized Steel (GI)', grade: 'Generic', category: 'Metals' },
          { id: 'sm-copper', name: 'Copper', grade: 'Generic', category: 'Metals' },
        ],
      },
    ],
  },
  '3d_printing': {
    categories: [
      {
        name: 'FDM Materials',
        materials: [
          { id: 'fdm-pla', name: 'PLA', grade: 'Standard', category: 'FDM' },
          { id: 'fdm-abs', name: 'ABS', grade: 'Standard', category: 'FDM' },
          { id: 'fdm-petg', name: 'PETG', grade: 'Standard', category: 'FDM' },
          { id: 'fdm-tpu', name: 'TPU (Flexible)', grade: 'Standard', category: 'FDM' },
          { id: 'fdm-nylon', name: 'Nylon', grade: 'Standard', category: 'FDM' },
        ],
      },
      {
        name: 'SLA Materials',
        materials: [
          { id: 'sla-standard', name: 'Standard Resin', grade: 'Clear/Grey/White', category: 'SLA' },
          { id: 'sla-tough', name: 'Tough Resin', grade: 'Engineering', category: 'SLA' },
          { id: 'sla-flex', name: 'Flexible Resin', grade: 'Elastomeric', category: 'SLA' },
        ],
      },
      {
        name: 'SLS Materials',
        materials: [
          { id: 'sls-pa12', name: 'Nylon (PA12)', grade: 'Standard', category: 'SLS' },
          { id: 'sls-gfpa12', name: 'Glass-filled Nylon', grade: 'Reinforced', category: 'SLS' },
        ],
      },
    ],
  },
  'cnc_turning': {
    categories: [
      {
        name: 'Metals',
        materials: [
          { id: 'ct-al', name: 'Aluminum', grade: '6061', category: 'Metals' },
          { id: 'ct-ss', name: 'Stainless Steel', grade: '304', category: 'Metals' },
          { id: 'ct-ms', name: 'Mild Steel', grade: 'Generic', category: 'Metals' },
          { id: 'ct-brass', name: 'Brass', grade: 'Generic', category: 'Metals' },
          { id: 'ct-copper', name: 'Copper', grade: 'Generic', category: 'Metals' },
        ],
      },
    ],
  },
  'wire_edm': {
    categories: [
      {
        name: 'Metals ONLY (conductive)',
        materials: [
          { id: 'we-tool-steel', name: 'Tool Steel', grade: 'D2/O1', category: 'Metals' },
          { id: 'we-hardened-steel', name: 'Hardened Steel', grade: 'Generic', category: 'Metals' },
          { id: 'we-ss', name: 'Stainless Steel', grade: '304/316', category: 'Metals' },
          { id: 'we-al', name: 'Aluminum (limited use)', grade: 'Generic', category: 'Metals' },
        ],
      },
    ],
  },
};
