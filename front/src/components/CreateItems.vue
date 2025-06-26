<template>
  <div class="create-items">
    <h2>Create Item</h2>
    <form @submit.prevent="createItem" class="form">
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
          v-model="itemData.floor_id"
          required
        >
          <option value="" disabled>Select a floor</option>
          <option 
            v-for="floor in props.floors" 
            :key="floor.id" 
            :value="floor.id"
          >
            {{ floor.name }} (ID: {{ floor.id }})
          </option>
        </select>
        <div v-if="props.floorsLoading" class="loading-text">Loading floors...</div>
        <div v-if="props.floorsError" class="error-text">{{ props.floorsError }}</div>
      </div>
      <button type="submit" :disabled="loading || props.floorsLoading" class="submit-btn">
        {{ loading ? 'Creating...' : 'Create Item' }}
      </button>
    </form>
    <div v-if="message" :class="messageClass">{{ message }}</div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const emit = defineEmits(['item-created'])

// Receive floors data from parent
const props = defineProps({
  floors: {
    type: Array,
    default: () => []
  },
  floorsLoading: {
    type: Boolean,
    default: false
  },
  floorsError: {
    type: String,
    default: ''
  }
})

const itemData = reactive({
  name: '',
  color: '#FF5733', // Default color
  floor_id: ''
})

const loading = ref(false)
const message = ref('')
const isSuccess = ref(false)

const messageClass = computed(() => ({
  message: true,
  success: isSuccess.value,
  error: !isSuccess.value
}))

const createItem = async () => {
  if (!itemData.name.trim() || !itemData.color.trim() || !itemData.floor_id) return

  loading.value = true
  message.value = ''

  // Ensure floorId is a number
  const payload = {
    name: itemData.name,
    color: itemData.color,
    floorId: Number(itemData.floor_id)
  }

  console.log('Sending payload:', payload)

  try {
    const response = await fetch('http://localhost:3333/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })

    if (response.ok) {
      message.value = 'Item created successfully!'
      isSuccess.value = true
      itemData.name = '' // Reset form
      itemData.color = '#FF5733' // Reset to default color
      itemData.floor_id = ''
      
      // Emit event to notify parent component
      emit('item-created')
    } else {
      const errorData = await response.text()
      console.error('Server response:', errorData)
      throw new Error(`HTTP error! status: ${response.status} - ${errorData}`)
    }
  } catch (error) {
    message.value = `Error creating item: ${error.message}`
    isSuccess.value = false
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.create-items {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #2c3e50;
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
  background: white;
}

input:focus, select:focus {
  outline: none;
  border-color: #e74c3c;
  box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.2);
}

select {
  cursor: pointer;
}

.loading-text {
  font-size: 12px;
  color: #666;
  font-style: italic;
}

.error-text {
  font-size: 12px;
  color: #e74c3c;
}

.input-help {
  font-size: 11px;
  color: #666;
  margin-top: 2px;
  font-style: italic;
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

.submit-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.submit-btn:hover:not(:disabled) {
  background: #c0392b;
}

.submit-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
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