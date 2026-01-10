<!-- ChatWidget.svelte -->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { RealtimeChannel } from '@supabase/supabase-js';
   import { supabase } from '$lib/supabase/supabase';
  
  interface Message {
    id: string | number;
    username: string;
    message: string;
    created_at: string;
  }

  let messages: Message[] = [];
  let newMessage: string = '';
  let username: string = '';
  let isOpen: boolean = false;
  let messagesContainer: HTMLDivElement;
  let realtimeChannel: RealtimeChannel | null = null;

  // Demo mode - set to false when using real Supabase
  const DEMO_MODE: boolean = false;

  onMount(() => {
    if (DEMO_MODE) {
      // Demo messages
      messages = [
        { 
          id: 1, 
          username: 'Visitor', 
          message: 'Hello! Nice portfolio!', 
          created_at: new Date().toISOString() 
        },
        { 
          id: 2, 
          username: 'Guest', 
          message: 'Love the design 👍', 
          created_at: new Date().toISOString() 
        },
      ];
    } else {
      // Real implementation: fetch existing messages
      fetchMessages();
      subscribeToMessages();
    }
  });

  onDestroy(() => {
    if (realtimeChannel) {
      supabase.removeChannel(realtimeChannel);
    }
  });

  async function fetchMessages(): Promise<void> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(50);
    
    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      messages = data as Message[];
    }
  }

  function subscribeToMessages(): void {
    realtimeChannel = supabase
      .channel('messages')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          messages = [...messages, payload.new as Message];
          scrollToBottom();
        }
      )
      .subscribe();
  }

  async function handleSend(): Promise<void> {
    if (!newMessage.trim()) return;

    const messageData = {
      username: username.trim() || 'Anonymous',
      message: newMessage.trim(),
    };

    if (DEMO_MODE) {
      // Demo mode
      messages = [...messages, { 
        ...messageData, 
        id: Date.now(),
        created_at: new Date().toISOString() 
      }];
      scrollToBottom();
    } else {
      // Real implementation
      const { error } = await supabase
        .from('messages')
        .insert([messageData]);
      
      if (error) {
        console.error('Error sending message:', error);
      }
    }

    newMessage = '';
  }

  function handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      handleSend();
    }
  }

  function scrollToBottom(): void {
    setTimeout(() => {
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }, 100);
  }

  function formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  }

  $: if (isOpen && messages.length) {
    scrollToBottom();
  }
</script>

<div class="chat-widget">
  {#if !isOpen}
    <!-- Chat Button -->
    <button class="chat-button" on:click={() => isOpen = true} aria-label="Open chat">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    </button>
  {/if}

  {#if isOpen}
    <!-- Chat Window -->
    <div class="chat-window">
      <!-- Header -->
      <div class="chat-header">
        <div>
          <h3>Chat Discussion</h3>
          <p>Say hi to visitors! 👋</p>
        </div>
        <button class="close-button" on:click={() => isOpen = false} aria-label="Close chat">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <!-- Messages Area -->
      <div class="messages-area" bind:this={messagesContainer}>
        {#each messages as msg (msg.id)}
          <div class="message">
            <div class="message-header">
              <span class="username">{msg.username}</span>
              <span class="timestamp">{formatTime(msg.created_at)}</span>
            </div>
            <p class="message-text">{msg.message}</p>
          </div>
        {/each}
      </div>

      <!-- Input Area -->
      <div class="input-area">
        <input
          type="text"
          placeholder="Your name (optional)"
          bind:value={username}
          maxlength={20}
          class="name-input"
        />
        <div class="message-input-wrapper">
          <input
            type="text"
            placeholder="Type a message..."
            bind:value={newMessage}
            on:keypress={handleKeyPress}
            maxlength={500}
            class="message-input"
          />
          <button class="send-button" on:click={handleSend} aria-label="Send message">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .chat-widget {
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    z-index: 50;
  }

  .chat-button {
    background-color: #2563eb;
    color: white;
    border: none;
    border-radius: 9999px;
    padding: 1rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all 0.3s;
  }

  .chat-button:hover {
    background-color: #1d4ed8;
    transform: scale(1.1);
  }

  .chat-window {
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    width: 20rem;
    height: 500px;
    display: flex;
    flex-direction: column;
  }

  @media (min-width: 640px) {
    .chat-window {
      width: 24rem;
    }
  }

  .chat-header {
    background-color: #2563eb;
    color: white;
    padding: 1rem;
    border-radius: 0.5rem 0.5rem 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .chat-header h3 {
    font-weight: 600;
    margin: 0;
    font-size: 1rem;
  }

  .chat-header p {
    font-size: 0.75rem;
    color: #bfdbfe;
    margin: 0.25rem 0 0 0;
  }

  .close-button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 9999px;
    transition: background-color 0.3s;
  }

  .close-button:hover {
    background-color: #1d4ed8;
  }

  .messages-area {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    background-color: #f9fafb;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .message {
    background: white;
    border-radius: 0.5rem;
    padding: 0.75rem;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  .message-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.25rem;
  }

  .username {
    font-weight: 600;
    font-size: 0.875rem;
    color: #2563eb;
  }

  .timestamp {
    font-size: 0.75rem;
    color: #9ca3af;
  }

  .message-text {
    font-size: 0.875rem;
    color: #374151;
    margin: 0;
    word-wrap: break-word;
  }

  .input-area {
    padding: 1rem;
    border-top: 1px solid #e5e7eb;
    background: white;
    border-radius: 0 0 0.5rem 0.5rem;
  }

  .name-input {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
  }

  .name-input:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  .message-input-wrapper {
    display: flex;
    gap: 0.5rem;
  }

  .message-input {
    flex: 1;
    padding: 0.5rem 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 0.875rem;
  }

  .message-input:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  .send-button {
    background-color: #2563eb;
    color: white;
    border: none;
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .send-button:hover {
    background-color: #1d4ed8;
  }
</style>