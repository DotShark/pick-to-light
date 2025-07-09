<template>
  <div class="bg-white rounded overflow-hidden shadow-lg">
    <!-- Breadcrumb -->
    <div class="flex items-center p-4 bg-gray-100 border-b border-gray-200">
      <button 
        class="border-none text-gray-600 cursor-pointer text-sm px-2 py-1 rounded transition-all duration-300 hover:bg-gray-200 hover:text-gray-700" 
        :class="{ 'bg-blue-500 text-white': currentLevel === 'shelves' }"
        @click="resetToShelves"
      >
        Shelves
      </button>
      <span v-if="selectedShelve" class="mx-2 text-gray-600">></span>
      <button 
        v-if="selectedShelve" 
        class="border-none text-gray-600 cursor-pointer text-sm px-2 py-1 rounded transition-all duration-300 hover:bg-gray-200 hover:text-gray-700"
        :class="{ 'bg-blue-500 text-white': currentLevel === 'floors' }"
        @click="goToFloors"
      >
        {{ selectedShelve.name }}
      </button>
      <span v-if="selectedFloor" class="mx-2 text-gray-600">></span>
      <button 
        v-if="selectedFloor" 
        class="border-none text-gray-600 cursor-pointer text-sm px-2 py-1 rounded transition-all duration-300 hover:bg-gray-200 hover:text-gray-700"
        :class="{ 'bg-blue-500 text-white': currentLevel === 'items' }"
        @click="goToItems"
      >
        {{ selectedFloor.name }}
      </button>
    </div>

    <!-- Shelves Card -->
    <div class="m-5 border border-gray-200 rounded bg-white">
      <div class="flex justify-between items-center p-5 bg-gray-100 border-b border-gray-200">
        <h3 class="m-0 text-slate-700">Shelves</h3>
        <button @click="openCreateModal('shelve')" class="bg-green-600 text-white border-none px-4 py-2 rounded cursor-pointer transition-colors duration-300 hover:bg-green-700">+ Add Shelve</button>
      </div>
      <div class="p-5">
        <div v-if="shelves.length === 0" class="text-center text-gray-600 p-10 italic">
          No shelves found. Create your first shelve to get started.
        </div>
        <div v-else class="flex flex-col gap-4">
          <select v-model="selectedShelveId" @change="onShelveSelect" class="p-3 border border-gray-300 rounded bg-white text-sm cursor-pointer transition-colors duration-300 focus:outline-none focus:border-blue-500 hover:border-blue-500">
            <option value="">Select a shelve...</option>
            <option v-for="shelve in shelves" :key="shelve.id" :value="shelve.id">
{{ shelve.name }} ({{ shelve.id }})
            </option>
          </select>
          <div v-if="selectedShelveId" class="flex gap-3">
            <button @click="editShelve(shelves.find(s => s.id == selectedShelveId))" class="bg-yellow-400 text-black border-none px-2 py-1 rounded cursor-pointer text-xs transition-colors duration-300 hover:bg-yellow-500">Edit</button>
            <button @click="deleteShelve(shelves.find(s => s.id == selectedShelveId))" class="bg-red-600 text-white border-none px-2 py-1 rounded cursor-pointer text-xs transition-colors duration-300 hover:bg-red-700">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Floors Card -->
    <div v-if="selectedShelve" class="m-5 border border-gray-200 rounded bg-white">
      <div class="flex justify-between items-center p-5 bg-gray-100 border-b border-gray-200">
        <h3 class="m-0 text-slate-700">Floors in {{ selectedShelve.name }}</h3>
        <button @click="openCreateModal('floor')" class="bg-green-600 text-white border-none px-4 py-2 rounded cursor-pointer transition-colors duration-300 hover:bg-green-700">+ Add Floor</button>
      </div>
      <div class="p-5">
        <div v-if="loadingFloors" class="text-center p-10 text-gray-600">
          Loading floors...
        </div>
        <div v-else-if="floors.length === 0" class="text-center text-gray-600 p-10 italic">
          No floors found in this shelve.
        </div>
        <div v-else class="flex flex-col gap-4">
          <select v-model="selectedFloorId" @change="onFloorSelect" class="p-3 border border-gray-300 rounded bg-white text-sm cursor-pointer transition-colors duration-300 focus:outline-none focus:border-blue-500 hover:border-blue-500">
            <option value="">Select a floor...</option>
            <option v-for="floor in floors" :key="floor.id" :value="floor.id">
{{ floor.name }} ({{ floor.id }})
            </option>
          </select>
          <div v-if="selectedFloorId" class="flex gap-3">
            <button @click="editFloor(floors.find(f => f.id == selectedFloorId))" class="bg-yellow-400 text-black border-none px-2 py-1 rounded cursor-pointer text-xs transition-colors duration-300 hover:bg-yellow-500">Edit</button>
            <button @click="deleteFloor(floors.find(f => f.id == selectedFloorId))" class="bg-red-600 text-white border-none px-2 py-1 rounded cursor-pointer text-xs transition-colors duration-300 hover:bg-red-700">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Items Card -->
    <div v-if="selectedFloor" class="m-5 border border-gray-200 rounded bg-white">
      <div class="flex justify-between items-center p-5 bg-gray-100 border-b border-gray-200">
        <h3 class="m-0 text-slate-700">Items in {{ selectedFloor.name }}</h3>
        <button @click="openCreateModal('item')" class="bg-green-600 text-white border-none px-4 py-2 rounded cursor-pointer transition-colors duration-300 hover:bg-green-700">+ Add Item</button>
      </div>
      <div class="p-5">
        <div v-if="loadingItems" class="text-center p-10 text-gray-600">
          Loading items...
        </div>
        <div v-else-if="items.length === 0" class="text-center text-gray-600 p-10 italic">
          No items found in this floor.
        </div>
        <div v-else class="flex flex-col gap-4">
          <select v-model="selectedItemId" @change="onItemSelect" class="p-3 border border-gray-300 rounded bg-white text-sm cursor-pointer transition-colors duration-300 focus:outline-none focus:border-blue-500 hover:border-blue-500">
            <option value="">Select an item...</option>
            <option v-for="item in items" :key="item.id" :value="item.id">
{{ item.name }} ({{ item.id }})
            </option>
          </select>
          <div v-if="selectedItemId && selectedItemDetails" class="flex justify-between items-center p-3 bg-gray-100 rounded border border-gray-200">
            <div class="flex items-center gap-2">
              <div class="w-5 h-5 rounded-full border border-gray-300" :style="{ backgroundColor: selectedItemDetails.color }"></div>
              <span>{{ selectedItemDetails.name }}</span>
            </div>
            <div class="flex gap-3">
              <button @click="editItem(selectedItemDetails)" class="bg-yellow-400 text-black border-none px-2 py-1 rounded cursor-pointer text-xs transition-colors duration-300 hover:bg-yellow-500">Edit</button>
              <button @click="deleteItem(selectedItemDetails)" class="bg-red-600 text-white border-none px-2 py-1 rounded cursor-pointer text-xs transition-colors duration-300 hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 flex justify-center items-center z-50" style="background-color: rgba(0, 0, 0, 0.3);" @click="cancelDelete">
      <div class="bg-white rounded p-5 max-w-sm w-11/12 max-h-[90vh] overflow-y-auto" @click.stop>
        <h3 class="mb-5 text-lg text-gray-800">Confirm Delete</h3>
        <p>Are you sure you want to delete "{{ itemToDelete?.name }}"?</p>
        <p v-if="deleteType === 'shelve'" class="bg-yellow-100 text-yellow-800 p-2 rounded my-2 border border-yellow-200">
          <strong>Warning:</strong> This will also delete all floors and items within this shelve.
        </p>
        <p v-if="deleteType === 'floor'" class="bg-yellow-100 text-yellow-800 p-2 rounded my-2 border border-yellow-200">
          <strong>Warning:</strong> This will also delete all items within this floor.
        </p>
        <div v-if="deleteError" class="bg-red-100 text-red-800 p-2 rounded mb-3 border border-red-200">
          {{ deleteError }}
        </div>
        <div class="flex gap-2 justify-end mt-5">
          <button @click="confirmDelete" class="bg-blue-500 text-white border-none px-4 py-2 rounded cursor-pointer transition-colors duration-300 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed" :disabled="isDeleteButtonDisabled">Yes, Delete</button>
          <button @click="cancelDelete" class="bg-gray-600 text-white border-none px-4 py-2 rounded cursor-pointer transition-colors duration-300 hover:bg-gray-700">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="fixed inset-0 flex justify-center items-center z-50" style="background-color: rgba(0, 0, 0, 0.3);" @click="cancelEdit">
      <div class="bg-white rounded p-5 max-w-sm w-11/12 max-h-[90vh] overflow-y-auto" @click.stop>
        <h3 class="mb-5 text-lg text-gray-800">Edit {{ editType === 'shelve' ? 'Shelve' : editType === 'floor' ? 'Floor' : 'Item' }}</h3>
        <form @submit.prevent="confirmEdit">
          <div class="mb-4">
            <label class="block mb-1 font-medium text-gray-700">Name:</label>
            <input v-model="editForm.name" type="text" required class="w-full p-2 border border-gray-300 rounded text-sm transition-colors duration-300 focus:outline-none focus:border-blue-500" />
          </div>
          <div v-if="editType === 'item'" class="mb-4">
            <label class="block mb-1 font-medium text-gray-700">Color:</label>
            <input v-model="editForm.color" type="color" class="w-full p-2 border border-gray-300 rounded text-sm transition-colors duration-300 focus:outline-none focus:border-blue-500" />
          </div>
          <div v-if="editError" class="bg-red-100 text-red-800 p-2 rounded mb-3 border border-red-200">
            {{ editError }}
          </div>
          <div class="flex gap-2 justify-end mt-5">
            <button type="submit" class="bg-blue-500 text-white border-none px-4 py-2 rounded cursor-pointer transition-colors duration-300 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed" :disabled="!!editError">Save Changes</button>
            <button type="button" @click="cancelEdit" class="bg-gray-600 text-white border-none px-4 py-2 rounded cursor-pointer transition-colors duration-300 hover:bg-gray-700">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Create Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 flex justify-center items-center z-50" style="background-color: rgba(0, 0, 0, 0.3);" @click="cancelCreate">
      <div class="bg-white rounded p-5 max-w-sm w-11/12 max-h-[90vh] overflow-y-auto" @click.stop>
        <h3 class="mb-5 text-lg text-gray-800">Create {{ createType === 'shelve' ? 'Shelve' : createType === 'floor' ? 'Floor' : 'Item' }}</h3>
        <form @submit.prevent="confirmCreate">
          <div class="mb-4">
            <label class="block mb-1 font-medium text-gray-700">Name:</label>
            <input v-model="createForm.name" type="text" required class="w-full p-2 border border-gray-300 rounded text-sm transition-colors duration-300 focus:outline-none focus:border-blue-500" />
          </div>
          <div v-if="createType === 'item'" class="mb-4">
            <label class="block mb-1 font-medium text-gray-700">Color:</label>
            <input v-model="createForm.color" type="color" class="w-full p-2 border border-gray-300 rounded text-sm transition-colors duration-300 focus:outline-none focus:border-blue-500" />
          </div>
          <div v-if="createError" class="bg-red-100 text-red-800 p-2 rounded mb-3 border border-red-200">
            {{ createError }}
          </div>
          <div class="flex gap-2 justify-end mt-5">
            <button type="submit" class="bg-blue-500 text-white border-none px-4 py-2 rounded cursor-pointer transition-colors duration-300 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed" :disabled="!!createError">Create</button>
            <button type="button" @click="cancelCreate" class="bg-gray-600 text-white border-none px-4 py-2 rounded cursor-pointer transition-colors duration-300 hover:bg-gray-700">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// Utility API function
