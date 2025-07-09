<template>
  <div class="bg-white rounded-lg overflow-hidden shadow-lg">
    <!-- Breadcrumb Navigation -->
    <div class="flex items-center px-5 py-4 bg-gray-100 border-b border-gray-200">
      <button 
        @click="resetToShelves" 
        :class="{ 'bg-blue-500 text-white': currentLevel === 'shelves' }"
        class="bg-transparent border-none text-gray-500 cursor-pointer text-sm px-2 py-1 rounded transition-all duration-300 hover:bg-gray-200 hover:text-gray-700"
      >
        Shelves
      </button>
      <span v-if="selectedShelve" class="mx-2 text-gray-500">›</span>
      <button 
        v-if="selectedShelve"
        @click="goToFloors" 
        :class="{ 'bg-blue-500 text-white': currentLevel === 'floors' }"
        class="bg-transparent border-none text-gray-500 cursor-pointer text-sm px-2 py-1 rounded transition-all duration-300 hover:bg-gray-200 hover:text-gray-700"
      >
        {{ selectedShelve.name }} - Floors
      </button>
      <span v-if="selectedFloor" class="mx-2 text-gray-500">›</span>
      <button 
        v-if="selectedFloor"
        @click="goToItems" 
        :class="{ 'bg-blue-500 text-white': currentLevel === 'items' }"
        class="bg-transparent border-none text-gray-500 cursor-pointer text-sm px-2 py-1 rounded transition-all duration-300 hover:bg-gray-200 hover:text-gray-700"
      >
        {{ selectedFloor.name }} - Items
      </button>
    </div>

    <!-- Shelves Level -->
    <div class="p-5">
      <h3 class="m-0 mb-5 text-gray-700">{{ selectedShelve ? `Selected Shelve: ${selectedShelve.name}` : 'Select a Shelve' }}</h3>
      <div class="relative">
        <div class="relative overflow-hidden w-full h-50">
          <div class="flex flex-row transition-transform duration-300 ease-in-out gap-5" :style="{ transform: `translateX(-${shelveSliderOffset}px)` }">
            <div 
              v-for="shelve in shelves" 
              :key="shelve.id"
              class="min-h-32 min-w-64 bg-gray-50 rounded-lg p-5 cursor-pointer transition-all duration-300 border-2 border-transparent flex-shrink-0 border-l-4 border-l-blue-500 hover:transform hover:-translate-y-1 hover:shadow-lg"
              :class="{ 'border-2 border-blue-500 bg-blue-50': selectedShelve && selectedShelve.id === shelve.id }"
              @click="selectShelve(shelve)"
            >
              <div>
                <h4 class="m-0 mb-2 text-gray-700">{{ shelve.name }}</h4>
                <p class="text-xs text-gray-500 my-1">ID: {{ shelve.id }}</p>
                <p class="text-xs text-gray-500 my-1">Created: {{ formatDate(shelve.createdAt) }}</p>
                <div class="flex gap-2 mt-4">
                  <button @click.stop="editShelve(shelve)" class="bg-orange-500 text-white border-none px-2 py-1 rounded text-xs cursor-pointer transition-colors duration-300 hover:bg-orange-600">Edit</button>
                  <button @click.stop="deleteShelve(shelve)" class="bg-red-500 text-white border-none px-2 py-1 rounded text-xs cursor-pointer transition-colors duration-300 hover:bg-red-600">Delete</button>
                </div>
              </div>
            </div>
          </div>
          <button @click="prevShelve" class="absolute bg-black bg-opacity-50 text-white border-none w-10 h-10 rounded-full cursor-pointer text-lg transition-colors duration-300 z-10 top-1/2 left-[-20px] transform -translate-y-1/2 hover:bg-opacity-70 disabled:bg-opacity-20 disabled:cursor-not-allowed" :disabled="shelveSliderOffset === 0">‹</button>
          <button @click="nextShelve" class="absolute bg-black bg-opacity-50 text-white border-none w-10 h-10 rounded-full cursor-pointer text-lg transition-colors duration-300 z-10 top-1/2 right-[-20px] transform -translate-y-1/2 hover:bg-opacity-70 disabled:bg-opacity-20 disabled:cursor-not-allowed" :disabled="!canScrollShelvesNext">›</button>
        </div>
      </div>
    </div>

    <!-- Floors Level -->
    <div v-if="selectedShelve" class="p-5">
      <h3 class="m-0 mb-5 text-gray-700">{{ selectedFloor ? `Selected Floor: ${selectedFloor.name}` : `Floors in ${selectedShelve.name}` }}</h3>
      <div v-if="loadingFloors" class="text-center py-10 text-gray-600">Loading floors...</div>
      <div v-else-if="floors.length === 0" class="text-center py-10 text-gray-600 italic">
        No floors found in this shelve.
      </div>
      <div v-else class="relative">
        <div class="relative overflow-hidden w-full h-50">
          <div class="flex flex-row transition-transform duration-300 ease-in-out gap-5" :style="{ transform: `translateX(-${floorSliderOffset}px)` }">
            <div 
              v-for="floor in floors" 
              :key="floor.id"
              class="min-h-32 min-w-64 bg-gray-50 rounded-lg p-5 cursor-pointer transition-all duration-300 border-2 border-transparent flex-shrink-0 border-l-4 border-l-green-500 hover:transform hover:-translate-y-1 hover:shadow-lg"
              :class="{ 'border-2 border-blue-500 bg-blue-50': selectedFloor && selectedFloor.id === floor.id }"
              @click="selectFloor(floor)"
            >
              <div>
                <h4 class="m-0 mb-2 text-gray-700">{{ floor.name }}</h4>
                <p class="text-xs text-gray-500 my-1">ID: {{ floor.id }}</p>
                <p class="text-xs text-gray-500 my-1">Shelve: {{ selectedShelve.name }}</p>
                <div class="flex gap-2 mt-4">
                  <button @click.stop="editFloor(floor)" class="bg-orange-500 text-white border-none px-2 py-1 rounded text-xs cursor-pointer transition-colors duration-300 hover:bg-orange-600">Edit</button>
                  <button @click.stop="deleteFloor(floor)" class="bg-red-500 text-white border-none px-2 py-1 rounded text-xs cursor-pointer transition-colors duration-300 hover:bg-red-600">Delete</button>
                </div>
              </div>
            </div>
          </div>
          <button @click="prevFloor" class="absolute bg-black bg-opacity-50 text-white border-none w-10 h-10 rounded-full cursor-pointer text-lg transition-colors duration-300 z-10 top-1/2 left-[-20px] transform -translate-y-1/2 hover:bg-opacity-70 disabled:bg-opacity-20 disabled:cursor-not-allowed" :disabled="floorSliderOffset === 0">‹</button>
          <button @click="nextFloor" class="absolute bg-black bg-opacity-50 text-white border-none w-10 h-10 rounded-full cursor-pointer text-lg transition-colors duration-300 z-10 top-1/2 right-[-20px] transform -translate-y-1/2 hover:bg-opacity-70 disabled:bg-opacity-20 disabled:cursor-not-allowed" :disabled="!canScrollFloorsNext">›</button>
        </div>
      </div>
    </div>

    <!-- Items Level -->
    <div v-if="selectedFloor" class="p-5">
      <h3 class="m-0 mb-5 text-gray-700">Items in {{ selectedFloor.name }}</h3>
      <div v-if="loadingItems" class="text-center py-10 text-gray-600">Loading items...</div>
      <div v-else-if="items.length === 0" class="text-center py-10 text-gray-600 italic">
        No items found in this floor.
      </div>
      <div v-else class="relative">
        <div class="relative overflow-hidden w-full h-50">
          <div class="flex flex-row transition-transform duration-300 ease-in-out gap-5" :style="{ transform: `translateX(-${itemSliderOffset}px)` }">
            <div 
              v-for="item in items" 
              :key="item.id"
              class="min-h-32 min-w-64 bg-gray-50 rounded-lg p-5 cursor-pointer transition-all duration-300 border-2 border-transparent flex-shrink-0 border-l-4 border-l-red-500"
            >
              <div>
                <h4 class="m-0 mb-2 text-gray-700">{{ item.name }}</h4>
                <div class="w-5 h-5 rounded-full my-2 border-2 border-gray-300" :style="{ backgroundColor: item.color }"></div>
                <p class="text-xs text-gray-500 my-1">ID: {{ item.id }}</p>
                <p class="text-xs text-gray-500 my-1">Floor: {{ selectedFloor.name }}</p>
                <div class="flex gap-2 mt-4">
                  <button @click.stop="editItem(item)" class="bg-orange-500 text-white border-none px-2 py-1 rounded text-xs cursor-pointer transition-colors duration-300 hover:bg-orange-600">Edit</button>
                  <button @click.stop="deleteItem(item)" class="bg-red-500 text-white border-none px-2 py-1 rounded text-xs cursor-pointer transition-colors duration-300 hover:bg-red-600">Delete</button>
                </div>
              </div>
            </div>
          </div>
          <button @click="prevItem" class="absolute bg-black bg-opacity-50 text-white border-none w-10 h-10 rounded-full cursor-pointer text-lg transition-colors duration-300 z-10 top-1/2 left-[-20px] transform -translate-y-1/2 hover:bg-opacity-70 disabled:bg-opacity-20 disabled:cursor-not-allowed" :disabled="itemSliderOffset === 0">‹</button>
          <button @click="nextItem" class="absolute bg-black bg-opacity-50 text-white border-none w-10 h-10 rounded-full cursor-pointer text-lg transition-colors duration-300 z-10 top-1/2 right-[-20px] transform -translate-y-1/2 hover:bg-opacity-70 disabled:bg-opacity-20 disabled:cursor-not-allowed" :disabled="!canScrollItemsNext">›</button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" @click="cancelDelete">
      <div class="bg-white p-5 rounded-lg max-w-md w-11/12" @click.stop>
        <h3 class="mt-0 text-gray-700">Confirm Delete</h3>
        <p>Are you sure you want to delete "{{ itemToDelete?.name }}"?</p>
        <p v-if="deleteType === 'shelve'" class="bg-yellow-100 text-yellow-800 p-2 rounded my-2 border border-yellow-300 text-sm">
          <strong>Warning:</strong> This will also delete all floors and items within this shelve.
        </p>
        <p v-if="deleteType === 'floor'" class="bg-yellow-100 text-yellow-800 p-2 rounded my-2 border border-yellow-300 text-sm">
          <strong>Warning:</strong> This will also delete all items within this floor.
        </p>
        <div v-if="deleteError" class="bg-red-100 text-red-800 p-2 rounded my-2 border border-red-300 text-sm">
          {{ deleteError }}
        </div>
        <div class="flex gap-2 justify-end mt-5">
          <button @click="confirmDelete" class="bg-red-500 text-white border-none px-4 py-2 rounded cursor-pointer hover:bg-red-600 disabled:bg-gray-500 disabled:cursor-not-allowed" :disabled="isDeleteButtonDisabled">Yes, Delete</button>
          <button @click="cancelDelete" class="bg-gray-500 text-white border-none px-4 py-2 rounded cursor-pointer hover:bg-gray-600">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" @click="cancelEdit">
      <div class="bg-white p-5 rounded-lg max-w-md w-11/12" @click.stop>
        <h3 class="mt-0 text-gray-700">Edit {{ editType === 'shelve' ? 'Shelve' : editType === 'floor' ? 'Floor' : 'Item' }}</h3>
        <form @submit.prevent="confirmEdit">
          <div class="mb-4">
            <label class="block mb-1 font-bold text-gray-700">Name:</label>
            <input v-model="editForm.name" type="text" required class="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500" />
          </div>
          <div v-if="editType === 'item'" class="mb-4">
            <label class="block mb-1 font-bold text-gray-700">Color:</label>
            <input v-model="editForm.color" type="color" class="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500" />
          </div>
          <div v-if="editError" class="bg-red-100 text-red-800 p-2 rounded my-2 border border-red-300 text-sm">
            {{ editError }}
          </div>
          <div class="flex gap-2 justify-end mt-5">
            <button type="submit" class="bg-red-500 text-white border-none px-4 py-2 rounded cursor-pointer hover:bg-red-600 disabled:bg-gray-500 disabled:cursor-not-allowed" :disabled="!!editError">Save Changes</button>
            <button type="button" @click="cancelEdit" class="bg-gray-500 text-white border-none px-4 py-2 rounded cursor-pointer hover:bg-gray-600">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Create Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" @click="cancelCreate">
      <div class="bg-white p-5 rounded-lg max-w-md w-11/12" @click.stop>
        <h3 class="mt-0 text-gray-700">Create {{ createType === 'shelve' ? 'Shelve' : createType === 'floor' ? 'Floor' : 'Item' }}</h3>
        <form @submit.prevent="confirmCreate">
          <div class="mb-4">
            <label class="block mb-1 font-bold text-gray-700">Name:</label>
            <input v-model="createForm.name" type="text" required class="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500" />
          </div>
          <div v-if="createType === 'item'" class="mb-4">
            <label class="block mb-1 font-bold text-gray-700">Color:</label>
            <input v-model="createForm.color" type="color" class="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500" />
          </div>
          <div v-if="createError" class="bg-red-100 text-red-800 p-2 rounded my-2 border border-red-300 text-sm">
            {{ createError }}
          </div>
          <div class="flex gap-2 justify-end mt-5">
            <button type="submit" class="bg-red-500 text-white border-none px-4 py-2 rounded cursor-pointer hover:bg-red-600 disabled:bg-gray-500 disabled:cursor-not-allowed" :disabled="!!createError">Create</button>
            <button type="button" @click="cancelCreate" class="bg-gray-500 text-white border-none px-4 py-2 rounded cursor-pointer hover:bg-gray-600">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Create Buttons -->
    <div class="flex gap-4 p-5 justify-center bg-gray-100 border-t border-gray-200">
      <button @click="openCreateModal('shelve')" class="bg-green-500 text-white border-none px-5 py-2 rounded cursor-pointer text-sm transition-colors duration-300 hover:bg-green-600">+ Add Shelve</button>
      <button v-if="selectedShelve" @click="openCreateModal('floor')" class="bg-green-500 text-white border-none px-5 py-2 rounded cursor-pointer text-sm transition-colors duration-300 hover:bg-green-600">+ Add Floor</button>
      <button v-if="selectedFloor" @click="openCreateModal('item')" class="bg-green-500 text-white border-none px-5 py-2 rounded cursor-pointer text-sm transition-colors duration-300 hover:bg-green-600">+ Add Item</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const route = useRoute()
