import { NextResponse } from 'next/server';
import { z } from 'zod';
import { amenitiesService, type IAmenitiesService } from '@/services';
import { AmenitySchema } from '@/types';

export const revalidate = 3600;

const QuerySchema = z.object({
  activeOnly: z
    .enum(['true', 'false', '1', '0'])
    .optional()
    .transform((v) => (v === undefined ? true : v === 'true' || v === '1')),
  limit: z.coerce.number().int().positive().max(200).optional().default(50),
});

export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const query = QuerySchema.safeParse({
      activeOnly: url.searchParams.get('activeOnly') ?? undefined,
      limit: url.searchParams.get('limit') ?? undefined,
    });
    const activeOnly = query.success ? query.data.activeOnly : true;
    const limit = query.success ? query.data.limit : 50;

    const result = await (amenitiesService as IAmenitiesService).getAmenities(activeOnly, limit);
    if (!result.success || !result.data) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'AM_FETCH_FAILED', message: 'Amenities data unavailable.' },
          data: [],
          total: 0,
        },
        {
          status: 200,
          headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
            'Cache-Tag': 'amenities',
          },
        },
      );
    }
    const items = result.data.filter((a) => z.boolean().parse(a.active ?? true));
    const validated = items
      .map((a) => AmenitySchema.safeParse(a))
      .filter((r): r is z.SafeParseSuccess<typeof AmenitySchema._type> => r.success)
      .map((r) => r.data);
    return NextResponse.json(
      { success: true, data: validated, total: validated.length, meta: result.meta ?? {} },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          'Cache-Tag': 'amenities',
        },
      },
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Internal server error.' },
        data: [],
        total: 0,
      },
      { status: 500 },
    );
  }
}
