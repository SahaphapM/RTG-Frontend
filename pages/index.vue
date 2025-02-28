<template>
  <div class="flex flex-col items-center justify-center">
    <img
      src="/image/microtecnology-logo.png"
      class="w-[50%] mx-auto mb-4"
      alt="image"
    />

    <div class="flex flex-col w-full max-w-lg">
      <div class="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
        <h1 class="text-2xl font-bold text-center mb-8">Login</h1>
        <form
          @submit.prevent="handleLogin"
          class="flex flex-col items-center gap-1"
        >
          <input
            v-model="email"
            placeholder="Email"
            class="w-full p-2 border rounded-md mb-2"
            required
          />
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            class="w-full p-2 border rounded-md mb-2"
            required
          />
          <button
            type="submit"
            class="w-32 bg-primary font-semibold mt-4 text-white p-2 rounded-md"
          >
            Login
          </button>
        </form>
      </div>
    </div>
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

  if (authStore.isAuthenticated) {
    // ✅ Redirect to dashboard page after successful login
    if (authStore.user?.role === "admin") {
      navigateTo("/projects");
    } else if (authStore.user?.role === "user") {
      navigateTo("/purchase-orders");
    }
  }
};

definePageMeta({
  layout: "auth", // ✅ Use "auth" layout for the login page
});
</script>