async function apiRequest(url, options = {}) {
  const response = await fetch(url, options)
  const contentType = response.headers.get('content-type')
  let data = null
  if (contentType && contentType.includes('application/json')) {
    data = await response.json()
  }
  if (!response.ok) {
    const error = (data && data.message) || response.statusText || 'API error'
    throw new Error(error)
  }
  return data
}

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

// Selected items for dropdowns
const selectedShelveId = ref('')
const selectedFloorId = ref('')
const selectedItemId = ref('')

// Loading states
const loadingFloors = ref(false)
const loadingItems = ref(false)

// Selected item details
const selectedItemDetails = computed(() => items.value.find(item => item.id == selectedItemId.value))

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
const isDeleteButtonDisabled = computed(() => {
  return deleteError.value !== null && deleteError.value !== ''
})

// Fetch data functions
async function fetchShelves() {
  try {
    shelves.value = await apiRequest('http://localhost:4000/shelves')
  } catch (error) {
    console.error('Error fetching shelves:', error)
  }
}

async function fetchFloors(shelveId) {
  loadingFloors.value = true
  try {
    const allFloors = await apiRequest('http://localhost:4000/floors')
    floors.value = allFloors.filter(floor => floor.shelfId == parseInt(shelveId))
  } catch (error) {
    console.error('Error fetching floors:', error)
  } finally {
    loadingFloors.value = false
  }
}

