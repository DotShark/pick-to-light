<template>
  <div class="bg-white p-5 rounded-lg shadow-lg">
    <h2 class="text-slate-700 mb-5 text-xl font-semibold">Existing Shelves</h2>
    <div v-if="loading" class="text-center p-5 text-gray-500">Loading shelves...</div>
    <div v-else-if="error" class="bg-red-100 text-red-800 border border-red-300 p-2.5 rounded">{{ error }}</div>
    <div v-else-if="shelves.length === 0" class="text-center p-10 text-gray-500 italic">
      No shelves found. Create your first shelve!
    </div>
    <div v-else class="grid gap-4">
      <div 
        v-for="shelve in shelves" 
        :key="shelve.id"
        class="flex justify-between items-center p-4 border border-gray-200 rounded-md transition-colors duration-200 hover:border-blue-500"
      >
        <div>
          <h3 class="m-0 mb-1 text-slate-700 text-base">{{ shelve.name }}</h3>
          <p class="m-0 text-xs text-gray-500">
            ID: {{ shelve.id }} | 
            Created: {{ formatDate(shelve.createdAt) }}
          </p>
        </div>
        <div class="flex gap-2">
          <router-link 
            :to="`/create/shelve/${shelve.id}`"
            class="bg-orange-500 text-white no-underline py-1 px-3 rounded text-xs transition-colors duration-300 hover:bg-orange-600"
          >
            Edit
          </router-link>
          <button 
            @click="deleteConfirm(shelve)"
            class="bg-red-600 text-white border-none py-1 px-3 rounded text-xs cursor-pointer transition-colors duration-300 hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black/30 flex justify-center items-center z-50" @click="cancelDelete">
      <div class="bg-white p-5 rounded-lg max-w-sm w-11/12" @click.stop>
        <h3 class="mt-0 text-slate-700">Confirm Delete</h3>
        <p>Are you sure you want to delete "{{ shelveToDelete?.name }}"?</p>
        <div class="flex gap-2 justify-end mt-5">
          <button @click="confirmDelete" class="bg-red-600 text-white border-none py-2 px-4 rounded cursor-pointer hover:bg-red-700">Yes, Delete</button>
          <button @click="cancelDelete" class="bg-gray-500 text-white border-none py-2 px-4 rounded cursor-pointer hover:bg-gray-600">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { fetchFromApi } from '@/utils/api'

const props = defineProps({
  shelves: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['refresh'])

const showDeleteConfirm = ref(false)
const shelveToDelete = ref(null)

const deleteConfirm = (shelve) => {
  shelveToDelete.value = shelve
  showDeleteConfirm.value = true
}

const cancelDelete = () => {
  showDeleteConfirm.value = false
  shelveToDelete.value = null
}

async function confirmDelete() {
  if (!shelveToDelete.value) return
  try {
    await fetchFromApi(`shelves/${shelveToDelete.value.id}`, {
      method: 'DELETE',
    })
    emit('refresh')
    showDeleteConfirm.value = false
    shelveToDelete.value = null
  } catch (error) {
    console.error('Error deleting shelve:', error)
    alert(`Error deleting shelve: ${error.message}`)
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}
</script>

