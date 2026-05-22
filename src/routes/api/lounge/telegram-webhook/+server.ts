import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/supabase/supabase';
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const payload = await request.json();
    console.log('Received Telegram webhook payload:', JSON.stringify(payload));

    const message = payload.message;
    if (!message || !message.text) {
      // Return 200 OK so Telegram doesn't retry sending non-text or empty events
      return json({ success: true, message: 'No text message found' });
    }

    const senderChatId = message.chat.id.toString();
    const adminChatId = env.TELEGRAM_ADMIN_CHAT_ID;

    // Verify the message comes from the authorized admin
    if (!adminChatId || senderChatId !== adminChatId) {
      console.warn(`Unauthorized chat attempt from ID: ${senderChatId}. Admin ID: ${adminChatId}`);
      return json({ error: 'Unauthorized' }, { status: 403 });
    }

    const replyText = message.text;

    // Insert the admin's message into Supabase messages table
    const { data, error } = await supabase
      .from('messages')
      .insert({
        username: 'Abrorilhuda', // Admin username as specified by the user
        message: replyText
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting admin message from Telegram into Supabase:', error);
      return json({ error: 'Failed to insert message' }, { status: 500 });
    }

    return json({ success: true, data });
  } catch (err) {
    console.error('Error in Telegram Webhook endpoint:', err);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};
