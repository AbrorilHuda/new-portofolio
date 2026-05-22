import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabase/supabase';

export const load: PageServerLoad = async () => {
  // Fetch the latest 100 messages from the database
  const { data: messages, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('Error fetching initial lounge messages:', error);
    return {
      messages: []
    };
  }

  // Reverse them to be in chronological order (oldest at the top, newest at the bottom)
  const sortedMessages = (messages || []).reverse();

  return {
    messages: sortedMessages
  };
};
