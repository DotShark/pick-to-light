<template>
  <div class="create-view">
    <h1>Create Elements</h1>
    <div class="components-container">
      <CreateShelve @shelve-created="handleShelveCreated" />
      <CreateFloors 
        :shelves="shelves" 
        :shelves-loading="shelvesLoading"
        :shelves-error="shelvesError"
        @floor-created="handleFloorCreated" 
      />
      <CreateItems 
        :floors="floors"
        :floors-loading="floorsLoading"
        :floors-error="floorsError"
        @item-created="handleItemCreated"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CreateShelve from '../components/CreateShelve.vue'
import CreateFloors from '../components/CreateFloors.vue'
import CreateItems from '../components/CreateItems.vue'

// Centralized data management
const shelves = ref([])
const shelvesLoading = ref(false)
const shelvesError = ref('')

const floors = ref([])
const floorsLoading = ref(false)
const floorsError = ref('')

// Fetch shelves from API
const fetchShelves = async () => {
  shelvesLoading.value = true
  shelvesError.value = ''
  
  try {
    const response = await fetch('http://localhost:4000/shelves')
    if (response.ok) {
      shelves.value = await response.json()
    } else {
      throw new Error(`Failed to fetch shelves: ${response.status}`)
    }
  } catch (error) {
    shelvesError.value = `Error loading shelves: ${error.message}`
  } finally {
    shelvesLoading.value = false
  }
}

// Fetch floors from API
const fetchFloors = async () => {
  floorsLoading.value = true
  floorsError.value = ''
  
  try {
    const response = await fetch('http://localhost:4000/floors')
    if (response.ok) {
      floors.value = await response.json()
    } else {
      throw new Error(`Failed to fetch floors: ${response.status}`)
    }
  } catch (error) {
    floorsError.value = `Error loading floors: ${error.message}`
  } finally {
    floorsLoading.value = false
  }
}

// Event handlers for child component events
const handleShelveCreated = () => {
  fetchShelves() // Refresh shelves list
}

const handleFloorCreated = () => {
  fetchFloors() // Refresh floors list
}

const handleItemCreated = () => {
  // Items don't affect other dropdowns, but we could add logic here if needed
}

// Load initial data when component mounts
onMounted(() => {
  fetchShelves()
  fetchFloors()
})
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
