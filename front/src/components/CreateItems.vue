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
        <input
          id="item-color"
          v-model="itemData.color"
          type="text"
          required
          placeholder="Enter item color"
        />
      </div>
      <div class="form-group">
        <label for="floor-id">Floor ID:</label>
        <input
          id="floor-id"
          v-model.number="itemData.floor_id"
          type="number"
          required
          placeholder="Enter floor ID"
        />
      </div>
      <button type="submit" :disabled="loading" class="submit-btn">
        {{ loading ? 'Creating...' : 'Create Item' }}
      </button>
    </form>
    <div v-if="message" :class="messageClass">{{ message }}</div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const itemData = reactive({
  name: '',
  color: '',
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

  try {
    const response = await fetch('http://localhost:3333/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: itemData.name,
        color: itemData.color,
        floorId: itemData.floor_id
      })
    })

    if (response.ok) {
      message.value = 'Item created successfully!'
      isSuccess.value = true
      itemData.name = '' // Reset form
      itemData.color = ''
      itemData.floor_id = ''
    } else {
      throw new Error(`HTTP error! status: ${response.status}`)
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

input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

input:focus {
  outline: none;
  border-color: #e74c3c;
  box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.2);
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