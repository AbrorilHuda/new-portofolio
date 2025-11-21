<script>
  import { onMount } from 'svelte';
  import Navbar from '../components/Navbar.svelte';
  import Hero from '../components/Hero.svelte';
  import About from '../components/About.svelte';
  import Projects from '../components/Projects.svelte';
  import Experience from '../components/Experience.svelte';
  import Contact from '../components/Contact.svelte';
  import Footer from '../components/Footer.svelte';

  let darkMode = false;

  onMount(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      darkMode = true;
      document.documentElement.classList.add('dark');
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('section');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  });

  function toggleDarkMode() {
    darkMode = !darkMode;
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }
</script>

<div class="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
  <Navbar {darkMode} {toggleDarkMode} />
  <Hero />
  <About />
  <Projects />
  <Experience />
  <Contact />
  <Footer />
</div>
