<template>
  <AppLayout>
    <div class="p-5 max-w-7xl mx-auto">
      <h1 class="text-center text-slate-700 mb-8 text-2xl font-bold">Select Elements</h1>
    
    <!-- Active Items Pop-up -->
    <div v-if="showActiveItemsPopup" class="fixed inset-0 flex justify-center items-center z-50" style="background-color: rgba(0, 0, 0, 0.3);" @click="closeActiveItemsPopup">
      <div class="bg-white rounded p-5 max-w-md w-11/12 max-h-[90vh] overflow-y-auto" @click.stop>
        <h3 class="mb-5 text-lg text-gray-800">Active Items</h3>
        <div v-if="activeItems.length === 0" class="text-center text-gray-600 p-4">
          No active items found.
        </div>
        <div v-else class="space-y-3">
          <div v-for="item in activeItems" :key="item.id" class="flex items-center justify-between p-3 bg-gray-100 rounded border">
            <div class="flex items-center gap-3">
              <div class="w-5 h-5 rounded-full border border-gray-300" :style="{ backgroundColor: item.color }"></div>
              <span class="font-medium">{{ item.name }}</span>
            </div>
            <button @click="navigateToItem(item)" class="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors">
              Go to item
            </button>
          </div>
        </div>
        <div class="flex justify-end mt-5">
          <button @click="closeActiveItemsPopup" class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>

      <SelectionNavigator />
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import SelectionNavigator from '../components/SelectionNavigator.vue'
import { API_URL, fetchFromApi } from '@/utils/api'

const router = useRouter()

// Active items popup state
const showActiveItemsPopup = ref(false)
const activeItems = ref([])

// Fetch active items (color !== #000000)
async function fetchActiveItems() {
  try {
    const allItems = await fetchFromApi('items')
    activeItems.value = allItems.filter(item => item.color !== '#000000')
  } catch (error) {
    console.error('Error fetching active items:', error)
  }
}

// Navigate to a specific item
function navigateToItem(item) {
  // This function will be implemented to navigate to the specific item
  // For now, we'll close the popup
  closeActiveItemsPopup()
  
  // Find the shelf and floor for this item
  // This would require additional API calls or state management
  // For now, we'll just log the item
  console.log('Navigate to item:', item)
}

// Close active items popup
function closeActiveItemsPopup() {
  showActiveItemsPopup.value = false
}

// Show active items popup if there are active items
async function checkAndShowActiveItems() {
  await fetchActiveItems()
  if (activeItems.value.length > 0) {
    showActiveItemsPopup.value = true
  }
}

onMounted(() => {
  checkAndShowActiveItems()
})
</script>
