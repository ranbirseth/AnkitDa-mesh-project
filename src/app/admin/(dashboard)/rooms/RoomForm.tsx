'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RoomSchema } from '@/types';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

// We omit 'id' for the form schema, or make it optional
const FormSchema = RoomSchema.omit({ id: true });
type RoomFormData = z.infer<typeof FormSchema>;

export default function RoomForm({ initialData, roomId }: { initialData?: any, roomId?: string }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<RoomFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: initialData || {
      currency: 'INR',
      status: 'available',
      featured: false,
      capacityAdults: 1,
      priceMonthly: 4000,
      features: [],
      gallery: [],
      primaryImage: { id: '', url: '', alt: '' },
    },
  });

  const imageUrl = watch('primaryImage.url');
  useEffect(() => {
    if (imageUrl) {
      setValue('primaryImage.id', imageUrl);
    }
  }, [imageUrl, setValue]);

  const onSubmit = async (data: RoomFormData) => {
    setIsSaving(true);
    try {
      const url = roomId ? `/api/admin/rooms/${roomId}` : '/api/admin/rooms';
      const method = roomId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Failed to save room');
      }

      toast.success(roomId ? 'Room updated successfully' : 'Room created successfully');
      router.push('/admin/rooms');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-forest-300 hover:text-gold-400" asChild>
            <Link href="/admin/rooms"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <h1 className="text-2xl font-serif text-gold-400 font-bold">
            {roomId ? 'Edit Room' : 'Add New Room'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-forest-900/50 p-6 md:p-8 rounded-xl border border-forest-800 backdrop-blur-sm">

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-forest-200 mb-1.5">Room Name</label>
            <input
              {...register('name')}
              className="w-full px-3 py-2 bg-forest-950 border border-forest-700 rounded-lg text-forest-50 focus:ring-2 focus:ring-gold-500/50"
              placeholder="e.g. Single Premium Room"
            />
            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-forest-200 mb-1.5">Slug</label>
            <input
              {...register('slug')}
              className="w-full px-3 py-2 bg-forest-950 border border-forest-700 rounded-lg text-forest-50 focus:ring-2 focus:ring-gold-500/50"
              placeholder="e.g. single-premium-room"
            />
            {errors.slug && <p className="text-red-400 text-sm mt-1">{errors.slug.message}</p>}
          </div>
        </div>

        {/* Pricing & Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-forest-200 mb-1.5">Monthly Price (₹)</label>
            <input
              type="number"
              {...register('priceMonthly', { valueAsNumber: true })}
              className="w-full px-3 py-2 bg-forest-950 border border-forest-700 rounded-lg text-forest-50 focus:ring-2 focus:ring-gold-500/50"
            />
            {errors.priceMonthly && <p className="text-red-400 text-sm mt-1">{errors.priceMonthly.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-forest-200 mb-1.5">Status</label>
            <select
              {...register('status')}
              className="w-full px-3 py-2 bg-forest-950 border border-forest-700 rounded-lg text-forest-50 focus:ring-2 focus:ring-gold-500/50"
            >
              <option value="available">Available</option>
              <option value="filled">Filled</option>
              <option value="maintenance">Maintenance</option>
            </select>
            {errors.status && <p className="text-red-400 text-sm mt-1">{errors.status.message}</p>}
          </div>
          <div className="flex items-center md:mt-7">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" {...register('featured')} className="w-5 h-5 rounded border-forest-700 text-gold-500 focus:ring-gold-500/50 bg-forest-950" />
              <span className="text-forest-200 font-medium">Featured Room</span>
            </label>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-forest-200 mb-1.5">Short Description</label>
          <textarea
            {...register('shortDescription')}
            rows={2}
            className="w-full px-3 py-2 bg-forest-950 border border-forest-700 rounded-lg text-forest-50 focus:ring-2 focus:ring-gold-500/50 resize-none"
          />
          {errors.shortDescription && <p className="text-red-400 text-sm mt-1">{errors.shortDescription.message}</p>}
        </div>

        {/* Primary Image */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-forest-200 uppercase tracking-wider border-b border-forest-800 pb-2">Primary Image</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-forest-200 mb-1.5">Image URL</label>
              <input
                {...register('primaryImage.url')}
                className="w-full px-3 py-2 bg-forest-950 border border-forest-700 rounded-lg text-forest-50 focus:ring-2 focus:ring-gold-500/50 text-sm"
                placeholder="https://res.cloudinary.com/..."
              />
              {errors.primaryImage?.url && <p className="text-red-400 text-sm mt-1">{errors.primaryImage.url.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-forest-200 mb-1.5">Image Alt Text</label>
              <input
                {...register('primaryImage.alt')}
                className="w-full px-3 py-2 bg-forest-950 border border-forest-700 rounded-lg text-forest-50 focus:ring-2 focus:ring-gold-500/50 text-sm"
                placeholder="Room photo description"
              />
              {errors.primaryImage?.alt && <p className="text-red-400 text-sm mt-1">{errors.primaryImage.alt.message}</p>}
            </div>
          </div>
          {/* Hidden id field — use URL as id if no media picker */}
          <input type="hidden" {...register('primaryImage.id')} />
        </div>

        {/* Gallery Images */}
        <GalleryImagesField watch={watch} setValue={setValue} />

        <div className="flex justify-end border-t border-forest-800 pt-6">
          <Button
            type="submit"
            disabled={isSaving}
            className="bg-gold-500 hover:bg-gold-400 text-forest-950 font-semibold px-8"
          >
            {isSaving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save Room</>}
          </Button>
        </div>
      </form>
    </div>
  );
}

function GalleryImagesField({
  watch,
  setValue,
}: {
  watch: any;
  setValue: any;
}) {
  const gallery: Array<{ id: string; url: string; alt: string }> = watch('gallery') || [];

  const addImage = () => {
    setValue('gallery', [...gallery, { id: '', url: '', alt: '' }]);
  };

  const removeImage = (idx: number) => {
    setValue('gallery', gallery.filter((_, i) => i !== idx));
  };

  const updateImage = (idx: number, field: 'url' | 'alt', value: string) => {
    const updated = gallery.map((img, i) =>
      i === idx ? { ...img, [field]: value, id: field === 'url' ? value : img.id || img.url } : img
    );
    setValue('gallery', updated);
  };

  const ic = 'w-full px-3 py-2 bg-forest-950 border border-forest-700 rounded-lg text-forest-50 focus:ring-2 focus:ring-gold-500/50 text-sm placeholder-forest-500';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-forest-800 pb-2">
        <h3 className="text-sm font-semibold text-forest-200 uppercase tracking-wider">Gallery Images ({gallery.length})</h3>
        <button
          type="button"
          onClick={addImage}
          className="inline-flex items-center gap-1.5 text-xs text-gold-400 hover:text-gold-300 bg-gold-500/10 hover:bg-gold-500/15 px-3 py-1.5 rounded-lg transition-colors"
        >
          + Add Image
        </button>
      </div>
      {gallery.length === 0 && (
        <p className="text-forest-500 text-sm text-center py-4">No gallery images. Click &quot;Add Image&quot; to add more photos.</p>
      )}
      <div className="space-y-3">
        {gallery.map((img, idx) => (
          <div key={idx} className="bg-forest-950/50 border border-forest-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-forest-500 font-mono">Gallery Image #{idx + 1}</span>
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded hover:bg-red-950/30 transition-colors"
              >
                Remove
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-forest-300 mb-1">Image URL</label>
                <input
                  value={img.url}
                  onChange={e => updateImage(idx, 'url', e.target.value)}
                  className={ic}
                  placeholder="https://res.cloudinary.com/..."
                />
              </div>
              <div>
                <label className="block text-xs text-forest-300 mb-1">Alt Text</label>
                <input
                  value={img.alt}
                  onChange={e => updateImage(idx, 'alt', e.target.value)}
                  className={ic}
                  placeholder="Image description"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
