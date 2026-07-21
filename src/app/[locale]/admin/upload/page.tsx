import { supabase } from '@/lib/supabase';
import { getTranslations } from 'next-intl/server';
import { notFound, redirect } from 'next/navigation';
import UploadClient from './UploadClient';

export default async function UploadPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ id?: string }>;
}) {
  const { locale } = await params;
  const { id } = await searchParams;
  const t = await getTranslations('Common');

  if (!id) {
    redirect(`/${locale}/admin/dashboard`);
  }

  // Fetch the specific lie
  const { data: lie } = await supabase
    .from('lies')
    .select('*')
    .eq('id', id)
    .single();

  if (!lie) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
      <header className="mb-16 border-b border-[var(--gray-200)] pb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-black mb-4">
          {t('uploadTitle')}
        </h1>
        <p className="text-[11px] uppercase tracking-[0.2em] font-sans" style={{ color: 'var(--gray-400)' }}>
          Step 2 of 2
        </p>
      </header>

      <UploadClient 
        lieId={lie.id} 
        lieContentEn={lie.content_en} 
        lieContentId={lie.content_id} 
        locale={locale} 
      />
    </div>
  );
}
