<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">
        {{ isNewProject ? "New Project" : project?.name }}
      </h1>
      <button
        v-if="!isEditing"
        @click="isEditing = true"
        class="btn btn-warning"
      >
        Edit
      </button>
    </div>

    <!-- Form Section -->
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
      <div class="relative">
        <label class="block font-bold">Customer</label>
        <div class="flex">
          <input
            v-model="searchQueryCustomer"
            @focus="showDropdown = true"
            type="text"
            class="input input-bordered w-full"
            :disabled="!isEditing"
            required
          />
          <button
            class="btn btn-primary ml-2"
            v-if="isEditing"
            @click="isCustomerModalOpen = true"
          >
            New Customer
          </button>
        </div>

        <!-- Dropdown for Search Results -->
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
    </div>

    <div class="mt-4">
      <label class="block font-bold">Description</label>
      <textarea
        v-model="form.description"
        class="textarea textarea-bordered w-full"
        :disabled="!isEditing"
      ></textarea>
    </div>

    <!-- Date Selection -->
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

    <ProjectOrder
      :projectItems="form.projectItems"
      :isEditing="isEditing"
      @increase-amount="increaseAmount"
      @decrease-amount="decreaseAmount"
      @add-item="addItem"
      @remove-item="removeItem"
      @search-item="searchItem"
      @new-item="addNewItem"
    />

    <!-- Buttons -->
    <div class="flex justify-end mt-6" v-if="isEditing">
      <button
        type="button"
        @click="(isEditing = false), resetForm()"
        class="btn btn-secondary mr-2"
      >
        Cancel
      </button>
      <button @click="saveProject" class="btn btn-success">Save</button>
    </div>
    <!-- space -->
    <div class="h-5"></div>
    <div class="flex justify-between" v-if="!isEditing">
      <button @click="goBack" class="btn btn-secondary">Back</button>
      <button @click="goNext" class="btn btn-primary">Next</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import useProjectService from "~/composables/projectService";
import type { Project } from "~/types/project";
import type { ProjectItem } from "~/types/projectItem";
import type { Customer } from "~/types/customer";
import { CustomerModal } from "#components";
import type { Item } from "~/types/item";

const route = useRoute();
const router = useRouter();
const { fetchProject, createProject, updateProject } = useProjectService();

const isEditing = ref(false);
const isNewProject = ref(false);
const project = ref<Project | null>(null);
const form = ref({
  name: "",
  description: "",
  customer: null as Customer | null,
  startDate: new Date(),
  endDate: new Date(),
  projectItems: [] as ProjectItem[],
});

const customerStore = useCustomerStore();
const searchQueryCustomer = ref("");
const showDropdown = ref(false);
const selectedCustomer = ref(null as Customer | null);
const isCustomerModalOpen = ref(false);

// Load project data
onMounted(async () => {
  nextTick(async () => {
    resetForm();
    customerStore.getCustomers(); // Ensure customers are loaded
  });
});

// Save Project
const saveProject = async () => {
  if (isNewProject.value) {
    await createProject(form.value);
  } else {
    await updateProject(project.value!.id, form.value);
  }

  isEditing.value = false;
};

// Goback
const goBack = () => {
  router.push("/projects"); // Go back if canceled
};

////////// item ////////////

const increaseAmount = (index: number) => {
  form.value.projectItems[index].quantity++;
};

const decreaseAmount = (index: number) => {
  if (form.value.projectItems[index].quantity > 1) {
    form.value.projectItems[index].quantity--;
  }
};

const addItem = (item: Item) => {
  // check if item already exists
  const existingItem = form.value.projectItems.find(
    (i) => i.item.id === item.id
  );
  if (existingItem) {
    existingItem.quantity++;
    return;
  }

  form.value.projectItems.push({
    quantity: 1,
    price: item.price,
    totalPrice: item.price,
    item: item,
  });
};

const removeItem = (index: number) => {
  form.value.projectItems.splice(index, 1);
};

const searchItem = () => {
  console.log("Search item clicked");
};

const addNewItem = () => {};

// Filter customers based on search input
const filteredCustomers = computed(() => {
  if (!searchQueryCustomer.value) return [];
  return customerStore.customers.filter((customer) =>
    customer.name
      .toLowerCase()
      .includes(searchQueryCustomer.value.toLowerCase())
  );
});

// Select a customer
const selectCustomer = (customer: Customer) => {
  searchQueryCustomer.value = customer.name;
  selectedCustomer.value = customer;
  form.value.customer = customer;
  showDropdown.value = false; // Hide dropdown after selecting
};

// Save (Add or Edit) Customer
const saveCustomer = async (customerData: Omit<Customer, "id">) => {
  const newCustomer = await customerStore.createCustomer(customerData);
  if (newCustomer) {
    selectedCustomer.value = newCustomer;
  }
  isCustomerModalOpen.value = false;
};
const closeCustomerModal = () => {
  isCustomerModalOpen.value = false;
};

const resetForm = async () => {
  if (route.params.id === "new") {
    isNewProject.value = true;
    isEditing.value = true;
  } else {
    const id = Number(route.params.id);
    project.value = await fetchProject(id);

    if (!project.value) {
      router.push("/projects"); // Redirect if not found
      return;
    }
    searchQueryCustomer.value = project.value.customer?.name || "";
    form.value = {
      name: project.value.name,
      description: project.value.description,
      customer: project.value.customer || null,
      startDate: project.value.startDate || new Date(),
      endDate: project.value.endDate || new Date(),
      projectItems: project.value.projectItems || [],
    };
  }
};
</script>
<style scoped>
button {
  font-weight: 700;
}
</style>
