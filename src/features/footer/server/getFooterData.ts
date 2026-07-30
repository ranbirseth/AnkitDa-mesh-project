import { footerService } from '@/services';
import type { FooterData } from '@/types';

export default async function getFooterData(): Promise<FooterData | null> {
  const result = await footerService.getFooter();
  if (result.success && result.data) {
    return result.data;
  }
  return null;
}