async function fetchItems(floorId) {
  loadingItems.value = true
  try {
    const allItems = await apiRequest('http://localhost:4000/items')
    items.value = allItems.filter(item => item.floorId == parseInt(floorId))
    selectedItemId.value = ''
  } catch (error) {
    console.error('Error fetching items:', error)
  } finally {
    loadingItems.value = false
  }
}

// Navigation functions
function onShelveSelect() {
  if (selectedShelveId.value) {
    router.push({ name: 'manageShelve', params: { shelveId: selectedShelveId.value } })
  }
}

function onFloorSelect() {
  if (selectedFloorId.value) {
    router.push({ name: 'manageFloor', params: { shelveId: selectedShelve.value.id, floorId: selectedFloorId.value } })
  }
}

function onItemSelect() {
  // Item selection just updates the displayed details
}

function resetToShelves() {
  selectedShelveId.value = ''
  selectedFloorId.value = ''
  selectedItemId.value = ''
  router.push({ name: 'manage' })
}

function goToFloors() {
  selectedFloorId.value = ''
  selectedItemId.value = ''
  router.push({ name: 'manageShelve', params: { shelveId: selectedShelve.value.id } })
}

function goToItems() {
  selectedItemId.value = ''
  router.push({ name: 'manageFloor', params: { shelveId: selectedShelve.value.id, floorId: selectedFloor.value.id } })
}

