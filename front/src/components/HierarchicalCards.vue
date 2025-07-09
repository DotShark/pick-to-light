<template>
  <div class="hierarchical-cards">
    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <button 
        class="breadcrumb-item" 
        :class="{ active: currentLevel === 'shelves' }"
        @click="resetToShelves"
      >
        Shelves
      </button>
      <span v-if="selectedShelve" class="breadcrumb-separator">></span>
      <button 
        v-if="selectedShelve" 
        class="breadcrumb-item"
        :class="{ active: currentLevel === 'floors' }"
        @click="goToFloors"
      >
        {{ selectedShelve.name }}
      </button>
      <span v-if="selectedFloor" class="breadcrumb-separator">></span>
      <button 
        v-if="selectedFloor" 
        class="breadcrumb-item"
        :class="{ active: currentLevel === 'items' }"
        @click="goToItems"
      >
        {{ selectedFloor.name }}
      </button>
    </div>

    <!-- Shelves Card -->
    <div v-if="currentLevel === 'shelves'" class="card">
      <div class="card-header">
        <h3>Shelves</h3>
        <button @click="openCreateModal('shelve')" class="create-btn">+ Add Shelve</button>
      </div>
      <div class="card-content">
        <div v-if="shelves.length === 0" class="empty-state">
          No shelves found. Create your first shelve to get started.
        </div>
        <div v-else class="dropdown-container">
          <select v-model="selectedShelveId" @change="onShelveSelect" class="dropdown">
            <option value="">Select a shelve...</option>
            <option v-for="shelve in shelves" :key="shelve.id" :value="shelve.id">
{{ shelve.name }} ({{ shelve.id }})
            </option>
          </select>
          <div v-if="selectedShelveId" class="item-actions">
            <button @click="editShelve(shelves.find(s => s.id == selectedShelveId))" class="edit-btn">Edit</button>
            <button @click="deleteShelve(shelves.find(s => s.id == selectedShelveId))" class="delete-btn">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Floors Card -->
    <div v-if="currentLevel === 'floors'" class="card">
      <div class="card-header">
        <h3>Floors in {{ selectedShelve.name }}</h3>
        <button @click="openCreateModal('floor')" class="create-btn">+ Add Floor</button>
      </div>
      <div class="card-content">
        <div v-if="loadingFloors" class="loading-state">
          Loading floors...
        </div>
        <div v-else-if="floors.length === 0" class="empty-state">
          No floors found in this shelve.
        </div>
        <div v-else class="dropdown-container">
          <select v-model="selectedFloorId" @change="onFloorSelect" class="dropdown">
            <option value="">Select a floor...</option>
            <option v-for="floor in floors" :key="floor.id" :value="floor.id">
{{ floor.name }} ({{ floor.id }})
            </option>
          </select>
          <div v-if="selectedFloorId" class="item-actions">
            <button @click="editFloor(floors.find(f => f.id == selectedFloorId))" class="edit-btn">Edit</button>
            <button @click="deleteFloor(floors.find(f => f.id == selectedFloorId))" class="delete-btn">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Items Card -->
    <div v-if="currentLevel === 'items'" class="card">
      <div class="card-header">
        <h3>Items in {{ selectedFloor.name }}</h3>
        <button @click="openCreateModal('item')" class="create-btn">+ Add Item</button>
      </div>
      <div class="card-content">
        <div v-if="loadingItems" class="loading-state">
          Loading items...
        </div>
        <div v-else-if="items.length === 0" class="empty-state">
          No items found in this floor.
        </div>
        <div v-else class="dropdown-container">
          <select v-model="selectedItemId" @change="onItemSelect" class="dropdown">
            <option value="">Select an item...</option>
            <option v-for="item in items" :key="item.id" :value="item.id">
{{ item.name }} ({{ item.id }})
            </option>
          </select>
          <div v-if="selectedItemId" class="item-details">
            <div class="item-info">
              <div class="color-indicator" :style="{ backgroundColor: selectedItemDetails?.color }"></div>
              <span>{{ selectedItemDetails?.name }}</span>
            </div>
            <div class="item-actions">
              <button @click="editItem(selectedItemDetails)" class="edit-btn">Edit</button>
              <button @click="deleteItem(selectedItemDetails)" class="delete-btn">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="cancelDelete">
      <div class="modal" @click.stop>
        <h3>Confirm Delete</h3>
        <p>Are you sure you want to delete "{{ itemToDelete?.name }}"?</p>
        <p v-if="deleteType === 'shelve'" class="cascade-warning">
          <strong>Warning:</strong> This will also delete all floors and items within this shelve.
        </p>
        <p v-if="deleteType === 'floor'" class="cascade-warning">
          <strong>Warning:</strong> This will also delete all items within this floor.
        </p>
        <div v-if="deleteError" class="error-message">
          {{ deleteError }}
        </div>
        <div class="modal-actions">
          <button @click="confirmDelete" class="confirm-btn" :disabled="isDeleteButtonDisabled">Yes, Delete</button>
          <button @click="cancelDelete" class="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="modal-overlay" @click="cancelEdit">
      <div class="modal" @click.stop>
        <h3>Edit {{ editType === 'shelve' ? 'Shelve' : editType === 'floor' ? 'Floor' : 'Item' }}</h3>
        <form @submit.prevent="confirmEdit">
          <div class="form-group">
            <label>Name:</label>
            <input v-model="editForm.name" type="text" required />
          </div>
          <div v-if="editType === 'item'" class="form-group">
            <label>Color:</label>
            <input v-model="editForm.color" type="color" />
          </div>
          <div v-if="editError" class="error-message">
            {{ editError }}
          </div>
          <div class="modal-actions">
            <button type="submit" class="confirm-btn" :disabled="!!editError">Save Changes</button>
            <button type="button" @click="cancelEdit" class="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Create Modal -->
    <div v-if="showCreateModal" class="modal-overlay" @click="cancelCreate">
      <div class="modal" @click.stop>
        <h3>Create {{ createType === 'shelve' ? 'Shelve' : createType === 'floor' ? 'Floor' : 'Item' }}</h3>
        <form @submit.prevent="confirmCreate">
          <div class="form-group">
            <label>Name:</label>
            <input v-model="createForm.name" type="text" required />
          </div>
          <div v-if="createType === 'item'" class="form-group">
            <label>Color:</label>
            <input v-model="createForm.color" type="color" />
          </div>
          <div v-if="createError" class="error-message">
            {{ createError }}
          </div>
          <div class="modal-actions">
            <button type="submit" class="confirm-btn" :disabled="!!createError">Create</button>
            <button type="button" @click="cancelCreate" class="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
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
      floors.value = allFloors.filter(floor => floor.shelfId == shelveId)
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
      items.value = allItems.filter(item => item.floorId == floorId)
    }
  } catch (error) {
    console.error('Error fetching items:', error)
  } finally {
    loadingItems.value = false
  }
}

