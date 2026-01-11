<script lang="ts">
	import { tick } from 'svelte';
	import Navbar from '../../components/Navbar.svelte';
	import Footer from '../../components/Footer.svelte';
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

<div class="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
	<Navbar {darkMode} {toggleDarkMode} />
	{@render children()}
	<Footer />
</div>