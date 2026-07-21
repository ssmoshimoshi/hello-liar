'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('Common');

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex-grow flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
      <h2 className="text-4xl md:text-6xl font-serif font-black tracking-tight mb-6">
        Sesuatu Telah Rusak.
      </h2>
      <p className="text-sm font-sans tracking-[0.2em] uppercase mb-12" style={{ color: 'var(--gray-400)' }}>
        Koneksi Terputus / {error.message || 'Unknown Error'}
      </p>
      
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="py-4 px-8 border-2 border-foreground font-sans font-bold uppercase tracking-[0.2em] text-[11px] transition-all hover:bg-foreground hover:text-background"
        >
          Coba Lagi
        </button>
        <Link 
          href="/"
          className="py-4 px-8 border-2 border-transparent font-sans font-bold uppercase tracking-[0.2em] text-[11px] transition-all hover:border-[var(--color-living-coral)] hover:text-[var(--color-living-coral)]"
        >
          Ke Beranda
        </Link>
      </div>
    </div>
  );
}
