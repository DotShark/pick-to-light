<template>
  <div class="bg-white p-5 rounded-lg shadow-lg">
    <h2 class="text-slate-700 mb-5 text-xl font-semibold">Update Shelve</h2>
    <div v-if="loadingItem" class="text-center p-5 text-gray-500">Loading shelve data...</div>
    <div v-else-if="loadError" class="bg-red-100 text-red-800 border border-red-300 p-2.5 rounded mb-5">{{ loadError }}</div>
    <form v-else @submit.prevent="updateShelve" class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <label for="shelve-name" class="font-medium text-gray-600">Name:</label>
        <input
          id="shelve-name"
          v-model="shelveData.name"
          type="text"
          required
          placeholder="Enter shelve name"
          class="p-2.5 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
        />
      </div>
      <div class="flex gap-2.5 items-center">
        <button type="submit" :disabled="loading" class="bg-orange-500 text-white border-none py-3 px-5 rounded cursor-pointer text-sm transition-colors duration-300 hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed">
          {{ loading ? 'Updating...' : 'Update Shelve' }}
        </button>
        <router-link to="/create" class="bg-gray-500 text-white no-underline py-3 px-5 rounded text-sm transition-colors duration-300 hover:bg-gray-600">Cancel</router-link>
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

const emit = defineEmits(['shelve-updated'])
const router = useRouter()

const shelveData = reactive({
  name: ''
})

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

const fetchShelve = async () => {
  loadingItem.value = true
  loadError.value = ''
  
  try {
    const response = await fetch(`http://localhost:4000/shelves/${props.id}`)
    if (response.ok) {
      const shelve = await response.json()
      shelveData.name = shelve.name
    } else {
      throw new Error(`Failed to fetch shelve: ${response.status}`)
    }
  } catch (error) {
    loadError.value = `Error loading shelve: ${error.message}`
  } finally {
    loadingItem.value = false
  }
}

const updateShelve = async () => {
  if (!shelveData.name.trim()) return

  loading.value = true
  message.value = ''

  try {
    const response = await fetch(`http://localhost:4000/shelves/${props.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: shelveData.name
      })
    })

    if (response.ok) {
      message.value = 'Shelve updated successfully!'
      isSuccess.value = true
      
      // Emit event to notify parent component
      emit('shelve-updated')
      
      // Redirect to create page after 2 seconds
      setTimeout(() => {
        router.push('/create')
      }, 2000)
    } else {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
  } catch (error) {
    message.value = `Error updating shelve: ${error.message}`
    isSuccess.value = false
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchShelve()
})
</script>

