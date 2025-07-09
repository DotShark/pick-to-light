<template>
  <div class="bg-white p-5 rounded-lg shadow-lg">
    <h2 class="text-slate-700 mb-5 text-xl font-semibold">Create Floor</h2>
    <form @submit.prevent="createFloor" class="flex flex-col gap-4">
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
          v-model="floorData.shelf_id"
          required
          class="p-2.5 border border-gray-300 rounded bg-white text-sm cursor-pointer focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-20"
        >
          <option value="" disabled>Select a shelf</option>
          <option 
            v-for="shelf in props.shelves" 
            :key="shelf.id" 
            :value="shelf.id"
          >
            {{ shelf.name }} (ID: {{ shelf.id }})
          </option>
        </select>
        <div v-if="props.shelvesLoading" class="text-xs text-gray-500 italic">Loading shelves...</div>
        <div v-if="props.shelvesError" class="text-xs text-red-600">{{ props.shelvesError }}</div>
      </div>
      <button type="submit" :disabled="loading || props.shelvesLoading" class="bg-green-600 text-white border-none py-3 px-5 rounded cursor-pointer text-sm transition-colors duration-300 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
        {{ loading ? 'Creating...' : 'Create Floor' }}
      </button>
    </form>
    <div v-if="message" :class="messageClass">{{ message }}</div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const emit = defineEmits(['floor-created'])

// Receive shelves data from parent
const props = defineProps({
  shelves: {
    type: Array,
    default: () => []
  },
  shelvesLoading: {
    type: Boolean,
    default: false
  },
  shelvesError: {
    type: String,
    default: ''
  }
})

const floorData = reactive({
  name: '',
  shelf_id: ''
})

const loading = ref(false)
const message = ref('')
const isSuccess = ref(false)

const messageClass = computed(() => ({
  'mt-4 p-2.5 rounded text-sm': true,
  'bg-green-100 text-green-800 border border-green-300': isSuccess.value,
  'bg-red-100 text-red-800 border border-red-300': !isSuccess.value
}))

const createFloor = async () => {
  if (!floorData.name.trim() || !floorData.shelf_id) return

  loading.value = true
  message.value = ''

  // Ensure shelfId is a number
  const payload = {
    name: floorData.name,
    shelfId: Number(floorData.shelf_id)
  }

  console.log('Sending payload:', payload)

  try {
    const response = await fetch('http://localhost:4000/floors/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })

    if (response.ok) {
      message.value = 'Floor created successfully!'
      isSuccess.value = true
      floorData.name = '' // Reset form
      floorData.shelf_id = ''
      
      // Emit event to notify parent component
      emit('floor-created')
    } else {
      const errorData = await response.text()
      console.error('Server response:', errorData)
      throw new Error(`HTTP error! status: ${response.status} - ${errorData}`)
    }
  } catch (error) {
    message.value = `Error creating floor: ${error.message}`
    isSuccess.value = false
  } finally {
    loading.value = false
  }
}
</script>

