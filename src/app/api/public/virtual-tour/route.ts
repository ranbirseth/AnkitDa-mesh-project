import { NextResponse } from 'next/server';
import { virtualTourService, type IVirtualTourService } from '@/services';
import { VirtualTourDataSchema } from '@/types';

export const revalidate = 3600;

export async function GET(): Promise<Response> {
  try {
    const result = await (virtualTourService as IVirtualTourService).getVirtualTour();
    if (!result.success || !result.data) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'VT_FETCH_FAILED', message: 'Virtual tour data unavailable.' },
          data: null,
        },
        {
          status: 200,
          headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
            'Cache-Tag': 'virtual-tour',
          },
        },
      );
    }
    const safe = VirtualTourDataSchema.safeParse(result.data);
    if (!safe.success) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'VT_VALIDATION', message: 'Virtual tour data failed validation.' },
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
          'Cache-Tag': 'virtual-tour',
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
