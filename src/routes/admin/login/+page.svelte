<script lang="ts">
  import { enhance } from '$app/forms';

  export let form;
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
  <div class="max-w-md w-full space-y-8">
    <div>
      <h2 class="text-center text-3xl font-bold">Admin Login</h2>
      <p class="mt-2 text-center text-gray-600 dark:text-gray-400">
        Silakan login untuk mengakses dashboard
      </p>
    </div>
    
    <form method="POST" use:enhance class="mt-8 space-y-6">
      {#if form?.error}
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {form.error}
        </div>
      {/if}

      <div class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium mb-2">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
            placeholder="admin@example.com"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium mb-2">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
            placeholder="••••••••"
          />
        </div>
      </div>

      <button
        type="submit"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Login
      </button>
    </form>

    <div class="text-center text-sm text-gray-600 dark:text-gray-400">
      <p>Demo credentials:</p>
      <p>Email: admin@example.com</p>
      <p>Password: admin123</p>
    </div>
  </div>
</div>