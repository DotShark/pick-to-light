<script setup lang="ts">

</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <img src="@images/logoPickToLightText.svg" alt="Logo PickToLight" />
  </div>


  <form class="w-full max-w-md">
    <div class="flex flex-col gap-2 w-full">
      <label for="email">Email</label>
      <input class="bg-gray rounded-lg p-3 w-full focus:outline-none" type="email" id="email" />

      <label for="password">Password</label>
      <input class="bg-gray rounded-lg p-3 w-full focus:outline-none" type="password" id="password" />

      <button class="bg-blue text-white rounded-lg p-3 w-full cursor-pointer" type="submit">Login</button>
    </div>
    
  </form>
  <div class="flex flex-col items-center w-full max-w-md">
    <button class="bg-green text-white rounded-lg p-3 size-fit self-end ">Admin</button>
  </div>

</template>
