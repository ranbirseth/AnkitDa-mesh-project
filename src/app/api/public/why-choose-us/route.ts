import { NextResponse } from 'next/server';
import { whyChooseUsService, type IWhyChooseUsService } from '@/services';
import { WhyChooseUsDataSchema } from '@/types';

export const revalidate = 3600;

export async function GET(): Promise<Response> {
  try {
    const result = await (whyChooseUsService as IWhyChooseUsService).getWhyChooseUs();
    if (!result.success || !result.data) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'WCU_FETCH_FAILED', message: 'Why Choose Us data unavailable.' },
          data: null,
        },
        {
          status: 200,
          headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
            'Cache-Tag': 'why-choose-us',
          },
        },
      );
    }
    const safe = WhyChooseUsDataSchema.safeParse(result.data);
    if (!safe.success) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'WCU_VALIDATION', message: 'Why Choose Us data failed validation.' },
          data: null,
        },
        { status: 200 },
      );
    }
    return NextResponse.json(
      { success: true, data: safe.data, meta: result.meta ?? {} },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          'Cache-Tag': 'why-choose-us',
        },
      },
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Internal server error.' },
        data: null,
      },
      { status: 500 },
    );
  }
}
