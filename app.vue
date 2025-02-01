<script setup lang="ts">
import { NuxtLayout } from "#components";

definePageMeta({
  middleware: "auth",
});
</script>

<template>
  <NuxtLoadingIndicator color="#3b82f6" />
  <NuxtLayout> <NuxtPage /></NuxtLayout>
</template>
