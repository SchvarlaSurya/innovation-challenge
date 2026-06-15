/**
 * app/login/page.tsx — Login page with CleanProof design
 */
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      setError('Email atau password salah.');
      return;
    }

    // Success → go back to the page they tried to visit, or /admin
    const callbackUrl = new URLSearchParams(window.location.search).get('callbackUrl');
    router.push(callbackUrl || '/admin');
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left — Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden flex-col justify-between p-12 text-on-primary">
        {/* Decorative shapes */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary-container/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-fixed/10 rounded-full blur-2xl"></div>
        
        <div className="z-10">
          <h1 className="text-4xl font-bold tracking-tight">CleanProof</h1>
          <p className="mt-2 text-primary-fixed-dim text-sm">Management System</p>
        </div>
        
        <div className="z-10 max-w-md">
          <blockquote className="text-lg font-medium leading-relaxed opacity-90">
            &ldquo;Kebersihan adalah sebagian dari iman. Dengan CleanProof, kita buktikan komitmen kita.&rdquo;
          </blockquote>
          <p className="mt-4 text-sm opacity-60">— Tim OSIS Divisi Kebersihan</p>
        </div>

        <div className="z-10 flex items-center gap-3">
          <span className="material-symbols-outlined text-3xl opacity-60" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
          <div>
            <p className="text-sm font-semibold">Sistem Terverifikasi</p>
            <p className="text-xs opacity-60">Platform Resmi OSIS</p>
          </div>
        </div>
      </div>

      {/* Right — Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-3xl font-bold text-primary">CleanProof</h1>
            <p className="text-sm text-on-surface-variant">Management System</p>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-8 shadow-lg">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-container text-on-primary-container rounded-2xl mb-4">
                <span className="material-symbols-outlined text-3xl">lock</span>
              </div>
              <h2 className="text-2xl font-bold text-on-surface">Selamat Datang</h2>
              <p className="mt-2 text-sm text-on-surface-variant">
                Masuk dengan akun OSIS Anda untuk mengakses dashboard.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="flex items-center gap-3 p-4 bg-error-container text-on-error-container rounded-xl text-sm font-semibold">
                  <span className="material-symbols-outlined text-lg">error</span>
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-on-surface mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-lg">mail</span>
                  </span>
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-surface-container border border-outline-variant rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    placeholder="osis@sman.sch.id"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-on-surface mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-lg">key</span>
                  </span>
                  <input
                    id="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-surface-container border border-outline-variant rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-3.5 rounded-xl font-bold text-sm shadow-md hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                    Memproses...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">login</span>
                    Masuk ke Dashboard
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-outline-variant">
              <a
                href="/"
                className="flex items-center justify-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors font-semibold"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Kembali ke Beranda
              </a>
            </div>
          </div>

          <p className="text-center text-xs text-on-surface-variant mt-6">
            © 2026 CleanProof • Dibuat oleh Tim IT OSIS
          </p>
        </div>
      </div>
    </div>
  );
}
