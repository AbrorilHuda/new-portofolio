import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/supabase/supabase';
import { env } from '$env/dynamic/private';

function escapeHTML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const { username, message } = await request.json();

    if (!username || !message || typeof username !== 'string' || typeof message !== 'string') {
      return json({ error: 'Username and message are required' }, { status: 400 });
    }

    const cleanUsername = username.trim();
    const reservedNames = ['abrorilhuda', 'abror', 'admin', 'owner', 'moderator'];

    // Protect reserved owner handles unless authenticated as admin
    if (reservedNames.includes(cleanUsername.toLowerCase())) {
      if (!locals.user) {
        return json(
          { error: `Nama "${cleanUsername}" dilindungi dan hanya dapat digunakan oleh pemilik website.` },
          { status: 403 }
        );
      }
    }

    // Insert message into Supabase 'messages' table
    const { data, error } = await supabase
      .from('messages')
      .insert({ username: cleanUsername, message: message.trim() })
      .select()
      .single();

    if (error) {
      console.error('Error inserting message into Supabase:', error);
      return json({ error: 'Failed to save message' }, { status: 500 });
    }

    const botToken = env.TELEGRAM_BOT_TOKEN;
    const adminChatId = env.TELEGRAM_ADMIN_CHAT_ID;

    // Send notification to Telegram bot if configured
    if (botToken && adminChatId) {
      try {
        const escapedUsername = escapeHTML(cleanUsername);
        const escapedMessage = escapeHTML(message.trim());
        const text = `💬 <b>Pesan Baru di abrorilhuda.me/lounge</b>\n👤 <b>${escapedUsername}</b>:\n${escapedMessage}`;
        const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

        fetch(telegramUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: adminChatId,
            text: text,
            parse_mode: 'HTML'
          })
        }).then(async res => {
          if (!res.ok) {
            const errorText = await res.text().catch(() => '');
            console.error(`Telegram API responded with status ${res.status}:`, errorText);
          }
        }).catch(err => {
          console.error('Error sending message to Telegram:', err);
        });
      } catch (tgErr) {
        console.error('Telegram webhook fetch failed:', tgErr);
      }
    }

    return json({ success: true, data });
  } catch (err) {
    console.error('Error in lounge send API:', err);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};
