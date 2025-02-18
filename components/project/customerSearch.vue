<template>
  <div class="relative">
    <label class="block font-semibold">Customer</label>
    <div class="flex gap-4">
      <div class="relative w-full">
        <input
          v-model="searchQuery"
          @focus="showDropdown = true"
          @blur="closeDropdownWithDelay"
          type="text"
          class="input input-bordered w-full pr-10"
          :disabled="!isEditing"
          required
        />
        <!-- Search Icon -->
        <Search
          class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
        />
      </div>
      <button
        class="btn btn-primary w-32"
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
        v-for="customer in filteredCustomers.slice(0, 5)"
        :key="customer.id"
        @click="selectCustomer(customer)"
        class="p-2 hover:bg-gray-100 cursor-pointer border border-collapse"
      >
        {{ customer.name }}
        <div class="text-xs text-gray-500">
          {{ truncateAddress(customer.address, 100) }}
        </div>
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
import { Search } from "lucide-vue-next";
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
    await customerStore.getCustomers();
  }
  isCustomerModalOpen.value = false;
};

const closeCustomerModal = () => {
  isCustomerModalOpen.value = false;
};

function truncateAddress(address: string, maxLength: number = 30): string {
  if (!address) return "";
  return address.length > maxLength
    ? address.substring(0, maxLength) + "..."
    : address;
}

const closeDropdownWithDelay = () => {
  setTimeout(() => {
    showDropdown.value = false;
  }, 100); // ✅ Small delay to allow selection click
};

// Watch for changes in modelValue
watch(
  () => props.modelValue,
  (newValue) => {
    emit("update:modelValue", newValue);

    selectedCustomer.value = newValue;
    searchQuery.value = newValue ? newValue.name : "";
  },
  { immediate: true }
);

onMounted(async () => {
  nextTick(async () => {
    await customerStore.getCustomers();
  });
});
</script>
