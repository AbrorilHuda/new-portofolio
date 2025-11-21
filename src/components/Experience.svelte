<script>
  const experiences = [
    {
      id: 1,
      title: 'Cooming Soon',
      company: '.........',
      period: '.......',
      description: '........',
      type: '.......'
    },
    {
      id: 2,
      title: 'Bachelor of Computer Science',
      company: 'Madura University',
      period: '2022 - now',
      description: 'create community DCN Madura University',
      type: 'education'
    }
  ];
</script>

<section id="experience" class="py-24 px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/50">
  <div class="max-w-5xl mx-auto">
    <div class="text-center mb-16">
      <h2 class="text-4xl md:text-5xl font-bold mb-4">
        Experience & <span class="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Education</span>
      </h2>
      <p class="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
        My professional journey and academic background
      </p>
    </div>
    
    <!-- Timeline -->
    <div class="relative">
      <!-- Vertical Line -->
      <div class="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-linear-to-b from-blue-600 to-purple-600"></div>
      
      <!-- Timeline Items -->
      <div class="space-y-12">
        {#each experiences as exp, i}
          <div class="relative flex flex-col md:flex-row gap-8 {i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}">
            <!-- Timeline Dot -->
            <div class="absolute left-8 md:left-1/2 w-4 h-4 bg-linear-to-r from-blue-600 to-purple-600 rounded-full transform -translate-x-1/2 shadow-lg">
              <div class="absolute inset-0 bg-linear-to-r from-blue-600 to-purple-600 rounded-full animate-ping opacity-75"></div>
            </div>
            
            <!-- Content Card -->
            <div class="md:w-1/2 {i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}">
              <div class="ml-16 md:ml-0 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div class="flex items-center gap-2 mb-2 {i % 2 === 0 ? 'md:justify-end' : ''}">
                  {#if exp.type === 'work'}
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  {:else}
                    <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  {/if}
                  <span class="text-sm font-medium text-gray-500 dark:text-gray-400">{exp.period}</span>
                </div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{exp.title}</h3>
                <p class="text-blue-600 dark:text-blue-400 font-medium mb-3">{exp.company}</p>
                <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{exp.description}</p>
              </div>
            </div>
            
            <div class="md:w-1/2"></div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>
