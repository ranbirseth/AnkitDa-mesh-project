'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Save, RefreshCw, Plus, Trash2 } from 'lucide-react';

interface Feature {
  id: string;
  iconKey: string;
  title: string;
  description: string;
  sortOrder: number;
  active: boolean;
}

const inputCls = "w-full px-3 py-2 bg-forest-950 border border-forest-700 rounded-lg text-forest-50 placeholder-forest-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 text-sm";

function generateId() {
  return `wcu-${Date.now().toString(36)}`;
}

export default function AdminWhyChooseUsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heading, setHeading] = useState('Why Choose Ankit Da Mess?');
  const [subheading, setSubheading] = useState('More than a PG — a community built for comfort, safety, and productivity.');
  const [features, setFeatures] = useState<Feature[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/admin/settings/why-choose-us');
        const data = await res.json();
        if (data.success && data.data) {
          const d = data.data;
          if (d.heading) setHeading(d.heading);
          if (d.subheading) setSubheading(d.subheading);
          if (Array.isArray(d.features)) setFeatures(d.features);
        }
      } catch { /* use defaults */ }
      finally { setLoading(false); }
    };
    void load();
  }, []);

  const addFeature = () => {
    setFeatures((prev) => [
      ...prev,
      { id: generateId(), iconKey: 'Star', title: '', description: '', sortOrder: prev.length, active: true },
    ]);
  };

  const removeFeature = (id: string) => {
    setFeatures((prev) => prev.filter((f) => f.id !== id));
  };

  const updateFeature = (id: string, field: keyof Feature, value: string | boolean | number) => {
    setFeatures((prev) => prev.map((f) => f.id === id ? { ...f, [field]: value } : f));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        id: 'wcu-main',
        heading,
        subheading,
        features: features.map((f, i) => ({ ...f, sortOrder: i })),
      };
      const res = await fetch('/api/admin/settings/why-choose-us', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to save');
      toast.success('Why Choose Us saved successfully');
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-gold-400 font-bold">Why Choose Us</h1>
          <p className="text-forest-300 mt-1">Edit the &quot;Why Choose Ankit Da Mess?&quot; section.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-gold-500 hover:bg-gold-400 text-forest-950 font-semibold px-6">
          {saving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" />Save Changes</>}
        </Button>
      </div>

      {/* Section heading */}
      <div className="bg-forest-900/50 border border-forest-800 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-forest-200 uppercase tracking-wider border-b border-forest-800 pb-2">Section Header</h2>
        <div>
          <label className="block text-sm font-medium text-forest-200 mb-1.5">Section Heading</label>
          <input value={heading} onChange={(e) => setHeading(e.target.value)} className={inputCls} placeholder="Why Choose Ankit Da Mess?" />
        </div>
        <div>
          <label className="block text-sm font-medium text-forest-200 mb-1.5">Section Subheading</label>
          <textarea value={subheading} onChange={(e) => setSubheading(e.target.value)} rows={2} className={inputCls + " resize-none"} />
        </div>
      </div>

      {/* Features */}
      <div className="bg-forest-900/50 border border-forest-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-forest-800 pb-2">
          <h2 className="text-sm font-semibold text-forest-200 uppercase tracking-wider">Features</h2>
          <Button type="button" onClick={addFeature} variant="ghost" size="sm" className="text-gold-400 hover:text-gold-300 hover:bg-forest-800">
            <Plus className="w-4 h-4 mr-1" /> Add Feature
          </Button>
        </div>

        {features.length === 0 && (
          <p className="text-forest-400 text-sm text-center py-6">No features yet. Click &quot;Add Feature&quot; to add one.</p>
        )}

        <div className="space-y-4">
          {features.map((f, i) => (
            <div key={f.id} className="bg-forest-950/50 border border-forest-800 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-forest-400 font-mono">Feature #{i + 1}</span>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={f.active} onChange={(e) => updateFeature(f.id, 'active', e.target.checked)}
                      className="w-4 h-4 rounded border-forest-700 bg-forest-950 text-gold-500" />
                    <span className="text-xs text-forest-300">Active</span>
                  </label>
                  <button type="button" onClick={() => removeFeature(f.id)}
                    className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-950/30 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-forest-300 mb-1">Title</label>
                  <input value={f.title} onChange={(e) => updateFeature(f.id, 'title', e.target.value)}
                    className={inputCls} placeholder="e.g. Affordable Pricing" />
                </div>
                <div>
                  <label className="block text-xs text-forest-300 mb-1">Icon Key (Lucide icon name)</label>
                  <input value={f.iconKey} onChange={(e) => updateFeature(f.id, 'iconKey', e.target.value)}
                    className={inputCls} placeholder="e.g. Wallet2, ShieldCheck, MapPin" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-forest-300 mb-1">Description</label>
                <textarea value={f.description} onChange={(e) => updateFeature(f.id, 'description', e.target.value)}
                  rows={2} className={inputCls + " resize-none"} placeholder="Short description..." />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
