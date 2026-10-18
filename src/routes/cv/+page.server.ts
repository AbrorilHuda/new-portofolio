import { initialCVData, sanitizeCVData, type CVData } from '$lib/data/cv';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  let cv: CVData = initialCVData;

  try {
    const { data, error } = await locals.supabase
      .from('cv_profile')
      .select('data')
      .eq('id', 'default')
      .maybeSingle();

    if (!error && data?.data) {
      cv = sanitizeCVData(data.data);
    }
  } catch (err) {
    console.warn('Error reading cv_profile from database, fallback to initial data:', err);
    cv = initialCVData;
  }

  return {
    cv,
    isAdmin: !!locals.user
  };
};
