<template>
  <div class="p-6">
    <!-- Header Section -->
    <div class="flex items-center mb-6">
      <h1 class="text-2xl font-bold w-[50%]">Customer Management</h1>
      <div class="flex gap-4 w-[50%] justify-end">
        <!-- Search Input -->
        <div class="w-[70%] min-w-[150px]">
          <input
            v-model="customerStore.query.search"
            placeholder="Search Customers"
            class="input input-bordered w-full"
          />
        </div>
        <button
          @click="openAddCustomerModal"
          class="btn btn-primary btn-md w-32"
        >
          Add New
        </button>
      </div>
    </div>

    <CustomerTable @edit="editCustomer" @delete="confirmDeleteCustomer" />

    <CustomerModal
      v-if="isModalOpen"
      :customer="selectedCustomer"
      @save="saveCustomer"
      @close="closeModal"
    />

    <!-- Reusable Delete Confirmation Modal -->
    <ConfirmDelete
      v-if="isDeleteModalOpen"
      :isOpen="isDeleteModalOpen"
      title="Confirm Delete"
      message="Are you sure you want to delete this customer?"
      confirmText="Yes, Delete"
      cancelText="Cancel"
      @confirm="toDeleteCustomer"
      @cancel="isDeleteModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import useCustomerService from "~/composables/customersService";
import type { Customer } from "~/types/customer";

const customerStore = useCustomerStore();
const { createCustomer, updateCustomer, deleteCustomer } = useCustomerService();

const isModalOpen = ref(false);
const selectedCustomer = ref<Customer | null>(null);
const isDeleteModalOpen = ref(false);
const customerToDelete = ref<number | null>(null);

onMounted(async () => {
  await nextTick(async () => {
    getCustomers();
  });
});

const getCustomers = async () => {
  await customerStore.getCustomers();
};

// Open Add Customer Modal
const openAddCustomerModal = () => {
  selectedCustomer.value = null;
  isModalOpen.value = true;
};

// Open Edit Customer Modal
const editCustomer = (customer: Customer) => {
  selectedCustomer.value = customer;
  isModalOpen.value = true;
};

// Save (Add or Edit) Customer
const saveCustomer = async (customerData: Omit<Customer, "id">) => {
  if (selectedCustomer.value) {
    await updateCustomer(selectedCustomer.value.id!, customerData);
  } else {
    await createCustomer(customerData);
  }
  isModalOpen.value = false;
  getCustomers();
};

// Open Delete Confirmation Modal
const confirmDeleteCustomer = (id: number) => {
  customerToDelete.value = id;
  isDeleteModalOpen.value = true;
};

// Delete Customer
const toDeleteCustomer = async () => {
  if (customerToDelete.value !== null) {
    await customerStore.deleteCustomer(customerToDelete.value);
    isDeleteModalOpen.value = false;
    getCustomers();
  }
};

// Close Modal
const closeModal = () => {
  isModalOpen.value = false;
};
</script>

<!-- CSS for fade transition -->
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
