'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Save, RefreshCw } from 'lucide-react';

interface CTAFormData {
  heading: string;
  subheading: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  primaryCtaExternal: boolean;
  secondaryCtaText: string;
  secondaryCtaHref: string;
  secondaryCtaExternal: boolean;
  tertiaryCtaText: string;
  tertiaryCtaHref: string;
}

const inputCls = "w-full px-3 py-2 bg-forest-950 border border-forest-700 rounded-lg text-forest-50 placeholder-forest-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 text-sm";

export default function AdminCTAPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset } = useForm<CTAFormData>({
    defaultValues: {
      heading: 'Ready to Book Your Room?',
      subheading: 'Contact us today for availability and best offers!',
      primaryCtaText: 'Call Now',
      primaryCtaHref: 'tel:+919614501727',
      primaryCtaExternal: false,
      secondaryCtaText: 'WhatsApp Us',
      secondaryCtaHref: 'https://wa.me/919614501727',
      secondaryCtaExternal: true,
      tertiaryCtaText: 'Enquire Now',
      tertiaryCtaHref: '#contact',
    },
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/admin/settings/cta');
        const data = await res.json();
        if (data.success && data.data) {
          const d = data.data;
          reset({
            heading: d.heading || '',
            subheading: d.subheading || '',
            primaryCtaText: d.primaryButton?.text || '',
            primaryCtaHref: d.primaryButton?.href || '',
            primaryCtaExternal: d.primaryButton?.external || false,
            secondaryCtaText: d.secondaryButton?.text || '',
            secondaryCtaHref: d.secondaryButton?.href || '',
            secondaryCtaExternal: d.secondaryButton?.external || true,
            tertiaryCtaText: d.tertiaryButton?.text || '',
            tertiaryCtaHref: d.tertiaryButton?.href || '',
          });
        }
      } catch { /* use defaults */ }
      finally { setLoading(false); }
    };
    void load();
  }, [reset]);

  const onSubmit = async (data: CTAFormData) => {
    setSaving(true);
    try {
      const payload = {
        id: 'cta-main',
        heading: data.heading,
        subheading: data.subheading,
        primaryButton: { text: data.primaryCtaText, href: data.primaryCtaHref, external: data.primaryCtaExternal },
        secondaryButton: { text: data.secondaryCtaText, href: data.secondaryCtaHref, external: data.secondaryCtaExternal },
        tertiaryButton: data.tertiaryCtaText ? { text: data.tertiaryCtaText, href: data.tertiaryCtaHref, external: false } : undefined,
      };
      const res = await fetch('/api/admin/settings/cta', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to save');
      toast.success('Call to Action saved successfully');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><RefreshCw className="w-6 h-6 text-gold-400 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-serif text-gold-400 font-bold">Call to Action</h1>
        <p className="text-forest-300 mt-1">Edit the CTA banner section on the homepage.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-forest-900/50 border border-forest-800 rounded-xl p-6 space-y-5">
          <h2 className="text-sm font-semibold text-forest-200 uppercase tracking-wider border-b border-forest-800 pb-2">Content</h2>
          <div>
            <label className="block text-sm font-medium text-forest-200 mb-1.5">Heading</label>
            <input {...register('heading')} className={inputCls} placeholder="Ready to Book Your Room?" />
          </div>
          <div>
            <label className="block text-sm font-medium text-forest-200 mb-1.5">Subheading</label>
            <textarea {...register('subheading')} rows={2} className={inputCls + " resize-none"} placeholder="Contact us today..." />
          </div>
        </div>

        <div className="bg-forest-900/50 border border-forest-800 rounded-xl p-6 space-y-5">
          <h2 className="text-sm font-semibold text-forest-200 uppercase tracking-wider border-b border-forest-800 pb-2">Primary Button (Call)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-forest-200 mb-1.5">Button Text</label>
              <input {...register('primaryCtaText')} className={inputCls} placeholder="Call Now" />
            </div>
            <div>
              <label className="block text-sm font-medium text-forest-200 mb-1.5">Button Link</label>
              <input {...register('primaryCtaHref')} className={inputCls} placeholder="tel:+919614501727" />
            </div>
          </div>
        </div>

        <div className="bg-forest-900/50 border border-forest-800 rounded-xl p-6 space-y-5">
          <h2 className="text-sm font-semibold text-forest-200 uppercase tracking-wider border-b border-forest-800 pb-2">Secondary Button (WhatsApp)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-forest-200 mb-1.5">Button Text</label>
              <input {...register('secondaryCtaText')} className={inputCls} placeholder="WhatsApp Us" />
            </div>
            <div>
              <label className="block text-sm font-medium text-forest-200 mb-1.5">Button Link</label>
              <input {...register('secondaryCtaHref')} className={inputCls} placeholder="https://wa.me/919614501727" />
            </div>
          </div>
        </div>

        <div className="bg-forest-900/50 border border-forest-800 rounded-xl p-6 space-y-5">
          <h2 className="text-sm font-semibold text-forest-200 uppercase tracking-wider border-b border-forest-800 pb-2">Tertiary Button (Enquire)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-forest-200 mb-1.5">Button Text</label>
              <input {...register('tertiaryCtaText')} className={inputCls} placeholder="Enquire Now" />
            </div>
            <div>
              <label className="block text-sm font-medium text-forest-200 mb-1.5">Button Link</label>
              <input {...register('tertiaryCtaHref')} className={inputCls} placeholder="#contact" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} className="bg-gold-500 hover:bg-gold-400 text-forest-950 font-semibold px-8">
            {saving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" />Save CTA</>}
          </Button>
        </div>
      </form>
    </div>
  );
}
