<template>
  <div
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 z-50"
  >
    <!-- Modal Content -->
    <div
      class="bg-white p-6 rounded-lg w-[50%] shadow-lg scale-95 transition-transform duration-300 ease-in-out"
    >
      <h2 class="text-xl font-bold mb-4">
        {{ subcontractor ? "Edit Subcontractor" : "Add Subcontractor" }}
      </h2>
      <form @submit.prevent="save">
        <input
          v-model="form.name"
          type="text"
          placeholder="Name"
          class="input input-bordered w-full mb-2"
          required
        />

        <!-- Type Dropdown -->
        <!-- <select v-model="form.type" class="select select-bordered w-full mb-2">
          <option disabled value="">Select Type</option>
          <option>Contractor</option>
          <option>Supplier</option>
          <option>Vendor</option>
        </select> -->

        <textarea
          v-model="form.description"
          placeholder="Description"
          class="textarea textarea-bordered textarea-md w-full"
        ></textarea>

        <input
          v-model="form.email"
          type="email"
          placeholder="Email"
          class="input input-bordered w-full mb-2"
        />

        <input
          v-model="form.contact"
          type="text"
          placeholder="Contact"
          class="input input-bordered w-full mb-2"
        />
        <input
          v-model="form.taxId"
          type="text"
          placeholder="Tax ID"
          class="input input-bordered w-full mb-2"
        />

        <textarea
          v-model="form.address"
          placeholder="Address"
          class="textarea textarea-bordered textarea-md w-full"
        ></textarea>

        <div class="flex justify-end mt-4">
          <button
            @click="$emit('close')"
            type="button"
            class="btn text-whitebtn-error mr-2 px-8"
          >
            Cancel
          </button>
          <button type="submit" class="btn text-whitebtn-success px-10">
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from "vue";
import type { Subcontractor } from "~/types/subcontractor";

const props = defineProps<{ subcontractor?: Subcontractor | null }>();
const emit = defineEmits(["save", "close"]);

const form = ref<Subcontractor>({
  name: "",
  email: "",
  contact: "",
  address: "",
  taxId: "",
  description: "",
});

watch(
  () => props.subcontractor,
  (subcontractor) => {
    form.value = subcontractor
      ? { ...subcontractor }
      : {
          name: "",
          description: "",
          email: "",
          contact: "",
          address: "",
          taxId: "",
        };
  },
  { immediate: true }
);

const save = () => emit("save", form.value);
</script>
