'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Save, RefreshCw } from 'lucide-react';

interface HeroFormData {
  eyebrow: string;
  heading: string;
  headingAccent: string;
  subHeading: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText: string;
  secondaryCtaHref: string;
  tertiaryCtaText: string;
  tertiaryCtaHref: string;
  backgroundImageUrl: string;
  backgroundImageAlt: string;
  posterUrl: string;
}

function AdminInput({ label, error, ...props }: { label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="block text-sm font-medium text-forest-200 mb-1.5">{label}</label>
      <input
        className="w-full px-3 py-2 bg-forest-950 border border-forest-700 rounded-lg text-forest-50 placeholder-forest-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 text-sm"
        {...props}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

function AdminTextarea({ label, error, ...props }: { label: string; error?: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <label className="block text-sm font-medium text-forest-200 mb-1.5">{label}</label>
      <textarea
        className="w-full px-3 py-2 bg-forest-950 border border-forest-700 rounded-lg text-forest-50 placeholder-forest-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 text-sm resize-none"
        {...props}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

export default function AdminHeroPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset } = useForm<HeroFormData>({
    defaultValues: {
      eyebrow: 'Comfort · Safety · Affordability',
      heading: 'A Comfortable',
      headingAccent: 'Home Away\nFrom Home',
      subHeading: 'Spacious rooms, modern amenities and a peaceful environment for students & working professionals.',
      primaryCtaText: 'Enquire Now',
      primaryCtaHref: '#contact',
      secondaryCtaText: 'WhatsApp',
      secondaryCtaHref: 'https://wa.me/919614501727',
      tertiaryCtaText: 'Call Now',
      tertiaryCtaHref: 'tel:+919614501727',
      backgroundImageUrl: '',
      backgroundImageAlt: '',
      posterUrl: '',
    },
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/admin/settings/hero');
        const data = await res.json();
        if (data.success && data.data) {
          const d = data.data;
          reset({
            eyebrow: d.eyebrow || '',
            heading: d.heading || '',
            headingAccent: d.headingAccent || '',
            subHeading: d.subHeading || '',
            primaryCtaText: d.primaryCTA?.text || '',
            primaryCtaHref: d.primaryCTA?.href || '',
            secondaryCtaText: d.secondaryCTA?.text || '',
            secondaryCtaHref: d.secondaryCTA?.href || '',
            tertiaryCtaText: d.tertiaryCTA?.text || '',
            tertiaryCtaHref: d.tertiaryCTA?.href || '',
            backgroundImageUrl: d.backgroundMedia?.url || '',
            backgroundImageAlt: d.backgroundMedia?.alt || '',
            posterUrl: d.posterImage?.url || '',
          });
        }
      } catch {
        // use defaults
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [reset]);

  const onSubmit = async (data: HeroFormData) => {
    setSaving(true);
    try {
      const payload = {
        id: 'hero-main',
        eyebrow: data.eyebrow,
        heading: data.heading,
        headingAccent: data.headingAccent,
        subHeading: data.subHeading,
        primaryCTA: { text: data.primaryCtaText, href: data.primaryCtaHref, external: false },
        secondaryCTA: { text: data.secondaryCtaText, href: data.secondaryCtaHref, external: true },
        tertiaryCTA: { text: data.tertiaryCtaText, href: data.tertiaryCtaHref, external: true },
        backgroundMedia: { id: data.backgroundImageUrl, url: data.backgroundImageUrl, alt: data.backgroundImageAlt },
        posterImage: { id: data.posterUrl, url: data.posterUrl, alt: data.backgroundImageAlt },
      };
      const res = await fetch('/api/admin/settings/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to save');
      toast.success('Hero section saved successfully');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="w-6 h-6 text-gold-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-serif text-gold-400 font-bold">Hero Section</h1>
        <p className="text-forest-300 mt-1">Edit the homepage hero content and CTAs.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Content */}
        <div className="bg-forest-900/50 border border-forest-800 rounded-xl p-6 space-y-5">
          <h2 className="text-sm font-semibold text-forest-200 uppercase tracking-wider border-b border-forest-800 pb-2">Content</h2>
          <AdminInput label="Eyebrow Text" {...register('eyebrow')} placeholder="Comfort · Safety · Affordability" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <AdminInput label="Main Heading" {...register('heading')} placeholder="A Comfortable" />
            <AdminInput label="Heading Accent (accent line)" {...register('headingAccent')} placeholder="Home Away From Home" />
          </div>
          <AdminTextarea label="Sub Heading" rows={3} {...register('subHeading')} placeholder="Spacious rooms, modern amenities..." />
        </div>

        {/* CTAs */}
        <div className="bg-forest-900/50 border border-forest-800 rounded-xl p-6 space-y-5">
          <h2 className="text-sm font-semibold text-forest-200 uppercase tracking-wider border-b border-forest-800 pb-2">Call to Action Buttons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <AdminInput label="Primary CTA Text" {...register('primaryCtaText')} placeholder="Enquire Now" />
            <AdminInput label="Primary CTA Link" {...register('primaryCtaHref')} placeholder="#contact" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <AdminInput label="Secondary CTA Text (WhatsApp)" {...register('secondaryCtaText')} placeholder="WhatsApp" />
            <AdminInput label="Secondary CTA Link" {...register('secondaryCtaHref')} placeholder="https://wa.me/..." />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <AdminInput label="Tertiary CTA Text (Call)" {...register('tertiaryCtaText')} placeholder="Call Now" />
            <AdminInput label="Tertiary CTA Link" {...register('tertiaryCtaHref')} placeholder="tel:+91..." />
          </div>
        </div>

        {/* Media */}
        <div className="bg-forest-900/50 border border-forest-800 rounded-xl p-6 space-y-5">
          <h2 className="text-sm font-semibold text-forest-200 uppercase tracking-wider border-b border-forest-800 pb-2">Background Media</h2>
          <AdminInput label="Background Image URL" {...register('backgroundImageUrl')} placeholder="https://res.cloudinary.com/..." />
          <AdminInput label="Background Image Alt Text" {...register('backgroundImageAlt')} placeholder="Ankit Da Mess building exterior" />
          <AdminInput label="Poster / Fallback Image URL" {...register('posterUrl')} placeholder="https://res.cloudinary.com/..." />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} className="bg-gold-500 hover:bg-gold-400 text-forest-950 font-semibold px-8">
            {saving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save Hero Section</>}
          </Button>
        </div>
      </form>
    </div>
  );
}
