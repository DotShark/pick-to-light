<template>
  <div class="update-item">
    <h2>Update Item</h2>
    <div v-if="loadingItem" class="loading">Loading item data...</div>
    <div v-else-if="loadError" class="error">{{ loadError }}</div>
    <form v-else @submit.prevent="updateItem" class="form">
      <div class="form-group">
        <label for="item-name">Name:</label>
        <input
          id="item-name"
          v-model="itemData.name"
          type="text"
          required
          placeholder="Enter item name"
        />
      </div>
      <div class="form-group">
        <label for="item-color">Color:</label>
        <div class="color-picker-wrapper">
          <input
            id="item-color"
            v-model="itemData.color"
            type="color"
            class="color-picker"
            required
          />
          <span class="color-value">{{ itemData.color }}</span>
        </div>
      </div>
      <div class="form-group">
        <label for="floor-select">Floor:</label>
        <select
          id="floor-select"
          v-model="itemData.floorId"
          required
        >
          <option value="" disabled>Select a floor</option>
          <option 
            v-for="floor in floors" 
            :key="floor.id" 
            :value="floor.id"
          >
            {{ floor.name }} (ID: {{ floor.id }})
          </option>
        </select>
      </div>
      <div class="form-actions">
        <button type="submit" :disabled="loading" class="submit-btn">
          {{ loading ? 'Updating...' : 'Update Item' }}
        </button>
        <router-link to="/manage" class="cancel-btn">Cancel</router-link>
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

const emit = defineEmits(['item-updated'])
const router = useRouter()

const itemData = reactive({
  name: '',
  color: '#FF5733',
  floorId: ''
})

const floors = ref([])
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

const fetchFloors = async () => {
  try {
    const response = await fetch('http://localhost:4000/floors')
    if (response.ok) {
      floors.value = await response.json()
    }
  } catch (error) {
    console.error('Error fetching floors:', error)
  }
}

const fetchItem = async () => {
  loadingItem.value = true
  loadError.value = ''
  
  try {
    const response = await fetch(`http://localhost:4000/items/${props.id}`)
    if (response.ok) {
      const item = await response.json()
      itemData.name = item.name
      itemData.color = item.color
      itemData.floorId = item.floorId
    } else {
      throw new Error(`Failed to fetch item: ${response.status}`)
    }
  } catch (error) {
    loadError.value = `Error loading item: ${error.message}`
  } finally {
    loadingItem.value = false
  }
}

const updateItem = async () => {
  if (!itemData.name.trim() || !itemData.color.trim() || !itemData.floorId) return

  loading.value = true
  message.value = ''

  try {
    const response = await fetch(`http://localhost:4000/items/${props.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: itemData.name,
        color: itemData.color,
        floorId: Number(itemData.floorId)
      })
    })

    if (response.ok) {
      message.value = 'Item updated successfully!'
      isSuccess.value = true
      
      emit('item-updated')
      
      setTimeout(() => {
        router.push('/manage')
      }, 2000)
    } else {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
  } catch (error) {
    message.value = `Error updating item: ${error.message}`
    isSuccess.value = false
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchFloors()
  fetchItem()
})
</script>

<style scoped>
.update-item {
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

input, select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

input:focus, select:focus {
  outline: none;
  border-color: #e74c3c;
  box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.2);
}

.color-picker-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.color-picker {
  width: 50px;
  height: 40px;
  border: 2px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  background: none;
  padding: 0;
  transition: border-color 0.2s ease;
}

.color-picker::-webkit-color-swatch-wrapper {
  padding: 0;
  border-radius: 6px;
  overflow: hidden;
}

.color-picker::-webkit-color-swatch {
  border: none;
  border-radius: 6px;
}

.color-picker::-moz-color-swatch {
  border: none;
  border-radius: 6px;
}

.color-picker:hover {
  border-color: #999;
}

.color-picker:focus {
  outline: none;
  border-color: #e74c3c;
  box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.2);
}

.color-value {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  color: #666;
  background: #f8f9fa;
  padding: 4px 8px;
  border-radius: 4px;
  letter-spacing: 0.5px;
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
