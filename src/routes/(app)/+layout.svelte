<script lang="ts">
	import { tick } from 'svelte';
	import Navbar from '../../components/Navbar.svelte';
	import Footer from '../../components/Footer.svelte';
	import ChatMessage from '../../components/ChatMessage.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	let darkMode = $state<boolean>(false);
	let mounted = $state(false);

	// Effect untuk dark mode initialization
	$effect(() => {
		if (typeof window === 'undefined') return;

		const savedTheme = localStorage.getItem('theme');
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		
		if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
			darkMode = true;
			document.documentElement.classList.add('dark');
		}

		mounted = true;
	});

	$effect(() => {
		if (!mounted) return;

		(async () => {
			await tick();

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
		})();
	});

	function toggleDarkMode(): void {
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

<div class="min-h-screen bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 transition-colors duration-300 relative overflow-x-hidden">
	<!-- Subtle ambient mesh gradient background -->
	<div class="pointer-events-none fixed inset-0 z-0 opacity-40 dark:opacity-60">
		<div class="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-blue-600/20 via-purple-600/15 to-emerald-500/10 blur-[120px] rounded-full"></div>
	</div>

	<div class="relative z-10">
		<Navbar {darkMode} {toggleDarkMode} />
		{@render children()}
		<Footer />
		<ChatMessage />
	</div>
</div>