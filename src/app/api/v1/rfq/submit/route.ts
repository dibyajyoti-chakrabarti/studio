import { ProjectController } from '@/controllers/project.controller';

/**
 * POST /api/v1/rfq/submit — Custom Project RFQ Submission
 */
export async function POST(request: Request) {
  return ProjectController.submitRfq(request);
}
