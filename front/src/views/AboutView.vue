<script setup lang="ts">
import AppLayout from '@/components/AppLayout.vue'
</script>

<template>
  <AppLayout>
    <div class="p-5 max-w-7xl mx-auto">
      <div class="bg-white rounded shadow-lg overflow-hidden">
        <div class="p-6 bg-gray-100 border-b border-gray-200 text-center">
          <h1 class="text-2xl font-bold text-slate-700">About PickToLight</h1>
        </div>
        <div class="p-6">
          <div class="prose max-w-none">
            <p class="text-gray-600 mb-4">
              PickToLight is a modern warehouse management system that helps you efficiently locate and manage items in your inventory.
            </p>
            <h2 class="text-xl font-semibold text-slate-700 mb-3">Features</h2>
            <ul class="text-gray-600 space-y-2">
              <li class="flex items-start">
                <span class="text-blue-500 mr-2">•</span>
                <span><strong>Select:</strong> Quickly find and activate items with visual indicators</span>
              </li>
              <li class="flex items-start">
                <span class="text-green-500 mr-2">•</span>
                <span><strong>Manage:</strong> Create and organize shelves, floors, and items</span>
              </li>
              <li class="flex items-start">
                <span class="text-gray-500 mr-2">•</span>
                <span><strong>Real-time:</strong> Live updates and status tracking</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
