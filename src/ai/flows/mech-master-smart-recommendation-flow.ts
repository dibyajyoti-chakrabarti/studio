'use server';
/**
 * @fileOverview A Genkit flow for intelligently recommending MechMasters based on manufacturing requirements.
 *
 * - mechMasterSmartRecommendation - A function that handles the MechMaster recommendation process.
 * - MechMasterRecommendationInput - The input type for the mechMasterSmartRecommendation function.
 * - MechMasterRecommendationOutput - The return type for the mechMasterSmartRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MechMasterRecommendationInputSchema = z.object({
  manufacturingProcess: z
    .string()
    .describe('The primary manufacturing process required (e.g., CNC Machining, Laser Cutting).'),
  material: z.string().describe('The material required for manufacturing (e.g., Stainless Steel, Aluminum, ABS Plastic).'),
  quantity: z.number().int().positive().describe('The quantity of parts to be manufactured.'),
  surfaceFinish: z.string().optional().describe('Optional: Specific surface finish requirements (e.g., Polished, Anodized, Powder Coated).'),
  toleranceRequirement: z.string().optional().describe('Optional: Specific tolerance requirements (e.g., +/- 0.05mm, ISO 2768-m).'),
  requiredDeliveryDate: z.string().describe('The required delivery date for the manufactured parts (YYYY-MM-DD format).'),
  budgetRange: z.string().optional().describe('Optional: The estimated budget range for the project (e.g., $1000-$5000).'),
  deliveryLocation: z.string().describe('The city and pincode for delivery (e.g., "Mumbai, 400001").'),
  additionalNotes: z.string().optional().describe('Any additional notes or specific requirements from the user.')
});
export type MechMasterRecommendationInput = z.infer<typeof MechMasterRecommendationInputSchema>;

const MechMasterRecommendationOutputSchema = z.object({
  processFilter: z.string().describe('The most suitable manufacturing process identified from the request.'),
  materialFilter: z.string().describe('The most suitable material identified from the request.'),
  locationFilter: z.string().describe('The primary geographic location (city or region) identified for filtering MechMasters.'),
  pincodeFilter: z.string().optional().describe('The pincode identified for filtering MechMasters, if highly specific.'),
  geographicImportance: z
    .boolean()
    .describe('True if geographic proximity or specific local presence is critical for this request (e.g., on-site work, highly localized delivery, urgent local pickup).'),
  recommendationRationale: z
    .string()
    .describe('A detailed explanation of why these filters were chosen, highlighting any implicit geographic preferences or critical aspects of the request.'),
});
export type MechMasterRecommendationOutput = z.infer<typeof MechMasterRecommendationOutputSchema>;

export async function mechMasterSmartRecommendation(input: MechMasterRecommendationInput): Promise<MechMasterRecommendationOutput> {
  return mechMasterRecommendationFlow(input);
}

const mechMasterRecommendationPrompt = ai.definePrompt({
  name: 'mechMasterRecommendationPrompt',
  input: {schema: MechMasterRecommendationInputSchema},
  output: {schema: MechMasterRecommendationOutputSchema},
  prompt: `You are an intelligent assistant for MechHub, designed to help recommend the most suitable MechMasters (manufacturing vendors) based on user requirements.

Analyze the provided manufacturing details and extract key filters for process, material, and location. Determine if geographic proximity is critical for this request based on the details.

**Manufacturing Details:**
- Manufacturing Process: {{{manufacturingProcess}}}
- Material: {{{material}}}
- Quantity: {{{quantity}}}
- Surface Finish: {{{surfaceFinish}}}
- Tolerance Requirement: {{{toleranceRequirement}}}
- Required Delivery Date: {{{requiredDeliveryDate}}}
- Budget Range: {{{budgetRange}}}
- Delivery Location: {{{deliveryLocation}}}
- Additional Notes: {{{additionalNotes}}}

Consider the following:
1.  **Process Filter**: Identify the primary manufacturing process.
2.  **Material Filter**: Identify the primary material.
3.  **Location Filter**: Extract the city/region from the 'Delivery Location'.
4.  **Pincode Filter**: Extract the pincode from the 'Delivery Location' if it seems relevant for fine-grained matching.
5.  **Geographic Importance**: Assess if the geographic location is CRITICAL. This is true if there's an implicit need for local inspection, on-site services, or extremely urgent local delivery that makes distant MechMasters impractical. If the request is standard manufacturing that can be shipped, geographic importance is likely false. Consider the 'Additional Notes' for clues.
6.  **Recommendation Rationale**: Explain your reasoning for the filters, particularly why you determined geographic importance to be true or false. Elaborate on how specific details in the request led to your conclusions.

Provide the output in a structured JSON format matching the output schema. Focus on providing precise filters and a clear rationale.`,
});

const mechMasterRecommendationFlow = ai.defineFlow(
  {
    name: 'mechMasterRecommendationFlow',
    inputSchema: MechMasterRecommendationInputSchema,
    outputSchema: MechMasterRecommendationOutputSchema,
  },
  async (input) => {
    const {output} = await mechMasterRecommendationPrompt(input);
    if (!output) {
      throw new Error('Failed to get recommendation from AI.');
    }
    return output;
  },
);
