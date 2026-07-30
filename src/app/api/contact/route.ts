import { NextResponse } from 'next/server';
import { ContactSubmissionSchema } from '@/types';
import { contactService, type IContactService } from '@/services';
import type { ContactSubmissionOutput } from '@/types';

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
        {
          success: false,
          error: {
            code: 'INVALID_JSON',
            message: 'Request body must be valid JSON.',
          },
        },
        {
          status: 400,
          headers: { 'Cache-Control': CACHE_CONTROL },
        },
      );
    }

    const validated = ContactSubmissionSchema.safeParse(body);
    if (!validated.success) {
      const errors: FieldErrorsShape = {};
      for (const issue of validated.error.issues) {
        const path = issue.path.join('.');
        if (path && !(path in errors)) {
          errors[path] = issue.message;
        }
      }
      return NextResponse.json(
        {
          success: false,
          errors,
        },
        {
          status: 422,
          headers: { 'Cache-Control': CACHE_CONTROL },
        },
      );
    }

    const submission: ContactSubmissionOutput = validated.data;
    const result = await (contactService as IContactService).submitContact(submission);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: result.error?.code ?? 'SUBMIT_FAILED',
            message: result.error?.message ?? 'Failed to submit contact form.',
          },
        },
        {
          status: 500,
          headers: { 'Cache-Control': CACHE_CONTROL },
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        submissionId: result.data?.submissionId,
      },
      {
        status: 201,
        headers: { 'Cache-Control': CACHE_CONTROL },
      },
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Internal server error.',
        },
      },
      {
        status: 500,
        headers: { 'Cache-Control': CACHE_CONTROL },
      },
    );
  }
}
