'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
// import { useForm } from 'react-form-hooks'; // Wait, let's just use react-hook-form
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm as useRHF } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/cn';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useRHF<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Failed to login');
      }

      toast.success('Login successful');
      router.push('/admin');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-forest-900 px-4 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-forest-700/30 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-md bg-forest-800/80 backdrop-blur-xl border border-forest-700/50 rounded-2xl p-6 sm:p-8 shadow-2xl z-10 relative mx-4 sm:mx-0">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-gold-500/20">
            <Lock className="w-8 h-8 text-forest-950" />
          </div>
          <h1 className="text-3xl font-serif text-gold-400 font-bold tracking-tight">Ankit Da Mess</h1>
          <p className="text-forest-300 mt-2 text-sm">Secure Admin Portal</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-forest-200 mb-1.5" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-forest-400" />
              </div>
              <input
                id="email"
                type="email"
                disabled={isLoading}
                {...register('email')}
                className={cn(
                  "block w-full pl-10 pr-3 py-2.5 border rounded-lg bg-forest-900/50 text-forest-50 placeholder-forest-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-colors sm:text-sm",
                  errors.email ? "border-red-500/50" : "border-forest-700"
                )}
                placeholder="admin@ankitdamess.in"
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-sm text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-forest-200 mb-1.5" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-forest-400" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                disabled={isLoading}
                {...register('password')}
                className={cn(
                  "block w-full pl-10 pr-10 py-2.5 border rounded-lg bg-forest-900/50 text-forest-50 placeholder-forest-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-colors sm:text-sm",
                  errors.password ? "border-red-500/50" : "border-forest-700"
                )}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-forest-400 hover:text-gold-400 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-sm text-red-400">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-forest-950 font-semibold py-2.5 shadow-lg shadow-gold-500/20"
            disabled={isLoading}
          >
            {isLoading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </Button>
        </form>
      </div>
    </div>
  );
}
