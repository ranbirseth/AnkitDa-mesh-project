import { whyChooseUsService } from '@/services';
import type { WhyChooseUsData } from '@/types';

export default async function getWhyChooseUsData(): Promise<WhyChooseUsData | null> {
  const result = await whyChooseUsService.getWhyChooseUs();
  if (result.success && result.data) {
    return result.data;
  }
  return null;
}
