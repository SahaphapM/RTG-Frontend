<template>
  <div class="relative">
    <label class="block font-semibold">Subcontractor</label>
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
        @click="isSubcontractorModalOpen = true"
      >
        New Subcontractor
      </button>
    </div>

    <ul
      v-if="showDropdown && filteredSubcontractors.length"
      class="absolute w-full bg-white shadow-lg border rounded-lg z-10 mt-1"
    >
      <li
        v-for="subcontractor in filteredSubcontractors"
        :key="subcontractor.id"
        @click="selectSubcontractor(subcontractor)"
        class="p-2 hover:bg-gray-100 cursor-pointer"
      >
        {{ subcontractor.name }}
        <div class="text-xs text-gray-500">{{ subcontractor.address }}</div>
      </li>
    </ul>

    <SubcontractorModal
      v-if="isSubcontractorModalOpen"
      :subcontractor="newSubcontractor"
      @save="saveSubcontractor"
      @close="closeSubcontractorModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits, watch, onMounted } from "vue";
import useSubcontractorService from "~/composables/subcontractorService";
import type { Subcontractor } from "~/types/subcontractor";

const props = defineProps<{
  modelValue: Subcontractor | null;
  isEditing: boolean;
}>();
const emit = defineEmits(["update:modelValue"]);

const { fetchSubcontractors, createSubcontractor } = useSubcontractorService();
const searchQuery = ref("");
const showDropdown = ref(false);
const newSubcontractor: Subcontractor = {
  name: "",
  address: "",
  email: "",
  contact: "",
};
const selectedSubcontractor = ref<Subcontractor | null>(null);
const isSubcontractorModalOpen = ref(false);
const subcontractors = ref<Subcontractor[]>([]);

// Filtered subcontractors based on search query
const filteredSubcontractors = computed(() =>
  searchQuery.value
    ? subcontractors.value.filter((subcontractor: Subcontractor) =>
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
    subcontractors.value = await fetchSubcontractors();
  }
  isSubcontractorModalOpen.value = false;
};

// Close the subcontractor modal
const closeSubcontractorModal = () => {
  isSubcontractorModalOpen.value = false;
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
    subcontractors.value = await fetchSubcontractors();
  });
});
</script>
