<template>
  <div class="update-shelve">
    <h2>Update Shelve</h2>
    <div v-if="loadingItem" class="loading">Loading shelve data...</div>
    <div v-else-if="loadError" class="error">{{ loadError }}</div>
    <form v-else @submit.prevent="updateShelve" class="form">
      <div class="form-group">
        <label for="shelve-name">Name:</label>
        <input
          id="shelve-name"
          v-model="shelveData.name"
          type="text"
          required
          placeholder="Enter shelve name"
        />
      </div>
      <div class="form-actions">
        <button type="submit" :disabled="loading" class="submit-btn">
          {{ loading ? 'Updating...' : 'Update Shelve' }}
        </button>
        <router-link to="/create" class="cancel-btn">Cancel</router-link>
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
  message: true,
  success: isSuccess.value,
  error: !isSuccess.value
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

<style scoped>
.update-shelve {
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
  margin-bottom: 20px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

label {
  font-weight: 500;
  color: #555;
}

input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.form-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.submit-btn {
  background: #f39c12;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.submit-btn:hover:not(:disabled) {
  background: #e67e22;
}

.submit-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.cancel-btn {
  background: #95a5a6;
  color: white;
  text-decoration: none;
  padding: 12px 20px;
  border-radius: 4px;
  font-size: 14px;
  transition: background 0.3s;
}

.cancel-btn:hover {
  background: #7f8c8d;
}

.message {
  margin-top: 15px;
  padding: 10px;
  border-radius: 4px;
  font-size: 14px;
}

.message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style>
