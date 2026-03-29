import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ProjectService } from '@/services/project.service';
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit';
import { logger } from '@/utils/logger';

const DesignFileSchema = z.object({
  name: z.string().min(1).max(255),
  size: z.number().max(10 * 1024 * 1024), // 10MB limit per file
  type: z.string().optional(),
  dataUrl: z
    .string()
    .startsWith('data:')
    .max(15 * 1024 * 1024), // DataURL size limit
});

const RfqSchema = z.object({
  userId: z.string().nullable(),
  userName: z.string().min(1).max(100),
  userEmail: z.string().email(),
  userPhone: z.string().max(20).optional(),
  teamName: z.string().max(100).optional(),
  projectName: z.string().min(1).max(200),
  manufacturingProcess: z.string().max(500),
  material: z.string().max(200),
  thickness: z.string().nullable().optional(),
  weight: z.string().nullable().optional(),
  quantity: z.number().min(1),
  surfaceFinish: z.string().max(200).optional(),
  tolerance: z.string().max(100),
  deliveryDate: z.string().optional(),
  budgetRange: z.string().max(100).optional(),
  deliveryLocation: z.string().min(1).max(500),
  extraRequirements: z.string().max(2000).optional(),
  designFiles: z.array(DesignFileSchema).max(5),
  selectedVendorIds: z.array(z.string()).min(1).max(20),
});

/**
 * ProjectController handles requests related to innovation projects and custom RFQs.
 */
export const ProjectController = {
  /**
   * Submits a custom manufacturing RFQ.
   */
  async submitRfq(request: Request) {
    try {
      // 1. Rate Limiting
      const ip = request.headers.get('x-forwarded-for') || 'anonymous';
      const limiter = await rateLimit(`rfq-submit:${ip}`, 3, 60000);
      if (!limiter.success) {
        return rateLimitResponse(limiter.reset);
      }

      // 2. Auth & Validation
      const body = await request.json();
      const result = RfqSchema.safeParse(body);

      if (!result.success) {
        logger.warn({ event: 'API: RFQ validation failed', errors: result.error.format() });
        return NextResponse.json(
          {
            error: 'Invalid submission data',
            details: result.error.format(),
          },
          { status: 400 }
        );
      }

      const data = result.data;

      // 3. Security Checks for Files
      const allowedExtensions = [
        '.step',
        '.stp',
        '.stl',
        '.obj',
        '.pdf',
        '.zip',
        '.png',
        '.jpg',
        '.jpeg',
      ];
      for (const file of data.designFiles) {
        const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        if (!allowedExtensions.includes(ext)) {
          return NextResponse.json({ error: `File type not allowed: ${ext}` }, { status: 400 });
        }
      }

      // 4. Execution via Service
      const rfqId = await ProjectService.submitProjectRfq(data);

      return NextResponse.json({ success: true, rfqId });
    } catch (error: any) {
      logger.error({
        event: 'API: RFQ submission failed',
        error: error.message,
      });
      return NextResponse.json(
        { error: 'Failed to submit RFQ. Please try again later.' },
        { status: 500 }
      );
    }
  },
};
