import { ctaService } from '@/services';
import type { CTAData } from '@/types';

export default async function getCTAData(): Promise<CTAData | null> {
  const result = await ctaService.getCTA();
  if (result.success && result.data) {
    return result.data;
  }
  return null;
}
