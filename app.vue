<script setup lang="ts">
import { NuxtLayout } from "#components";

const authStore = useAuthStore();

onMounted(async () => {
  nextTick(async () => {
    await authStore.initAuth();
  });
}); // ✅ Ensure user is authenticated before rendering

definePageMeta({
  middleware: "auth-role",
});
</script>

<template>
  <NuxtLoadingIndicator color="#3b82f6" />
  <NuxtLayout> <NuxtPage /></NuxtLayout>
</template>
