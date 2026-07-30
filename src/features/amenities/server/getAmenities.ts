import { amenitiesService } from '@/services';
import type { Amenity } from '@/types';

export default async function getAmenities(): Promise<ReadonlyArray<Amenity> | null> {
  try {
    const result = await amenitiesService.getAmenities(true, 50);
    if (!result.success || !result.data) return null;
    return [...result.data].sort((a, b) => a.sortOrder - b.sortOrder);
  } catch {
    return null;
  }
}
