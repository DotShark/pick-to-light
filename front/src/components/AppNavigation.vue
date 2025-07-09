<template>
  <nav class="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo/Brand -->
        <div class="flex items-center">
          <router-link to="/" class="text-xl font-bold text-slate-700 hover:text-blue-600 transition-colors">
            PickToLight
          </router-link>
        </div>

        <!-- Navigation Links -->
        <div class="flex space-x-1">
          <router-link
            to="/"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            :class="isActive('/') 
              ? 'bg-blue text-white' 
              : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'"
          >
            Home
          </router-link>

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
              ? 'bg-green text-white' 
              : 'text-gray-700 hover:bg-gray-100 hover:text-green-600'"
          >
            Manage
          </router-link>

          <router-link
            to="/about"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            :class="isActive('/about') 
              ? 'bg-gray-600 text-white' 
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-600'"
          >
            About
          </router-link>
        </div>

        <!-- User Actions -->
        <div class="flex items-center space-x-2">
          <router-link
            to="/login"
            class="px-3 py-1 text-sm text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
          >
            Login
          </router-link>
          <span class="text-gray-400">|</span>
          <router-link
            to="/login-admin"
            class="px-3 py-1 text-sm text-green-600 hover:text-green-700 transition-colors cursor-pointer font-medium"
          >
            Admin
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

// Function to check if a route is active
const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}
</script>
