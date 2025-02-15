<template>
  <div class="relative">
    <label class="block font-semibold">Customer</label>
    <div class="flex">
      <input
        v-model="searchQuery"
        @focus="showDropdown = true"
        type="text"
        class="input input-bordered w-full"
        :disabled="!isEditing"
        required
      />
      <button
        class="btn btn-primary w-32 ml-2"
        v-if="isEditing"
        @click="isCustomerModalOpen = true"
      >
        New Customer
      </button>
    </div>

    <ul
      v-if="showDropdown && filteredCustomers.length"
      class="absolute w-full bg-white shadow-lg border rounded-lg z-10 mt-1"
    >
      <li
        v-for="customer in filteredCustomers"
        :key="customer.id"
        @click="selectCustomer(customer)"
        class="p-2 hover:bg-gray-100 cursor-pointer"
      >
        {{ customer.name }}
      </li>
    </ul>

    <CustomerModal
      v-if="isCustomerModalOpen"
      :customer="selectedCustomer"
      @save="saveCustomer"
      @close="closeCustomerModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from "vue";
import type { Customer } from "~/types/customer";

const props = defineProps<{
  modelValue: Customer | null;
  isEditing: boolean;
}>();
const emit = defineEmits(["update:modelValue"]);

const customerStore = useCustomerStore();
const searchQuery = ref("");
const showDropdown = ref(false);
const selectedCustomer = ref<Customer | null>();
const isCustomerModalOpen = ref(false);

const filteredCustomers = computed(() =>
  searchQuery.value
    ? customerStore.customers.filter((customer: Customer) =>
        customer.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    : []
);

const selectCustomer = (customer: Customer) => {
  searchQuery.value = customer.name;
  selectedCustomer.value = customer;
  emit("update:modelValue", customer);
  showDropdown.value = false;
};

const saveCustomer = async (customerData: Omit<Customer, "id">) => {
  const newCustomer = await customerStore.createCustomer(customerData);
  if (newCustomer) {
    selectedCustomer.value = newCustomer;
    emit("update:modelValue", newCustomer);
  }
  isCustomerModalOpen.value = false;
};

const closeCustomerModal = () => {
  isCustomerModalOpen.value = false;
};

// Watch for changes in modelValue
watch(
  () => props.modelValue,
  (newValue) => {
    selectedCustomer.value = newValue;
    searchQuery.value = newValue ? newValue.name : "";
  },
  { immediate: true }
);

onMounted(async () => {
  await customerStore.getCustomers();
});
</script>
