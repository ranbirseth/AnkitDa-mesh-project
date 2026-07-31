'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Save, RefreshCw } from 'lucide-react';

interface ContactFormData {
  heading: string;
  subheading: string;
  phonePrimary: string;
  phoneSecondary: string;
  whatsapp: string;
  email: string;
  address: string;
  addressMapLink: string;
  openHours: string;
}

const inputCls = "w-full px-3 py-2 bg-forest-950 border border-forest-700 rounded-lg text-forest-50 placeholder-forest-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 text-sm";

export default function AdminContactPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset } = useForm<ContactFormData>({
    defaultValues: {
      heading: 'Get In Touch',
      subheading: 'Have a question about availability or pricing? Send us a message or call us directly.',
      phonePrimary: '+91 96145 01727',
      phoneSecondary: '+91 96145 01727',
      whatsapp: '+919614501727',
      email: 'ap423637@gmail.com',
      address: 'Fuljhore, Rabindra Pally, Durgapur - 713206, West Bengal',
      addressMapLink: 'https://www.google.com/maps/search/?api=1&query=Fuljhore+Rabindra+Pally+Durgapur+713206+West+Bengal',
      openHours: 'Open 24x7',
    },
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/admin/settings/contact');
        const data = await res.json();
        if (data.success && data.data) {
          const d = data.data;
          reset({
            heading: d.heading || 'Get In Touch',
            subheading: d.subheading || '',
            phonePrimary: d.phonePrimary || '',
            phoneSecondary: d.phoneSecondary || '',
            whatsapp: d.whatsapp || '',
            email: d.email || '',
            address: d.address || '',
            addressMapLink: d.addressMapLink || '',
            openHours: d.openHours || '',
          });
        }
      } catch { /* use defaults */ }
      finally { setLoading(false); }
    };
    void load();
  }, [reset]);

  const onSubmit = async (data: ContactFormData) => {
    setSaving(true);
    try {
      const payload = {
        id: 'contact-main',
        eyebrow: 'CONTACT',
        ...data,
        enquiryTypes: [
          { id: 'single-room', label: 'Single Room' },
          { id: 'shared-room', label: 'Shared Room' },
          { id: 'balcony-room', label: 'Room with Balcony' },
          { id: 'premium-room', label: 'Premium Room' },
          { id: 'long-stay', label: 'Long Stay / Custom Plan' },
          { id: 'general', label: 'General Enquiry' },
        ],
      };
      const res = await fetch('/api/admin/settings/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to save');
      toast.success('Contact info saved successfully');
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
        <h1 className="text-3xl font-serif text-gold-400 font-bold">Contact Info</h1>
        <p className="text-forest-300 mt-1">Edit contact details displayed on the public website.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-forest-900/50 border border-forest-800 rounded-xl p-6 space-y-5">
          <h2 className="text-sm font-semibold text-forest-200 uppercase tracking-wider border-b border-forest-800 pb-2">Section Header</h2>
          <div>
            <label className="block text-sm font-medium text-forest-200 mb-1.5">Heading</label>
            <input {...register('heading')} className={inputCls} placeholder="Get In Touch" />
          </div>
          <div>
            <label className="block text-sm font-medium text-forest-200 mb-1.5">Subheading</label>
            <textarea {...register('subheading')} rows={2} className={inputCls + " resize-none"} />
          </div>
        </div>

        <div className="bg-forest-900/50 border border-forest-800 rounded-xl p-6 space-y-5">
          <h2 className="text-sm font-semibold text-forest-200 uppercase tracking-wider border-b border-forest-800 pb-2">Contact Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-forest-200 mb-1.5">Primary Phone</label>
              <input {...register('phonePrimary')} className={inputCls} placeholder="+91 96145 01727" />
            </div>
            <div>
              <label className="block text-sm font-medium text-forest-200 mb-1.5">Secondary Phone (optional)</label>
              <input {...register('phoneSecondary')} className={inputCls} placeholder="+91 96145 01727" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-forest-200 mb-1.5">WhatsApp Number</label>
              <input {...register('whatsapp')} className={inputCls} placeholder="+919614501727 (no spaces)" />
            </div>
            <div>
              <label className="block text-sm font-medium text-forest-200 mb-1.5">Email Address</label>
              <input type="email" {...register('email')} className={inputCls} placeholder="ap423637@gmail.com" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-forest-200 mb-1.5">Open Hours</label>
            <input {...register('openHours')} className={inputCls} placeholder="Open 24x7" />
          </div>
        </div>

        <div className="bg-forest-900/50 border border-forest-800 rounded-xl p-6 space-y-5">
          <h2 className="text-sm font-semibold text-forest-200 uppercase tracking-wider border-b border-forest-800 pb-2">Address</h2>
          <div>
            <label className="block text-sm font-medium text-forest-200 mb-1.5">Full Address</label>
            <textarea {...register('address')} rows={2} className={inputCls + " resize-none"} placeholder="Fuljhore, Rabindra Pally, Durgapur - 713206, West Bengal" />
          </div>
          <div>
            <label className="block text-sm font-medium text-forest-200 mb-1.5">Google Maps Link</label>
            <input {...register('addressMapLink')} className={inputCls} placeholder="https://www.google.com/maps/..." />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} className="bg-gold-500 hover:bg-gold-400 text-forest-950 font-semibold px-8">
            {saving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" />Save Contact Info</>}
          </Button>
        </div>
      </form>
    </div>
  );
}
