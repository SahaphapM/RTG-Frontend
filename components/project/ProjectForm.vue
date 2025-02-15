<template>
  <div>
    <div class="grid grid-cols-2 gap-4 text-lg">
      <div>
        <label class="block font-semibold">Name</label>
        <input
          v-model="localForm.name"
          type="text"
          class="input input-bordered w-full"
          :disabled="!isEditing"
          required
        />
      </div>

      <!-- Customer Search Component -->
      <CustomerSearch :modelValue="localForm.customer" :isEditing="isEditing" />
    </div>

    <div class="mt-4">
      <label class="block font-semibold">Description</label>
      <textarea
        v-model="localForm.description"
        class="textarea textarea-bordered w-full"
        :disabled="!isEditing"
      ></textarea>
    </div>

    <div class="grid grid-cols-2 gap-4 mt-4">
      <div>
        <label class="block font-semibold">Start Date</label>
        <input
          v-model="localForm.startDate"
          type="date"
          class="input input-bordered w-full"
          :disabled="!isEditing"
        />
      </div>
      <div>
        <label class="block font-semibold">End Date</label>
        <input
          v-model="localForm.endDate"
          type="date"
          class="input input-bordered w-full"
          :disabled="!isEditing"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import type { Customer } from "~/types/customer";
import CustomerSearch from "./customerSearch.vue";
import type { Project } from "~/types/project";

const props = defineProps<{ form: Project; isEditing: boolean }>();

const localForm = ref<Project>(props.form);

watch(
  () => props.form,
  (newForm) => {
    localForm.value = newForm;
  },
  { deep: true, immediate: true }
);
</script>
