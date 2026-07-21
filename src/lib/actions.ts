'use server';

import { revalidatePath } from 'next/cache';
import { supabase } from './supabase';

export async function submitLie(content_id: string, content_en: string) {
  if (!content_id || !content_en) return { error: "Content is required" };
  
  // Validation: length check
  if (content_id.length < 10 || content_en.length < 10) return { error: "Content must be at least 10 characters long" };
  if (content_id.length > 500 || content_en.length > 500) return { error: "Content must be less than 500 characters long" };

  // Sanitization: strip basic HTML tags
  const sanitizedId = content_id.replace(/<[^>]*>?/gm, '');
  const sanitizedEn = content_en.replace(/<[^>]*>?/gm, '');

  const { data, error } = await supabase
    .from('lies')
    .insert([{ content_id: sanitizedId, content_en: sanitizedEn }])
    .select('id')
    .single();

  if (error || !data) {
    console.error("Error inserting lie:", error);
    return { error: "Failed to submit lie" };
  }

  revalidatePath('/', 'layout');
  return { success: true, id: data.id };
}

export async function addDoubt(id: string) {
  // Atomic increment via Supabase RPC
  const { error } = await supabase.rpc('increment_doubt', { lie_id: id });

  if (error) {
    console.error("Error incrementing doubt:", error);
    return { error: "Failed to update doubt" };
  }

  revalidatePath('/', 'layout');
  return { success: true };
}

export async function addResonate(id: string) {
  // Atomic increment via Supabase RPC
  const { error } = await supabase.rpc('increment_resonate', { lie_id: id });

  if (error) {
    console.error("Error incrementing resonate:", error);
    return { error: "Failed to update resonate" };
  }

  revalidatePath('/', 'layout');
  revalidatePath(`/read/${id}`, 'page');
  return { success: true };
}

export async function markIllustrated(id: string, imageUrl: string) {
  const { error } = await supabase.rpc('mark_illustrated', { 
    lie_id: id,
    img_url: imageUrl
  });

  if (error) {
    console.error("Error marking illustrated:", error);
    return { error: "Failed to mark as illustrated" };
  }

  revalidatePath('/', 'layout');
  revalidatePath(`/read/${id}`, 'page');
  revalidatePath('/illustrated', 'page');
  return { success: true };
}
