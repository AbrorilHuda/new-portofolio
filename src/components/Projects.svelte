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
      title: 'Mobile Fitness App',
      description: 'Cross-platform fitness tracking application with workout plans and progress monitoring.',
      image: 'https://images.unsplash.com/photo-1641567535859-c58187ac4954',
      technologies: ['React Native', 'Firebase', 'Redux', 'TypeScript'],
      link: '#'
    },
    {
      id: 5,
      title: 'Portfolio Generator',
      description: 'SaaS platform for creating beautiful portfolio websites with drag-and-drop interface.',
      image: 'https://images.unsplash.com/photo-1609921212029-bb5a28e60960',
      technologies: ['Vue.js', 'Express', 'AWS S3', 'WebSockets'],
      link: '#'
    },
    {
      id: 6,
      title: 'Social Media App',
      description: 'Feature-rich social networking platform with real-time messaging and content sharing.',
      image: 'https://images.unsplash.com/photo-1597740985671-2a8a3b80502e',
      technologies: ['Svelte', 'Socket.io', 'Redis', 'Docker'],
      link: '#'
    }
  ];
</script>

<section id="projects" class="py-24 px-6 lg:px-8">
  <div class="max-w-7xl mx-auto">
    <div class="text-center mb-16">
      <h2 class="text-4xl md:text-5xl font-bold mb-4">
        Featured <span class="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Projects</span>
      </h2>
      <p class="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
        A selection of my recent work and personal projects
      </p>
    </div>
    
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {#each projects as project}
        <ProjectCard {project} />
      {/each}
    </div>
  </div>
</section>
