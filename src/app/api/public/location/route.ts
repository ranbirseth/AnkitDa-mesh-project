import { NextResponse } from 'next/server';
import { locationService, type ILocationService } from '@/services';
import { LocationDataSchema } from '@/types';

export const revalidate = 3600;

export async function GET(): Promise<Response> {
  try {
    const result = await (locationService as ILocationService).getLocation();
    if (!result.success || !result.data) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'LOC_FETCH_FAILED', message: 'Location data unavailable.' },
          data: null,
        },
        {
          status: 200,
          headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
            'Cache-Tag': 'location',
          },
        },
      );
    }
    const safe = LocationDataSchema.safeParse(result.data);
    if (!safe.success) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'LOC_VALIDATION', message: 'Location data failed validation.' },
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
          'Cache-Tag': 'location',
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
