<template>
  <div class="relative">
    <label class="block font-semibold">Subcontractor</label>

    <div class="flex items-center gap-4">
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

      <!-- "New Subcontractor" Button -->
      <button
        class="btn btn-primary w-32"
        v-if="isEditing"
        @click="isSubcontractorModalOpen = true"
      >
        New Subcontractor
      </button>
    </div>

    <!-- Dropdown List -->
    <ul
      v-if="showDropdown && filteredSubcontractors.length"
      class="absolute w-[70%] bg-white shadow-lg border rounded-lg z-10 mt-1"
    >
      <li
        v-for="subcontractor in filteredSubcontractors.slice(0, 5)"
        :key="subcontractor.id"
        @click="selectSubcontractor(subcontractor)"
        class="p-2 hover:bg-gray-100 cursor-pointer border border-collapse"
      >
        {{ subcontractor.name }}
        <div class="text-xs text-gray-500">{{ subcontractor.taxId }}</div>
        <div class="text-xs text-gray-500">{{ subcontractor.address }}</div>
      </li>
    </ul>

    <!-- Subcontractor Modal -->
    <SubcontractorModal
      v-if="isSubcontractorModalOpen"
      :subcontractor="newSubcontractor"
      @save="saveSubcontractor"
      @close="closeSubcontractorModal"
    />
  </div>
</template>

<script setup lang="ts">
import { Search } from "lucide-vue-next";
import {
  ref,
  computed,
  defineProps,
  defineEmits,
  watch,
  onMounted,
  nextTick,
} from "vue";
import useSubcontractorService from "~/composables/subcontractorService";
import type { Subcontractor } from "~/types/subcontractor";
import { useSubcontractorStore } from "~/stores/subcontractor"; // Make sure to import store

const props = defineProps<{
  modelValue: Subcontractor | null;
  isEditing: boolean;
}>();
const emit = defineEmits(["update:modelValue"]);

const subcontractorStore = useSubcontractorStore(); // Initialize the store
const { fetchSubcontractors, createSubcontractor } = useSubcontractorService();

const searchQuery = ref("");
const showDropdown = ref(false);
const newSubcontractor: Subcontractor = {
  name: "",
  address: "",
  type: "Contractor",
  email: "",
  contact: "",
};
const selectedSubcontractor = ref<Subcontractor | null>(null);
const isSubcontractorModalOpen = ref(false);

// Filtered subcontractors based on search query
const filteredSubcontractors = computed(() =>
  searchQuery.value
    ? subcontractorStore.subcontractors.filter((subcontractor: Subcontractor) =>
        subcontractor.name
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase())
      )
    : []
);

// Select a subcontractor from the dropdown
const selectSubcontractor = (subcontractor: Subcontractor) => {
  searchQuery.value = subcontractor.name;
  selectedSubcontractor.value = subcontractor;

  emit("update:modelValue", subcontractor);
  console.log("selectedSubcontractor", subcontractor);
  showDropdown.value = false;
};

// Save a new subcontractor
const saveSubcontractor = async (subcontractorData: Subcontractor) => {
  const newSubcontractor = await createSubcontractor(subcontractorData);
  if (newSubcontractor) {
    selectedSubcontractor.value = newSubcontractor;
    emit("update:modelValue", newSubcontractor);
    subcontractorStore.subcontractors.push(newSubcontractor); // Directly add to the store
  }
  isSubcontractorModalOpen.value = false;
};

// Close the subcontractor modal
const closeSubcontractorModal = () => {
  isSubcontractorModalOpen.value = false;
};

const closeDropdownWithDelay = () => {
  setTimeout(() => {
    showDropdown.value = false;
  }, 100); // ✅ Small delay to allow selection click
};

// Watch for changes in modelValue
watch(
  () => props.modelValue,
  (newValue) => {
    selectedSubcontractor.value = newValue;
    searchQuery.value = newValue ? newValue.name : "";
  },
  { immediate: true }
);

// Fetch subcontractors on mount
onMounted(async () => {
  nextTick(async () => {
    await subcontractorStore.getSubcontractors(); // Use the store method to fetch subcontractors
  });
});
</script>
