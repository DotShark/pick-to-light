<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
    router.push('/create')
})
</script>

<template>
  <div class="about">
    <h1>This is the home page</h1>
  </div>
</template>
