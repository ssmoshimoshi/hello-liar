import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import StoryReader from '@/components/StoryReader';

export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string; locale: string }>;
}): Promise<Metadata> {
  const { id, locale } = await params;

  const { data: lie } = await supabase
    .from('lies')
    .select('*')
    .eq('id', id)
    .single();

  if (!lie) return { title: 'Not Found' };

  const content = locale === 'en' ? lie.content_en : lie.content_id;
  const title = `Hello Liar — Nᵒ ${lie.id.slice(0, 8)}`;
  const description = content;
  const image = lie.illustration_url || '/og-default.png';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    }
  };
}

export default async function ReadPage({
  params
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  
  const { data: lie } = await supabase
    .from('lies')
    .select('*')
    .eq('id', id)
    .single();

  if (!lie) {
    notFound();
  }

  return (
    <div className="w-full flex-grow flex flex-col">
      <StoryReader initialLie={lie} locale={locale} />
    </div>
  );
}
