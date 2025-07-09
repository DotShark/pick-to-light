<script setup lang="ts">

</script>

<template>
  <div class="bg-white rounded shadow-lg overflow-hidden max-w-md w-full">
    <!-- Header avec titre admin -->
    <div class="p-6 bg-gray-100 border-b border-gray-200 text-center">
      <h2 class="text-xl font-bold text-slate-700">Connexion Administrateur</h2>
    </div>

    <!-- Formulaire de connexion admin -->
    <form class="p-6">
      <div class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email Administrateur</label>
          <input
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
            type="email"
            id="email"
            placeholder="Email administrateur"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
          <input
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
            type="password"
            id="password"
            placeholder="Mot de passe administrateur"
          />
        </div>

        <router-link to="/select" class="block">
          <button class="w-full bg-green text-white p-3 rounded-lg hover:bg-green-700 transition-colors font-medium cursor-pointer">
            Se connecter
          </button>
        </router-link>
      </div>
    </form>

    <!-- Footer avec bouton retour -->
    <div class="p-4 bg-gray-50 border-t border-gray-200">
      <router-link to="/login" class="block">
        <button class="w-full bg-gray-600 text-white p-2 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium flex items-center justify-center gap-2 cursor-pointer">
          <img src="@images/back.svg" alt="Retour" class="w-4 h-4" />
          Retour à la connexion
        </button>
      </router-link>
    </div>
  </div>
</template>
