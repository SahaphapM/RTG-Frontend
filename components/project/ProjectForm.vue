<template>
  <div>
    <div class="grid grid-cols-2 gap-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block font-semibold">No.</label>
          <input
            v-model="localForm.number"
            type="text"
            class="input input-bordered w-full"
            :disabled="!isEditing"
            required
          />
        </div>
        <div>
          <label class="block font-semibold">Status</label>
          <select
            v-model="localForm.status"
            class="select select-bordered w-full"
            :disabled="!isEditing"
          >
            <option disabled value="">Select Status</option>
            <!-- set default value -->
            <option
              v-for="status in statusOptions"
              :value="status"
              :key="status"
            >
              {{ status }}
            </option>
          </select>
        </div>
      </div>

      <div class="flex-grow">
        <label class="block font-semibold">Name</label>
        <input
          v-model="localForm.name"
          type="text"
          class="input input-bordered w-full"
          :disabled="!isEditing"
          required
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
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
      <!-- Customer Search Component -->
      <CustomerSearch
        :modelValue="localForm.customer"
        @update:modelValue="updateCustomer"
        :isEditing="isEditing"
      />
    </div>

    <div class="mt-4">
      <label class="block font-semibold">Description</label>
      <textarea
        v-model="localForm.description"
        class="textarea textarea-bordered w-full h-[150px]"
        :disabled="!isEditing"
      ></textarea>
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

const statusOptions = ["Pending", "In Progress", "Completed", "Cancelled"];

const updateCustomer = (customer: Customer | null) => {
  localForm.value.customer = customer;
};
watch(
  () => props.form,
  (newForm) => {
    localForm.value = newForm;
    if (localForm.value.status === null) {
      localForm.value.status = statusOptions[0];
    }
  },
  { deep: true, immediate: true }
);
</script>
