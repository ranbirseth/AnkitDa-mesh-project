'use client';

import { useState } from 'react';
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

  const { register, handleSubmit, formState: { errors } } = useForm<RoomFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: initialData || {
      currency: 'INR',
      status: 'available',
      featured: false,
      capacityAdults: 1,
      priceMonthly: 4000,
      features: [],
      gallery: [],
      primaryImage: { id: 'temp', url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267', alt: 'Placeholder' } // Simple fallback for now
    },
  });

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

      if (!res.ok) throw new Error('Failed to save room');

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
          <div className="flex items-center mt-7">
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

        {/* Note: In a real app, Media Picker and Features array would go here. For now we use the hidden default values for complex nested arrays to allow basic saving. */}
        <div className="p-4 bg-forest-800/30 rounded-lg border border-forest-700">
          <p className="text-sm text-forest-300">
            * Note: Media upload and amenities selection would require a custom MediaPicker component. Default placeholders are used to satisfy validation for this demo.
          </p>
        </div>

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
