<template>
  <div class="p-5 max-w-7xl mx-auto">
    <h1 class="text-center text-slate-700 mb-8 text-2xl font-bold">Manage Elements</h1>
    <HierarchicalCards />
  </div>
</template>

<script setup>
import HierarchicalCards from '../components/HierarchicalCards.vue'

defineProps({
  shelveId: {
    type: String,
    default: null
  },
  floorId: {
    type: String,
    default: null
  }
})
</script>

