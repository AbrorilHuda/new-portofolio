<script lang="ts">
  import { onMount } from "svelte";
  import type { PageData } from "./$types";

  export let data: PageData;

  $: cv = data.cv;
  $: isAdmin = data.isAdmin;

  let currentTheme: "auto" | "light" | "dark" = "auto";
  let copied = false;

  onMount(() => {
    const saved = localStorage.getItem("cv-theme") as
      | "auto"
      | "light"
      | "dark"
      | null;
    if (saved) {
      currentTheme = saved;
      applyTheme(saved);
    }
  });

  function applyTheme(theme: "auto" | "light" | "dark") {
    currentTheme = theme;
    localStorage.setItem("cv-theme", theme);
    const root = document.documentElement;
    if (theme === "auto") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", theme);
    }
  }

  function toggleTheme() {
    if (currentTheme === "auto") {
      applyTheme("dark");
    } else if (currentTheme === "dark") {
      applyTheme("light");
    } else {
      applyTheme("auto");
    }
  }

  function handlePrint() {
    window.print();
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      copied = true;
      setTimeout(() => (copied = false), 2000);
    } catch {
      // fallback
    }
  }

  function formatPhoneUrl(phone: string) {
    return "tel:" + phone.replace(/[^+\d]/g, "");
  }

  function formatUrl(url: string | undefined, defaultPrefix = "https://") {
    if (!url) return "#";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return defaultPrefix + url;
  }
</script>

<svelte:head>
  <title>CV – {cv.name}</title>
  <meta
    name="description"
    content="Curriculum Vitae ATS-Friendly {cv.name} - {cv.role}."
  />
</svelte:head>

