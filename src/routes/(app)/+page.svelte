<script>
  import Hero from '../../components/Hero.svelte';
  import About from '../../components/About.svelte';
  import Projects from '../../components/Projects.svelte';
  import Experience from '../../components/Experience.svelte';
  import Contact from '../../components/Contact.svelte';

  export let data;
</script>

<div>
  <Hero liveProjectsCount={data.projects.filter((p) => Boolean(p.link)).length} />
  <About />
  <Projects projects={data.projects} />
  <Experience />
  <Contact />
</div>
