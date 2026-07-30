import { testimonialsService } from '@/services';
import type { TestimonialsData } from '@/types';

export default async function getTestimonials(): Promise<TestimonialsData | null> {
  const result = await testimonialsService.getTestimonials();
  if (result.success && result.data) {
    return result.data;
  }
  return null;
}
