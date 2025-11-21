<script>
  export let project;
</script>

<div class="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
  <div class="relative h-64 overflow-hidden">
    <img
      src={project.image}
      alt={project.title}
      class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      loading="lazy"
    />
    <div class="absolute inset-0 bg--to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    
    <a
      href={project.link}
      class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-6 py-3 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-100 flex items-center gap-2"
    >
      View Project
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    </a>
  </div>
  
  <div class="p-6 space-y-4">
    <h3 class="text-xl font-bold text-gray-900 dark:text-white">{project.title}</h3>
    <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{project.description}</p>
    
    <div class="flex flex-wrap gap-2">
      {#each project.technologies as tech}
        <span class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
          {tech}
        </span>
      {/each}
    </div>
  </div>
</div>