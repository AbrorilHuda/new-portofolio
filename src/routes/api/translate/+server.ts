import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { CHATANYWHERE_API_KEY, AI_MODEL, API_URL } from '$env/static/private';

// Helper: Translate a single small chunk (<= 350 chars)
async function translateChunk(chunk: string): Promise<string> {
  if (!chunk || !chunk.trim()) return '';

  const cleanChunk = chunk.trim();

  // 1. Try Google Translate gtx with proper Browser User-Agent
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=id&tl=en&dt=t&q=${encodeURIComponent(cleanChunk)}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': '*/*'
      }
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data[0] && Array.isArray(data[0])) {
        const text = data[0].map((item: any) => item[0] || '').join('');
        if (text && !text.includes('QUERY LENGTH LIMIT EXCEEDED')) {
          return text;
        }
      }
    }
  } catch (err) {
    console.warn('Google Translate chunk error:', err);
  }

  // 2. Backup: MyMemory Free API (Strict 500 chars limit)
  if (cleanChunk.length <= 450) {
    try {
      const fallbackUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(cleanChunk)}&langpair=id|en`;
      const res = await fetch(fallbackUrl);
      if (res.ok) {
        const data = await res.json();
        const translatedText = data?.responseData?.translatedText;
        if (translatedText && !translatedText.includes('QUERY LENGTH LIMIT EXCEEDED')) {
          return translatedText;
        }
      }
    } catch (err) {
      console.warn('MyMemory fallback error:', err);
    }
  }

  return cleanChunk;
}

// Helper: Process long markdown text into safe 300-character chunks
async function translateLongText(text: string): Promise<string> {
  if (!text || !text.trim()) return '';

  const lines = text.split('\n');
  const chunks: string[] = [];

  for (const line of lines) {
    if (line.length <= 300) {
      chunks.push(line);
    } else {
      // Split long lines into ~300-character sub-chunks by spaces
      const subChunks = line.match(/.{1,300}(\s+|$)/g) || [line];
      for (const sub of subChunks) {
        chunks.push(sub);
      }
    }
  }

  // Execute translations in small batches of 3
  const results: string[] = [];
  for (let i = 0; i < chunks.length; i += 3) {
    const batch = chunks.slice(i, i + 3);
    const batchResults = await Promise.all(batch.map(c => translateChunk(c)));
    results.push(...batchResults);
  }

  return results.join('\n');
}

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    // Only authenticated admins can trigger auto-translation
    if (!locals.user) {
      return json({ error: 'Unauthorized access' }, { status: 401 });
    }

    const { title, excerpt, content } = await request.json();

    if (!title && !content) {
      return json({ error: 'Title or content is required for translation' }, { status: 400 });
    }

    let title_en = '';
    let excerpt_en = '';
    let content_en = '';
    let aiSuccess = false;

    // Attempt 1: AI Translation (ChatAnywhere / OpenAI)
    if (CHATANYWHERE_API_KEY && API_URL) {
      try {
        const systemMessage = "You are an expert technical translator. Translate Indonesian developer blog posts to English. Maintain all Markdown syntax (#, **, list items, code blocks ```) intact. Output ONLY valid JSON.";
        const userPrompt = `Translate the following to English:
Title: ${title || ''}
Excerpt: ${excerpt || ''}
Content:
${content || ''}

JSON Response Format:
{
  "title_en": "...",
  "excerpt_en": "...",
  "content_en": "..."
}`;

        const aiRes = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CHATANYWHERE_API_KEY}`
          },
          body: JSON.stringify({
            model: AI_MODEL || 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: systemMessage },
              { role: 'user', content: userPrompt }
            ],
            max_tokens: 2500,
            temperature: 0.2
          })
        });

        if (aiRes.ok) {
          const aiData = await aiRes.json();
          const rawText = aiData?.choices?.[0]?.message?.content?.trim() || '';
          
          // Clean JSON string if enclosed in markdown code blocks
          const cleanJson = rawText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
          const parsed = JSON.parse(cleanJson);

          if (parsed.title_en || parsed.content_en) {
            title_en = parsed.title_en || '';
            excerpt_en = parsed.excerpt_en || '';
            content_en = parsed.content_en || '';
            aiSuccess = true;
          }
        } else {
          const errText = await aiRes.text();
          console.warn('AI API HTTP Error:', aiRes.status, errText);
        }
      } catch (aiErr) {
        console.warn('AI translation error, switching to Fallback Engine:', aiErr);
      }
    }

    // Attempt 2: Fallback to Multi-Engine Safe 300-Char Chunked Translator if AI failed
    if (!aiSuccess) {
      console.log('Executing Multi-Engine 300-Char Chunked Fallback...');
      const [transTitle, transExcerpt, transContent] = await Promise.all([
        translateLongText(title || ''),
        translateLongText(excerpt || ''),
        translateLongText(content || '')
      ]);

      title_en = transTitle;
      excerpt_en = transExcerpt;
      content_en = transContent;
    }

    return json({
      success: true,
      data: {
        title_en,
        excerpt_en,
        content_en,
        engine: aiSuccess ? 'ai' : 'fallback'
      }
    });

  } catch (err: any) {
    console.error('Error in translate API endpoint:', err);
    return json({ error: err.message || 'Internal translation error' }, { status: 500 });
  }
};
