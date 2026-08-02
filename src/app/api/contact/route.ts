import { NextResponse } from 'next/server';
import { ContactSubmissionSchema } from '@/types';
import type { ContactSubmissionOutput } from '@/types';
import { connectDB } from '@/lib/db';
import { EnquiryModel } from '@/models/Enquiry';
import { sendEnquiryEmail } from '@/lib/sendEnquiryEmail';

export const dynamic = 'force-dynamic';

const CACHE_CONTROL = 'private, no-store, no-cache, must-revalidate';

type FieldErrorsShape = Record<string, string>;

export async function POST(request: Request): Promise<Response> {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_JSON', message: 'Request body must be valid JSON.' } },
        { status: 400, headers: { 'Cache-Control': CACHE_CONTROL } },
      );
    }

    const validated = ContactSubmissionSchema.safeParse(body);
    if (!validated.success) {
      const errors: FieldErrorsShape = {};
      for (const issue of validated.error.issues) {
        const path = issue.path.join('.');
        if (path && !(path in errors)) errors[path] = issue.message;
      }
      return NextResponse.json(
        { success: false, errors },
        { status: 422, headers: { 'Cache-Control': CACHE_CONTROL } },
      );
    }

    const submission: ContactSubmissionOutput = validated.data;

    // Save to MongoDB
    let submissionId: string | undefined;
    try {
      await connectDB();
      const enquiry = await EnquiryModel.create({
        name: submission.name,
        phone: submission.phone,
        email: submission.email || undefined,
        whatsapp: submission.phone,
        roomType: submission.roomType || 'general',
        roomName: (body as any)?.roomName || undefined,
        roomId: (body as any)?.roomId || undefined,
        roomSlug: (body as any)?.roomSlug || undefined,
        message: submission.message || undefined,
        source: submission.source || 'website',
        status: 'new',
      });
      submissionId = enquiry._id.toString();
    } catch (dbErr) {
      console.error('[contact] DB save failed:', dbErr);
      // Don't block the user if DB fails — continue to send email
    }

    // Send admin email notification (non-blocking)
    void sendEnquiryEmail({
      name: submission.name,
      phone: submission.phone,
      email: submission.email || undefined,
      whatsapp: submission.phone,
      roomType: submission.roomType || 'general',
      roomName: (body as any)?.roomName || undefined,
      message: submission.message || undefined,
      source: submission.source || 'website',
      submissionId,
    });

    return NextResponse.json(
      { success: true, submissionId },
      { status: 201, headers: { 'Cache-Control': CACHE_CONTROL } },
    );
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error.' } },
      { status: 500, headers: { 'Cache-Control': CACHE_CONTROL } },
    );
  }
}
