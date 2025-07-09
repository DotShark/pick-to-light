<template>
  <div class="hierarchical-slider">
    <!-- Breadcrumb Navigation -->
    <div class="breadcrumb">
      <button 
        @click="resetToShelves" 
        :class="{ active: currentLevel === 'shelves' }"
        class="breadcrumb-item"
      >
        Shelves
      </button>
      <span v-if="selectedShelve" class="breadcrumb-separator">›</span>
      <button 
        v-if="selectedShelve"
        @click="goToFloors" 
        :class="{ active: currentLevel === 'floors' }"
        class="breadcrumb-item"
      >
        {{ selectedShelve.name }} - Floors
      </button>
      <span v-if="selectedFloor" class="breadcrumb-separator">›</span>
      <button 
        v-if="selectedFloor"
        @click="goToItems" 
        :class="{ active: currentLevel === 'items' }"
        class="breadcrumb-item"
      >
        {{ selectedFloor.name }} - Items
      </button>
    </div>

    <!-- Shelves Level -->
    <div class="level-container">
      <h3>{{ selectedShelve ? `Selected Shelve: ${selectedShelve.name}` : 'Select a Shelve' }}</h3>
      <div class="slider-container">
        <div class="slider-wrapper">
          <div class="slider-content" :style="{ transform: `translateX(-${shelveSliderOffset}px)` }">
            <div 
              v-for="shelve in shelves" 
              :key="shelve.id"
              class="slider-item shelve-item"
              :class="{ selected: selectedShelve && selectedShelve.id === shelve.id }"
              @click="selectShelve(shelve)"
            >
              <div class="item-content">
                <h4>{{ shelve.name }}</h4>
                <p class="item-meta">ID: {{ shelve.id }}</p>
                <p class="item-meta">Created: {{ formatDate(shelve.createdAt) }}</p>
                <div class="item-actions">
                  <button @click.stop="editShelve(shelve)" class="edit-btn">Edit</button>
                  <button @click.stop="deleteShelve(shelve)" class="delete-btn">Delete</button>
                </div>
              </div>
            </div>
          </div>
          <button @click="prevShelve" class="slider-nav prev" :disabled="shelveSliderOffset === 0">‹</button>
          <button @click="nextShelve" class="slider-nav next" :disabled="!canScrollShelvesNext">›</button>
        </div>
      </div>
    </div>

    <!-- Floors Level -->
    <div v-if="selectedShelve" class="level-container">
      <h3>{{ selectedFloor ? `Selected Floor: ${selectedFloor.name}` : `Floors in ${selectedShelve.name}` }}</h3>
      <div v-if="loadingFloors" class="loading">Loading floors...</div>
      <div v-else-if="floors.length === 0" class="empty-state">
        No floors found in this shelve.
      </div>
      <div v-else class="slider-container">
        <div class="slider-wrapper">
          <div class="slider-content" :style="{ transform: `translateX(-${floorSliderOffset}px)` }">
            <div 
              v-for="floor in floors" 
              :key="floor.id"
              class="slider-item floor-item"
              :class="{ selected: selectedFloor && selectedFloor.id === floor.id }"
              @click="selectFloor(floor)"
            >
              <div class="item-content">
                <h4>{{ floor.name }}</h4>
                <p class="item-meta">ID: {{ floor.id }}</p>
                <p class="item-meta">Shelve: {{ selectedShelve.name }}</p>
                <div class="item-actions">
                  <button @click.stop="editFloor(floor)" class="edit-btn">Edit</button>
                  <button @click.stop="deleteFloor(floor)" class="delete-btn">Delete</button>
                </div>
              </div>
            </div>
          </div>
          <button @click="prevFloor" class="slider-nav prev" :disabled="floorSliderOffset === 0">‹</button>
          <button @click="nextFloor" class="slider-nav next" :disabled="!canScrollFloorsNext">›</button>
        </div>
      </div>
    </div>

    <!-- Items Level -->
    <div v-if="selectedFloor" class="level-container">
      <h3>Items in {{ selectedFloor.name }}</h3>
      <div v-if="loadingItems" class="loading">Loading items...</div>
      <div v-else-if="items.length === 0" class="empty-state">
        No items found in this floor.
      </div>
      <div v-else class="slider-container">
        <div class="slider-wrapper">
          <div class="slider-content" :style="{ transform: `translateX(-${itemSliderOffset}px)` }">
            <div 
              v-for="item in items" 
              :key="item.id"
              class="slider-item item-item"
            >
              <div class="item-content">
                <h4>{{ item.name }}</h4>
                <div class="color-indicator" :style="{ backgroundColor: item.color }"></div>
                <p class="item-meta">ID: {{ item.id }}</p>
                <p class="item-meta">Floor: {{ selectedFloor.name }}</p>
                <div class="item-actions">
                  <button @click.stop="editItem(item)" class="edit-btn">Edit</button>
                  <button @click.stop="deleteItem(item)" class="delete-btn">Delete</button>
                </div>
              </div>
            </div>
          </div>
          <button @click="prevItem" class="slider-nav prev" :disabled="itemSliderOffset === 0">‹</button>
          <button @click="nextItem" class="slider-nav next" :disabled="!canScrollItemsNext">›</button>
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
          <div class="modal-actions">
            <button type="submit" class="confirm-btn">Save Changes</button>
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
          <div class="modal-actions">
            <button type="submit" class="confirm-btn">Create</button>
            <button type="button" @click="cancelCreate" class="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Create Buttons -->
    <div class="create-buttons">
      <button @click="openCreateModal('shelve')" class="create-btn">+ Add Shelve</button>
      <button v-if="selectedShelve" @click="openCreateModal('floor')" class="create-btn">+ Add Floor</button>
      <button v-if="selectedFloor" @click="openCreateModal('item')" class="create-btn">+ Add Item</button>
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

