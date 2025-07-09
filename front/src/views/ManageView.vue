<template>
  <div class="manage-view">
    <h1>Manage Elements</h1>
    <HierarchicalSlider />
  </div>
</template>

<script setup>
import HierarchicalSlider from '../components/HierarchicalSlider.vue'

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

<style scoped>
.manage-view {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
}
</style>
