<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import TheWelcome from '@components/TheWelcome.vue'

const router = useRouter()

onMounted(() => {
  const token = localStorage.getItem('token')
  if (!token) {
    router.push('/login')
  }
})
</script>

<template>
  <main>
    <TheWelcome />
  </main>
</template>
