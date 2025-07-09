<template>
  <nav class="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo/Brand -->
        <div class="flex items-center">
          <span class="text-xl font-bold text-slate-700">
            PickToLight
          </span>
        </div>

        <!-- Navigation Links -->
        <div class="flex space-x-1">
          <router-link
            to="/select"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            :class="isActive('/select')
              ? 'bg-blue text-white'
              : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'"
          >
            Select
          </router-link>

          <router-link
            to="/manage"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            :class="isActive('/manage')
              ? 'bg-blue text-white'
              : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'"
          >
            Manage
          </router-link>
        </div>

        <!-- Logout Button -->
        <div class="flex items-center">
          <button
            @click="logout"
            class="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()

// Function to check if a route is active
const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

// Logout function
const logout = () => {
  // Here you would typically clear authentication tokens/session
  // For now, we'll just redirect to login
  router.push('/login')
}
</script>
