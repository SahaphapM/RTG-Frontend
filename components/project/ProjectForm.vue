<template>
  <div>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block font-bold">Name</label>
        <input
          v-model="form.name"
          type="text"
          class="input input-bordered w-full"
          :disabled="!isEditing"
          required
        />
      </div>

      <!-- Customer Search Component -->
      <CustomerSearch
        v-model="form.customer as Customer"
        :isEditing="isEditing"
      />
    </div>

    <div class="mt-4">
      <label class="block font-bold">Description</label>
      <textarea
        v-model="form.description"
        class="textarea textarea-bordered w-full"
        :disabled="!isEditing"
      ></textarea>
    </div>

    <div class="grid grid-cols-2 gap-4 mt-4">
      <div>
        <label class="block font-bold">Start Date</label>
        <input
          v-model="form.startDate"
          type="date"
          class="input input-bordered w-full"
          :disabled="!isEditing"
        />
      </div>
      <div>
        <label class="block font-bold">End Date</label>
        <input
          v-model="form.endDate"
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

onMounted(() => {
  console.log("form", props.form);
});
</script>
