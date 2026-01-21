<script>
  import ProjectCard from './ProjectCard.svelte';
  
  const projects = [
    {
      id: 1,
      title: 'Demtimcod Docs',
      description: 'to make it easier for readers to read the documentation',
      image: 'https://32ily8ib82.ucarecd.net/80bddb32-e19f-453c-a1a9-a0c30a1f52ec/demtimcod.png',
      technologies: ['React', 'docusaurus', 'tailwindcss'],
      link: 'https://demtimcod.github.io/'
    },
    {
      id: 2,
      title: 'Website Digital Solution',
      description: 'Modern website digital solution codverse for businesses',
      image: 'https://32ily8ib82.ucarecd.net/40e78aef-543f-4bc6-8b46-402cdaefe117/codverse.png',
      technologies: ['Next.js', 'Tailwind'],
      link: 'https://codverse.site'
    },
    {
      id: 3,
      title: 'Mobile apps',
      description: 'mobile apps ',
      image: 'https://32ily8ib82.ucarecd.net/edf30a1d-c76b-46b2-8582-45edee790a5b/reunira.png',
      technologies: ['React Native'],
      link: ''
    },
    {
      id: 4,
      title: 'Maduradev ',
      description: 'Website information maduradev.',
      image: 'https://32ily8ib82.ucarecd.net/519fe07d-e17b-4b57-b2ef-d6f2948955a9/maduradev.png',
      technologies: ['Next.js', 'TypeScript', 'TailwindCSS'],
      link: 'https://madura.dev'
    },
    {
      id: 5,
      title: 'DCN UNIRA',
      description: 'A create web information dcn universitas madura',
      image: 'https://32ily8ib82.ucarecd.net/68fcd631-d4c4-4f53-becf-2b602286e771/dcnuniradev.png',
      technologies: ['Next.js', 'TailwindCSS', 'Framer Motion', 'etc'],
      link: 'https://dcnunira.dev'
    },
    {
      id: 6,
      title: 'Presentasion deck',
      description: 'Saas presentasion deck for student',
      image: 'https://32ily8ib82.ucarecd.net/4abf756f-b6ac-4ba6-8a10-bf1d29ed688e/presentasionapp.png',
      technologies: ['Next.js', 'gemini', 'markdown', 'etc'],
      link: 'https://slide.dcnunira.dev'
    }
  ];
</script>

<section id="projects" class="py-24 px-6 lg:px-8">
  <div class="max-w-7xl mx-auto">
    <div class="text-center mb-16">
      <h2 class="text-4xl md:text-5xl font-bold mb-4">
        Featured <span class="bg-linear-to-r from-blue-600 via-purple-500 to-blue-600 bg-size[200%_100%] bg-clip-text text-transparent animate-shine">Projects</span>
      </h2>
      <p class="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
        A selection of my recent work and personal projects
      </p>
    </div>
    
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-animation">
      {#each projects as project}
        <ProjectCard {project} />
      {/each}
    </div>
  </div>
</section>
