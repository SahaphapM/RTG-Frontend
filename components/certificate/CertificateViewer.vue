<template>
  <div v-if="pdfUrl" class="w-full">
    <!-- Use `object` for better PDF scaling -->
    <!-- <object
      :data="pdfUrl"
      type="application/pdf"
      class="w-full h-[600px] border rounded-lg"
    >
      <p class="text-center text-red-500">
        Your browser does not support PDFs.
      </p>
      <a :href="pdfUrl" target="_blank" class="text-blue-600 underline"
        >Download PDF</a
      >
    </object> -->
    <embed
      :src="pdfUrl"
      type="application/pdf"
      class="w-full min-h-[700px] border rounded-lg"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const prop = defineProps<{ previewUrl: string }>();
const pdfUrl = ref<string | null>(null);

watch(
  () => prop.previewUrl,
  async (newFileName) => {
    if (newFileName) {
      pdfUrl.value = newFileName;
    } else {
      pdfUrl.value = null;
    }
  },
  { immediate: true }
);
</script>
