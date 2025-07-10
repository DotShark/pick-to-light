<template>
  <div class="bg-white rounded overflow-hidden shadow-lg">
    <!-- Navigation breadcrumb -->
    <div class="flex items-center p-4 bg-gray-100 border-b border-gray-200">
      <button
        class="border-none text-gray-600 cursor-pointer text-sm px-2 py-1 rounded transition-all duration-300 hover:bg-gray-200 hover:text-gray-700"
        :class="{ 'bg-blue-500 text-white': currentStep === 'shelves' }"
        @click="goToShelves"
      >
        Shelves
      </button>
      <span v-if="selectedShelve" class="mx-2 text-gray-600">></span>
      <button
        v-if="selectedShelve"
        class="border-none text-gray-600 cursor-pointer text-sm px-2 py-1 rounded transition-all duration-300 hover:bg-gray-200 hover:text-gray-700"
        :class="{ 'bg-blue-500 text-white': currentStep === 'floors' }"
        @click="goToFloors"
      >
        {{ selectedShelve.name }}
      </button>
      <span v-if="selectedFloor" class="mx-2 text-gray-600">></span>
      <button
        v-if="selectedFloor"
        class="border-none text-gray-600 cursor-pointer text-sm px-2 py-1 rounded transition-all duration-300 hover:bg-gray-200 hover:text-gray-700"
        :class="{ 'bg-blue-500 text-white': currentStep === 'items' }"
        @click="goToItems"
      >
        {{ selectedFloor.name }}
      </button>
    </div>

    <!-- Shelves Selection -->
    <div v-if="currentStep === 'shelves'" class="m-5 border border-gray-200 rounded bg-white">
      <div class="p-5 bg-gray-100 border-b border-gray-200">
        <h3 class="m-0 text-slate-700">Select a Shelf</h3>
      </div>
      <div class="p-5">
        <div v-if="shelves.length === 0" class="text-center text-gray-600 p-10">
          <p class="mb-4 italic">No shelves found. Create your first shelve to get started.</p>
          <button
            @click="goToManage"
            class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer font-medium"
          >
            Go to Management
          </button>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="shelf in shelves" :key="shelf.id"
               class="border border-gray-200 rounded p-4 hover:shadow-md transition-shadow cursor-pointer"
               @click="selectShelf(shelf)">
            <h4 class="font-medium text-gray-800">{{ shelf.name }}</h4>
            <p class="text-sm text-gray-600">ID: {{ shelf.id }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Floors Selection -->
    <div v-if="currentStep === 'floors'" class="m-5 border border-gray-200 rounded bg-white">
      <div class="p-5 bg-gray-100 border-b border-gray-200">
        <h3 class="m-0 text-slate-700">Select a Floor in {{ selectedShelve.name }}</h3>
      </div>
      <div class="p-5">
        <div v-if="loadingFloors" class="text-center p-10 text-gray-600">
          Loading floors...
        </div>
        <div v-else-if="floors.length === 0" class="text-center text-gray-600 p-10">
          <p class="mb-4 italic">No floors found in this shelf.</p>
          <button
            @click="goToManage"
            class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer font-medium"
          >
            Go to Management
          </button>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="floor in floors" :key="floor.id"
               class="border border-gray-200 rounded p-4 hover:shadow-md transition-shadow cursor-pointer"
               @click="selectFloor(floor)">
            <h4 class="font-medium text-gray-800">{{ floor.name }}</h4>
            <p class="text-sm text-gray-600">ID: {{ floor.id }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Items Selection -->
    <div v-if="currentStep === 'items'" class="m-5 border border-gray-200 rounded bg-white">
      <div class="p-5 bg-gray-100 border-b border-gray-200">
        <h3 class="m-0 text-slate-700">Select Items in {{ selectedFloor.name }}</h3>
      </div>
      <div class="p-5">
        <div v-if="loadingItems" class="text-center p-10 text-gray-600">
          Loading items...
        </div>
        <div v-else-if="items.length === 0" class="text-center text-gray-600 p-10">
          <p class="mb-4 italic">No items found in this floor.</p>
          <button
            @click="goToManage"
            class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer font-medium"
          >
            Go to Management
          </button>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="item in items" :key="item.id"
               class="border border-gray-200 rounded p-4 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-3">
                <div class="w-5 h-5 rounded-full border border-gray-300" :style="{ backgroundColor: item.color }"></div>
                <div>
                  <h4 class="font-medium text-gray-800">{{ item.name }}</h4>
                  <p class="text-sm text-gray-600">Slot: {{ item.slot }}</p>
                </div>
              </div>
            </div>
            <div class="mt-3">
              <button
                v-if="item.color === '#000000'"
                @click="activateItem(item)"
                class="cursor-pointer w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                :disabled="updatingItem === item.id"
              >
                {{ updatingItem === item.id ? 'Finding...' : 'Find' }}
              </button>
              <button
                v-else
                @click="deactivateItem(item)"
                class="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                :disabled="updatingItem === item.id"
              >
                {{ updatingItem === item.id ? 'Stopping...' : 'Stop' }}
              </button>

              <!-- Slot Selection -->
              <div class="mt-4 p-3 bg-gray-50 rounded border border-gray-200">
                <label class="block text-sm font-medium text-gray-700 mb-2">Slot Selection (0-10):</label>
                <div class="flex items-center gap-2 mb-2">
                  <input
                    type="range"
                    :id="`slot-${item.id}`"
                    v-model="slotSelections[item.id]"
                    min="0"
                    max="10"
                    class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <span class="text-sm font-medium text-gray-700 min-w-[3rem] text-center">{{ slotSelections[item.id] || 0 }}</span>
                </div>
                <button
                  @click="updateItemSlot(item)"
                  class="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm cursor-pointer"
                  :disabled="updatingItem === item.id"
                >
                  {{ updatingItem === item.id ? 'Updating...' : 'Update Slot' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchFromApi } from '@/utils/api'

const router = useRouter()

const currentStep = ref('shelves')
const selectedShelve = ref(null)
const selectedFloor = ref(null)

const shelves = ref([])
const floors = ref([])
const items = ref([])

const loadingFloors = ref(false)
const loadingItems = ref(false)
const updatingItem = ref(null)
const slotSelections = ref({})

async function fetchShelves() {
  try {
    shelves.value = await fetchFromApi('shelves')
  } catch (error) {
    console.error('Error fetching shelves:', error)
  }
}

async function fetchFloors(shelfId) {
  loadingFloors.value = true
  try {
    const allFloors = await fetchFromApi('floors')
    floors.value = allFloors.filter(floor =>
      floor.shelfId === parseInt(shelfId) ||
      floor.shelf_id === parseInt(shelfId)
    )
  } catch (error) {
    console.error('Error fetching floors:', error)
  } finally {
    loadingFloors.value = false
  }
}

async function fetchItems(floorId) {
  loadingItems.value = true
  try {
    const allItems = await fetchFromApi('items')
    items.value = allItems.filter(item =>
      item.floorId === parseInt(floorId) ||
      item.floor_id === parseInt(floorId)
    )

    items.value.forEach(item => {
      slotSelections.value[item.id] = item.slot || 0
    })
  } catch (error) {
    console.error('Error fetching items:', error)
  } finally {
    loadingItems.value = false
  }
}

function selectShelf(shelf) {
  selectedShelve.value = shelf
  currentStep.value = 'floors'
  fetchFloors(shelf.id)
}

function selectFloor(floor) {
  selectedFloor.value = floor
  currentStep.value = 'items'
  fetchItems(floor.id)
}

function goToShelves() {
  currentStep.value = 'shelves'
  selectedShelve.value = null
  selectedFloor.value = null
  floors.value = []
  items.value = []
}

function goToFloors() {
  currentStep.value = 'floors'
  selectedFloor.value = null
  items.value = []
}

function goToItems() {
  currentStep.value = 'items'
}

function goToManage() {
  router.push('/manage')
}

async function activateItem(item) {
  updatingItem.value = item.id
  try {
    await fetchFromApi(`items/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ color: '#008000' })
    })
    const idx = items.value.findIndex(i => i.id === item.id)
    if (idx !== -1) items.value[idx].color = '#008000'
  } catch (error) {
    console.error('Error activating item:', error)
  } finally {
    updatingItem.value = null
  }
}

async function deactivateItem(item) {
  updatingItem.value = item.id
  try {
    await fetchFromApi(`items/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ color: '#000000' })
    })
    const idx = items.value.findIndex(i => i.id === item.id)
    if (idx !== -1) items.value[idx].color = '#000000'
  } catch (error) {
    console.error('Error deactivating item:', error)
  } finally {
    updatingItem.value = null
  }
}

async function updateItemSlot(item) {
  updatingItem.value = item.id
  try {
    const selectedSlot = slotSelections.value[item.id] || 0
    await fetchFromApi(`items/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: item.name,
        color: item.color,
        floorId: item.floorId || item.floor_id,
        slot: selectedSlot
      })
    })
    // Update the item in the local state
    const idx = items.value.findIndex(i => i.id === item.id)
    if (idx !== -1) {
      items.value[idx].slot = selectedSlot
    }
  } catch (error) {
    console.error('Error updating item slot:', error)
  } finally {
    updatingItem.value = null
  }
}

onMounted(() => {
  fetchShelves()
})

defineExpose({
  navigateToItem: (item) => {
    console.log('Navigate to item:', item)
  }
})
</script>
