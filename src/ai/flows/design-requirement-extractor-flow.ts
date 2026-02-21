'use server';
/**
 * @fileOverview This file implements a Genkit flow for extracting key manufacturing requirements
 * from design documents and additional notes. It identifies material grades, tolerances,
 * special instructions, and determines if geographic location is important for the manufacturing process.
 *
 * - extractDesignRequirements - A function that handles the extraction process.
 * - DesignRequirementExtractorInput - The input type for the extractDesignRequirements function.
 * - DesignRequirementExtractorOutput - The return type for the extractDesignRequirements function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DesignRequirementExtractorInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A design document (e.g., PDF, JPG, PNG) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    )
    .optional(),
  additionalNotes: z
    .string()
    .describe('Any additional notes or specifications provided by the user.')
    .optional(),
});
export type DesignRequirementExtractorInput = z.infer<
  typeof DesignRequirementExtractorInputSchema
>;

const DesignRequirementExtractorOutputSchema = z.object({
  materialGrades: z
    .array(z.string())
    .describe('A list of identified material grades.'),
  tolerances: z
    .array(z.string())
    .describe('A list of identified specific tolerances (e.g., +/- 0.05mm, ISO 2768-mK).'),
  specialInstructions: z
    .string()
    .describe('Any special instructions for manufacturing.'),
  identifiedRequirements: z
    .string()
    .describe('A general summary of all key manufacturing requirements identified.'),
  isLocationImportant: z
    .boolean()
    .describe(
      'True if the manufacturing requirements indicate that geographic location (e.g., local suppliers, specific shipping needs) is important; otherwise, false.'
    ),
});
export type DesignRequirementExtractorOutput = z.infer<
  typeof DesignRequirementExtractorOutputSchema
>;

export async function extractDesignRequirements(
  input: DesignRequirementExtractorInput
): Promise<DesignRequirementExtractorOutput> {
  return designRequirementExtractorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'designRequirementExtractorPrompt',
  input: { schema: DesignRequirementExtractorInputSchema },
  output: { schema: DesignRequirementExtractorOutputSchema },
  prompt: `You are an expert in manufacturing and design, specializing in extracting critical requirements from technical documents and notes.
Your task is to carefully analyze the provided design document and any additional notes to identify key manufacturing requirements. Focus on precision and completeness.

Extract the following information:
1.  **Material Grades**: List all specified material grades (e.g., "Alloy 6061-T6", "SS304", "ABS").
2.  **Tolerances**: List any explicit or implied tolerances (e.g., "+/- 0.05mm", "ISO 2768-mK", "GD&T callouts").
3.  **Special Instructions**: Note any unique or critical manufacturing instructions (e.g., "surface finish Ra 0.8", "heat treatment required", "anodizing process").
4.  **Identified Requirements**: Provide a concise, general summary of all key manufacturing requirements you have identified.
5.  **Is Location Important**: Determine if the manufacturing requirements or notes suggest that the geographic location of the manufacturer is particularly important (e.g., mentions of "local suppliers", "on-site assembly", specific regional standards, or highly sensitive shipping requirements). Return true or false.

Design Document: {{#if documentDataUri}}{{media url=documentDataUri}}{{else}}No document provided.{{/if}}

Additional Notes: {{{additionalNotes}}}`,
});

const designRequirementExtractorFlow = ai.defineFlow(
  {
    name: 'designRequirementExtractorFlow',
    inputSchema: DesignRequirementExtractorInputSchema,
    outputSchema: DesignRequirementExtractorOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
