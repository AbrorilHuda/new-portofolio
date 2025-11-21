<script>
  const skills = [
    { name: 'JavaScript', level: 90 },
    { name: 'React', level: 85 },
    { name: 'Node.js', level: 80 },
    { name: 'TypeScript', level: 85 },
    { name: 'Svelte', level: 75 },
    { name: 'UI/UX Design', level: 30 },
    { name: 'Tailwind CSS', level: 90 },
    { name: 'SQL', level: 80 },
  ];
</script>

<section id="about" class="py-24 px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/50">
  <div class="max-w-7xl mx-auto">
    <div class="text-center mb-16">
      <h2 class="text-4xl md:text-5xl font-bold mb-4">
        About <span class="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Me</span>
      </h2>
      <p class="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
        Passionate about creating exceptional digital experiences
      </p>
    </div>
    
    <div class="grid md:grid-cols-2 gap-12 items-start">
      <!-- About Text -->
      <div class="space-y-6">
        <div class="prose dark:prose-invert max-w-none">
          <p class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            I am a Full-Stack Web Developer and Computer Science student at Madura University with experience in building web applications from front-end to back-end. Currently, I also serve as Lead Developer at MaduraDev and DCN, leading feature development and ensuring the quality and scalability of the solutions developed. Focused on clean code, problem-solving, and continuous learning, I believe that every error is part of the process of becoming a better developer. I am committed to delivering effective, functional, and reliable digital solutions.
          </p>
          <p class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            ..
          </p>
        </div>
        
        <div class="flex flex-wrap gap-3">
          <span class="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium">Web Development</span>
          <span class="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-sm font-medium">VIBE</span>
          <span class="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">Responsive Design</span>
          <span class="px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-sm font-medium">API Development</span>
        </div>
      </div>
      
      <!-- Skills -->
      <div class="space-y-6">
        <h3 class="text-2xl font-bold mb-8">Technical Skills</h3>
        {#each skills as skill}
          <div>
            <div class="flex justify-between mb-2">
              <span class="text-gray-700 dark:text-gray-300 font-medium">{skill.name}</span>
              <span class="text-gray-500 dark:text-gray-400">{skill.level}%</span>
            </div>
            <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                class="h-full bg-linear-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-1000 ease-out"
                style="width: {skill.level}%"
              ></div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>
