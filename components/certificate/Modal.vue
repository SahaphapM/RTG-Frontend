<template>
  <div
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 z-50"
  >
    <!-- Modal Content -->
    <div
      class="bg-white p-6 rounded-lg w-1/3 shadow-lg scale-95 transition-transform duration-300 ease-in-out"
    >
      <h2 class="text-xl font-bold mb-4">
        {{ certificate ? "Edit Certificate" : "Add Certificate" }}
      </h2>
      <form @submit.prevent="save">
        <!-- Certificate Name -->
        <input
          v-model="form.name"
          type="text"
          placeholder="Certificate Name"
          class="input input-bordered w-full mb-2"
          required
        />

        <!-- Description -->
        <textarea
          v-model="form.description"
          placeholder="Description"
          class="textarea textarea-bordered textarea-md w-full"
          required
        ></textarea>

        <!-- File Upload -->
        <div class="mt-2">
          <label class="block font-semibold mb-1">Upload File</label>
          <input
            type="file"
            accept=".pdf"
            class="file-input file-input-bordered w-full"
            @change="handleFileUpload"
          />
          <p v-if="form.fileName" class="text-sm text-gray-500 mt-1">
            Uploaded: {{ form.fileName }}
          </p>
        </div>

        <!-- Buttons -->
        <div class="flex justify-end mt-4">
          <button
            @click="$emit('close')"
            type="button"
            class="btn btn-error mr-2 px-8"
          >
            Cancel
          </button>
          <button type="submit" class="btn btn-success px-10">Save</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from "vue";
import type { Certificate } from "~/types/certificate";

const props = defineProps<{ certificate?: Certificate | null }>();
const emit = defineEmits(["save", "close"]);

const form = ref({
  name: "",
  description: "",
  file: null as File | null,
  fileName: "",
});

// Watch for prop changes
watch(
  () => props.certificate,
  (certificate) => {
    form.value = certificate
      ? {
          name: certificate.name,
          description: certificate.description,
          file: null,
          fileName: certificate.file || "",
        }
      : { name: "", description: "", file: null, fileName: "" };
  },
  { immediate: true }
);

// Handle file upload
const handleFileUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    form.value.file = file;
    form.value.fileName = file.name;
  }
};

// Save certificate
const save = () => {
  emit("save", form.value);
};
</script>
