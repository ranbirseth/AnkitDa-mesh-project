'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Save, RefreshCw } from 'lucide-react';

const ic =
  'w-full px-3 py-2 bg-forest-950 border border-forest-700 rounded-lg text-forest-50 placeholder-forest-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 text-sm';

interface SocialData {
  facebook: string;
  instagram: string;
  whatsapp: string;
  youtube: string;
  linkedin: string;
  threads: string;
  twitter: string;
  telegram: string;
  website: string;
  googleMaps: string;
  googleBusiness: string;
  email: string;
  phone: string;
  address: string;
}

const DEFAULTS: SocialData = {
  facebook: '',
  instagram: '',
  whatsapp: 'https://wa.me/919614501727',
  youtube: '',
  linkedin: '',
  threads: '',
  twitter: '',
  telegram: '',
  website: 'https://ankitdamess.in',
  googleMaps: 'https://www.google.com/maps/search/?api=1&query=Fuljhore+Rabindra+Pally+Durgapur+713206',
  googleBusiness: '',
  email: 'ap423637@gmail.com',
  phone: '+91 96145 01727',
  address: 'Fuljhore, Rabindra Pally, Durgapur - 713206, West Bengal',
};

const FIELDS: Array<{ key: keyof SocialData; label: string; placeholder: string; type?: string }> = [
  { key: 'facebook', label: 'Facebook Page URL', placeholder: 'https://www.facebook.com/...' },
  { key: 'instagram', label: 'Instagram Profile URL', placeholder: 'https://www.instagram.com/...' },
  { key: 'whatsapp', label: 'WhatsApp Link', placeholder: 'https://wa.me/91...' },
  { key: 'youtube', label: 'YouTube Channel URL', placeholder: 'https://www.youtube.com/@...' },
  { key: 'linkedin', label: 'LinkedIn URL', placeholder: 'https://www.linkedin.com/...' },
  { key: 'threads', label: 'Threads URL', placeholder: 'https://www.threads.net/@...' },
  { key: 'twitter', label: 'Twitter / X URL', placeholder: 'https://twitter.com/...' },
  { key: 'telegram', label: 'Telegram Link', placeholder: 'https://t.me/...' },
  { key: 'website', label: 'Website URL', placeholder: 'https://ankitdamess.in' },
  { key: 'googleMaps', label: 'Google Maps Link', placeholder: 'https://www.google.com/maps/...' },
  { key: 'googleBusiness', label: 'Google Business Profile URL', placeholder: 'https://g.page/...' },
  { key: 'email', label: 'Contact Email', placeholder: 'ap423637@gmail.com', type: 'email' },
  { key: 'phone', label: 'Phone Number', placeholder: '+91 96145 01727', type: 'tel' },
  { key: 'address', label: 'Physical Address', placeholder: 'Full address...' },
];

export default function AdminSocialSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<SocialData>(DEFAULTS);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/admin/settings/social-media');
        const json = await res.json();
        if (json.success && json.data) {
          setData({ ...DEFAULTS, ...json.data });
        }
      } catch { /* use defaults */ }
      finally { setLoading(false); }
    };
    void load();
  }, []);

  const update = (key: keyof SocialData, value: string) => {
    setData(p => ({ ...p, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings/social-media', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to save');
      toast.success('Social media settings saved successfully');
    } catch (err: any) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <RefreshCw className="w-6 h-6 text-gold-400 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-gold-400 font-bold">Social Media &amp; Contact</h1>
          <p className="text-forest-300 mt-1">Manage all social links, contact details, and business information.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-gold-500 hover:bg-gold-400 text-forest-950 font-semibold px-6">
          {saving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" />Save All</>}
        </Button>
      </div>

      <div className="bg-forest-900/50 border border-forest-800 rounded-xl p-6 space-y-5">
        <h2 className="text-sm font-semibold text-forest-200 uppercase tracking-wider border-b border-forest-800 pb-2">
          Social Media &amp; Business Links
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {FIELDS.map(f => (
            <div key={f.key} className={f.key === 'address' ? 'md:col-span-2' : ''}>
              <label className="block text-sm font-medium text-forest-200 mb-1.5">{f.label}</label>
              {f.key === 'address' ? (
                <textarea
                  value={data[f.key]}
                  onChange={e => update(f.key, e.target.value)}
                  rows={2}
                  className={ic + ' resize-none'}
                  placeholder={f.placeholder}
                />
              ) : (
                <input
                  type={f.type || 'text'}
                  value={data[f.key]}
                  onChange={e => update(f.key, e.target.value)}
                  className={ic}
                  placeholder={f.placeholder}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