// Edit functions
function editShelve(shelve) {
  itemToEdit.value = shelve
  editType.value = 'shelve'
  editForm.value = { name: shelve.name }
  editError.value = null
  showEditModal.value = true
}

function editFloor(floor) {
  itemToEdit.value = floor
  editType.value = 'floor'
  editForm.value = { name: floor.name }
  editError.value = null
  showEditModal.value = true
}

function editItem(item) {
  itemToEdit.value = item
  editType.value = 'item'
  editForm.value = { name: item.name, color: item.color }
  editError.value = null
  showEditModal.value = true
}

// Delete functions
function deleteShelve(shelve) {
  itemToDelete.value = shelve
  deleteType.value = 'shelve'
  deleteError.value = null
  showDeleteModal.value = true
}

function deleteFloor(floor) {
  itemToDelete.value = floor
  deleteType.value = 'floor'
  deleteError.value = null
  showDeleteModal.value = true
}

function deleteItem(item) {
  itemToDelete.value = item
  deleteType.value = 'item'
  deleteError.value = null
  showDeleteModal.value = true
}

async function confirmDelete() {
  if (!itemToDelete.value) return

  try {
    const endpoint = deleteType.value === 'shelve' ? 'shelves' :
                   deleteType.value === 'floor' ? 'floors' : 'items'

    await apiRequest(`http://localhost:4000/${endpoint}/${itemToDelete.value.id}`, {
      method: 'DELETE'
    })

    // Refresh appropriate data
    if (deleteType.value === 'shelve') {
      await fetchShelves()
      floors.value = []
      items.value = []
      selectedShelveId.value = ''
      selectedFloorId.value = ''
      selectedItemId.value = ''
      resetToShelves()
    } else if (deleteType.value === 'floor') {
      await fetchFloors(selectedShelve.value.id)
      items.value = []
      selectedFloorId.value = ''
      selectedItemId.value = ''
      if (selectedFloor.value?.id === itemToDelete.value.id) {
        goToFloors()
      }
    } else {
      await fetchItems(selectedFloor.value.id)
      selectedItemId.value = ''
    }

    emit('refresh')
    cancelDelete()
  } catch (error) {
    deleteError.value = error.message || 'An error occurred while deleting the item.'
  }
}

