<template>
  <div class="bg-white p-5 rounded-lg shadow-lg">
    <h2 class="text-slate-700 mb-5 text-xl font-semibold">Create Shelve</h2>
    <form @submit.prevent="createShelve" class="flex flex-col gap-4">
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
      <button type="submit" :disabled="loading" class="bg-blue-500 text-white border-none py-3 px-5 rounded cursor-pointer text-sm transition-colors duration-300 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed">
        {{ loading ? 'Creating...' : 'Create Shelve' }}
      </button>
    </form>
    <div v-if="message" :class="messageClass">{{ message }}</div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { fetchFromApi } from '@/utils/api'

const emit = defineEmits(['shelve-created'])

const shelveData = reactive({
  name: ''
})

const loading = ref(false)
const message = ref('')
const isSuccess = ref(false)

const messageClass = computed(() => ({
  'mt-4 p-2.5 rounded text-sm': true,
  'bg-green-100 text-green-800 border border-green-300': isSuccess.value,
  'bg-red-100 text-red-800 border border-red-300': !isSuccess.value
}))

async function createShelve() {
  if (!shelveData.name.trim()) return

  loading.value = true
  message.value = ''

  try {
    await fetchFromApi('shelves', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: shelveData.name })
    })

    message.value = 'Shelve created successfully!'
    isSuccess.value = true
    shelveData.name = '' // Reset form

    // Emit event to notify parent component
    emit('shelve-created')
  } catch (error) {
    message.value = `Error creating shelve: ${error.message}`
    isSuccess.value = false
  } finally {
    loading.value = false
  }
}
</script>

