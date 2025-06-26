<template>
  <div class="create-floors">
    <h2>Create Floor</h2>
    <form @submit.prevent="createFloor" class="form">
      <div class="form-group">
        <label for="floor-name">Name:</label>
        <input
          id="floor-name"
          v-model="floorData.name"
          type="text"
          required
          placeholder="Enter floor name"
        />
      </div>
      <div class="form-group">
        <label for="shelf-id">Shelf ID:</label>
        <input
          id="shelf-id"
          v-model.number="floorData.shelf_id"
          type="number"
          required
          placeholder="Enter shelf ID"
        />
      </div>
      <button type="submit" :disabled="loading" class="submit-btn">
        {{ loading ? 'Creating...' : 'Create Floor' }}
      </button>
    </form>
    <div v-if="message" :class="messageClass">{{ message }}</div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const floorData = reactive({
  name: '',
  shelf_id: ''
})

const loading = ref(false)
const message = ref('')
const isSuccess = ref(false)

const messageClass = computed(() => ({
  message: true,
  success: isSuccess.value,
  error: !isSuccess.value
}))

const createFloor = async () => {
  if (!floorData.name.trim() || !floorData.shelf_id) return

  loading.value = true
  message.value = ''

  try {
    const response = await fetch('http://localhost:3333/floors/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: floorData.name,
        shelfId: floorData.shelf_id
      })
    })

    if (response.ok) {
      message.value = 'Floor created successfully!'
      isSuccess.value = true
      floorData.name = '' // Reset form
      floorData.shelf_id = ''
    } else {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
  } catch (error) {
    message.value = `Error creating floor: ${error.message}`
    isSuccess.value = false
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.create-floors {
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
  border-color: #27ae60;
  box-shadow: 0 0 0 2px rgba(39, 174, 96, 0.2);
}

.submit-btn {
  background: #27ae60;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.submit-btn:hover:not(:disabled) {
  background: #229954;
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