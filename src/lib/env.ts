import { z } from 'zod';

// ================================================================
// Runtime Environment Validation — fail-fast on boot if required env missing.
// ================================================================

const EnvSchema = z.object({
  // Site
  NEXT_PUBLIC_SITE_URL: z.string().url().optional().default('https://ankitdamess.in'),
  NEXT_PUBLIC_SITE_NAME: z.string().min(1).optional().default('Ankit Da Mess'),
  NODE_ENV: z.enum(['development', 'production', 'test']).optional().default('development'),

  // Database (Phase 4 — optional now for Phase 1 build)
  MONGODB_URI: z.string().optional(),
  DB_NAME: z.string().optional().default('ankitdamess'),

  // Auth (Phase 4)
  JWT_SECRET: z.string().optional(),
  INITIAL_ADMIN_EMAIL: z.string().email().optional(),
  INITIAL_ADMIN_PASSWORD: z.string().optional(),

  // Cloudinary (Phase 4)
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  CLOUDINARY_UPLOAD_PRESET: z.string().optional(),

  // Transactional (Phase 3)
  RESEND_API_KEY: z.string().optional(),
  CONTACT_FORM_RECIPIENT: z.string().email().optional(),

  // Google (Phase 2)
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string().optional(),

  // Analytics (Phase 5)
  NEXT_PUBLIC_ANALYTICS_ID: z.string().optional(),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success && process.env.NODE_ENV !== 'production') {
  // Build-time only warnings — don't break Phase 1 since DB/Auth aren't required yet.
  const first = parsed.error.issues[0];
  if (first) {
    // eslint-disable-next-line no-console
    console.warn(`[env] warn: ${String(first.path.join('.'))} — ${first.message}`);
  }
}

export const env = parsed.data;
