/**
 * Lightweight Autonomous Bilingual Translation Engine (ID ↔ EN).
 * Detects the origin language and seamlessly generates twin language versions
 * for universal storage without blocking or external dependencies.
 */

async function fetchTranslate(text: string, targetLang: 'id' | 'en'): Promise<{ translated: string; detected: string }> {
  try {
    const res = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`,
      { 
        headers: { 'User-Agent': 'Mozilla/5.0' },
        cache: 'no-store'
      }
    );
    if (!res.ok) {
      return { translated: text, detected: 'unknown' };
    }
    const data = await res.json();
    const translated = Array.isArray(data[0]) 
      ? data[0].map((s: any) => s[0]).join('') 
      : text;
    const detected = typeof data[2] === 'string' ? data[2] : 'unknown';
    return { translated: translated || text, detected };
  } catch (err) {
    console.error(`[Translation Error -> ${targetLang}]:`, err);
    return { translated: text, detected: 'unknown' };
  }
}

export async function translateBilingual(rawText: string): Promise<{ content_id: string; content_en: string }> {
  if (!rawText || rawText.trim().length === 0) {
    return { content_id: '', content_en: '' };
  }

  const cleanText = rawText.trim();

  try {
    // Attempt initial translation to English to capture translation and language identity
    const { translated: enText, detected } = await fetchTranslate(cleanText, 'en');
    const lang = detected.toLowerCase();

    if (lang.startsWith('id') || lang.startsWith('ms') || lang === 'jw' || lang === 'su') {
      // Original input is Indonesian / Nusantara dialects
      return {
        content_id: cleanText,
        content_en: enText || cleanText
      };
    } else if (lang.startsWith('en')) {
      // Original input is English; generate Indonesian counterpart
      const { translated: idText } = await fetchTranslate(cleanText, 'id');
      return {
        content_id: idText || cleanText,
        content_en: cleanText
      };
    } else {
      // Third-party language origin (e.g. Japanese, French, Spanish) -> generate both target columns
      const { translated: idText } = await fetchTranslate(cleanText, 'id');
      return {
        content_id: idText || cleanText,
        content_en: enText || cleanText
      };
    }
  } catch (err) {
    console.error('[Bilingual Engine Fallback]:', err);
    // Fail-safe fallback ensuring story submission succeeds regardless of external translation latency
    return {
      content_id: cleanText,
      content_en: cleanText
    };
  }
}
