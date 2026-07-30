import { virtualTourService } from '@/services';
import type { VirtualTourData } from '@/types';

export default async function getVirtualTourData(): Promise<VirtualTourData | null> {
  const result = await virtualTourService.getVirtualTour();
  if (result.success && result.data) {
    return result.data;
  }
  return null;
}
