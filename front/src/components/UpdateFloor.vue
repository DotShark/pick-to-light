<template>
  <div class="bg-white p-5 rounded-lg shadow-lg">
    <h2 class="text-slate-700 mb-5 text-xl font-semibold">Update Floor</h2>
    <div v-if="loadingItem" class="text-center p-5 text-gray-500">Loading floor data...</div>
    <div v-else-if="loadError" class="bg-red-100 text-red-800 border border-red-300 p-2.5 rounded mb-5">{{ loadError }}</div>
    <form v-else @submit.prevent="updateFloor" class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <label for="floor-name" class="font-medium text-gray-600">Name:</label>
        <input
          id="floor-name"
          v-model="floorData.name"
          type="text"
          required
          placeholder="Enter floor name"
          class="p-2.5 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-20"
        />
      </div>
      <div class="flex flex-col gap-1">
        <label for="shelf-select" class="font-medium text-gray-600">Shelf:</label>
        <select
          id="shelf-select"
          v-model="floorData.shelfId"
          required
          class="p-2.5 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-20"
        >
          <option value="" disabled>Select a shelf</option>
          <option 
            v-for="shelf in shelves" 
            :key="shelf.id" 
            :value="shelf.id"
          >
            {{ shelf.name }} (ID: {{ shelf.id }})
          </option>
        </select>
      </div>
      <div class="flex gap-2.5 items-center">
        <button type="submit" :disabled="loading" class="bg-orange-500 text-white border-none py-3 px-5 rounded cursor-pointer text-sm transition-colors duration-300 hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed">
          {{ loading ? 'Updating...' : 'Update Floor' }}
        </button>
        <router-link to="/manage" class="bg-gray-500 text-white no-underline py-3 px-5 rounded text-sm transition-colors duration-300 hover:bg-gray-600">Cancel</router-link>
      </div>
    </form>
    <div v-if="message" :class="messageClass">{{ message }}</div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchFromApi } from '@/utils/api'

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['floor-updated'])
const router = useRouter()

const floorData = reactive({
  name: '',
  shelfId: ''
})

const shelves = ref([])
const loading = ref(false)
const loadingItem = ref(true)
const loadError = ref('')
const message = ref('')
const isSuccess = ref(false)

const messageClass = computed(() => ({
  'mt-4 p-2.5 rounded text-sm': true,
  'bg-green-100 text-green-800 border border-green-300': isSuccess.value,
  'bg-red-100 text-red-800 border border-red-300': !isSuccess.value
}))

async function fetchShelves() {
  try {
    shelves.value = await fetchFromApi('shelves')
  } catch (error) {
    console.error('Error fetching shelves:', error)
  }
}

async function fetchFloor() {
  loadingItem.value = true
  loadError.value = ''
  try {
    const floor = await fetchFromApi(`floors/${props.id}`)
    floorData.name = floor.name
    floorData.shelfId = floor.shelfId
  } catch (error) {
    loadError.value = `Error loading floor: ${error.message}`
  } finally {
    loadingItem.value = false
  }
}

async function updateFloor() {
  if (!floorData.name.trim() || !floorData.shelfId) return
  loading.value = true
  message.value = ''
  try {
    await fetchFromApi(`floors/${props.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: floorData.name,
        shelfId: Number(floorData.shelfId)
      })
    })
    message.value = 'Floor updated successfully!'
    isSuccess.value = true
    emit('floor-updated')
    setTimeout(() => {
      router.push('/manage')
    }, 2000)
  } catch (error) {
    message.value = `Error updating floor: ${error.message}`
    isSuccess.value = false
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchShelves()
  fetchFloor()
})
</script>

