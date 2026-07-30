import { roomsService } from '@/services';
import type { Room } from '@/types';

export default async function getPricingData(): Promise<ReadonlyArray<Room>> {
  const result = await roomsService.getRooms(false, 12);
  if (result.success && result.data) {
    return result.data;
  }
  return [];
}
