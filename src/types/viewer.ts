/**
 * CAD Viewer Types
 * 
 * Defines the contract between the frontend and the 
 * CAD conversion microservices (Python/CadQuery).
 */

export interface BoundingBox {
  x: number;
  y: number;
  z: number;
}

export interface HoleFeature {
  center: { x: number; y: number; z: number };
  radius: number;
  depth: number;
  normal: { x: number; y: number; z: number };
}

export interface BendFeature {
  start: { x: number; y: number; z: number };
  end: { x: number; y: number; z: number };
  angle: number;
  direction: 'UP' | 'DOWN';
  radius: number;
}

export interface ConversionResult {
  /** Base64-encoded binary STL data */
  stl: string;
  /** Number of facets in the generated mesh */
  triangleCount: number;
  /** Dimensions of the part in millimeters */
  boundingBox: BoundingBox;
  /** List of detected circular holes */
  holes?: HoleFeature[];
  /** List of detected sheet metal bends */
  bends?: BendFeature[];
}
