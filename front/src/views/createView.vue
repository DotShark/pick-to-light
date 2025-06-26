<template>
  <div class="create-view">
    <h1>Create Elements</h1>
    <div class="components-container">
      <CreateShelve />
      <CreateFloors />
      <CreateItems />
    </div>
  </div>
</template>

<script setup>
import CreateShelve from '../components/CreateShelve.vue'
import CreateFloors from '../components/CreateFloors.vue'
import CreateItems from '../components/CreateItems.vue'
</script>

<style scoped>
.create-view {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.components-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
}
</style>
