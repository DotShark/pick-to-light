<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import TheWelcome from '@components/TheWelcome.vue'

const router = useRouter()

onMounted(() => {
    router.push('/create')
})
</script>

<template>
  <main>
    <TheWelcome />
  </main>
</template>