<!-- Floating Toolbar for visitor interaction (hidden in print) -->
<aside class="toolbar no-print" aria-label="Toolbar Aksi CV">
  <div class="toolbar-content">
    <a href="/" class="toolbar-btn" title="Kembali ke Beranda Portfolio">
      <svg
        class="icon"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
        />
      </svg>
      <span class="btn-label">Beranda</span>
    </a>

    <div class="divider"></div>

    <button
      type="button"
      class="toolbar-btn"
      on:click={toggleTheme}
      title="Ganti Tema Tampilan (Auto / Gelap / Terang)"
    >
      {#if currentTheme === "dark"}
        <svg
          class="icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
          />
        </svg>
        <span class="btn-label">Gelap</span>
      {:else if currentTheme === "light"}
        <svg
          class="icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
          />
        </svg>
        <span class="btn-label">Terang</span>
      {:else}
        <svg
          class="icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3"
          />
        </svg>
        <span class="btn-label">Auto</span>
      {/if}
    </button>

    <button
      type="button"
      class="toolbar-btn"
      on:click={copyLink}
      title="Salin Tautan CV"
    >
      <svg
        class="icon"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-3.536l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
        />
      </svg>
      <span class="btn-label">{copied ? "Disalin!" : "Salin Link"}</span>
    </button>

    <button
      type="button"
      class="toolbar-btn primary"
      on:click={handlePrint}
      title="Cetak atau Simpan PDF (Ctrl+P / Cmd+P)"
    >
      <svg
        class="icon"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.75A2.25 2.25 0 0015 1.5H9a2.25 2.25 0 00-2.25 2.25v3.456"
        />
      </svg>
      <span class="btn-label">Cetak / PDF</span>
    </button>

    {#if isAdmin}
      <div class="divider"></div>
      <a
        href="/admin/cv"
        class="toolbar-btn admin"
        title="Buka Pengaturan CV di Admin Panel"
      >
        <svg
          class="icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
          />
        </svg>
        <span class="btn-label">Edit CV</span>
      </a>
    {/if}
  </div>
</aside>

<!-- Main ATS-friendly document container (identical markup & typography to CV-ATS-Friendly.html) -->
<div class="cv-wrapper">
  <main class="page">
    <header>
      <h1>{cv.name}</h1>
      <p class="role">{cv.role}</p>
      <ul class="contact">
        {#if cv.contact.location}
          <li>{cv.contact.location}</li>
        {/if}
        {#if cv.contact.email}
          <li><a href="mailto:{cv.contact.email}">{cv.contact.email}</a></li>
        {/if}
        {#if cv.contact.phone}
          <li>
            <a href={formatPhoneUrl(cv.contact.phone)}>{cv.contact.phone}</a>
          </li>
        {/if}
        {#if cv.contact.linkedin}
          <li>
            <a
              href={formatUrl(cv.contact.linkedin_url || cv.contact.linkedin)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {cv.contact.linkedin.replace(/^https?:\/\/(www\.)?/, "")}
            </a>
          </li>
        {/if}
        {#if cv.contact.github}
          <li>
            <a
              href={formatUrl(cv.contact.github_url || cv.contact.github)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {cv.contact.github.replace(/^https?:\/\/(www\.)?/, "")}
            </a>
          </li>
        {/if}
        {#if cv.contact.website}
          <li>
            <a
              href={formatUrl(cv.contact.website_url || cv.contact.website)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {cv.contact.website.replace(/^https?:\/\/(www\.)?/, "")}
            </a>
          </li>
        {/if}
      </ul>
    </header>

    {#if cv.summary}
      <section aria-labelledby="ringkasan">
        <h2 id="ringkasan">Ringkasan Profesional</h2>
        <p>{cv.summary}</p>
      </section>
    {/if}

    {#if cv.experiences && cv.experiences.length > 0}
      <section aria-labelledby="pengalaman">
        <h2 id="pengalaman">Pengalaman Kerja</h2>
        {#each cv.experiences as exp (exp.id || exp.title)}
          <article class="item">
            <div class="head">
              <h3>{exp.title}</h3>
              <span class="date">{exp.period}</span>
            </div>
            <p class="org">
              {exp.company}{#if exp.location}, {exp.location}{/if}
            </p>
            {#if exp.highlights && exp.highlights.length > 0}
              <ul>
                {#each exp.highlights as highlight}
                  <li>{highlight}</li>
                {/each}
              </ul>
            {/if}
          </article>
        {/each}
      </section>
    {/if}

    {#if cv.projects && cv.projects.length > 0}
      <section aria-labelledby="proyek">
        <h2 id="proyek">Proyek</h2>
        {#each cv.projects as proj (proj.id || proj.title)}
          <article class="item">
            <div class="head">
              <h3>
                {#if proj.link}
                  <a
                    href={formatUrl(proj.link)}
                    target="_blank"
                    rel="noopener noreferrer">{proj.title}</a
                  >
                {:else}
                  {proj.title}
                {/if}
              </h3>
              {#if proj.period}
                <span class="date">{proj.period}</span>
              {/if}
            </div>
            <p>{proj.description}</p>
          </article>
        {/each}
      </section>
    {/if}

    {#if cv.education && cv.education.length > 0}
      <section aria-labelledby="pendidikan">
        <h2 id="pendidikan">Pendidikan</h2>
        {#each cv.education as edu (edu.id || edu.degree)}
          <article class="item">
            <div class="head">
              <h3>{edu.degree}</h3>
              <span class="date">{edu.period}</span>
            </div>
            <p class="org">
              {edu.institution}{#if edu.info}, {edu.info}{/if}
            </p>
          </article>
        {/each}
      </section>
    {/if}

    {#if cv.skills && cv.skills.length > 0}
      <section aria-labelledby="keahlian">
        <h2 id="keahlian">Keahlian</h2>
        <dl class="skills">
          {#each cv.skills as skill (skill.id || skill.category)}
            <dt>{skill.category}</dt>
            <dd>{skill.skills}</dd>
          {/each}
        </dl>
      </section>
    {/if}

    {#if cv.certifications && cv.certifications.length > 0}
      <section aria-labelledby="sertifikasi">
        <h2 id="sertifikasi">Sertifikasi</h2>
        <ul>
          {#each cv.certifications as cert (cert.id || cert.name)}
            <li>
              <strong>{cert.name}</strong> – {cert.issuer}{#if cert.year}, {cert.year}{/if}
            </li>
          {/each}
        </ul>
      </section>
    {/if}
  </main>
</div>

<style>
  :global(:root) {
    box-sizing: border-box;
    padding-top: env(safe-area-inset-top, 0px);
    padding-bottom: env(safe-area-inset-bottom, 0px);
    --bg: #eef0f2;
    --paper: #ffffff;
    --ink: #1b1f24;
    --muted: #4f5a66;
    --accent: #1f4e5f;
    --line: #cfd6dc;
  }

  @media (prefers-color-scheme: dark) {
    :global(:root:not([data-theme="light"])) {
      --bg: #14181c;
      --paper: #1c2228;
      --ink: #e8ecef;
      --muted: #a3afba;
      --accent: #7cc1d6;
      --line: #34404a;
    }
  }

  :global(:root[data-theme="dark"]) {
    --bg: #14181c;
    --paper: #1c2228;
    --ink: #e8ecef;
    --muted: #a3afba;
    --accent: #7cc1d6;
    --line: #34404a;
  }

  :global(:root[data-theme="light"]) {
    --bg: #eef0f2;
    --paper: #ffffff;
    --ink: #1b1f24;
    --muted: #4f5a66;
    --accent: #1f4e5f;
    --line: #cfd6dc;
  }

  .cv-wrapper {
    min-height: 100vh;
    background: var(--bg);
    color: var(--ink);
    font:
      16px/1.6 -apple-system,
      "Segoe UI",
      Roboto,
      Arial,
      sans-serif;
    -webkit-text-size-adjust: 100%;
    padding: 1.5rem 1rem 3.5rem;
    box-sizing: border-box;
    transition:
      background-color 0.25s ease,
      color 0.25s ease;
  }

  .page {
    max-width: 820px;
    margin: clamp(0px, 3vw, 32px) auto;
    background: var(--paper);
    padding: clamp(20px, 5vw, 56px);
    border-radius: 6px;
    box-shadow:
      0 4px 20px -2px rgba(0, 0, 0, 0.06),
      0 2px 6px -1px rgba(0, 0, 0, 0.04);
    transition: background-color 0.25s ease;
  }

  h1,
  h2,
  h3 {
    font-family: Georgia, "Times New Roman", serif;
    line-height: 1.25;
    margin: 0;
  }

  h1 {
    font-size: clamp(1.7rem, 5vw, 2.3rem);
    letter-spacing: 0.01em;
  }

  .role {
    margin: 0.25rem 0 0;
    font-size: 1.1rem;
    color: var(--accent);
    font-weight: 600;
  }

  .contact {
    list-style: none;
    padding: 0;
    margin: 1rem 0 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem 1.25rem;
    color: var(--muted);
    font-size: 0.95rem;
  }

  .contact a {
    color: inherit;
    text-decoration: underline;
    text-underline-offset: 3px;
    overflow-wrap: anywhere;
  }

  a:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  section {
    margin-top: 1.75rem;
  }

  h2 {
    font-size: 1.15rem;
    color: var(--accent);
    border-bottom: 2px solid var(--line);
    padding-bottom: 0.3rem;
    margin-bottom: 0.9rem;
  }

  h3 {
    font-size: 1.02rem;
  }

  h3 a {
    color: inherit;
    text-decoration: none;
    border-bottom: 1px dotted var(--accent);
  }

  h3 a:hover {
    color: var(--accent);
  }

  .item {
    margin-bottom: 1.15rem;
  }

  .item:last-child {
    margin-bottom: 0;
  }

  .head {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 0.1rem 1rem;
    align-items: baseline;
  }

  .date {
    color: var(--muted);
    font-size: 0.92rem;
    white-space: nowrap;
  }

  .org {
    margin: 0.1rem 0 0.4rem;
    color: var(--muted);
    font-size: 0.95rem;
  }

  p {
    margin: 0 0 0.5rem;
  }

  ul {
    margin: 0.3rem 0 0;
    padding-left: 1.2rem;
  }

  li {
    margin-bottom: 0.3rem;
  }

  .skills {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: 0.35rem 1.25rem;
    margin: 0;
  }

  .skills dt {
    font-weight: 600;
  }

  .skills dd {
    margin: 0;
  }

  @media (max-width: 560px) {
    .skills {
      grid-template-columns: 1fr;
      gap: 0;
    }
    .skills dd {
      margin-bottom: 0.6rem;
    }
    .date {
      white-space: normal;
    }
  }

  /* Floating Toolbar */
  .toolbar {
    position: sticky;
    top: 1rem;
    z-index: 100;
    max-width: 820px;
    margin: 0 auto 1rem;
    display: flex;
    justify-content: flex-end;
  }

  .toolbar-content {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    background: var(--paper);
    padding: 0.35rem 0.5rem;
    border-radius: 9999px;
    border: 1px solid var(--line);
    box-shadow:
      0 10px 25px -5px rgba(0, 0, 0, 0.1),
      0 8px 10px -6px rgba(0, 0, 0, 0.05);
    backdrop-filter: blur(8px);
  }

  .toolbar-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.4rem 0.75rem;
    font-size: 0.825rem;
    font-weight: 500;
    border-radius: 9999px;
    color: var(--ink);
    background: transparent;
    border: none;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.15s ease;
    user-select: none;
  }

  .toolbar-btn:hover {
    background: var(--bg);
    color: var(--accent);
  }

  .toolbar-btn.primary {
    background: var(--accent);
    color: var(--paper);
  }

  .toolbar-btn.primary:hover {
    opacity: 0.92;
    transform: translateY(-1px);
  }

  .toolbar-btn.admin {
    background: #2563eb;
    color: #ffffff;
  }

  .toolbar-btn.admin:hover {
    background: #1d4ed8;
  }

  .icon {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
  }

  .divider {
    width: 1px;
    height: 1.25rem;
    background: var(--line);
    margin: 0 0.15rem;
  }

  @media (max-width: 600px) {
    .toolbar {
      justify-content: center;
      top: 0.5rem;
    }
    .btn-label {
      display: none;
    }
    .toolbar-btn {
      padding: 0.45rem;
    }
  }

  /* PRINT STYLING - Pure ATS friendly black & white standard print */
  @media print {
    @page {
      size: A4;
      margin: 14mm;
    }

    :global(:root) {
      --bg: #fff !important;
      --paper: #fff !important;
      --ink: #000 !important;
      --muted: #333 !important;
      --accent: #000 !important;
      --line: #999 !important;
      padding: 0 !important;
    }

    :global(body) {
      background: #fff !important;
      color: #000 !important;
      font-size: 11pt !important;
    }

    .cv-wrapper {
      padding: 0 !important;
      background: #fff !important;
      min-height: auto !important;
    }

    .page {
      margin: 0 !important;
      padding: 0 !important;
      max-width: none !important;
      border-radius: 0 !important;
      box-shadow: none !important;
    }

    section,
    .item {
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .no-print {
      display: none !important;
    }

    .contact a {
      text-decoration: none !important;
    }
  }
</style>
