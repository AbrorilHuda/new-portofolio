import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDirectPdfDownloadUrl, initialCVData, sanitizeCVData } from '$lib/data/cv';

export const GET: RequestHandler = async ({ locals }) => {
  let pdfUrl = initialCVData.pdf_url || '';

  try {
    const { data } = await locals.supabase
      .from('cv_profile')
      .select('data')
      .eq('id', 'default')
      .maybeSingle();

    if (data?.data) {
      const sanitized = sanitizeCVData(data.data);
      pdfUrl = sanitized.pdf_url || '';
    }
  } catch (err) {
    console.warn('Error fetching cv_profile for download:', err);
  }

  const downloadUrl = getDirectPdfDownloadUrl(pdfUrl);
  if (!downloadUrl) {
    throw error(404, 'File CV PDF belum tersedia.');
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(downloadUrl);
    if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
      throw new Error('Invalid protocol');
    }
  } catch {
    throw error(400, 'URL file CV tidak valid.');
  }

  // Use native globalThis.fetch so external redirects (e.g. Google Drive -> usercontent) work reliably
  const upstream = await globalThis.fetch(parsedUrl.toString(), {
    redirect: 'follow',
    headers: {
      Accept: 'application/pdf, application/octet-stream, */*',
    },
  });

  if (!upstream.ok || !upstream.body) {
    console.error('CV upstream fetch failed:', upstream.status, upstream.statusText, parsedUrl.toString());
    throw error(502, `Gagal mengambil file CV dari sumber (HTTP ${upstream.status}).`);
  }

  const contentType = upstream.headers.get('content-type') || '';
  if (contentType.includes('text/html')) {
    throw error(
      502,
      'File CV belum dapat diakses secara publik. Pastikan akses Google Drive disetel ke "Siapa saja yang memiliki link".'
    );
  }

  const headers = new Headers({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'attachment; filename="CV-Moh-Abroril-Huda.pdf"',
    'Cache-Control': 'public, max-age=300',
  });

  const contentLength = upstream.headers.get('content-length');
  if (contentLength) {
    headers.set('Content-Length', contentLength);
  }

  return new Response(upstream.body, {
    status: 200,
    headers,
  });
};
