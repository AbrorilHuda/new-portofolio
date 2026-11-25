import { initialCVData, sanitizeCVData, type CVData } from '$lib/data/cv';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  let cv: CVData = initialCVData;
  let updatedAt: string | null = null;

  try {
    const { data, error } = await locals.supabase
      .from('cv_profile')
      .select('data, updated_at')
      .eq('id', 'default')
      .maybeSingle();

    if (!error && data?.data) {
      cv = sanitizeCVData(data.data);
      updatedAt = data.updated_at || null;
    }
  } catch (err) {
    console.warn('Error reading cv_profile from database, fallback to initial data:', err);
    cv = initialCVData;
  }

  return {
    cv,
    updatedAt,
    isAdmin: !!locals.user
  };
};
