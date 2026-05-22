<!-- AI Portfolio Assistant -->
<script lang="ts">
  import { onMount } from "svelte";
  import { marked } from "marked";

  interface Message {
    id: string | number;
    sender: "user" | "ai";
    message: string;
    created_at: string;
  }

  // Configure marked untuk output yang lebih clean
  marked.setOptions({
    breaks: true,
    gfm: true,
  });

  // Function untuk render markdown ke HTML
  function renderMarkdown(text: string): string {
    return marked(text) as string;
  }

  let messages: Message[] = [];
  let newMessage: string = "";
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
    return (
      text
        // Bold **text**
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        // Bullet points
        .replace(/^🔹\s*(.+)$/gm, "<li>$1</li>")
        // Line breaks
        .replace(/\n\n/g, "</p><p>")
        .replace(/\n/g, "<br>")
    );
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
      "JavaScript",
      "TypeScript",
      "React",
      "Svelte",
      "Node.js",
      "Next.js",
      "TailwindCSS",
      "PostgreSQL",
      "Git",
      "React Native",
    ],

    projects: [
      {
        name: "Demtimcod Docs",
        description: "Documentation platform built with React and Docusaurus",
        tech: ["React", "Docusaurus", "TailwindCSS"],
        link: "https://demtimcod.github.io/",
      },
      {
        name: "Codverse",
        description: "Modern digital solution website for businesses",
        tech: ["Next.js", "Tailwind"],
        link: "https://codverse.site",
      },
      {
        name: "MaduraDev Community",
        description: "Developer community website for Madura Island",
        tech: ["Next.js", "TypeScript", "TailwindCSS"],
        link: "https://madura.dev",
      },
      {
        name: "DCN UNIRA",
        description: "Dicoding Community Network hub for Universitas Madura",
        tech: ["Next.js", "TailwindCSS", "Framer Motion"],
        link: "https://dcnunira.dev",
      },
    ],

    experience: [
      {
        role: "Lead Organizer",
        company: "MaduraDev Community",
        period: "2025 - now",
        description:
          "Leading the developer community on Madura Island to grow the local tech ecosystem",
      },
      {
        role: "Builder & Organizer",
        company: "Dicoding Community Network Universitas Madura",
        period: "2025 - now",
        description:
          "Co-founded and built the official DCN chapter at Madura University",
      },
      {
        role: "Assistant Practicum",
        company: "Informatics Department Madura University",
        period: "April 2025 - July 2025",
        description: "Teaching assistant for Operating Systems practicum",
      },
    ],

    personality: {
      motto: "Vibe coders engineer only - learn",
      approach: "Clean code, problem-solving, and continuous learning",
      focus:
        "Building local tech communities and delivering reliable digital solutions",
    },
  };

  // Text-to-Speech function dengan voice Indonesia terbaik
  function speakText(text: string): void {
    if (!speechEnabled || !("speechSynthesis" in window)) return;

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Gunakan voice yang dipilih user, atau cari otomatis
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    } else {
      // Auto-select voice Indonesia terbaik
      const voices = window.speechSynthesis.getVoices();
      const indonesianVoice =
        voices.find(
          (voice) =>
            voice.name.includes("Google Bahasa Indonesia") ||
            voice.name.includes("Microsoft Andika") ||
            voice.name.includes("Microsoft Gadis") ||
            (voice.lang.includes("id-ID") && voice.name.includes("Natural")),
        ) || voices.find((voice) => voice.lang.includes("id-ID"));

      if (indonesianVoice) {
        utterance.voice = indonesianVoice;
        selectedVoice = indonesianVoice;
      }
    }

    utterance.lang = "id-ID";
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
      console.error("Speech error:", event);
      isSpeaking = false;
    };

    window.speechSynthesis.speak(utterance);
  }

  // Load available voices
  function loadVoices(): void {
    const voices = window.speechSynthesis.getVoices();
    // Filter hanya voice Indonesia
    availableVoices = voices.filter(
      (voice) =>
        voice.lang.includes("id-ID") ||
        voice.lang.includes("id_ID") ||
        voice.name.toLowerCase().includes("indonesia"),
    );

    // Auto-select voice terbaik jika belum ada yang dipilih
    if (!selectedVoice && availableVoices.length > 0) {
      selectedVoice =
        availableVoices.find(
          (voice) =>
            voice.name.includes("Google") ||
            voice.name.includes("Natural") ||
            voice.name.includes("Andika"),
        ) || availableVoices[0];
    }

    console.log(
      "Indonesian voices available:",
      availableVoices.map((v) => v.name),
    );
  }

  // Load voices saat component mount
  onMount(() => {
    // Load voices
    if ("speechSynthesis" in window) {
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
        sender: "ai",
        message: `Halo! 👋 Saya AI assistant Abroril. Saya di sini untuk menceritakan semua tentang ${aiKnowledge.name} - keahliannya, proyek-proyek, pengalaman, dan cara menghubunginya. Apa yang ingin kamu ketahui?`,
        created_at: new Date().toISOString(),
      },
    ];
  });

  // Stop speech function
  function stopSpeech(): void {
    window.speechSynthesis.cancel();
    isSpeaking = false;
  }

  async function getAIResponse(userMessage: string): Promise<string> {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.message;
    } catch (error) {
      console.error("Error calling chat API:", error);
      return generateFallbackResponse(userMessage);
    }
  }

  // Fallback response jika API gagal
  function generateFallbackResponse(userMessage: string): string {
    const message = userMessage.toLowerCase();

    if (
      message.includes("halo") ||
      message.includes("hai") ||
      message.includes("hello")
    ) {
      return `Halo! 👋 Saya AI assistant Abroril. Saya di sini untuk memperkenalkan ${aiKnowledge.name} - seorang Full-Stack Developer yang passionate dari ${aiKnowledge.location}. Ada yang ingin kamu ketahui tentang dia?`;
    }

    if (
      message.includes("tentang") ||
      message.includes("siapa") ||
      message.includes("profil")
    ) {
      return `${aiKnowledge.name} adalah seorang ${aiKnowledge.role} dan ${aiKnowledge.university}. Dia passionate dalam membangun pengalaman digital yang luar biasa dan saat ini menjadi Lead Organizer di MaduraDev Community, mengembangkan ekosistem teknologi lokal di Pulau Madura. Mottonya adalah "${aiKnowledge.personality.motto}" - dia percaya setiap error adalah bagian dari menjadi developer yang lebih baik! 🚀`;
    }

    if (
      message.includes("skill") ||
      message.includes("keahlian") ||
      message.includes("teknologi")
    ) {
      return `Abroril ahli dalam: ${aiKnowledge.skills.slice(0, 6).join(", ")}, dan masih banyak lagi! Dia spesialis dalam ${aiKnowledge.personality.approach}. Dia sangat kuat dalam pengembangan web modern dengan React, Svelte, dan Next.js. Mau lihat proyek-proyeknya? 💻`;
    }

    if (
      message.includes("proyek") ||
      message.includes("karya") ||
      message.includes("portfolio")
    ) {
      const featuredProjects = aiKnowledge.projects.slice(0, 3);
      let response = "Ini beberapa proyek notable Abroril:\n\n";
      featuredProjects.forEach((project) => {
        response += `🔹 **${project.name}**: ${project.description}\n`;
      });
      response +=
        "\nSetiap proyek menunjukkan komitmennya pada kualitas dan inovasi!";
      return response;
    }

    if (
      message.includes("kontak") ||
      message.includes("email") ||
      message.includes("hubungi")
    ) {
      return `Kamu bisa menghubungi Abroril di:\n📧 Email: ${aiKnowledge.email}\n💼 LinkedIn: ${aiKnowledge.linkedin}\n🐙 GitHub: ${aiKnowledge.github}\n🐦 Twitter: ${aiKnowledge.twitter}\n\nDia selalu terbuka untuk kolaborasi dan peluang baru!`;
    }

    return `Saya senang bisa cerita lebih banyak tentang ${aiKnowledge.name}! Kamu bisa tanya tentang keahliannya, proyek-proyek, pengalaman, atau cara menghubunginya. Apa yang paling menarik buatmu? 😊`;
  }

  onMount(() => {
    // Load voices
    if ("speechSynthesis" in window) {
      // Chrome loads voices asynchronously
      window.speechSynthesis.onvoiceschanged = () => {
        const voices = window.speechSynthesis.getVoices();
        console.log(
          "Available voices:",
          voices.filter((v) => v.lang.includes("id")),
        );
      };

      // Trigger voice loading
      window.speechSynthesis.getVoices();
    }

    // Welcome message from AI
    messages = [
      {
        id: 1,
        sender: "ai",
        message: `Halo! 👋 Saya AI assistant Abroril. Saya di sini untuk menceritakan semua tentang ${aiKnowledge.name} - keahliannya, proyek-proyek, pengalaman, dan cara menghubunginya. Apa yang ingin kamu ketahui?`,
        created_at: new Date().toISOString(),
      },
    ];
  });

  async function handleSend(): Promise<void> {
    if (!newMessage.trim()) return;

    // Add user message
    const userMsg: Message = {
      id: Date.now(),
      sender: "user",
      message: newMessage.trim(),
      created_at: new Date().toISOString(),
    };

    messages = [...messages, userMsg];
    const currentMessage = newMessage;
    newMessage = "";
    scrollToBottom();

    isTyping = true;

    try {
      const aiResponseText = await getAIResponse(currentMessage);

      const aiMsg: Message = {
        id: Date.now() + 1,
        sender: "ai",
        message: aiResponseText,
        created_at: new Date().toISOString(),
      };

      messages = [...messages, aiMsg];
      isTyping = false;
      scrollToBottom();

      // Speak the AI response
      if (speechEnabled) {
        setTimeout(() => {
          const plainText = aiResponseText
            .replace(/```[\s\S]*?```/g, "")
            .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
            .replace(/[*_~`#]+/g, "")
            .trim();
          speakText(plainText);
        }, 500);
      }
    } catch (error) {
      console.error("Error getting AI response:", error);
      isTyping = false;
    }
  }

  function handleKeyPress(event: KeyboardEvent): void {
    if (event.key === "Enter") {
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
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  $: if (isOpen && messages.length) {
    scrollToBottom();
  }
</script>

<div class="ai-assistant-widget">
  {#if !isOpen}
    <button
      class="ai-button"
      on:click={() => (isOpen = true)}
      aria-label="Open AI Assistant"
    >
      <div class="ai-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"
          />
        </svg>
        <span class="pulse-dot"></span>
      </div>
      <span class="ai-label">Tanya AI</span>
    </button>
  {/if}

  {#if isOpen}
    <div class="ai-window">
      <div class="ai-header">
        <div class="ai-header-content">
          <button
            class="mobile-back-button"
            on:click={() => (isOpen = false)}
            aria-label="Kembali"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>

          <div class="ai-avatar">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"
              />
            </svg>
          </div>
          <div class="ai-header-info">
            <div class="ai-title-wrapper">
              <h3>AI Assistant</h3>
              <span class="status-indicator"></span>
            </div>
            <p>Tanya tentang abrorilhuda</p>
          </div>
        </div>
        <div class="header-controls">
          <!-- Voice Selection Dropdown Trigger -->
          {#if availableVoices.length > 1}
            <button
              class="header-voice-toggle {showVoiceSettings ? 'active' : ''}"
              on:click={() => (showVoiceSettings = !showVoiceSettings)}
              aria-label="Pilih Suara"
              title="Pilih Suara"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="3" />
                <path
                  d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
                />
              </svg>
            </button>
          {/if}

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
            aria-label={speechEnabled ? "Matikan suara" : "Nyalakan suara"}
            title={speechEnabled ? "Matikan suara" : "Nyalakan suara"}
          >
            {#if isSpeaking}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
              </svg>
            {:else if speechEnabled}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            {:else}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="22" y1="9" x2="16" y2="15" />
                <line x1="16" y1="9" x2="22" y2="15" />
              </svg>
            {/if}
          </button>

          <!-- Close Button (Desktop only, hidden on mobile in favor of Back Button) -->
          <button
            class="desktop-close-button"
            on:click={() => (isOpen = false)}
            aria-label="Tutup AI Assistant"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Voice Settings Dropdown (Absolute overlay at top of messages) -->
      {#if showVoiceSettings && availableVoices.length > 1}
        <div class="voice-settings-overlay">
          <div class="voice-settings-header">
            <h4>Pilih Suara Asisten</h4>
            <button
              class="voice-settings-close"
              on:click={() => (showVoiceSettings = false)}
              aria-label="Tutup suara"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" /><line
                  x1="6"
                  y1="6"
                  x2="18"
                  y2="18"
                />
              </svg>
            </button>
          </div>
          <div class="voice-list">
            {#each availableVoices as voice}
              <button
                class="voice-option {selectedVoice?.name === voice.name
                  ? 'active'
                  : ''}"
                on:click={() => {
                  selectedVoice = voice;
                  showVoiceSettings = false;
                  speakText("Halo, ini suara saya");
                }}
              >
                <span class="voice-name"
                  >{voice.name
                    .replace("Microsoft", "")
                    .replace("Google", "")
                    .trim()}</span
                >
                {#if selectedVoice?.name === voice.name}
                  <span class="check">✓</span>
                {/if}
              </button>
            {/each}
          </div>
        </div>
      {/if}

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
            <div class="message-bubble typing-bubble">
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
        <div class="quick-questions">
          <button
            class="quick-btn"
            on:click={() => {
              newMessage = "Ceritakan tentang keahlian Abroril";
              handleSend();
            }}
          >
            💻 Keahlian
          </button>
          <button
            class="quick-btn"
            on:click={() => {
              newMessage = "Proyek apa saja yang pernah dia kerjakan?";
              handleSend();
            }}
          >
            🚀 Proyek
          </button>
          <button
            class="quick-btn"
            on:click={() => {
              newMessage = "Bagaimana cara menghubunginya?";
              handleSend();
            }}
          >
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
          <button
            class="send-button"
            on:click={handleSend}
            aria-label="Send message"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  /* Widget Wrapper Container */
  .ai-assistant-widget {
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    z-index: 50;
    font-family:
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      Roboto,
      Oxygen,
      Ubuntu,
      Cantarell,
      "Open Sans",
      "Helvetica Neue",
      sans-serif;
  }

  /* Floating trigger button */
  .ai-button {
    position: relative;
    background: #18181b; /* solid zinc-900 in light mode */
    color: #ffffff;
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 9999px;
    padding: 0.8rem 1.4rem;
    box-shadow:
      0 4px 12px rgba(0, 0, 0, 0.08),
      0 2px 4px rgba(0, 0, 0, 0.04);
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-weight: 600;
    font-size: 0.875rem;
  }

  :global(.dark) .ai-button {
    background: #ffffff; /* pure white in dark mode */
    color: #18181b;
    border-color: rgba(255, 255, 255, 0.08);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }

  .ai-button:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }

  :global(.dark) .ai-button:hover {
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.45);
  }

  .ai-button:active {
    transform: translateY(0) scale(1);
  }

  .ai-icon {
    display: flex;
    align-items: center;
    position: relative;
  }

  .pulse-dot {
    position: absolute;
    top: -2px;
    right: -2px;
    width: 6px;
    height: 6px;
    background: #10b981; /* emerald-500 */
    border-radius: 50%;
    border: 1.5px solid #18181b;
    transition: border-color 0.3s;
  }

  :global(.dark) .pulse-dot {
    border-color: #ffffff;
  }

  /* Chat Window Card */
  .ai-window {
    background: #ffffff;
    border-radius: 1.25rem; /* 20px modern radius */
    /* Beautiful dual drop shadow */
    box-shadow:
      0 20px 50px -12px rgba(0, 0, 0, 0.12),
      0 0 1px rgba(0, 0, 0, 0.15);
    width: 26.5rem; /* Spacious elegant width */
    height: 500px; /* Compact, elegant desktop proportions */
    max-height: calc(100vh - 6rem); /* Responsive vertical limit */
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid rgba(0, 0, 0, 0.06);
    position: relative;
    transition:
      background-color 0.3s,
      border-color 0.3s,
      box-shadow 0.3s;
    animation: desktopFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  :global(.dark) .ai-window {
    background: #18181b;
    border-color: rgba(255, 255, 255, 0.06);
    box-shadow:
      0 30px 60px -15px rgba(0, 0, 0, 0.5),
      0 0 1px rgba(255, 255, 255, 0.08);
  }

  @keyframes desktopFadeIn {
    from {
      opacity: 0;
      transform: scale(0.96) translateY(12px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  /* Header Styles */
  .ai-header {
    background: #ffffff;
    padding: 1.15rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    z-index: 10;
    transition:
      background-color 0.3s,
      border-bottom-color 0.3s;
  }

  :global(.dark) .ai-header {
    background: #18181b;
    border-bottom-color: rgba(255, 255, 255, 0.06);
  }

  .ai-header-content {
    display: flex;
    align-items: center;
    gap: 0.85rem;
  }

  .ai-header-info {
    display: flex;
    flex-direction: column;
  }

  .ai-title-wrapper {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .ai-header h3 {
    font-weight: 700;
    color: #18181b;
    margin: 0;
    font-size: 0.95rem;
    letter-spacing: -0.018em;
  }

  :global(.dark) .ai-header h3 {
    color: #f4f4f5;
  }

  .ai-header p {
    font-size: 0.75rem;
    color: #71717a;
    margin: 0.15rem 0 0 0;
    font-weight: 400;
  }

  :global(.dark) .ai-header p {
    color: #a1a1aa;
  }

  .ai-avatar {
    background: #18181b;
    color: #ffffff;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.25s;
    border: 1px solid rgba(0, 0, 0, 0.04);
  }

  :global(.dark) .ai-avatar {
    background: #ffffff;
    color: #18181b;
    border-color: rgba(255, 255, 255, 0.08);
  }

  .status-indicator {
    width: 6px;
    height: 6px;
    background: #10b981; /* emerald-500 */
    border-radius: 50%;
    display: inline-block;
    animation: pulseSlow 2s infinite ease-in-out;
  }

  @keyframes pulseSlow {
    0%,
    100% {
      opacity: 0.4;
      transform: scale(0.8);
    }
    50% {
      opacity: 1;
      transform: scale(1.2);
    }
  }

  /* Header controls */
  .header-controls {
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }

  .header-controls button {
    background: transparent;
    border: none;
    color: #71717a;
    cursor: pointer;
    padding: 0.45rem;
    border-radius: 50%;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :global(.dark) .header-controls button {
    color: #a1a1aa;
  }

  .header-controls button:hover {
    background: #f4f4f5;
    color: #18181b;
  }

  :global(.dark) .header-controls button:hover {
    background: #27272a;
    color: #f4f4f5;
  }

  /* Voice settings overlay */
  .voice-settings-overlay {
    position: absolute;
    top: 69px; /* height of header */
    left: 0;
    right: 0;
    background: #ffffff;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    z-index: 30;
    padding: 1rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
    animation: slideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }

  :global(.dark) .voice-settings-overlay {
    background: #18181b;
    border-bottom-color: rgba(255, 255, 255, 0.06);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .voice-settings-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .voice-settings-header h4 {
    margin: 0;
    font-size: 0.8rem;
    font-weight: 600;
    color: #3f3f46;
    letter-spacing: -0.01em;
  }

  :global(.dark) .voice-settings-header h4 {
    color: #d4d4d8;
  }

  .voice-settings-close {
    background: transparent;
    border: none;
    color: #71717a;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .voice-settings-close:hover {
    background: #f4f4f5;
    color: #18181b;
  }

  :global(.dark) .voice-settings-close:hover {
    background: #27272a;
    color: #f4f4f5;
  }

  .voice-list {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    max-height: 160px;
    overflow-y: auto;
    padding-right: 0.25rem;
  }

  /* Thin scrollbar for voice list */
  .voice-list::-webkit-scrollbar {
    width: 4px;
  }
  .voice-list::-webkit-scrollbar-track {
    background: transparent;
  }
  .voice-list::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 99px;
  }
  :global(.dark) .voice-list::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
  }

  .voice-option {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0.75rem;
    background: #fafafa;
    border: 1px solid #e4e4e7;
    border-radius: 0.375rem;
    cursor: pointer;
    text-align: left;
    font-size: 0.775rem;
    color: #27272a;
    font-weight: 500;
    transition: all 0.2s;
  }

  :global(.dark) .voice-option {
    background: #27272a;
    border-color: #3f3f46;
    color: #e4e4e7;
  }

  .voice-option:hover {
    background: #f4f4f5;
    border-color: #d4d4d8;
  }

  :global(.dark) .voice-option:hover {
    background: #3f3f46;
    border-color: #52525b;
  }

  .voice-option.active {
    background: #f5f3ff;
    border-color: #c084fc;
    color: #6d28d9;
  }

  :global(.dark) .voice-option.active {
    background: rgba(124, 58, 237, 0.15);
    border-color: #8b5cf6;
    color: #a78bfa;
  }

  .voice-name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .check {
    font-weight: bold;
    margin-left: 0.5rem;
  }

  /* Messages Area */
  .messages-area {
    flex: 1;
    overflow-y: auto;
    padding: 1.25rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 1.15rem;
    background: #fafafa;
    transition: background-color 0.3s;
  }

  :global(.dark) .messages-area {
    background: #09090b; /* zinc-950 background in dark mode */
  }

  /* Custom Premium Scrollbar */
  .messages-area::-webkit-scrollbar {
    width: 6px;
  }

  .messages-area::-webkit-scrollbar-track {
    background: transparent;
  }

  .messages-area::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.08);
    border-radius: 9999px;
    transition: background-color 0.2s;
  }

  .messages-area::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.16);
  }

  :global(.dark) .messages-area::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.08);
  }

  :global(.dark) .messages-area::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.16);
  }

  /* Message Wrapper & Bubble */
  .message-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    animation: messageFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  @keyframes messageFadeIn {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .message-wrapper.user {
    align-items: flex-end;
  }

  .message-wrapper.ai {
    align-items: flex-start;
  }

  .message-bubble {
    max-width: 82%;
    padding: 0.75rem 0.95rem;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    transition: all 0.2s;
  }

  .message-wrapper.ai .message-bubble {
    background: #ffffff;
    color: #18181b;
    border: 1px solid rgba(0, 0, 0, 0.05);
    border-radius: 14px 14px 14px 2px; /* asymmetric */
  }

  :global(.dark) .message-wrapper.ai .message-bubble {
    background: #18181b;
    color: #f4f4f5;
    border-color: rgba(255, 255, 255, 0.06);
  }

  .message-wrapper.user .message-bubble {
    background: #4f46e5; /* premium indigo solid background */
    color: #ffffff;
    border-radius: 14px 14px 2px 14px; /* asymmetric */
  }

  :global(.dark) .message-wrapper.user .message-bubble {
    background: #6366f1; /* lighter indigo in dark mode */
  }

  /* Bubble Markdown & HTML styling */
  .message-content {
    font-size: 0.875rem;
    line-height: 1.5;
    word-break: break-word;
  }

  .message-content :global(p) {
    margin: 0 0 0.5rem 0;
  }

  .message-content :global(p:last-child) {
    margin: 0;
  }

  .message-content :global(strong) {
    font-weight: 600;
    color: #18181b;
  }

  .message-wrapper.user .message-content :global(strong) {
    color: #ffffff;
  }

  :global(.dark) .message-content :global(strong) {
    color: #ffffff;
  }

  .message-content :global(a) {
    color: #4f46e5;
    text-decoration: underline;
    font-weight: 500;
    transition: color 0.2s;
  }

  .message-wrapper.user .message-content :global(a) {
    color: #ffffff;
  }

  :global(.dark) .message-content :global(a) {
    color: #a5b4fc;
  }

  .message-content :global(a:hover) {
    color: #312e81;
  }

  :global(.dark) .message-content :global(a:hover) {
    color: #c7d2fe;
  }

  .message-content :global(code) {
    background: rgba(0, 0, 0, 0.05);
    padding: 0.15rem 0.3rem;
    border-radius: 0.25rem;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
      "Liberation Mono", "Courier New", monospace;
    font-size: 0.8rem;
    font-weight: 500;
  }

  .message-wrapper.user .message-content :global(code) {
    background: rgba(255, 255, 255, 0.2);
    color: #ffffff;
  }

  :global(.dark) .message-content :global(code) {
    background: rgba(255, 255, 255, 0.1);
  }

  .message-content :global(ul),
  .message-content :global(ol) {
    margin: 0.5rem 0;
    padding-left: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .message-content :global(li) {
    margin: 0;
  }

  .message-time {
    font-size: 0.675rem;
    align-self: flex-end;
  }

  .message-wrapper.ai .message-time {
    color: #a1a1aa;
  }

  .message-wrapper.user .message-time {
    color: rgba(255, 255, 255, 0.7);
  }

  /* Typing Indicator */
  .typing-bubble {
    align-self: flex-start;
    background: #ffffff;
    border: 1px solid rgba(0, 0, 0, 0.05);
    border-radius: 14px 14px 14px 2px;
    padding: 0.75rem 1.15rem;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
  }

  :global(.dark) .typing-bubble {
    background: #18181b;
    border-color: rgba(255, 255, 255, 0.06);
  }

  .typing-indicator {
    display: flex;
    align-items: center;
    gap: 4px;
    height: 12px;
  }

  .typing-indicator span {
    width: 5px;
    height: 5px;
    background: #a1a1aa;
    border-radius: 50%;
    display: inline-block;
    animation: bounce 1.4s infinite ease-in-out both;
  }

  .typing-indicator span:nth-child(1) {
    animation-delay: -0.32s;
  }

  .typing-indicator span:nth-child(2) {
    animation-delay: -0.16s;
  }

  @keyframes bounce {
    0%,
    80%,
    100% {
      transform: scale(0.6);
      opacity: 0.4;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }

  /* Input Area */
  .input-area {
    padding: 1rem 1.15rem;
    background: #ffffff;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    z-index: 10;
    transition:
      background-color 0.3s,
      border-top-color 0.3s;
  }

  :global(.dark) .input-area {
    background: #18181b;
    border-top-color: rgba(255, 255, 255, 0.06);
  }

  .quick-questions {
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
    padding-bottom: 0.25rem;
    scrollbar-width: none; /* Hide standard Firefox scrollbars */
  }

  .quick-questions::-webkit-scrollbar {
    display: none; /* Hide Webkit scrollbars */
  }

  .quick-btn {
    white-space: nowrap;
    background: #ffffff;
    border: 1px solid #e4e4e7;
    border-radius: 9999px;
    padding: 0.4rem 0.8rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: #27272a;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }

  :global(.dark) .quick-btn {
    background: #27272a;
    border-color: #3f3f46;
    color: #e4e4e7;
  }

  .quick-btn:hover {
    background: #fafafa;
    border-color: #a1a1aa;
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  }

  :global(.dark) .quick-btn:hover {
    background: #3f3f46;
    border-color: #52525b;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .quick-btn:active {
    transform: translateY(0);
  }

  .message-input-wrapper {
    display: flex;
    align-items: center;
    position: relative;
    width: 100%;
  }

  .message-input {
    width: 100%;
    box-sizing: border-box;
    background: #fafafa;
    border: 1px solid #e4e4e7;
    border-radius: 9999px;
    padding: 0.65rem 2.85rem 0.65rem 1.15rem;
    font-size: 0.85rem;
    color: #18181b;
    outline: none;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }

  :global(.dark) .message-input {
    background: #09090b;
    border-color: #27272a;
    color: #ffffff;
  }

  .message-input:focus {
    border-color: #4f46e5;
    background: #ffffff;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.08);
  }

  :global(.dark) .message-input:focus {
    border-color: #6366f1;
    background: #09090b;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.15);
  }

  .send-button {
    position: absolute;
    right: 4px;
    background: #18181b;
    color: #ffffff;
    border: none;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }

  :global(.dark) .send-button {
    background: #ffffff;
    color: #18181b;
  }

  .send-button:hover {
    transform: scale(1.06);
    background: #000000;
  }

  :global(.dark) .send-button:hover {
    background: #e4e4e7;
    transform: scale(1.06);
  }

  .send-button:active {
    transform: scale(0.94);
  }

  @media (max-width: 640px) {
    .ai-button {
      pointer-events: auto;
    }

    /* Immersive full screen window drawer */
    .ai-window {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100%;
      height: 100dvh;
      max-height: none; /* Restore full screen height on mobile */
      border-radius: 0;
      border: none;
      pointer-events: auto;
      display: flex;
      flex-direction: column;
      z-index: 100;
      animation: slideInMobile 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes slideInMobile {
      from {
        transform: translateY(100%);
      }
      to {
        transform: translateY(0);
      }
    }

    /* Taller, beautiful mobile header with bigger tap targets */
    .ai-header {
      padding: 0.95rem 1rem;
      height: 64px;
      box-sizing: border-box;
    }

    /* Show back button on mobile */
    .mobile-back-button {
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      color: #71717a;
      padding: 0.4rem;
      border-radius: 50%;
      cursor: pointer;
      margin-left: -0.4rem;
    }

    :global(.dark) .mobile-back-button {
      color: #a1a1aa;
    }

    .mobile-back-button:hover {
      background: #f4f4f5;
    }

    :global(.dark) .mobile-back-button:hover {
      background: #27272a;
    }

    /* Hide desktop close button on mobile */
    .desktop-close-button {
      display: none !important;
    }

    .ai-avatar {
      width: 26px;
      height: 26px;
    }

    .ai-header h3 {
      font-size: 0.9rem;
    }

    .ai-header p {
      font-size: 0.7rem;
    }

    /* Refine voice settings dropdown positioning for full-screen mobile */
    .voice-settings-overlay {
      top: 63px;
    }

    /* Expand text bubble limits for optimal typing */
    .message-bubble {
      max-width: 86%;
    }

    /* Refine padding for messages area */
    .messages-area {
      padding: 1rem;
    }

    /* Safe margins inside mobile inputs */
    .input-area {
      padding: 0.75rem 1rem calc(0.75rem + env(safe-area-inset-bottom)) 1rem;
      border-radius: 0;
    }
  }
</style>
