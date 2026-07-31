'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Save, RefreshCw, Plus, Trash2 } from 'lucide-react';

const ic = "w-full px-3 py-2 bg-forest-950 border border-forest-700 rounded-lg text-forest-50 placeholder-forest-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 text-sm";

interface QuickLink { id: string; label: string; href: string; }
interface SocialLink { id: string; platform: string; url: string; label: string; }
function gid() { return `id-${Date.now().toString(36)}`; }

export default function AdminFooterPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [brandName, setBrandName] = useState('Ankit Da Mess');
  const [brandTagline, setBrandTagline] = useState('Guest House & PG');
  const [brandDescription, setBrandDescription] = useState('Providing a safe, comfortable and affordable living space for students and working professionals.');
  const [copyright, setCopyright] = useState('© 2026 Ankit Da Mess. All Rights Reserved.');
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/admin/settings/footer');
        const data = await res.json();
        if (data.success && data.data) {
          const d = data.data;
          if (d.brandName) setBrandName(d.brandName);
          if (d.brandTagline) setBrandTagline(d.brandTagline);
          if (d.brandDescription) setBrandDescription(d.brandDescription);
          if (d.copyrightPrefix) setCopyright(d.copyrightPrefix + (d.copyrightSuffix ? ' ' + d.copyrightSuffix : ''));
          if (Array.isArray(d.quickLinks)) setQuickLinks(d.quickLinks);
          if (Array.isArray(d.socialLinks)) setSocialLinks(d.socialLinks);
        }
      } catch { /* defaults */ } finally { setLoading(false); }
    };
    void load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        id: 'footer-main',
        brandName, brandTagline, brandDescription,
        quickLinksTitle: 'Quick Links',
        quickLinks: quickLinks.map((l, i) => ({ ...l, isAnchor: l.href.startsWith('#'), sortOrder: i })),
        contactTitle: 'Contact Us',
        contact: { phonePrimary: '+91 96145 01727', phoneSecondary: '+91 96145 01727', whatsapp: '+919614501727', email: 'ap423637@gmail.com', address: 'Fuljhore, Rabindra Pally, Durgapur - 713206, West Bengal' },
        socialLinks: socialLinks.map((l) => ({ ...l, label: l.label || l.platform })),
        copyrightPrefix: copyright,
        copyrightSuffix: '',
      };
      const res = await fetch('/api/admin/settings/footer', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to save');
      toast.success('Footer saved successfully');
    } catch (err: any) { toast.error(err.message); } finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><RefreshCw className="w-6 h-6 text-gold-400 animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div><h1 className="text-3xl font-serif text-gold-400 font-bold">Footer</h1><p className="text-forest-300 mt-1">Edit footer brand, links and social media.</p></div>
        <Button onClick={handleSave} disabled={saving} className="bg-gold-500 hover:bg-gold-400 text-forest-950 font-semibold px-6">
          {saving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" />Save Footer</>}
        </Button>
      </div>
      <div className="bg-forest-900/50 border border-forest-800 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-forest-200 uppercase tracking-wider border-b border-forest-800 pb-2">Brand</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-forest-200 mb-1.5">Brand Name</label><input value={brandName} onChange={(e) => setBrandName(e.target.value)} className={ic} /></div>
          <div><label className="block text-sm font-medium text-forest-200 mb-1.5">Tagline</label><input value={brandTagline} onChange={(e) => setBrandTagline(e.target.value)} className={ic} /></div>
        </div>
        <div><label className="block text-sm font-medium text-forest-200 mb-1.5">Brand Description</label><textarea value={brandDescription} onChange={(e) => setBrandDescription(e.target.value)} rows={2} className={ic + " resize-none"} /></div>
        <div><label className="block text-sm font-medium text-forest-200 mb-1.5">Copyright Text</label><input value={copyright} onChange={(e) => setCopyright(e.target.value)} className={ic} /></div>
      </div>
      <div className="bg-forest-900/50 border border-forest-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-forest-800 pb-2">
          <h2 className="text-sm font-semibold text-forest-200 uppercase tracking-wider">Quick Links</h2>
          <Button type="button" onClick={() => setQuickLinks((p) => [...p, { id: gid(), label: '', href: '#' }])} variant="ghost" size="sm" className="text-gold-400 hover:bg-forest-800"><Plus className="w-4 h-4 mr-1" /> Add Link</Button>
        </div>
        <div className="space-y-2">
          {quickLinks.map((link) => (
            <div key={link.id} className="flex items-center gap-2">
              <input value={link.label} onChange={(e) => setQuickLinks((p) => p.map((l) => l.id === link.id ? { ...l, label: e.target.value } : l))} className={ic + " flex-1"} placeholder="Label (e.g. Home)" />
              <input value={link.href} onChange={(e) => setQuickLinks((p) => p.map((l) => l.id === link.id ? { ...l, href: e.target.value } : l))} className={ic + " flex-1"} placeholder="#home" />
              <button type="button" onClick={() => setQuickLinks((p) => p.filter((l) => l.id !== link.id))} className="text-red-400 hover:text-red-300 p-2 rounded hover:bg-red-950/30 flex-shrink-0"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-forest-900/50 border border-forest-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-forest-800 pb-2">
          <h2 className="text-sm font-semibold text-forest-200 uppercase tracking-wider">Social Links</h2>
          <Button type="button" onClick={() => setSocialLinks((p) => [...p, { id: gid(), platform: 'facebook', url: '', label: 'Facebook' }])} variant="ghost" size="sm" className="text-gold-400 hover:bg-forest-800"><Plus className="w-4 h-4 mr-1" /> Add Social</Button>
        </div>
        <div className="space-y-2">
          {socialLinks.map((link) => (
            <div key={link.id} className="flex items-center gap-2">
              <select value={link.platform} onChange={(e) => setSocialLinks((p) => p.map((l) => l.id === link.id ? { ...l, platform: e.target.value, label: e.target.value } : l))} className={ic + " w-36 flex-shrink-0"}>
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="youtube">YouTube</option>
                <option value="twitter">Twitter</option>
              </select>
              <input value={link.url} onChange={(e) => setSocialLinks((p) => p.map((l) => l.id === link.id ? { ...l, url: e.target.value } : l))} className={ic + " flex-1"} placeholder="https://..." />
              <button type="button" onClick={() => setSocialLinks((p) => p.filter((l) => l.id !== link.id))} className="text-red-400 hover:text-red-300 p-2 rounded hover:bg-red-950/30 flex-shrink-0"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
