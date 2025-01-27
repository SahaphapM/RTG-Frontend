<template>
  <div
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
  >
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
      <!-- ✅ Make modal wider -->
      <h2 class="text-2xl font-bold mb-4">
        {{ project ? "Edit Project" : "Add Project" }}
      </h2>

      <!-- Form -->
      <form @submit.prevent="save">
        <div class="grid grid-cols-2 gap-4">
          <!-- ✅ Use grid for better spacing -->
          <input
            v-model="form.name"
            type="text"
            placeholder="Project Name"
            class="input input-bordered w-full"
            required
          />
          <input
            v-model="form.number"
            type="text"
            placeholder="Project Number"
            class="input input-bordered w-full"
            required
          />
        </div>
        <textarea
          v-model="form.description"
          placeholder="Project Description"
          class="textarea textarea-bordered w-full mt-4"
        ></textarea>

        <div class="grid grid-cols-2 gap-4 mt-4">
          <input
            v-model="form.startDate"
            type="date"
            class="input input-bordered w-full"
          />
          <input
            v-model="form.endDate"
            type="date"
            class="input input-bordered w-full"
          />
        </div>

        <div class="grid grid-cols-2 gap-4 mt-4">
          <input
            v-model="form.discount"
            type="number"
            placeholder="Discount"
            class="input input-bordered w-full"
          />
          <input
            v-model="form.totalProjectPrice"
            type="number"
            placeholder="Total Price"
            class="input input-bordered w-full"
          />
        </div>

        <div class="flex justify-end mt-6">
          <button
            @click="$emit('close')"
            type="button"
            class="btn btn-secondary mr-2"
          >
            Cancel
          </button>
          <button type="submit" class="btn btn-success">Save</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from "vue";
import type { Project } from "~/types/project";

const props = defineProps<{ project?: Project | null }>();
const emit = defineEmits(["save", "close"]);

const form = ref({
  name: "",
  number: "",
  description: "",
  startDate: "",
  endDate: "",
  discount: 0,
  totalProjectPrice: 0,
});

watch(
  () => props.project,
  (project) => {
    if (project) {
      form.value = {
        name: project.name,
        number: project.number,
        description: project.description,
        startDate: project.startDate
          ? project.startDate.toISOString().split("T")[0]
          : "", // Convert Date to string (YYYY-MM-DD)
        endDate: project.endDate
          ? project.endDate.toISOString().split("T")[0]
          : "",
        discount: project.discount ?? 0, // Ensure null values default to 0
        totalProjectPrice: project.totalProjectPrice ?? 0,
      };
    } else {
      form.value = {
        name: "",
        number: "",
        description: "",
        startDate: "",
        endDate: "",
        discount: 0,
        totalProjectPrice: 0,
      };
    }
  },
  { immediate: true }
);

const save = () => {
  const formattedProject = {
    ...form.value,
    startDate: form.value.startDate ? new Date(form.value.startDate) : null, // Convert string to Date
    endDate: form.value.endDate ? new Date(form.value.endDate) : null,
  };
  emit("save", formattedProject);
};
</script>