const router = useRouter()
const emit = defineEmits(['refresh'])

// State management
const currentLevel = computed(() => route.name === 'manage' ? 'shelves' : route.name === 'manageShelve' ? 'floors' : 'items')
const selectedShelve = computed(() => shelves.value.find(shelve => shelve.id == route.params.shelveId))
const selectedFloor = computed(() => floors.value.find(floor => floor.id == route.params.floorId))

// Data
const shelves = ref([])
const floors = ref([])
const items = ref([])

// Loading states
const loadingFloors = ref(false)
const loadingItems = ref(false)

// Slider offsets
const shelveSliderOffset = ref(0)
const floorSliderOffset = ref(0)
const itemSliderOffset = ref(0)

// Slider settings
const itemWidth = 270
const itemsPerView = 3

// Delete modal
const showDeleteModal = ref(false)
const itemToDelete = ref(null)
const deleteType = ref('')
const deleteError = ref(null)

// Edit modal
const showEditModal = ref(false)
const itemToEdit = ref(null)
const editType = ref('')
const editForm = ref({})
const editError = ref(null)

// Create modal
const showCreateModal = ref(false)
const createType = ref('')
const createForm = ref({})
const createError = ref(null)

// Computed properties
const canScrollShelvesNext = computed(() => {
  return shelveSliderOffset.value < (shelves.value.length - itemsPerView) * itemWidth
})

