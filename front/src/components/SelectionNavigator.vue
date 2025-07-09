<template>
  <div class="bg-white rounded overflow-hidden shadow-lg">
    <!-- Navigation breadcrumb -->
    <div class="flex items-center p-4 bg-gray-100 border-b border-gray-200">
      <button
        class="border-none text-gray-600 cursor-pointer text-sm px-2 py-1 rounded transition-all duration-300 hover:bg-gray-200 hover:text-gray-700"
        :class="{ 'bg-blue-500 text-white': currentStep === 'shelves' }"
        @click="goToShelves"
      >
        Shelves
      </button>
      <span v-if="selectedShelve" class="mx-2 text-gray-600">></span>
      <button
        v-if="selectedShelve"
        class="border-none text-gray-600 cursor-pointer text-sm px-2 py-1 rounded transition-all duration-300 hover:bg-gray-200 hover:text-gray-700"
        :class="{ 'bg-blue-500 text-white': currentStep === 'floors' }"
        @click="goToFloors"
      >
        {{ selectedShelve.name }}
      </button>
      <span v-if="selectedFloor" class="mx-2 text-gray-600">></span>
      <button
        v-if="selectedFloor"
        class="border-none text-gray-600 cursor-pointer text-sm px-2 py-1 rounded transition-all duration-300 hover:bg-gray-200 hover:text-gray-700"
        :class="{ 'bg-blue-500 text-white': currentStep === 'items' }"
        @click="goToItems"
      >
        {{ selectedFloor.name }}
      </button>
    </div>

    <!-- Shelves Selection -->
    <div v-if="currentStep === 'shelves'" class="m-5 border border-gray-200 rounded bg-white">
      <div class="p-5 bg-gray-100 border-b border-gray-200">
        <h3 class="m-0 text-slate-700">Select a Shelf</h3>
      </div>
      <div class="p-5">
        <div v-if="shelves.length === 0" class="text-center text-gray-600 p-10 italic">
          No shelves found.
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="shelf in shelves" :key="shelf.id"
               class="border border-gray-200 rounded p-4 hover:shadow-md transition-shadow cursor-pointer"
               @click="selectShelf(shelf)">
            <h4 class="font-medium text-gray-800">{{ shelf.name }}</h4>
            <p class="text-sm text-gray-600">ID: {{ shelf.id }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Floors Selection -->
    <div v-if="currentStep === 'floors'" class="m-5 border border-gray-200 rounded bg-white">
      <div class="p-5 bg-gray-100 border-b border-gray-200">
        <h3 class="m-0 text-slate-700">Select a Floor in {{ selectedShelve.name }}</h3>
      </div>
      <div class="p-5">
        <div v-if="loadingFloors" class="text-center p-10 text-gray-600">
          Loading floors...
        </div>
        <div v-else-if="floors.length === 0" class="text-center text-gray-600 p-10 italic">
          No floors found in this shelf.
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="floor in floors" :key="floor.id"
               class="border border-gray-200 rounded p-4 hover:shadow-md transition-shadow cursor-pointer"
               @click="selectFloor(floor)">
            <h4 class="font-medium text-gray-800">{{ floor.name }}</h4>
            <p class="text-sm text-gray-600">ID: {{ floor.id }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Items Selection -->
    <div v-if="currentStep === 'items'" class="m-5 border border-gray-200 rounded bg-white">
      <div class="p-5 bg-gray-100 border-b border-gray-200">
        <h3 class="m-0 text-slate-700">Select Items in {{ selectedFloor.name }}</h3>
      </div>
      <div class="p-5">
        <div v-if="loadingItems" class="text-center p-10 text-gray-600">
          Loading items...
        </div>
        <div v-else-if="items.length === 0" class="text-center text-gray-600 p-10 italic">
          No items found in this floor.
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="item in items" :key="item.id"
               class="border border-gray-200 rounded p-4 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-3">
                <div class="w-5 h-5 rounded-full border border-gray-300" :style="{ backgroundColor: item.color }"></div>
                <div>
                  <h4 class="font-medium text-gray-800">{{ item.name }}</h4>
                  <p class="text-sm text-gray-600">Slot: {{ item.slot }}</p>
                </div>
              </div>
            </div>
            <div class="mt-3">
              <button
                v-if="item.color === '#000000'"
                @click="activateItem(item)"
                class="cursor-pointer w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                :disabled="updatingItem === item.id"
              >
                {{ updatingItem === item.id ? 'Finding...' : 'Find' }}
              </button>
              <button
                v-else
                @click="deactivateItem(item)"
                class="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                :disabled="updatingItem === item.id"
              >
                {{ updatingItem === item.id ? 'Stopping...' : 'Stop' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

// State management
const currentStep = ref('shelves')
const selectedShelve = ref(null)
const selectedFloor = ref(null)

// Data
const shelves = ref([])
const floors = ref([])
const items = ref([])

// Loading states
const loadingFloors = ref(false)
const loadingItems = ref(false)
const updatingItem = ref(null)

// Fetch functions
const fetchShelves = async () => {
  try {
    const response = await fetch('http://localhost:4000/shelves')
    if (response.ok) {
      shelves.value = await response.json()
    }
  } catch (error) {
    console.error('Error fetching shelves:', error)
  }
}

const fetchFloors = async (shelfId) => {
  loadingFloors.value = true
  try {
    const response = await fetch('http://localhost:4000/floors')
    if (response.ok) {
      const allFloors = await response.json()
      console.log('Debug - All floors:', allFloors)
      console.log('Debug - Shelf ID to filter:', shelfId)

      // Try both possible field names
      const filteredFloors = allFloors.filter(floor =>
        floor.shelfId == parseInt(shelfId) ||
        floor.shelf_id == parseInt(shelfId)
      )

      console.log('Debug - Filtered floors:', filteredFloors)
      floors.value = filteredFloors
    }
  } catch (error) {
    console.error('Error fetching floors:', error)
  } finally {
    loadingFloors.value = false
  }
}

const fetchItems = async (floorId) => {
  loadingItems.value = true
  try {
    const response = await fetch('http://localhost:4000/items')
    if (response.ok) {
      const allItems = await response.json()
      console.log('Debug - All items:', allItems)
      console.log('Debug - Floor ID to filter:', floorId)

      // Try both possible field names
      const filteredItems = allItems.filter(item =>
        item.floorId == parseInt(floorId) ||
        item.floor_id == parseInt(floorId)
      )

      console.log('Debug - Filtered items:', filteredItems)
      items.value = filteredItems
    }
  } catch (error) {
    console.error('Error fetching items:', error)
  } finally {
    loadingItems.value = false
  }
}

// Navigation functions
const selectShelf = (shelf) => {
  selectedShelve.value = shelf
  currentStep.value = 'floors'
  fetchFloors(shelf.id)
}

const selectFloor = (floor) => {
  selectedFloor.value = floor
  currentStep.value = 'items'
  fetchItems(floor.id)
}

const goToShelves = () => {
  currentStep.value = 'shelves'
  selectedShelve.value = null
  selectedFloor.value = null
  floors.value = []
  items.value = []
}

const goToFloors = () => {
  currentStep.value = 'floors'
  selectedFloor.value = null
  items.value = []
}

const goToItems = () => {
  currentStep.value = 'items'
}

// Item activation functions
const activateItem = async (item) => {
  updatingItem.value = item.id
  try {
    const response = await fetch(`http://localhost:4000/items/${item.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ color: '#008000' })
    })

    if (response.ok) {
      // Update local state
      const itemIndex = items.value.findIndex(i => i.id === item.id)
      if (itemIndex !== -1) {
        items.value[itemIndex].color = '#008000'
      }
    } else {
      console.error('Error activating item:', response.statusText)
    }
  } catch (error) {
    console.error('Error activating item:', error)
  } finally {
    updatingItem.value = null
  }
}

const deactivateItem = async (item) => {
  updatingItem.value = item.id
  try {
    const response = await fetch(`http://localhost:4000/items/${item.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ color: '#000000' })
    })

    if (response.ok) {
      // Update local state
      const itemIndex = items.value.findIndex(i => i.id === item.id)
      if (itemIndex !== -1) {
        items.value[itemIndex].color = '#000000'
      }
    } else {
      console.error('Error deactivating item:', response.statusText)
    }
  } catch (error) {
    console.error('Error deactivating item:', error)
  } finally {
    updatingItem.value = null
  }
}

// Initialize
onMounted(() => {
  fetchShelves()
})

// Expose functions for parent component
defineExpose({
  navigateToItem: (item) => {
    // This function will be called from the parent to navigate to a specific item
    // We need to find the shelf and floor for this item and navigate there
    // For now, we'll implement a basic version
    console.log('Navigate to item:', item)
  }
})
</script>