// Navigation functions
const onShelveSelect = () => {
  if (selectedShelveId.value) {
    router.push({ name: 'manageShelve', params: { shelveId: selectedShelveId.value } })
  }
}

const onFloorSelect = () => {
  if (selectedFloorId.value) {
    router.push({ name: 'manageFloor', params: { shelveId: selectedShelve.value.id, floorId: selectedFloorId.value } })
  }
}

const onItemSelect = () => {
  // Item selection just updates the displayed details
}

const resetToShelves = () => {
  selectedShelveId.value = ''
  selectedFloorId.value = ''
  selectedItemId.value = ''
  router.push({ name: 'manage' })
}

const goToFloors = () => {
  selectedFloorId.value = ''
  selectedItemId.value = ''
  router.push({ name: 'manageShelve', params: { shelveId: selectedShelve.value.id } })
}

const goToItems = () => {
  selectedItemId.value = ''
  router.push({ name: 'manageFloor', params: { shelveId: selectedShelve.value.id, floorId: selectedFloor.value.id } })
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
  itemToDelete.value = shelve
  deleteType.value = 'shelve'
  deleteError.value = null
  showDeleteModal.value = true
}

const deleteFloor = (floor) => {
  itemToDelete.value = floor
  deleteType.value = 'floor'
  deleteError.value = null
  showDeleteModal.value = true
}

const deleteItem = (item) => {
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
    } else {
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

// Initialize
onMounted(() => {
  fetchShelves()
})

// Watch route changes
watch(() => route.params, (newParams) => {
  if (newParams.shelveId && !floors.value.some(f => f.shelfId == newParams.shelveId)) {
    fetchFloors(parseInt(newParams.shelveId))
  }
  if (newParams.floorId && !items.value.some(i => i.floorId == newParams.floorId)) {
    fetchItems(parseInt(newParams.floorId))
  }
}, { immediate: true })
</script>

<style scoped>
.hierarchical-cards {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.breadcrumb {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.breadcrumb-item {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  font-size: 14px;
  padding: 5px 10px;
  border-radius: 4px;
  transition: all 0.3s;
}

.breadcrumb-item:hover {
  background: #e9ecef;
  color: #495057;
}

.breadcrumb-item.active {
  background: #007bff;
  color: white;
}

.breadcrumb-separator {
  margin: 0 10px;
  color: #6c757d;
}

.card {
  margin: 20px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: white;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.card-header h3 {
  margin: 0;
  color: #2c3e50;
}

.card-content {
  padding: 20px;
}

.dropdown-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.dropdown {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.3s;
}

.dropdown:focus {
  outline: none;
  border-color: #007bff;
}

.dropdown:hover {
  border-color: #007bff;
}

.item-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #e9ecef;
}

.item-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.color-indicator {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid #ddd;
}

.item-actions {
  display: flex;
  gap: 10px;
}

.create-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.create-btn:hover {
  background: #218838;
}

.edit-btn {
  background: #ffc107;
  color: #212529;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.3s;
}

.edit-btn:hover {
  background: #e0a800;
}

.delete-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.3s;
}

.delete-btn:hover {
  background: #c82333;
}

.empty-state {
  text-align: center;
  color: #6c757d;
  padding: 40px;
  font-style: italic;
}

.loading-state {
  text-align: center;
  color: #6c757d;
  padding: 40px;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 8px;
  padding: 20px;
  max-width: 400px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal h3 {
  margin: 0 0 20px 0;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #495057;
}

.form-group input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #007bff;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

.confirm-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.confirm-btn:hover:not(:disabled) {
  background: #0056b3;
}

.confirm-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.cancel-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.cancel-btn:hover {
  background: #5a6268;
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
  border: 1px solid #f5c6cb;
}

.cascade-warning {
  background: #fff3cd;
  color: #856404;
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
  border: 1px solid #ffeaa7;
}
</style>
