import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabaseAdmin } from '$lib/supabase/supabase.server';
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const payload = await request.json();
    console.log('Received Telegram webhook payload:', JSON.stringify(payload));

    const message = payload.message;
    if (!message || !message.text) {
      return json({ success: true, message: 'No text message found' });
    }

    const senderChatId = message.chat.id.toString();
    const adminChatId = env.TELEGRAM_ADMIN_CHAT_ID;

    // Verify the message comes from the authorized admin
    if (!adminChatId || senderChatId !== adminChatId) {
      console.warn(`Unauthorized chat attempt from ID: ${senderChatId}. Admin ID: ${adminChatId}`);
      return json({ error: 'Unauthorized' }, { status: 403 });
    }

    const text = message.text.trim();
    const botToken = env.TELEGRAM_BOT_TOKEN;

    if (text === '/pesandelete' || text.startsWith('/pesandelete ')) {
      const { error: deleteError } = await supabaseAdmin
        .from('messages')
        .delete()
        .not('id', 'is', null);

      if (deleteError) {
        console.error('Error deleting messages:', deleteError);

        if (botToken) {
          const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
          await fetch(telegramUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: senderChatId,
              text: `❌ Gagal menghapus pesan: ${deleteError.message}`
            })
          }).catch(err => console.error('Error sending delete failure notification to Telegram:', err));
        }

        return json({ error: 'Failed to delete messages' }, { status: 500 });
      }
      if (botToken) {
        const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
        await fetch(telegramUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: senderChatId,
            text: `🗑️ Semua pesan di lounge berhasil dihapus!`
          })
        }).catch(err => console.error('Error sending delete success notification to Telegram:', err));
      }

      return json({ success: true, message: 'All messages successfully deleted' });
    }

    let replyText = message.text;
    const replyTo = message.reply_to_message;
    if (replyTo && replyTo.text) {
      const text = replyTo.text;

      const nameMatch = text.match(/👤\s*\*?([^*:\n]+)\*?:/);
      if (nameMatch && nameMatch[1]) {
        const targetUser = nameMatch[1].trim();
        const lines = text.split('\n');
        let originalMsgSnippet = '';
        if (lines.length > 2) {
          originalMsgSnippet = lines.slice(2).join('\n').trim();
          if (originalMsgSnippet.length > 60) {
            originalMsgSnippet = originalMsgSnippet.substring(0, 57) + '...';
          }
        }

        if (originalMsgSnippet) {
          replyText = `💬 Membalas @${targetUser}: "${originalMsgSnippet}"\n\n${message.text}`;
        } else {
          replyText = `💬 Membalas @${targetUser}\n\n${message.text}`;
        }
      }
    }

    // Insert the admin's message into Supabase messages table
    const { data, error } = await supabaseAdmin
      .from('messages')
      .insert({
        username: 'Abrorilhuda',
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
