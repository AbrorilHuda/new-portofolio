<!-- AI Portfolio Assistant -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { marked } from 'marked';
  
  interface Message {
    id: string | number;
    sender: 'user' | 'ai';
    message: string;
    created_at: string;
  }

  // Configure marked untuk output yang lebih clean
  marked.setOptions({
    breaks: true,
    gfm: true
  });

  // Function untuk render markdown ke HTML
  function renderMarkdown(text: string): string {
    return marked(text) as string;
  }

  let messages: Message[] = [];
  let newMessage: string = '';
  let isOpen: boolean = false;
  let messagesContainer: HTMLDivElement;
  let isTyping: boolean = false;
  let isSpeaking: boolean = false;
  let speechEnabled: boolean = true;
  let availableVoices: SpeechSynthesisVoice[] = [];
  let selectedVoice: SpeechSynthesisVoice | null = null;
  let showVoiceSettings: boolean = false;

  // Format markdown sederhana ke HTML
  function formatMessage(text: string): string {
    return text
      // Bold **text**
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Bullet points
      .replace(/^🔹\s*(.+)$/gm, '<li>$1</li>')
      // Line breaks
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');
  }

  // AI Assistant Knowledge Base about Abroril Huda
  const aiKnowledge = {
    name: "Abroril Huda",
    role: "Full-Stack Web Developer",
    location: "Madura, Indonesia",
    university: "Madura University - Computer Science Student",
    email: "moh.abrorilhuda@gmail.com",
    github: "github.com/abrorilhuda",
    linkedin: "linkedin.com/in/moh-abroril-huda",
    twitter: "@abror_dc",
    
    skills: [
      "JavaScript", "TypeScript", "React", "Svelte", "Node.js", 
      "Next.js", "TailwindCSS", "PostgreSQL", "Git", "React Native"
    ],
    
    projects: [
      {
        name: "Demtimcod Docs",
        description: "Documentation platform built with React and Docusaurus",
        tech: ["React", "Docusaurus", "TailwindCSS"],
        link: "https://demtimcod.github.io/"
      },
      {
        name: "Codverse",
        description: "Modern digital solution website for businesses",
        tech: ["Next.js", "Tailwind"],
        link: "https://codverse.site"
      },
      {
        name: "MaduraDev Community",
        description: "Developer community website for Madura Island",
        tech: ["Next.js", "TypeScript", "TailwindCSS"],
        link: "https://madura.dev"
      },
      {
        name: "DCN UNIRA",
        description: "Dicoding Community Network hub for Universitas Madura",
        tech: ["Next.js", "TailwindCSS", "Framer Motion"],
        link: "https://dcnunira.dev"
      }
    ],
    
    experience: [
      {
        role: "Lead Organizer",
        company: "MaduraDev Community",
        period: "2025 - now",
        description: "Leading the developer community on Madura Island to grow the local tech ecosystem"
      },
      {
        role: "Builder & Organizer", 
        company: "Dicoding Community Network Universitas Madura",
        period: "2025 - now",
        description: "Co-founded and built the official DCN chapter at Madura University"
      },
      {
        role: "Assistant Practicum",
        company: "Informatics Department Madura University", 
        period: "April 2025 - July 2025",
        description: "Teaching assistant for Operating Systems practicum"
      }
    ],
    
    personality: {
      motto: "Vibe coders engineer only - learn",
      approach: "Clean code, problem-solving, and continuous learning",
      focus: "Building local tech communities and delivering reliable digital solutions"
    }
  };

  // Text-to-Speech function dengan voice Indonesia terbaik
  function speakText(text: string): void {
    if (!speechEnabled || !('speechSynthesis' in window)) return;
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Gunakan voice yang dipilih user, atau cari otomatis
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    } else {
      // Auto-select voice Indonesia terbaik
      const voices = window.speechSynthesis.getVoices();
      const indonesianVoice = voices.find(voice => 
        voice.name.includes('Google Bahasa Indonesia') ||
        voice.name.includes('Microsoft Andika') ||
        voice.name.includes('Microsoft Gadis') ||
        (voice.lang.includes('id-ID') && voice.name.includes('Natural'))
      ) || voices.find(voice => voice.lang.includes('id-ID'));
      
      if (indonesianVoice) {
        utterance.voice = indonesianVoice;
        selectedVoice = indonesianVoice;
      }
    }
    
    utterance.lang = 'id-ID';
    utterance.rate = 0.95; 
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    utterance.onstart = () => {
      isSpeaking = true;
    };
    
    utterance.onend = () => {
      isSpeaking = false;
    };
    
    utterance.onerror = (event) => {
      console.error('Speech error:', event);
      isSpeaking = false;
    };
    
    window.speechSynthesis.speak(utterance);
  }

  // Load available voices
  function loadVoices(): void {
    const voices = window.speechSynthesis.getVoices();
    // Filter hanya voice Indonesia
    availableVoices = voices.filter(voice => 
      voice.lang.includes('id-ID') || 
      voice.lang.includes('id_ID') ||
      voice.name.toLowerCase().includes('indonesia')
    );
    
    // Auto-select voice terbaik jika belum ada yang dipilih
    if (!selectedVoice && availableVoices.length > 0) {
      selectedVoice = availableVoices.find(voice => 
        voice.name.includes('Google') || 
        voice.name.includes('Natural') ||
        voice.name.includes('Andika')
      ) || availableVoices[0];
    }
    
    console.log('Indonesian voices available:', availableVoices.map(v => v.name));
  }

  // Load voices saat component mount
  onMount(() => {
    // Load voices
    if ('speechSynthesis' in window) {
      // Load immediately
      loadVoices();
      
      // Chrome loads voices asynchronously
      window.speechSynthesis.onvoiceschanged = () => {
        loadVoices();
      };
    }
    
    // Welcome message from AI
    messages = [
      {
        id: 1,
        sender: 'ai',
        message: `Halo! 👋 Saya AI assistant Abroril. Saya di sini untuk menceritakan semua tentang ${aiKnowledge.name} - keahliannya, proyek-proyek, pengalaman, dan cara menghubunginya. Apa yang ingin kamu ketahui?`,
        created_at: new Date().toISOString()
      }
    ];
  });

  // Stop speech function
  function stopSpeech(): void {
    window.speechSynthesis.cancel();
    isSpeaking = false;
  }

  async function getAIResponse(userMessage: string): Promise<string> {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.message;
    } catch (error) {
      console.error('Error calling chat API:', error);
      return generateFallbackResponse(userMessage);
    }
  }

  // Fallback response jika API gagal
  function generateFallbackResponse(userMessage: string): string {
    const message = userMessage.toLowerCase();
    
    if (message.includes('halo') || message.includes('hai') || message.includes('hello')) {
      return `Halo! 👋 Saya AI assistant Abroril. Saya di sini untuk memperkenalkan ${aiKnowledge.name} - seorang Full-Stack Developer yang passionate dari ${aiKnowledge.location}. Ada yang ingin kamu ketahui tentang dia?`;
    }
    
    if (message.includes('tentang') || message.includes('siapa') || message.includes('profil')) {
      return `${aiKnowledge.name} adalah seorang ${aiKnowledge.role} dan ${aiKnowledge.university}. Dia passionate dalam membangun pengalaman digital yang luar biasa dan saat ini menjadi Lead Organizer di MaduraDev Community, mengembangkan ekosistem teknologi lokal di Pulau Madura. Mottonya adalah "${aiKnowledge.personality.motto}" - dia percaya setiap error adalah bagian dari menjadi developer yang lebih baik! 🚀`;
    }
    
    if (message.includes('skill') || message.includes('keahlian') || message.includes('teknologi')) {
      return `Abroril ahli dalam: ${aiKnowledge.skills.slice(0, 6).join(', ')}, dan masih banyak lagi! Dia spesialis dalam ${aiKnowledge.personality.approach}. Dia sangat kuat dalam pengembangan web modern dengan React, Svelte, dan Next.js. Mau lihat proyek-proyeknya? 💻`;
    }
    
    if (message.includes('proyek') || message.includes('karya') || message.includes('portfolio')) {
      const featuredProjects = aiKnowledge.projects.slice(0, 3);
      let response = "Ini beberapa proyek notable Abroril:\n\n";
      featuredProjects.forEach(project => {
        response += `🔹 **${project.name}**: ${project.description}\n`;
      });
      response += "\nSetiap proyek menunjukkan komitmennya pada kualitas dan inovasi!";
      return response;
    }
    
    if (message.includes('kontak') || message.includes('email') || message.includes('hubungi')) {
      return `Kamu bisa menghubungi Abroril di:\n📧 Email: ${aiKnowledge.email}\n💼 LinkedIn: ${aiKnowledge.linkedin}\n🐙 GitHub: ${aiKnowledge.github}\n🐦 Twitter: ${aiKnowledge.twitter}\n\nDia selalu terbuka untuk kolaborasi dan peluang baru!`;
    }
    
    return `Saya senang bisa cerita lebih banyak tentang ${aiKnowledge.name}! Kamu bisa tanya tentang keahliannya, proyek-proyek, pengalaman, atau cara menghubunginya. Apa yang paling menarik buatmu? 😊`;
  }

  onMount(() => {
    // Load voices
    if ('speechSynthesis' in window) {
      // Chrome loads voices asynchronously
      window.speechSynthesis.onvoiceschanged = () => {
        const voices = window.speechSynthesis.getVoices();
        console.log('Available voices:', voices.filter(v => v.lang.includes('id')));
      };
      
      // Trigger voice loading
      window.speechSynthesis.getVoices();
    }
    
    // Welcome message from AI
    messages = [
      {
        id: 1,
        sender: 'ai',
        message: `Halo! 👋 Saya AI assistant Abroril. Saya di sini untuk menceritakan semua tentang ${aiKnowledge.name} - keahliannya, proyek-proyek, pengalaman, dan cara menghubunginya. Apa yang ingin kamu ketahui?`,
        created_at: new Date().toISOString()
      }
    ];
  });

  async function handleSend(): Promise<void> {
    if (!newMessage.trim()) return;

    // Add user message
    const userMsg: Message = {
      id: Date.now(),
      sender: 'user',
      message: newMessage.trim(),
      created_at: new Date().toISOString()
    };
    
    messages = [...messages, userMsg];
    const currentMessage = newMessage;
    newMessage = '';
    scrollToBottom();
    
    // Show typing indicator
    isTyping = true;
    
    try {
      // Get AI response from API
      const aiResponseText = await getAIResponse(currentMessage);
      
      const aiMsg: Message = {
        id: Date.now() + 1,
        sender: 'ai',
        message: aiResponseText,
        created_at: new Date().toISOString()
      };
      
      messages = [...messages, aiMsg];
      isTyping = false;
      scrollToBottom();
      
      // Speak the AI response
      if (speechEnabled) {
        setTimeout(() => {
          const plainText = aiResponseText
            .replace(/```[\s\S]*?```/g, '')
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
            .replace(/[*_~`#]+/g, '')
            .trim();
          speakText(plainText);
        }, 500);
      }
      
    } catch (error) {
      console.error('Error getting AI response:', error);
      isTyping = false;
    }
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

<div class="ai-assistant-widget">
  {#if !isOpen}
    <!-- AI Assistant Button -->
    <button class="ai-button" on:click={() => isOpen = true} aria-label="Open AI Assistant">
      <div class="ai-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
          <circle cx="12" cy="19" r="3"/>
        </svg>
      </div>
      <span class="ai-label">AI Assistant</span>
    </button>
  {/if}

  {#if isOpen}
    <!-- AI Assistant Window -->
    <div class="ai-window">
      <!-- Header -->
      <div class="ai-header">
        <div class="ai-header-content">
          <div class="ai-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <circle cx="12" cy="19" r="3"/>
            </svg>
          </div>
          <div>
            <h3>AI Assistant Abroril</h3>
            <p>Tanya tentang skills & proyek Abroril! 🤖</p>
          </div>
        </div>
        <div class="header-controls">
          <!-- Speech Toggle Button -->
          <button 
            class="speech-toggle" 
            on:click={() => {
              if (isSpeaking) {
                stopSpeech();
              } else {
                speechEnabled = !speechEnabled;
              }
            }}
            aria-label={speechEnabled ? 'Matikan suara' : 'Nyalakan suara'}
            title={speechEnabled ? 'Matikan suara' : 'Nyalakan suara'}
          >
            {#if isSpeaking}
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 9h6v6h-6z"/>
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              </svg>
            {:else if speechEnabled}
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
              </svg>
            {:else}
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <line x1="22" y1="9" x2="16" y2="15"/>
                <line x1="16" y1="9" x2="22" y2="15"/>
              </svg>
            {/if}
          </button>
          <button class="close-button" on:click={() => isOpen = false} aria-label="Tutup AI Assistant">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Messages Area -->
      <div class="messages-area" bind:this={messagesContainer}>
        {#each messages as msg (msg.id)}
          <div class="message-wrapper {msg.sender}">
            <div class="message-bubble">
              <div class="message-content">
                {@html renderMarkdown(msg.message)}
              </div>
              <div class="message-time">{formatTime(msg.created_at)}</div>
            </div>
          </div>
        {/each}
        
        {#if isTyping}
          <div class="message-wrapper ai">
            <div class="message-bubble">
              <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        {/if}
      </div>

      <!-- Input Area -->
      <div class="input-area">
        <!-- Voice Settings (jika ada multiple voices) -->
        {#if availableVoices.length > 1}
          <div class="voice-settings">
            <button 
              class="voice-settings-toggle" 
              on:click={() => showVoiceSettings = !showVoiceSettings}
            >
              🎤 {selectedVoice?.name || 'Pilih Suara'} 
              <span class="toggle-icon">{showVoiceSettings ? '▲' : '▼'}</span>
            </button>
            
            {#if showVoiceSettings}
              <div class="voice-list">
                {#each availableVoices as voice}
                  <button
                    class="voice-option {selectedVoice?.name === voice.name ? 'active' : ''}"
                    on:click={() => {
                      selectedVoice = voice;
                      showVoiceSettings = false;
                      // Test voice
                      speakText('Halo, ini suara saya');
                    }}
                  >
                    {voice.name}
                    {#if selectedVoice?.name === voice.name}
                      <span class="check">✓</span>
                    {/if}
                  </button>
                {/each}
              </div>
            {/if}
          </div>
        {/if}
        
        <div class="quick-questions">
          <button class="quick-btn" on:click={() => { newMessage = "Ceritakan tentang keahlian Abroril"; handleSend(); }}>
            💻 Keahlian
          </button>
          <button class="quick-btn" on:click={() => { newMessage = "Proyek apa saja yang pernah dia kerjakan?"; handleSend(); }}>
            🚀 Proyek
          </button>
          <button class="quick-btn" on:click={() => { newMessage = "Bagaimana cara menghubunginya?"; handleSend(); }}>
            📧 Kontak
          </button>
        </div>
        <div class="message-input-wrapper">
          <input
            type="text"
            placeholder="Tanya apa saja tentang Abroril..."
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
  .ai-assistant-widget {
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    z-index: 50;
  }

  .ai-button {
    position: relative;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 2rem;
    padding: 1rem 1.75rem;
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.35);
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-weight: 600;
    font-size: 0.9rem;
    overflow: hidden;
  }

  .ai-button::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }

  .ai-button:hover::before {
    width: 300px;
    height: 300px;
  }

  .ai-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 32px rgba(102, 126, 234, 0.45);
  }

  .ai-button:active {
    transform: translateY(-1px);
  }

  .ai-icon {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
  }

  .ai-label {
    font-size: 0.9rem;
    font-weight: 600;
    z-index: 1;
  }

  .ai-window {
    background: white;
    border-radius: 1.5rem;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    width: 22rem;
    height: 600px;
    display: flex;
    flex-direction: column;
    transition: all 0.3s;
    overflow: hidden;
    border: 1px solid rgba(102, 126, 234, 0.1);
  }

  :global(.dark) .ai-window {
    background: #1a1f2e;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
    border-color: rgba(102, 126, 234, 0.2);
  }

  @media (min-width: 640px) {
    .ai-window {
      width: 28rem;
    }
  }

  .ai-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .ai-header-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .header-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .speech-toggle {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .speech-toggle:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }

  .ai-avatar {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ai-header h3 {
    font-weight: 700;
    margin: 0;
    font-size: 1.15rem;
    letter-spacing: -0.02em;
  }

  .ai-header p {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.85);
    margin: 0.25rem 0 0 0;
    font-weight: 400;
  }

  .close-button {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: background-color 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .close-button:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .messages-area {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
    background: #f8f9fa;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    transition: background 0.3s;
  }

  :global(.dark) .messages-area {
    background: #0f1419;
  }

  .message-wrapper {
    display: flex;
    width: 100%;
    animation: messageSlide 0.3s ease-out;
  }

  @keyframes messageSlide {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .message-wrapper.user {
    justify-content: flex-end;
  }

  .message-wrapper.ai {
    justify-content: flex-start;
  }

  .message-bubble {
    max-width: 80%;
    padding: 1rem 1.25rem;
    border-radius: 1.25rem;
    position: relative;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: all 0.3s;
  }

  .message-wrapper.user .message-bubble {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-bottom-right-radius: 0.25rem;
  }

  .message-wrapper.ai .message-bubble {
    background: white;
    color: #1f2937;
    border-bottom-left-radius: 0.25rem;
  }

  :global(.dark) .message-wrapper.ai .message-bubble {
    background: #1e293b;
    color: #e2e8f0;
  }

  .message-content {
    font-size: 0.95rem;
    line-height: 1.6;
    word-wrap: break-word;
  }

  /* Markdown Styling */
  .message-content :global(p) {
    margin: 0 0 0.5rem 0;
  }

  .message-content :global(p:last-child) {
    margin-bottom: 0;
  }

  .message-content :global(strong) {
    font-weight: 700;
    color: inherit;
  }

  .message-wrapper.ai .message-content :global(strong) {
    color: #667eea;
  }

  :global(.dark) .message-wrapper.ai .message-content :global(strong) {
    color: #93c5fd;
  }

  .message-content :global(ul),
  .message-content :global(ol) {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
  }

  .message-content :global(li) {
    margin: 0.25rem 0;
  }

  .message-content :global(code) {
    background: rgba(0, 0, 0, 0.1);
    padding: 0.2rem 0.4rem;
    border-radius: 0.25rem;
    font-size: 0.9em;
    font-family: 'Courier New', monospace;
  }

  .message-wrapper.user .message-content :global(code) {
    background: rgba(255, 255, 255, 0.2);
  }

  .message-content :global(a) {
    color: #667eea;
    text-decoration: underline;
  }

  .message-wrapper.user .message-content :global(a) {
    color: white;
    text-decoration: underline;
  }

  .message-time {
    font-size: 0.7rem;
    opacity: 0.6;
    margin-top: 0.5rem;
    text-align: right;
  }

  .typing-indicator {
    display: flex;
    gap: 0.35rem;
    padding: 0.5rem 0;
  }

  .typing-indicator span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #667eea;
    animation: typing 1.4s infinite ease-in-out;
  }

  .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
  .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

  @keyframes typing {
    0%, 80%, 100% { 
      transform: scale(0.8); 
      opacity: 0.5; 
    }
    40% { 
      transform: scale(1.2); 
      opacity: 1; 
    }
  }

  .input-area {
    padding: 1.25rem;
    border-top: 1px solid #e5e7eb;
    background: white;
    border-radius: 0 0 1rem 1rem;
    transition: all 0.3s;
  }

  :global(.dark) .input-area {
    background: #1f2937;
    border-top-color: #374151;
  }

  .voice-settings {
    margin-bottom: 1rem;
    position: relative;
  }

  .voice-settings-toggle {
    width: 100%;
    padding: 0.75rem 1rem;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    border-radius: 0.75rem;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.3s;
  }

  .voice-settings-toggle:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }

  .toggle-icon {
    font-size: 0.7rem;
  }

  .voice-list {
    position: absolute;
    bottom: 100%;
    left: 0;
    right: 0;
    margin-bottom: 0.5rem;
    background: white;
    border-radius: 0.75rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    max-height: 200px;
    overflow-y: auto;
    z-index: 10;
    animation: slideUp 0.2s ease-out;
  }

  :global(.dark) .voice-list {
    background: #374151;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .voice-option {
    width: 100%;
    padding: 0.75rem 1rem;
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
    font-size: 0.85rem;
    color: #374151;
    transition: all 0.2s;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  :global(.dark) .voice-option {
    color: #d1d5db;
  }

  .voice-option:hover {
    background: #f3f4f6;
  }

  :global(.dark) .voice-option:hover {
    background: #4b5563;
  }

  .voice-option.active {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
    color: #667eea;
    font-weight: 600;
  }

  :global(.dark) .voice-option.active {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2));
    color: #93c5fd;
  }

  .check {
    color: #667eea;
    font-weight: bold;
  }

  .voice-list::-webkit-scrollbar {
    width: 6px;
  }

  .voice-list::-webkit-scrollbar-track {
    background: transparent;
  }

  .voice-list::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 3px;
  }

  .quick-questions {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  .quick-btn {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    border-radius: 1.5rem;
    padding: 0.6rem 1rem;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 0.9;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
  }

  .quick-btn:hover {
    opacity: 1;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.35);
  }

  .quick-btn:active {
    transform: translateY(0);
  }

  .message-input-wrapper {
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }

  .message-input {
    flex: 1;
    padding: 0.85rem 1.25rem;
    border: 2px solid #e5e7eb;
    border-radius: 1.5rem;
    font-size: 0.95rem;
    color: #1f2937;
    background: white;
    transition: all 0.3s;
    font-family: inherit;
  }

  :global(.dark) .message-input {
    background: #1e293b;
    border-color: #334155;
    color: #f1f5f9;
  }

  .message-input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
  }

  .message-input::placeholder {
    color: #9ca3af;
  }

  :global(.dark) .message-input::placeholder {
    color: #64748b;
  }

  .send-button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 50%;
    padding: 0.85rem;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 48px;
    min-height: 48px;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }

  .send-button:hover {
    transform: scale(1.08);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }

  .send-button:active {
    transform: scale(0.98);
  }

  /* Scrollbar styling */
  .messages-area::-webkit-scrollbar {
    width: 6px;
  }

  .messages-area::-webkit-scrollbar-track {
    background: transparent;
  }

  .messages-area::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 3px;
  }

  .messages-area::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #5a67d8, #6b46c1);
  }

  /* Mobile responsiveness */
  @media (max-width: 640px) {
    .ai-assistant-widget {
      bottom: 1rem;
      right: 1rem;
    }
    
    .ai-window {
      width: calc(100vw - 2rem);
      height: 500px;
    }
    
    .ai-button {
      padding: 0.75rem 1rem;
      font-size: 0.8rem;
    }
    
    .ai-label {
      display: none;
    }
  }
</style>