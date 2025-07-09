<template>
  <div class="bg-white p-5 rounded-lg shadow-lg">
    <h2 class="text-slate-700 mb-5 text-xl font-semibold">Update Item</h2>
    <div v-if="loadingItem" class="text-center p-5 text-gray-500">Loading item data...</div>
    <div v-else-if="loadError" class="bg-red-100 text-red-800 border border-red-300 p-2.5 rounded mb-5">{{ loadError }}</div>
    <form v-else @submit.prevent="updateItem" class="flex flex-col gap-4">
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
          v-model="itemData.floorId"
          required
          class="p-2.5 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-opacity-20"
        >
          <option value="" disabled>Select a floor</option>
          <option 
            v-for="floor in floors" 
            :key="floor.id" 
            :value="floor.id"
          >
            {{ floor.name }} (ID: {{ floor.id }})
          </option>
        </select>
      </div>
      <div class="flex gap-2.5 items-center">
        <button type="submit" :disabled="loading" class="bg-orange-500 text-white border-none py-3 px-5 rounded cursor-pointer text-sm transition-colors duration-300 hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed">
          {{ loading ? 'Updating...' : 'Update Item' }}
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

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['item-updated'])
const router = useRouter()

const itemData = reactive({
  name: '',
  color: '#FF5733',
  floorId: ''
})

const floors = ref([])
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

const fetchFloors = async () => {
  try {
    const response = await fetch('http://localhost:4000/floors')
    if (response.ok) {
      floors.value = await response.json()
    }
  } catch (error) {
    console.error('Error fetching floors:', error)
  }
}

const fetchItem = async () => {
  loadingItem.value = true
  loadError.value = ''
  
  try {
    const response = await fetch(`http://localhost:4000/items/${props.id}`)
    if (response.ok) {
      const item = await response.json()
      itemData.name = item.name
      itemData.color = item.color
      itemData.floorId = item.floorId
    } else {
      throw new Error(`Failed to fetch item: ${response.status}`)
    }
  } catch (error) {
    loadError.value = `Error loading item: ${error.message}`
  } finally {
    loadingItem.value = false
  }
}

const updateItem = async () => {
  if (!itemData.name.trim() || !itemData.color.trim() || !itemData.floorId) return

  loading.value = true
  message.value = ''

  try {
    const response = await fetch(`http://localhost:4000/items/${props.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: itemData.name,
        color: itemData.color,
        floorId: Number(itemData.floorId)
      })
    })

    if (response.ok) {
      message.value = 'Item updated successfully!'
      isSuccess.value = true
      
      emit('item-updated')
      
      setTimeout(() => {
        router.push('/manage')
      }, 2000)
    } else {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
  } catch (error) {
    message.value = `Error updating item: ${error.message}`
    isSuccess.value = false
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchFloors()
  fetchItem()
})
</script>

