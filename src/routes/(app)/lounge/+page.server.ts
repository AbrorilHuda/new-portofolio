import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabase/supabase';

export const load: PageServerLoad = async ({ locals }) => {
  // Fetch the latest 100 messages from the database
  const { data: messages, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('Error fetching initial lounge messages:', error);
    return {
      messages: [],
      isAdmin: !!locals.user,
      user: locals.user ? { email: locals.user.email } : null
    };
  }

  // Reverse to chronological order (oldest at top, newest at bottom)
  const sortedMessages = (messages || []).reverse();

  return {
    messages: sortedMessages,
    isAdmin: !!locals.user,
    user: locals.user ? { email: locals.user.email } : null
  };
};
