<template>
  <div class="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
    <h1 class="text-2xl font-bold text-center">Login</h1>
    <form @submit.prevent="handleLogin">
      <input
        v-model="email"
        placeholder="Email"
        class="w-full p-2 border rounded mb-2"
        required
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="w-full p-2 border rounded mb-2"
        required
      />
      <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded">
        Login
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();
const email = ref("");
const password = ref("");

const handleLogin = async () => {
  await authStore.login(email.value, password.value);
};

definePageMeta({
  layout: "auth", // ✅ Use "auth" layout for the login page
});
</script>
