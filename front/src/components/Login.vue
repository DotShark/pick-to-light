<script setup lang="ts">

</script>

<template>
  <div class="bg-white rounded shadow-lg overflow-hidden max-w-md w-full">
    <!-- Header -->
    <div class="p-6 bg-gray-100 border-b border-gray-200 text-center">
      <h2 class="text-xl font-bold text-slate-700">Connexion</h2>
    </div>

    <!-- Formulaire de connexion -->
    <form class="p-6">
      <div class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input 
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors" 
            type="email" 
            id="email" 
            placeholder="Votre email"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
          <input 
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors" 
            type="password" 
            id="password" 
            placeholder="Votre mot de passe"
          />
        </div>

        <router-link to="/select" class="block">
          <button class="w-full bg-blue text-white p-3 rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer">
            Se connecter
          </button>
        </router-link>
      </div>
    </form>

    <!-- Footer avec lien Admin -->
    <div class="p-4 bg-gray-50 border-t border-gray-200">
      <router-link to="/login-admin" class="block">
        <button class="w-full bg-green text-white p-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium cursor-pointer">
          Connexion Administrateur
        </button>
      </router-link>
    </div>
  </div>
</template>
