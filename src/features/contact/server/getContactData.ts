import { contactService } from '@/services';
import type { ContactInfoData } from '@/types';

export default async function getContactData(): Promise<ContactInfoData | null> {
  const result = await contactService.getContactInfo();
  if (result.success && result.data) {
    return result.data;
  }
  return null;
}
