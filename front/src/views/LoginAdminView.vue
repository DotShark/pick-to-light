<script setup lang="ts">
import LoginAdmin from '@components/LoginAdmin.vue'
</script>

<template>
  <main class="h-dvh pt-16 flex items-center flex-col justify-between px-6 pb-6">
    <div class="flex flex-col items-center justify-center text-green font-black font-inter size-fit text-3xl gap-2">
      <h1>Connection</h1>
      <h1>Administrateur</h1>
    </div>

    <LoginAdmin />
  </main>
</template>
