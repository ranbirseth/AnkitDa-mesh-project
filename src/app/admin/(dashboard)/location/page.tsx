'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Save, RefreshCw, Plus, Trash2 } from 'lucide-react';

const ic = "w-full px-3 py-2 bg-forest-950 border border-forest-700 rounded-lg text-forest-50 placeholder-forest-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 text-sm";

interface NearbyPlace { id: string; name: string; distanceKm: number; category: string; walkingMinutes: number; iconKey: string; active: boolean; }

function gid() { return `np-${Date.now().toString(36)}`; }

export default function AdminLocationPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addressLine1, setAddressLine1] = useState('Fuljhore, Rabindra Pally');
  const [city, setCity] = useState('Durgapur');
  const [state, setState] = useState('West Bengal');
  const [postalCode, setPostalCode] = useState('713206');
  const [latitude, setLatitude] = useState('23.5204');
  const [longitude, setLongitude] = useState('87.3119');
  const [mapEmbedUrl, setMapEmbedUrl] = useState('');
  const [mapLink, setMapLink] = useState('');
  const [heading, setHeading] = useState('Prime Location');
  const [subheading, setSubheading] = useState('Nestled in the heart of Durgapur — minutes from colleges, markets, and everything you need.');
  const [nearby, setNearby] = useState<NearbyPlace[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/admin/settings/location');
        const data = await res.json();
        if (data.success && data.data) {
          const d = data.data;
          if (d.addressLine1) setAddressLine1(d.addressLine1);
          if (d.city) setCity(d.city);
          if (d.state) setState(d.state);
          if (d.postalCode) setPostalCode(d.postalCode);
          if (d.latitude) setLatitude(String(d.latitude));
          if (d.longitude) setLongitude(String(d.longitude));
          if (d.googleMapsEmbedUrl) setMapEmbedUrl(d.googleMapsEmbedUrl);
          if (d.mapLink) setMapLink(d.mapLink);
          if (d.heading) setHeading(d.heading);
          if (d.subheading) setSubheading(d.subheading);
          if (Array.isArray(d.nearbyPlaces)) setNearby(d.nearbyPlaces);
        }
      } catch { /* defaults */ } finally { setLoading(false); }
    };
    void load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        id: 'loc-main',
        addressLine1, addressLine2: '', city, state, postalCode, country: 'India',
        latitude: parseFloat(latitude) || 23.5204,
        longitude: parseFloat(longitude) || 87.3119,
        googleMapsEmbedUrl: mapEmbedUrl,
        mapLink, heading, subheading,
        nearbyPlaces: nearby.map((p, i) => ({ ...p, sortOrder: i })),
      };
      const res = await fetch('/api/admin/settings/location', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to save');
      toast.success('Location saved successfully');
    } catch (err: any) { toast.error(err.message); } finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><RefreshCw className="w-6 h-6 text-gold-400 animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-gold-400 font-bold">Location</h1>
          <p className="text-forest-300 mt-1">Edit address, map coordinates, and nearby places.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-gold-500 hover:bg-gold-400 text-forest-950 font-semibold px-6">
          {saving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" />Save Location</>}
        </Button>
      </div>

      <div className="bg-forest-900/50 border border-forest-800 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-forest-200 uppercase tracking-wider border-b border-forest-800 pb-2">Section Header</h2>
        <div><label className="block text-sm font-medium text-forest-200 mb-1.5">Heading</label><input value={heading} onChange={(e) => setHeading(e.target.value)} className={ic} /></div>
        <div><label className="block text-sm font-medium text-forest-200 mb-1.5">Subheading</label><textarea value={subheading} onChange={(e) => setSubheading(e.target.value)} rows={2} className={ic + " resize-none"} /></div>
      </div>

      <div className="bg-forest-900/50 border border-forest-800 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-forest-200 uppercase tracking-wider border-b border-forest-800 pb-2">Address</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-forest-200 mb-1.5">Address Line 1</label><input value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} className={ic} /></div>
          <div><label className="block text-sm font-medium text-forest-200 mb-1.5">City</label><input value={city} onChange={(e) => setCity(e.target.value)} className={ic} /></div>
          <div><label className="block text-sm font-medium text-forest-200 mb-1.5">State</label><input value={state} onChange={(e) => setState(e.target.value)} className={ic} /></div>
          <div><label className="block text-sm font-medium text-forest-200 mb-1.5">Postal Code</label><input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className={ic} /></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-forest-200 mb-1.5">Latitude</label><input value={latitude} onChange={(e) => setLatitude(e.target.value)} className={ic} placeholder="23.5204" /></div>
          <div><label className="block text-sm font-medium text-forest-200 mb-1.5">Longitude</label><input value={longitude} onChange={(e) => setLongitude(e.target.value)} className={ic} placeholder="87.3119" /></div>
        </div>
        <div><label className="block text-sm font-medium text-forest-200 mb-1.5">Google Maps Embed URL</label><input value={mapEmbedUrl} onChange={(e) => setMapEmbedUrl(e.target.value)} className={ic} placeholder="https://www.google.com/maps?q=...&output=embed" /></div>
        <div><label className="block text-sm font-medium text-forest-200 mb-1.5">Google Maps Link (for button)</label><input value={mapLink} onChange={(e) => setMapLink(e.target.value)} className={ic} placeholder="https://www.google.com/maps/..." /></div>
      </div>

      <div className="bg-forest-900/50 border border-forest-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-forest-800 pb-2">
          <h2 className="text-sm font-semibold text-forest-200 uppercase tracking-wider">Nearby Places</h2>
          <Button type="button" onClick={() => setNearby((p) => [...p, { id: gid(), name: '', distanceKm: 0.5, category: 'other', walkingMinutes: 6, iconKey: 'MapPin', active: true }])}
            variant="ghost" size="sm" className="text-gold-400 hover:bg-forest-800"><Plus className="w-4 h-4 mr-1" /> Add Place</Button>
        </div>
        {nearby.length === 0 && <p className="text-forest-400 text-sm text-center py-4">No nearby places. Click &quot;Add Place&quot; to add one.</p>}
        <div className="space-y-3">
          {nearby.map((place) => (
            <div key={place.id} className="bg-forest-950/50 border border-forest-800 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={place.active} onChange={(e) => setNearby((p) => p.map((pl) => pl.id === place.id ? { ...pl, active: e.target.checked } : pl))} className="w-4 h-4 rounded border-forest-700 bg-forest-950 text-gold-500" />
                  <span className="text-xs text-forest-300">Active</span>
                </label>
                <button type="button" onClick={() => setNearby((p) => p.filter((pl) => pl.id !== place.id))} className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-950/30"><Trash2 className="w-4 h-4" /></button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className="col-span-2"><label className="block text-xs text-forest-300 mb-1">Name</label><input value={place.name} onChange={(e) => setNearby((p) => p.map((pl) => pl.id === place.id ? { ...pl, name: e.target.value } : pl))} className={ic} placeholder="e.g. Bus Stand" /></div>
                <div><label className="block text-xs text-forest-300 mb-1">Distance (km)</label><input type="number" step="0.1" value={place.distanceKm} onChange={(e) => setNearby((p) => p.map((pl) => pl.id === place.id ? { ...pl, distanceKm: parseFloat(e.target.value) || 0 } : pl))} className={ic} /></div>
                <div><label className="block text-xs text-forest-300 mb-1">Walk (mins)</label><input type="number" value={place.walkingMinutes} onChange={(e) => setNearby((p) => p.map((pl) => pl.id === place.id ? { ...pl, walkingMinutes: parseInt(e.target.value) || 0 } : pl))} className={ic} /></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