const canScrollFloorsNext = computed(() => {
  return floorSliderOffset.value < (floors.value.length - itemsPerView) * itemWidth
})

const canScrollItemsNext = computed(() => {
  return itemSliderOffset.value < (items.value.length - itemsPerView) * itemWidth
})

const isDeleteButtonDisabled = computed(() => {
  return deleteError.value !== null && deleteError.value !== ''
})

// Fetch data functions
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

const fetchFloors = async (shelveId) => {
  loadingFloors.value = true
  try {
    const response = await fetch(`http://localhost:4000/floors`)
    if (response.ok) {
      const allFloors = await response.json()
      floors.value = allFloors.filter(floor => floor.shelfId == parseInt(shelveId))
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
    const response = await fetch(`http://localhost:4000/items`)
    if (response.ok) {
      const allItems = await response.json()
      items.value = allItems.filter(item => item.floorId == parseInt(floorId))
      // Reset item slider offset when changing floors
      itemSliderOffset.value = 0
    }
  } catch (error) {
    console.error('Error fetching items:', error)
  } finally {
    loadingItems.value = false
  }
}

// Navigation functions
const selectShelve = (shelve) => {
  router.push({ name: 'manageShelve', params: { shelveId: shelve.id } })
}

const selectFloor = (floor) => {
  router.push({ name: 'manageFloor', params: { shelveId: selectedShelve.value.id, floorId: floor.id } })
}

const resetToShelves = () => {
  router.push({ name: 'manage' })
}

const goToFloors = () => {
  router.push({ name: 'manageShelve', params: { shelveId: selectedShelve.value.id } })
}

const goToItems = () => {
  router.push({ name: 'manageFloor', params: { shelveId: selectedShelve.value.id, floorId: selectedFloor.value.id } })
}

// Slider navigation functions
const prevShelve = () => {
  shelveSliderOffset.value = Math.max(0, shelveSliderOffset.value - itemWidth)
}

const nextShelve = () => {
  shelveSliderOffset.value = Math.min(
    (shelves.value.length - itemsPerView) * itemWidth,
    shelveSliderOffset.value + itemWidth
  )
}

const prevFloor = () => {
  floorSliderOffset.value = Math.max(0, floorSliderOffset.value - itemWidth)
}

const nextFloor = () => {
  floorSliderOffset.value = Math.min(
    (floors.value.length - itemsPerView) * itemWidth,
    floorSliderOffset.value + itemWidth
  )
}

const prevItem = () => {
  itemSliderOffset.value = Math.max(0, itemSliderOffset.value - itemWidth)
}

const nextItem = () => {
  itemSliderOffset.value = Math.min(
    (items.value.length - itemsPerView) * itemWidth,
    itemSliderOffset.value + itemWidth
  )
}

// Edit functions
const editShelve = (shelve) => {
  itemToEdit.value = shelve
  editType.value = 'shelve'
  editForm.value = { name: shelve.name }
  editError.value = null
  showEditModal.value = true
}

const editFloor = (floor) => {
  itemToEdit.value = floor
  editType.value = 'floor'
  editForm.value = { name: floor.name }
  editError.value = null
  showEditModal.value = true
}

const editItem = (item) => {
  itemToEdit.value = item
  editType.value = 'item'
  editForm.value = { name: item.name, color: item.color }
  editError.value = null
  showEditModal.value = true
}

// Delete functions
const deleteShelve = (shelve) => {
  // Reset all modal state
  itemToDelete.value = shelve
  deleteType.value = 'shelve'
  deleteError.value = null
  showDeleteModal.value = true
}

const deleteFloor = (floor) => {
  // Reset all modal state
  itemToDelete.value = floor
  deleteType.value = 'floor'
  deleteError.value = null
  showDeleteModal.value = true
}

const deleteItem = (item) => {
  // Reset all modal state
  itemToDelete.value = item
  deleteType.value = 'item'
  deleteError.value = null
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!itemToDelete.value) return

  try {
    const endpoint = deleteType.value === 'shelve' ? 'shelves' : 
                   deleteType.value === 'floor' ? 'floors' : 'items'
    
    const response = await fetch(`http://localhost:4000/${endpoint}/${itemToDelete.value.id}`, {
      method: 'DELETE'
    })

    if (response.ok) {
      // Refresh appropriate data
      if (deleteType.value === 'shelve') {
        await fetchShelves()
        // Clear floors and items since they were deleted with CASCADE
        floors.value = []
        items.value = []
        // Reset slider offsets
        floorSliderOffset.value = 0
        itemSliderOffset.value = 0
        // Always navigate back to shelves when deleting a shelve
        resetToShelves()
      } else if (deleteType.value === 'floor') {
        await fetchFloors(selectedShelve.value.id)
        // Clear items since they were deleted with CASCADE
        items.value = []
        // Reset item slider offset
        itemSliderOffset.value = 0
        if (selectedFloor.value?.id === itemToDelete.value.id) {
          goToFloors()
        }
      } else {
        await fetchItems(selectedFloor.value.id)
      }
      
      emit('refresh')
      cancelDelete()
    } else {
      // Handle error response
      const errorData = await response.json()
      deleteError.value = errorData.message || 'An error occurred while deleting the item.'
    }
  } catch (error) {
    console.error('Error deleting item:', error)
    deleteError.value = 'An error occurred while deleting the item.'
  }
}

