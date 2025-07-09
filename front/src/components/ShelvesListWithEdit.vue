<template>
  <div class="shelves-list">
    <h2>Existing Shelves</h2>
    <div v-if="loading" class="loading">Loading shelves...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="shelves.length === 0" class="empty-state">
      No shelves found. Create your first shelve!
    </div>
    <div v-else class="shelves-grid">
      <div 
        v-for="shelve in shelves" 
        :key="shelve.id"
        class="shelve-card"
      >
        <div class="shelve-info">
          <h3>{{ shelve.name }}</h3>
          <p class="shelve-meta">
            ID: {{ shelve.id }} | 
            Created: {{ formatDate(shelve.createdAt) }}
          </p>
        </div>
        <div class="shelve-actions">
          <router-link 
            :to="`/create/shelve/${shelve.id}`"
            class="edit-btn"
          >
            Edit
          </router-link>
          <button 
            @click="deleteConfirm(shelve)"
            class="delete-btn"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="modal-overlay" @click="cancelDelete">
      <div class="modal" @click.stop>
        <h3>Confirm Delete</h3>
        <p>Are you sure you want to delete "{{ shelveToDelete?.name }}"?</p>
        <div class="modal-actions">
          <button @click="confirmDelete" class="confirm-btn">Yes, Delete</button>
          <button @click="cancelDelete" class="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

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

const confirmDelete = async () => {
  if (!shelveToDelete.value) return
  
  try {
    const response = await fetch(`http://localhost:4000/shelves/${shelveToDelete.value.id}`, {
      method: 'DELETE',
    })
    
    if (response.ok) {
      emit('refresh')
      showDeleteConfirm.value = false
      shelveToDelete.value = null
    } else {
      throw new Error(`Failed to delete: ${response.status}`)
    }
  } catch (error) {
    console.error('Error deleting shelve:', error)
    alert(`Error deleting shelve: ${error.message}`)
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}
</script>

<style scoped>
.shelves-list {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #2c3e50;
  margin-bottom: 20px;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #666;
}

.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  padding: 10px;
  border-radius: 4px;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
  font-style: italic;
}

.shelves-grid {
  display: grid;
  gap: 15px;
}

.shelve-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 1px solid #e1e8ed;
  border-radius: 6px;
  transition: border-color 0.2s;
}

.shelve-card:hover {
  border-color: #3498db;
}

.shelve-info h3 {
  margin: 0 0 5px 0;
  color: #2c3e50;
  font-size: 16px;
}

.shelve-meta {
  margin: 0;
  font-size: 12px;
  color: #666;
}

.shelve-actions {
  display: flex;
  gap: 10px;
}

.edit-btn {
  background: #f39c12;
  color: white;
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  transition: background 0.3s;
}

.edit-btn:hover {
  background: #e67e22;
}

.delete-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.3s;
}

.delete-btn:hover {
  background: #c0392b;
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
</style>