function cancelDelete() {
  showDeleteModal.value = false
  itemToDelete.value = null
  deleteType.value = ''
  deleteError.value = null
}

// Edit modal functions
async function confirmEdit() {
  if (!itemToEdit.value) return

  try {
    const endpoint = editType.value === 'shelve' ? 'shelves' :
                   editType.value === 'floor' ? 'floors' : 'items'

    await apiRequest(`http://localhost:4000/${endpoint}/${itemToEdit.value.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editForm.value)
    })

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
  } catch (error) {
    editError.value = error.message || 'An error occurred while updating the item.'
  }
}

function cancelEdit() {
  showEditModal.value = false
  itemToEdit.value = null
  editType.value = ''
  editForm.value = {}
  editError.value = null
}

// Create modal functions
function openCreateModal(type) {
  createType.value = type
  createForm.value = type === 'item' ? { name: '', color: '#000000' } : { name: '' }
  createError.value = null
  showCreateModal.value = true
}

async function confirmCreate() {
  try {
    const endpoint = createType.value === 'shelve' ? 'shelves' : 
                   createType.value === 'floor' ? 'floors' : 'items'
    const payload = { ...createForm.value }
    if (createType.value === 'floor' && selectedShelve.value) {
      payload.shelfId = selectedShelve.value.id
    } else if (createType.value === 'item' && selectedFloor.value) {
      payload.floorId = selectedFloor.value.id
    }
    const createdItem = await apiRequest(`http://localhost:4000/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    if (createType.value === 'shelve') {
      await fetchShelves()
      router.push({ name: 'manageShelve', params: { shelveId: createdItem.id.toString() } })
    } else if (createType.value === 'floor') {
      await fetchFloors(selectedShelve.value.id)
      router.push({ name: 'manageFloor', params: { shelveId: selectedShelve.value.id.toString(), floorId: createdItem.id.toString() } })
    } else {
      await fetchItems(selectedFloor.value.id)
      selectedItemId.value = createdItem.id.toString()
    }
    emit('refresh')
    cancelCreate()
  } catch (error) {
    createError.value = error.message || 'An error occurred while creating the item.'
  }
}

function cancelCreate() {
  showCreateModal.value = false
  createType.value = ''
  createForm.value = {}
  createError.value = null
}

// Initialize
onMounted(() => {
  fetchShelves()
})

// Watch route changes
watch(() => route.params, (newParams) => {
  // Synchronize dropdown selections with route params
  if (newParams.shelveId) {
    selectedShelveId.value = newParams.shelveId
    if (!floors.value.some(f => f.shelfId == parseInt(newParams.shelveId))) {
      fetchFloors(parseInt(newParams.shelveId))
    }
  } else {
    selectedShelveId.value = ''
    floors.value = []
  }

  if (newParams.floorId) {
    selectedFloorId.value = newParams.floorId
    if (!items.value.some(i => i.floorId == parseInt(newParams.floorId))) {
      fetchItems(parseInt(newParams.floorId))
    }
  } else {
    selectedFloorId.value = ''
    items.value = []
  }
}, { immediate: true })
</script>

