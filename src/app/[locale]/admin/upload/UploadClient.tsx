'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { markIllustrated } from '@/lib/actions';
import { useTranslations } from 'next-intl';

interface Props {
  lieId: string;
  lieContentEn: string;
  lieContentId: string;
  locale: string;
}

export default function UploadClient({ lieId, lieContentEn, lieContentId, locale }: Props) {
  const t = useTranslations('Common');
  
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select an image');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${lieId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `public/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('illustrations')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('illustrations')
        .getPublicUrl(filePath);

      const res = await markIllustrated(lieId, data.publicUrl);
      
      if (res.error) {
        throw new Error(res.error);
      }

      setSuccess(true);
      
    } catch (err: any) {
      setError(err.message || 'Failed to upload illustration');
    } finally {
      setIsUploading(false);
    }
  };

  const content = locale === 'en' ? lieContentEn : lieContentId;

  // Instagram Caption Template
  const igCaption = `"${content}"\n\n— Hello Liar\nhelloliar.web/read/${lieId}`;

  if (success) {
    return (
      <div className="text-center py-20 border border-[var(--color-living-coral)]">
        <h2 className="text-2xl font-serif text-[var(--color-living-coral)] mb-4">Art Published!</h2>
        <p className="text-[11px] font-sans uppercase tracking-[0.2em] mb-8" style={{ color: 'var(--gray-400)' }}>
          The story has been updated.
        </p>
        <div className="flex gap-4 justify-center">
          <a href={`/${locale}/read/${lieId}`} className="px-6 py-3 border border-[var(--gray-200)] text-[11px] font-sans uppercase tracking-[0.1em] hover:border-foreground">View Story</a>
          <a href={`/${locale}/admin/dashboard`} className="px-6 py-3 bg-foreground text-background text-[11px] font-sans uppercase tracking-[0.1em]">Back to Dashboard</a>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      
      {/* Upload Column */}
      <div className="space-y-8 border border-[var(--gray-200)] p-8">
        <div>
          <label className="block text-[10px] font-sans uppercase tracking-[0.2em] mb-2" style={{ color: 'var(--gray-500)' }}>Target Story Nᵒ {lieId.slice(0,8)}</label>
          <p className="font-serif leading-relaxed line-clamp-2">&ldquo;{content}&rdquo;</p>
        </div>

        <div className="border-t border-[var(--gray-200)] pt-8">
          <label className="block text-[10px] font-sans uppercase tracking-[0.2em] mb-4" style={{ color: 'var(--gray-500)' }}>Illustration Image</label>
          
          <div className="mb-4">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              className="block w-full text-[11px] font-sans file:mr-4 file:py-2 file:px-4 file:border-0 file:text-[11px] file:font-sans file:uppercase file:tracking-[0.1em] file:bg-[var(--gray-100)] file:text-foreground hover:file:bg-[var(--gray-200)]"
            />
          </div>

          {error && <p className="text-[10px] font-sans text-red-500 mb-4">{error}</p>}

          <button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="w-full py-4 bg-[var(--color-living-coral)] text-white font-sans font-bold uppercase tracking-[0.1em] text-[11px] disabled:opacity-50"
          >
            {isUploading ? 'Uploading...' : t('uploadBtn')}
          </button>
        </div>
      </div>

      {/* Preview Column */}
      <div className="space-y-8">
        <p className="text-[10px] font-sans uppercase tracking-[0.2em]" style={{ color: 'var(--gray-500)' }}>Preview & Share</p>
        
        <div className="aspect-square bg-[var(--gray-100)] border border-[var(--gray-200)] flex items-center justify-center overflow-hidden">
          {preview ? (
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <span className="text-[10px] font-sans uppercase tracking-[0.2em]" style={{ color: 'var(--gray-400)' }}>800 x 800</span>
          )}
        </div>

        <div>
          <label className="block text-[10px] font-sans uppercase tracking-[0.2em] mb-2" style={{ color: 'var(--gray-500)' }}>Instagram Caption Template</label>
          <textarea 
            readOnly 
            value={igCaption}
            rows={5}
            className="w-full p-4 text-[12px] font-sans bg-[var(--gray-100)] border border-[var(--gray-200)] resize-none focus:outline-none"
          />
          <button 
            onClick={() => navigator.clipboard.writeText(igCaption)}
            className="mt-2 text-[10px] font-sans uppercase tracking-[0.1em] text-[var(--color-living-coral)] hover:underline"
          >
            Copy Caption
          </button>
        </div>
      </div>

    </div>
  );
}
