import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { initialCVData, sanitizeCVData, type CVData } from '$lib/data/cv';

export const load: PageServerLoad = async ({ locals }) => {
  let cv: CVData = initialCVData;
  let hasDbRecord = false;

  try {
    const { data, error } = await locals.supabase
      .from('cv_profile')
      .select('data, updated_at')
      .eq('id', 'default')
      .maybeSingle();

    if (!error && data?.data) {
      cv = sanitizeCVData(data.data);
      hasDbRecord = true;
    }
  } catch (err) {
    console.error('Error fetching CV data:', err);
  }

  return {
    cv,
    hasDbRecord
  };
};

export const actions: Actions = {
  save: async ({ request, locals }) => {
    const formData = await request.formData();
    const payloadRaw = formData.get('payload') as string;

    if (!payloadRaw) {
      return fail(400, { error: 'Data CV tidak boleh kosong.' });
    }

    try {
      const parsed = JSON.parse(payloadRaw);
      const sanitized = sanitizeCVData(parsed);

      const { error } = await locals.supabase
        .from('cv_profile')
        .upsert(
          {
            id: 'default',
            data: sanitized,
            updated_at: new Date().toISOString()
          },
          { onConflict: 'id' }
        );

      if (error) {
        // Jika tabel belum dibuat di Supabase
        if (error.code === '42P01' || error.message.includes('relation "cv_profile" does not exist')) {
          return fail(500, {
            error:
              'Tabel "cv_profile" belum ada di Supabase. Silakan jalankan file SQL src/lib/supabase/cv.sql di SQL Editor Supabase terlebih dahulu.'
          });
        }
        return fail(500, { error: 'Gagal menyimpan CV: ' + error.message });
      }

      return { success: true, message: 'Data CV berhasil disimpan!' };
    } catch (err: any) {
      return fail(400, { error: 'Format data JSON tidak valid: ' + (err.message || err) });
    }
  },

  reset: async ({ locals }) => {
    try {
      const { error } = await locals.supabase
        .from('cv_profile')
        .upsert(
          {
            id: 'default',
            data: initialCVData,
            updated_at: new Date().toISOString()
          },
          { onConflict: 'id' }
        );

      if (error) {
        return fail(500, { error: 'Gagal mereset CV: ' + error.message });
      }

      return { success: true, message: 'Data CV berhasil direset ke nilai awal template!' };
    } catch (err: any) {
      return fail(500, { error: 'Terjadi kesalahan saat reset: ' + (err.message || err) });
    }
  }
};
