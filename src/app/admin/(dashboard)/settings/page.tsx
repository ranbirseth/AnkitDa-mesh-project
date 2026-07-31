'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Save, RefreshCw, ShieldAlert } from 'lucide-react';

interface SettingsFormData {
  siteName: string;
  siteUrl: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  analyticsId: string;
}

const ic =
  'w-full px-3 py-2 bg-forest-950 border border-forest-700 rounded-lg text-forest-50 placeholder-forest-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 text-sm';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset } = useForm<SettingsFormData>({
    defaultValues: {
      siteName: 'Ankit Da Mess',
      siteUrl: 'https://ankitdamess.in',
      seoTitle: 'Ankit Da Mess — Guest House & PG in Durgapur',
      seoDescription:
        'Safe, affordable and comfortable guest house & PG accommodation in Fuljhore, Durgapur.',
      seoKeywords: 'guest house durgapur, pg durgapur, fuljhore pg',
      analyticsId: '',
    },
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/admin/settings/settings');
        const data = await res.json();
        if (data.success && data.data) {
          const d = data.data;
          reset({
            siteName: d.siteName || '',
            siteUrl: d.siteUrl || '',
            seoTitle: d.seoTitle || '',
            seoDescription: d.seoDescription || '',
            seoKeywords: d.seoKeywords || '',
            analyticsId: d.analyticsId || '',
          });
        }
      } catch {
        /* use defaults */
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [reset]);

  const onSubmit = async (data: SettingsFormData) => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to save');
      toast.success('Settings saved successfully');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="w-6 h-6 text-gold-400 animate-spin" />
      </div>
    );

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-serif text-gold-400 font-bold">Site Settings</h1>
        <p className="text-forest-300 mt-1">
          Manage SEO metadata and general site configuration.
        </p>
      </div>

      <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-200">
          API keys, database credentials, and secrets are managed in{' '}
          <code className="text-amber-300 font-mono text-xs bg-amber-950/50 px-1 rounded">
            .env.local
          </code>{' '}
          only and are never shown here.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-forest-900/50 border border-forest-800 rounded-xl p-6 space-y-5">
          <h2 className="text-sm font-semibold text-forest-200 uppercase tracking-wider border-b border-forest-800 pb-2">
            General
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-forest-200 mb-1.5">
                Site Name
              </label>
              <input {...register('siteName')} className={ic} />
            </div>
            <div>
              <label className="block text-sm font-medium text-forest-200 mb-1.5">
                Site URL
              </label>
              <input {...register('siteUrl')} className={ic} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-forest-200 mb-1.5">
              Analytics ID (optional)
            </label>
            <input {...register('analyticsId')} className={ic} placeholder="G-XXXXXXXXXX" />
          </div>
        </div>

        <div className="bg-forest-900/50 border border-forest-800 rounded-xl p-6 space-y-5">
          <h2 className="text-sm font-semibold text-forest-200 uppercase tracking-wider border-b border-forest-800 pb-2">
            SEO Defaults
          </h2>
          <div>
            <label className="block text-sm font-medium text-forest-200 mb-1.5">
              Default SEO Title
            </label>
            <input {...register('seoTitle')} className={ic} />
          </div>
          <div>
            <label className="block text-sm font-medium text-forest-200 mb-1.5">
              Default Meta Description
            </label>
            <textarea {...register('seoDescription')} rows={3} className={ic + ' resize-none'} />
          </div>
          <div>
            <label className="block text-sm font-medium text-forest-200 mb-1.5">
              Keywords (comma separated)
            </label>
            <input {...register('seoKeywords')} className={ic} />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={saving}
            className="bg-gold-500 hover:bg-gold-400 text-forest-950 font-semibold px-8"
          >
            {saving ? (
              'Saving...'
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
