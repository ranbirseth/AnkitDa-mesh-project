'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/button';
import { ContactSubmissionSchema, type ContactSubmissionInput, type ContactSubmissionOutput } from '@/lib/contactSchema';
import type { ContactInfoData } from '@/types';

export interface ContactFormProps {
  readonly contactInfo: ContactInfoData;
  readonly className?: string;
}

type FieldErrorsShape = Partial<Record<keyof ContactSubmissionInput, string>>;

const inputBase = cn(
  'w-full rounded-xl bg-forest-950/40 border border-white/10 text-cream-50',
  'placeholder:text-cream-200/40',
  'px-4 py-3 text-sm',
  'focus:outline-none focus:ring-2 focus:ring-gold-500/60 focus:border-gold-500/50',
  'transition-all duration-200',
  'disabled:opacity-50 disabled:cursor-not-allowed',
);

const labelBase = cn(
  'block text-xs font-semibold text-cream-50/80 uppercase tracking-wide mb-1.5',
);

const errorText = cn(
  'mt-1 text-xs text-red-400',
);

export function ContactForm({ contactInfo, className }: ContactFormProps): React.ReactElement {
  const [submitting, setSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ContactSubmissionInput>({
    resolver: zodResolver(ContactSubmissionSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      roomType: 'general',
      message: '',
      source: 'website-footer',
    },
    mode: 'onTouched',
  });

  const onSubmit = React.useCallback(
    async (values: ContactSubmissionInput): Promise<void> => {
      if (submitting) return;

      setSubmitting(true);

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values satisfies ContactSubmissionInput as ContactSubmissionOutput),
        });

        const payload = (await response.json().catch(() => ({}))) as {
          readonly success?: boolean;
          readonly errors?: FieldErrorsShape;
          readonly error?: { readonly message?: string };
        };

        if (response.status === 422 && payload.errors) {
          const mapped = payload.errors;
          (Object.keys(mapped) as ReadonlyArray<keyof ContactSubmissionInput>).forEach((key) => {
            const msg = mapped[key];
            if (typeof msg === 'string') {
              setError(key, { type: 'server', message: msg });
            }
          });
          toast.error('Please check the form and try again.');
          return;
        }

        if (response.status === 500) {
          const serverMsg = payload.error?.message ?? 'Something went wrong on our end.';
          toast.error(serverMsg);
          return;
        }

        if (!response.ok || !payload.success) {
          toast.error('Unexpected error. Please try again.');
          return;
        }

        toast.success('Thank you. We will contact you shortly.');
        reset();
      } catch {
        toast.error('Network issue. Try again.');
      } finally {
        setSubmitting(false);
      }
    },
    [submitting, setError, reset],
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className={cn(
        'relative rounded-3xl overflow-hidden bg-forest-900/60 border border-white/10 backdrop-blur-md',
        'p-6 sm:p-7 flex flex-col gap-4',
        className,
      )}
    >
      <div className="grid grid-cols-1 min-[480px]:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label htmlFor="contact-name" className={labelBase}>
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            aria-invalid={errors.name ? true : undefined}
            className={cn(inputBase, errors.name && 'border-red-500/60 focus:ring-red-500/40 focus:border-red-500/60')}
            disabled={submitting}
            {...register('name')}
          />
          {errors.name && (
            <p className={errorText}>{errors.name.message}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="contact-phone" className={labelBase}>
            Phone
          </label>
          <input
            id="contact-phone"
            type="tel"
            autoComplete="tel"
            placeholder="+91 98234 56789"
            aria-invalid={errors.phone ? true : undefined}
            className={cn(inputBase, errors.phone && 'border-red-500/60 focus:ring-red-500/40 focus:border-red-500/60')}
            disabled={submitting}
            {...register('phone')}
          />
          {errors.phone && (
            <p className={errorText}>{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col">
        <label htmlFor="contact-email" className={labelBase}>
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com (optional)"
          aria-invalid={errors.email ? true : undefined}
          className={cn(inputBase, errors.email && 'border-red-500/60 focus:ring-red-500/40 focus:border-red-500/60')}
          disabled={submitting}
          {...register('email')}
        />
        {errors.email && (
          <p className={errorText}>{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="contact-room" className={labelBase}>
          Looking For
        </label>
        <select
          id="contact-room"
          aria-invalid={errors.roomType ? true : undefined}
          className={cn(inputBase, errors.roomType && 'border-red-500/60 focus:ring-red-500/40 focus:border-red-500/60')}
          disabled={submitting}
          {...register('roomType')}
        >
          {contactInfo.enquiryTypes.map((opt) => (
            <option key={opt.id} value={opt.id} className="bg-forest-900">
              {opt.label}
            </option>
          ))}
        </select>
        {errors.roomType && (
          <p className={errorText}>{errors.roomType.message}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="contact-message" className={labelBase}>
          Message
        </label>
        <textarea
          id="contact-message"
          rows={4}
          placeholder="Tell us a little about your requirements..."
          aria-invalid={errors.message ? true : undefined}
          className={cn(
            inputBase,
            'resize-y min-h-[110px]',
            errors.message && 'border-red-500/60 focus:ring-red-500/40 focus:border-red-500/60',
          )}
          disabled={submitting}
          {...register('message')}
        />
        {errors.message && (
          <p className={errorText}>{errors.message.message}</p>
        )}
      </div>

      <Button
        type="submit"
        variant="gold"
        size="lg"
        loading={submitting}
        loadingText="Sending..."
        disabled={submitting}
        aria-busy={submitting}
        className="w-full"
      >
        Send Enquiry
      </Button>
    </form>
  );
}
