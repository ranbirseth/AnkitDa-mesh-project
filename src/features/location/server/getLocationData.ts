import { locationService } from '@/services';
import type { LocationData } from '@/types';

export default async function getLocationData(): Promise<LocationData | null> {
  try {
    const result = await locationService.getLocation();
    if (!result.success || !result.data) return null;
    return result.data;
  } catch {
    return null;
  }
}
