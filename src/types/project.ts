// ═══════════════════════════════════════════════════
// Project RFQ Types for Manufacturing Workflow
// ═══════════════════════════════════════════════════

/** Main manufacturing service types */
export type ManufacturingService =
  | 'cnc_machining'
  | 'sheet_metal_cutting'
  | '3d_printing'
  | 'wire_edm'
  | 'cnc_turning';

/** Secondary manufacturing processes */
export type SecondaryProcess =
  | 'powder_coating'
  | 'bending'
  | 'anodizing'
  | 'zinc_plating'
  | 'chrome_plating'
  | 'sand_blasting'
  | 'heat_treatment'
  | 'nickel_plating';

/** Coating/Anodizing color options */
export type ColorOption =
  | 'black'
  | 'white'
  | 'red'
  | 'blue'
  | 'green'
  | 'yellow'
  | 'grey'
  | 'custom'
  | 'clear'
  | 'gold'
  | 'bronze';

/** Part status in the workflow */
export type PartStatus =
  | 'draft'
  | 'ready_for_quote';

/** Project RFQ status */
export type ProjectRFQStatus =
  | 'draft'
  | 'quote_requested'
  | 'under_review'
  | 'quotation_sent'
  | 'negotiation'
  | 'deposit_pending'
  | 'assigned'
  | 'accepted'
  | 'in_production'
  | 'completed'
  | 'shipped'
  | 'delivered'
  | 'shipping';

/** Mechanical part in a project */
export interface MechanicalPart {
  readonly id: string;
  readonly projectId: string;
  readonly userId: string;
  readonly partName?: string;
  readonly service: ManufacturingService;
  readonly cadFile: {
    readonly fileName: string;
    readonly fileUrl: string;
    readonly fileSize: number;
    readonly uploadedAt: string;
  };
  readonly material: {
    readonly id: string;
    readonly name: string;
    readonly grade?: string;
    readonly thickness?: number;
  };
  readonly secondaryProcesses: SecondaryProcess[];
  readonly coatingColor?: ColorOption;
  readonly quantity: number;
  readonly unitCost?: number;
  readonly discountTier?: string;
  readonly status: PartStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/** Negotiation message entry */
export interface NegotiationMessage {
  readonly role: 'user' | 'admin';
  readonly message: string;
  readonly timestamp: string;
  readonly proposedPrice?: number;
}

/** Project RFQ containing multiple parts */
export interface ProjectRFQ {
  readonly id: string;
  readonly userId: string;
  readonly userName: string;
  readonly userEmail: string;
  readonly projectName: string;
  readonly parts: MechanicalPart[];
  readonly status: ProjectRFQStatus;
  readonly deliveryLocation?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly quotedPrice?: number;
  readonly leadTimeDays?: number;
  readonly assignedVendorId?: string;
  readonly negotiationHistory?: NegotiationMessage[];
  readonly paymentStatus?: {
    readonly advance?: { readonly paid: boolean; readonly paidAt?: string; readonly amount?: number };
    readonly completion?: { readonly paid: boolean; readonly paidAt?: string; readonly amount?: number };
  };
  readonly finalPrice?: number;
}

/** Step in the part creation wizard */
export type PartCreationStep =
  | 'service_selection'
  | 'file_upload'
  | 'material_selection'
  | 'secondary_process'
  | 'quantity_review';

/** Service configuration for UI display */
export interface ServiceConfig {
  readonly id: ManufacturingService;
  readonly name: string;
  readonly description: string;
  readonly icon: string;
  readonly supportedMaterials: string[];
}
