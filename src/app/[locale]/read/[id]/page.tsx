import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import StoryReader from '@/components/StoryReader';

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