const cancelDelete = () => {
  showDeleteModal.value = false
  itemToDelete.value = null
  deleteType.value = ''
  deleteError.value = null
}

// Edit modal functions
const confirmEdit = async () => {
  if (!itemToEdit.value) return

  try {
    const endpoint = editType.value === 'shelve' ? 'shelves' : 
                   editType.value === 'floor' ? 'floors' : 'items'
    
    const response = await fetch(`http://localhost:4000/${endpoint}/${itemToEdit.value.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editForm.value)
    })

    if (response.ok) {
      // Refresh appropriate data
      if (editType.value === 'shelve') {
        await fetchShelves()
      } else if (editType.value === 'floor') {
        await fetchFloors(selectedShelve.value.id)
      } else {
        await fetchItems(selectedFloor.value.id)
      }
      
      emit('refresh')
      cancelEdit()
    } else {
      // Handle error response
      const errorData = await response.json()
      editError.value = errorData.message || 'An error occurred while updating the item.'
    }
  } catch (error) {
    console.error('Error updating item:', error)
    editError.value = 'An error occurred while updating the item.'
  }
}

const cancelEdit = () => {
  showEditModal.value = false
  itemToEdit.value = null
  editType.value = ''
  editForm.value = {}
  editError.value = null
}

// Create modal functions
const openCreateModal = (type) => {
  createType.value = type
  createForm.value = type === 'item' ? { name: '', color: '#000000' } : { name: '' }
  createError.value = null
  showCreateModal.value = true
}

const confirmCreate = async () => {
  try {
    const endpoint = createType.value === 'shelve' ? 'shelves' : 
                   createType.value === 'floor' ? 'floors' : 'items'
    
    const payload = { ...createForm.value }
    
    // Add parent ID for floors and items
    if (createType.value === 'floor' && selectedShelve.value) {
      payload.shelfId = selectedShelve.value.id
    } else if (createType.value === 'item' && selectedFloor.value) {
      payload.floorId = selectedFloor.value.id
    }
    
    const response = await fetch(`http://localhost:4000/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (response.ok) {
      // Refresh appropriate data
      if (createType.value === 'shelve') {
        await fetchShelves()
      } else if (createType.value === 'floor') {
        await fetchFloors(selectedShelve.value.id)
      } else {
        await fetchItems(selectedFloor.value.id)
      }
      
      emit('refresh')
      cancelCreate()
    } else {
      // Handle error response
      const errorData = await response.json()
      createError.value = errorData.message || 'An error occurred while creating the item.'
    }
  } catch (error) {
    console.error('Error creating item:', error)
    createError.value = 'An error occurred while creating the item.'
  }
}

const cancelCreate = () => {
  showCreateModal.value = false
  createType.value = ''
  createForm.value = {}
  createError.value = null
}

// Utility functions
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

// Initialize
onMounted(() => {
  fetchShelves()
})

// Watch route changes
watch(() => route.params, (newParams) => {
  if (newParams.shelveId && !floors.value.some(f => f.shelfId == parseInt(newParams.shelveId))) {
    fetchFloors(parseInt(newParams.shelveId))
  }
  if (newParams.floorId && !items.value.some(i => i.floorId == parseInt(newParams.floorId))) {
    fetchItems(parseInt(newParams.floorId))
  }
}, { immediate: true })

// Watch for floor changes to reset item selection
watch(() => route.params.floorId, (newFloorId, oldFloorId) => {
  if (newFloorId !== oldFloorId && newFloorId) {
    itemSliderOffset.value = 0
  }
}, { immediate: true })
</script>
