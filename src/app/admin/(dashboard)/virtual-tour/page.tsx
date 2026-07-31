'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Save, RefreshCw } from 'lucide-react';

interface VirtualTourFormData {
  title: string;
  description: string;
  videoUrl: string;
  posterUrl: string;
  posterAlt: string;
  ctaText: string;
  ctaHref: string;
  supportingText: string;
  enabled: boolean;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-forest-200 mb-1.5">{label}</label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

const inputCls = "w-full px-3 py-2 bg-forest-950 border border-forest-700 rounded-lg text-forest-50 placeholder-forest-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 text-sm";

export default function AdminVirtualTourPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset } = useForm<VirtualTourFormData>({
    defaultValues: {
      title: 'Take a Virtual Tour',
      description: 'Explore every corner of Ankit Da Mess from the comfort of your home.',
      videoUrl: '',
      posterUrl: '',
      posterAlt: 'Ankit Da Mess guest house',
      ctaText: 'Contact Us',
      ctaHref: '#contact',
      supportingText: '',
      enabled: true,
    },
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/admin/settings/virtual-tour');
        const data = await res.json();
        if (data.success && data.data) {
          const d = data.data;
          reset({
            title: d.title || '',
            description: d.description || '',
            videoUrl: d.videoUrl || '',
            posterUrl: d.posterUrl || '',
            posterAlt: d.posterAlt || '',
            ctaText: d.ctaText || '',
            ctaHref: d.ctaHref || '',
            supportingText: d.supportingText || '',
            enabled: d.enabled !== false,
          });
        }
      } catch { /* use defaults */ }
      finally { setLoading(false); }
    };
    void load();
  }, [reset]);

  const onSubmit = async (data: VirtualTourFormData) => {
    setSaving(true);
    try {
      const payload = {
        id: 'vt-main',
        ...data,
        posterWidth: 1748,
        posterHeight: 899,
        panorama: false,
      };
      const res = await fetch('/api/admin/settings/virtual-tour', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to save');
      toast.success('Virtual Tour saved successfully');
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
        <h1 className="text-3xl font-serif text-gold-400 font-bold">Virtual Tour</h1>
        <p className="text-forest-300 mt-1">Edit the virtual tour section on the homepage.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-forest-900/50 border border-forest-800 rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-forest-800 pb-2">
            <h2 className="text-sm font-semibold text-forest-200 uppercase tracking-wider">Content</h2>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('enabled')} className="w-4 h-4 rounded border-forest-700 bg-forest-950 text-gold-500 focus:ring-gold-500/50" />
              <span className="text-sm text-forest-300">Section Enabled</span>
            </label>
          </div>
          <Field label="Title">
            <input {...register('title')} className={inputCls} placeholder="Take a Virtual Tour" />
          </Field>
          <Field label="Description">
            <textarea {...register('description')} rows={3} className={inputCls + " resize-none"} placeholder="Explore every corner..." />
          </Field>
          <Field label="Supporting Text (small caption)">
            <input {...register('supportingText')} className={inputCls} placeholder="Real footage of Ankit Da Mess..." />
          </Field>
        </div>

        <div className="bg-forest-900/50 border border-forest-800 rounded-xl p-6 space-y-5">
          <h2 className="text-sm font-semibold text-forest-200 uppercase tracking-wider border-b border-forest-800 pb-2">Media</h2>
          <Field label="Video URL (Cloudinary or MP4 link)">
            <input {...register('videoUrl')} className={inputCls} placeholder="https://res.cloudinary.com/dyc33dchn/video/upload/..." />
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Poster Image URL">
              <input {...register('posterUrl')} className={inputCls} placeholder="https://res.cloudinary.com/..." />
            </Field>
            <Field label="Poster Image Alt Text">
              <input {...register('posterAlt')} className={inputCls} placeholder="Ankit Da Mess building" />
            </Field>
          </div>
        </div>

        <div className="bg-forest-900/50 border border-forest-800 rounded-xl p-6 space-y-5">
          <h2 className="text-sm font-semibold text-forest-200 uppercase tracking-wider border-b border-forest-800 pb-2">CTA Button</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="CTA Button Text">
              <input {...register('ctaText')} className={inputCls} placeholder="Contact Us" />
            </Field>
            <Field label="CTA Button Link">
              <input {...register('ctaHref')} className={inputCls} placeholder="#contact" />
            </Field>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} className="bg-gold-500 hover:bg-gold-400 text-forest-950 font-semibold px-8">
            {saving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" />Save Virtual Tour</>}
          </Button>
        </div>
      </form>
    </div>
  );
}
