<template>
  <div
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 z-50"
  >
    <!-- Modal Content -->
    <div
      class="bg-white p-6 w-[50%] rounded-lg shadow-lg scale-95 transition-transform duration-300 ease-in-out"
    >
      <h2 class="text-xl font-bold mb-4">
        {{ customer ? "Edit Customer" : "Add Customer" }}
      </h2>
      <form @submit.prevent="save">
        <input
          v-model="form.name"
          type="text"
          placeholder="Name"
          class="input input-bordered w-full mb-2"
          required
        />
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
        <textarea
          v-model="form.address"
          placeholder="Address"
          class="textarea textarea-bordered textarea-md w-full text-[16px]"
        ></textarea>
        <input
          v-model="form.agentName"
          type="text"
          placeholder="Agent Name"
          class="input input-bordered w-full mb-2"
        />
        <input
          v-model="form.agentEmail"
          type="text"
          placeholder="Agent Email"
          class="input input-bordered w-full mb-2"
        />
        <input
          v-model="form.agentContact"
          type="text"
          placeholder="Agent Contact"
          class="input input-bordered w-full mb-2"
        />
        <!-- lg -->
        <div class="flex justify-end mt-4">
          <button
            @click="$emit('close')"
            type="button"
            class="btn text-white btn-error mr-2 px-8"
          >
            Cancel
          </button>
          <button type="submit" class="btn text-white btn-success px-10">
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from "vue";
import type { Customer } from "~/types/customer";

const props = defineProps<{ customer?: Customer | null }>();
const emit = defineEmits(["save", "close"]);

const form = ref<Customer>({
  name: "",
  email: "",
  contact: "",
  address: "",
  agentName: "",
  agentContact: "",
  agentEmail: "",
});

watch(
  () => props.customer,
  (customer) => {
    form.value = customer
      ? { ...customer }
      : {
          name: "",
          email: "",
          contact: "",
          address: "",
          agentName: "",
          agentContact: "",
          agentEmail: "",
        };
  },
  { immediate: true }
);

const save = () => emit("save", form.value);
</script>
