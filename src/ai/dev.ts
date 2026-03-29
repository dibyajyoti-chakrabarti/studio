/**
 * AI Development Entry Point
 *
 * This file loads environment variables (like API keys) from a .env file,
 * then imports and registers all the AI "flows" (automated pipelines)
 * used by MechHub. Each flow is a self-contained AI feature.
 */

// Load environment variables from .env file so AI flows can access API keys
import { config } from 'dotenv';
config();

// Register the AI flow that extracts design requirements from uploaded CAD files
import '@/ai/flows/design-requirement-extractor-flow.ts';

// Register the AI flow that recommends the best manufacturing process for a part
import '@/ai/flows/mech-master-smart-recommendation-flow.ts';
