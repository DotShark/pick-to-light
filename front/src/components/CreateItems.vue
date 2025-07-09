<template>
  <div class="bg-white p-5 rounded-lg shadow-lg">
    <h2 class="text-slate-700 mb-5 text-xl font-semibold">Create Item</h2>
    <form @submit.prevent="createItem" class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <label for="item-name" class="font-medium text-gray-600">Name:</label>
        <input
          id="item-name"
          v-model="itemData.name"
          type="text"
          required
          placeholder="Enter item name"
          class="p-2.5 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-opacity-20"
        />
      </div>
      <div class="flex flex-col gap-1">
        <label for="item-color" class="font-medium text-gray-600">Color:</label>
        <div class="flex items-center gap-3">
          <input
            id="item-color"
            v-model="itemData.color"
            type="color"
            class="w-12 h-10 border-2 border-gray-300 rounded-lg cursor-pointer bg-none p-0 transition-colors duration-200 hover:border-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-opacity-20"
            required
          />
          <span class="font-mono text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded tracking-wide">{{ itemData.color }}</span>
        </div>
      </div>
      <div class="flex flex-col gap-1">
        <label for="floor-select" class="font-medium text-gray-600">Floor:</label>
        <select
          id="floor-select"
          v-model="itemData.floor_id"
          required
          class="p-2.5 border border-gray-300 rounded bg-white text-sm cursor-pointer focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-opacity-20"
        >
          <option value="" disabled>Select a floor</option>
          <option 
            v-for="floor in props.floors" 
            :key="floor.id" 
            :value="floor.id"
          >
            {{ floor.name }} (ID: {{ floor.id }})
          </option>
        </select>
        <div v-if="props.floorsLoading" class="text-xs text-gray-500 italic">Loading floors...</div>
        <div v-if="props.floorsError" class="text-xs text-red-600">{{ props.floorsError }}</div>
      </div>
      <button type="submit" :disabled="loading || props.floorsLoading" class="bg-red-600 text-white border-none py-3 px-5 rounded cursor-pointer text-sm transition-colors duration-300 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
        {{ loading ? 'Creating...' : 'Create Item' }}
      </button>
    </form>
    <div v-if="message" :class="messageClass">{{ message }}</div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { fetchFromApi } from '@/utils/api'

const emit = defineEmits(['item-created'])

// Receive floors data from parent
const props = defineProps({
  floors: {
    type: Array,
    default: () => []
  },
  floorsLoading: {
    type: Boolean,
    default: false
  },
  floorsError: {
    type: String,
    default: ''
  }
})

const itemData = reactive({
  name: '',
  color: '#FF5733', // Default color
  floor_id: ''
})

const loading = ref(false)
const message = ref('')
const isSuccess = ref(false)

const messageClass = computed(() => ({
  'mt-4 p-2.5 rounded text-sm': true,
  'bg-green-100 text-green-800 border border-green-300': isSuccess.value,
  'bg-red-100 text-red-800 border border-red-300': !isSuccess.value
}))

async function createItem() {
  if (!itemData.name.trim() || !itemData.color.trim() || !itemData.floor_id) return

  loading.value = true
  message.value = ''

  const payload = {
    name: itemData.name,
    color: itemData.color,
    floorId: Number(itemData.floor_id)
  }

  try {
    await fetchFromApi('items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })

    message.value = 'Item created successfully!'
    isSuccess.value = true
    itemData.name = '' // Reset form
    itemData.color = '#FF5733' // Reset to default color
    itemData.floor_id = ''
    
    // Emit event to notify parent component
    emit('item-created')
  } catch (error) {
    message.value = `Error creating item: ${error.message}`
    isSuccess.value = false
  } finally {
    loading.value = false
  }
}
</script>

