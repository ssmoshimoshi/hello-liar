'use server';

import { revalidatePath } from 'next/cache';
import { addLie, incrementDoubt } from './mock-db';

export async function submitLie(content_id: string, content_en: string) {
  if (!content_id || !content_en) return { error: "Content is required" };
  
  const lie = await addLie(content_id, content_en);
  revalidatePath('/');
  return { success: true, id: lie.id };
}

export async function addDoubt(id: string) {
  const newCount = await incrementDoubt(id);
  revalidatePath(`/read/${id}`);
  revalidatePath('/');
  return { success: true, count: newCount };
}
