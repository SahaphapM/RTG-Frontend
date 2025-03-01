<script setup lang="ts">
import { NuxtLayout } from "#components";

const authStore = useAuthStore();

onMounted(async () => {
  // ✅ Ensure authentication finishes before the app starts
  nextTick(async () => {
    await authStore.initAuth();
    if (!authStore.isAuthenticated) {
      console.log("User is not authenticated, redirecting to login.");
      console.log("value : ", authStore.isAuthenticated);
    }
  });
});
</script>

<template>
  <NuxtLoadingIndicator color="#3b82f6" />
  <NuxtLayout> <NuxtPage /></NuxtLayout>
</template>
