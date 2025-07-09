<template>
  <div class="p-5 max-w-7xl mx-auto">
    <h1 class="text-center text-slate-700 mb-8 text-2xl font-bold">{{ isUpdate ? 'Update Element' : 'Create Elements' }}</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-5">
      <!-- Update Mode -->
      <UpdateShelve 
        v-if="isUpdate && type === 'shelve'"
        :id="route.params.id"
        @shelve-updated="handleShelveCreated" 
      />
      <UpdateFloor 
        v-if="isUpdate && type === 'floor'"
        :id="route.params.id"
        @floor-updated="handleFloorCreated" 
      />
      <UpdateItem 
        v-if="isUpdate && type === 'item'"
        :id="route.params.id"
        @item-updated="handleItemCreated" 
      />
      
      <!-- Create Mode -->
      <template v-else>
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
        <ShelvesListWithEdit 
          :shelves="shelves"
          :loading="shelvesLoading"
          :error="shelvesError"
          @refresh="fetchShelves"
        />
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import CreateShelve from '../components/CreateShelve.vue'
import CreateFloors from '../components/CreateFloors.vue'
import CreateItems from '../components/CreateItems.vue'
import UpdateShelve from '../components/UpdateShelve.vue'
import UpdateFloor from '../components/UpdateFloor.vue'
import UpdateItem from '../components/UpdateItem.vue'
import ShelvesListWithEdit from '../components/ShelvesListWithEdit.vue'
import { API_URL, fetchFromApi } from '@/utils/api'

// Determine if we are in update mode
const route = useRoute()
const isUpdate = computed(() => route.params.id !== undefined)
const type = computed(() => route.params.type || 'shelve')

// Centralized data management
const shelves = ref([])
const shelvesLoading = ref(false)
const shelvesError = ref('')

const floors = ref([])
const floorsLoading = ref(false)
const floorsError = ref('')

// Event handlers for child component events
function handleShelveCreated() {
  fetchShelves()
}

function handleFloorCreated() {
  fetchFloors()
}

function handleItemCreated() {
  // Items don't affect other dropdowns, but we could add logic here if needed
}

async function fetchShelves() {
  shelvesLoading.value = true
  shelvesError.value = ''
  try {
    shelves.value = await fetchFromApi('shelves')
  } catch (error) {
    shelvesError.value = `Error loading shelves: ${error.message}`
  } finally {
    shelvesLoading.value = false
  }
}

async function fetchFloors() {
  floorsLoading.value = true
  floorsError.value = ''
  try {
    floors.value = await fetchFromApi('floors')
  } catch (error) {
    floorsError.value = `Error loading floors: ${error.message}`
  } finally {
    floorsLoading.value = false
  }
}

// Load initial data when component mounts
onMounted(() => {
  fetchShelves()
  fetchFloors()
})
</script>

