import { getLieById } from '@/lib/mock-db';
import { notFound } from 'next/navigation';
import StoryReader from '@/components/StoryReader';

export default async function ReadPage({
  params
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  const lie = await getLieById(id);

  if (!lie) {
    notFound();
  }

  return (
    <div className="w-full flex-grow flex flex-col">
      <StoryReader initialLie={lie} locale={locale} />
    </div>
  );
}