// Create modal
const showCreateModal = ref(false)
const createType = ref('')
const createForm = ref({})

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
  showEditModal.value = true
}

const editFloor = (floor) => {
  itemToEdit.value = floor
  editType.value = 'floor'
  editForm.value = { name: floor.name }
  showEditModal.value = true
}

const editItem = (item) => {
  itemToEdit.value = item
  editType.value = 'item'
  editForm.value = { name: item.name, color: item.color }
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
        if (selectedShelve.value?.id === itemToDelete.value.id) {
          resetToShelves()
        }
      } else if (deleteType.value === 'floor') {
        await fetchFloors(selectedShelve.value.id)
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
      method: 'PUT',
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
    }
  } catch (error) {
    console.error('Error updating item:', error)
  }

  cancelEdit()
}

const cancelEdit = () => {
  showEditModal.value = false
  itemToEdit.value = null
  editType.value = ''
  editForm.value = {}
}

// Create modal functions
const openCreateModal = (type) => {
  createType.value = type
  createForm.value = type === 'item' ? { name: '', color: '#000000' } : { name: '' }
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
    }
  } catch (error) {
    console.error('Error creating item:', error)
  }

  cancelCreate()
}

const cancelCreate = () => {
  showCreateModal.value = false
  createType.value = ''
  createForm.value = {}
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
  if (newParams.shelveId && !floors.value.some(f => f.shelfId == newParams.shelveId)) {
    fetchFloors(parseInt(newParams.shelveId))
  }
  if (newParams.floorId && !items.value.some(i => i.floorId == newParams.floorId)) {
    fetchItems(parseInt(newParams.floorId))
  }
}, { immediate: true })
</script>

<style scoped>
.hierarchical-slider {
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

.level-container {
  padding: 20px;
}

.level-container h3 {
  margin: 0 0 20px 0;
  color: #2c3e50;
}

.slider-container {
  position: relative;
}

.slider-wrapper {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 200px;
}

.slider-content {
display: flex;
  flex-direction: row;
  transition: transform 0.3s ease;
  gap: 20px;
}

.slider-item {
  min-height: 150px;
  min-width: 250px;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
  flex-shrink: 0;
}

.slider-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.slider-item.selected {
  border: 2px solid #007bff;
  background: #e3f2fd;
}

.shelve-item {
  border-left: 4px solid #3498db;
}

.floor-item {
  border-left: 4px solid #27ae60;
}

.item-item {
  border-left: 4px solid #e74c3c;
}

.item-content h4 {
  margin: 0 0 10px 0;
  color: #2c3e50;
}

.item-meta {
  font-size: 12px;
  color: #6c757d;
  margin: 5px 0;
}

.color-indicator {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin: 10px 0;
  border: 2px solid #ddd;
}

.item-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.edit-btn {
  background: #f39c12;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.3s;
}

.edit-btn:hover {
  background: #e67e22;
}

.delete-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.3s;
}

.delete-btn:hover {
  background: #c0392b;
}

.slider-nav {
  position: absolute;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  transition: background 0.3s;
  z-index: 10;
}

.slider-nav:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.7);
}

.slider-nav:disabled {
  background: rgba(0, 0, 0, 0.2);
  cursor: not-allowed;
}

.slider-nav.prev {
  top: 50%;
  left: -20px;
  transform: translateY(-50%);
}

.slider-nav.next {
  top: 50%;
  right: -20px;
  transform: translateY(-50%);
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
  font-style: italic;
}

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
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
}

.modal h3 {
  margin-top: 0;
  color: #2c3e50;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

.confirm-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.confirm-btn:hover {
  background: #c0392b;
}

.cancel-btn {
  background: #95a5a6;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn:hover {
  background: #7f8c8d;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #2c3e50;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input:focus {
  outline: none;
  border-color: #007bff;
}

.create-buttons {
  display: flex;
  gap: 15px;
  padding: 20px;
  justify-content: center;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
}

.create-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.create-btn:hover {
  background: #218838;
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
  border: 1px solid #f5c6cb;
  font-size: 14px;
}

.confirm-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.confirm-btn:disabled:hover {
  background: #6c757d;
}

.cascade-warning {
  background: #fff3cd;
  color: #856404;
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
  border: 1px solid #ffeaa7;
  font-size: 14px;
}
</style>
