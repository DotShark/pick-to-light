<script setup lang="ts">
import AppLayout from '@/components/AppLayout.vue'
</script>

<template>
  <AppLayout>
    <div class="p-5 max-w-7xl mx-auto">
      <div class="bg-white rounded shadow-lg overflow-hidden">
        <div class="p-6 bg-gray-100 border-b border-gray-200 text-center">
          <h1 class="text-2xl font-bold text-slate-700">Welcome to PickToLight</h1>
        </div>
        <div class="p-6 text-center">
          <p class="text-gray-600 mb-6">Choose an action to get started:</p>
          <div class="flex justify-center space-x-4">
            <router-link to="/select" class="bg-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer font-medium">
              Select Items
            </router-link>
            <router-link to="/manage" class="bg-green text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors cursor-pointer font-medium">
              Manage Elements
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
