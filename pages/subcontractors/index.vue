<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Subcontractor Management</h1>
      <button @click="openModal()" class="btn btn-primary w-32">Add New</button>
    </div>
    <SubcontractorTable
      :subcontractors="subcontractors"
      :isLoading="isLoading"
      @edit="handleEdit"
      @delete="handleDelete"
    />
    <SubcontractorModal
      v-if="isModalOpen"
      :subcontractor="selectedSubcontractor"
      @save="handleSave"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import useSubcontractorService from "~/composables/subcontractorService";
import type { Subcontractor } from "~/types/subcontractor";

const {
  fetchSubcontractors,
  createSubcontractor,
  updateSubcontractor,
  deleteSubcontractor,
} = useSubcontractorService();

const subcontractors = ref<Subcontractor[]>([]);
const selectedSubcontractor = ref<Subcontractor | null>(null);
const isModalOpen = ref(false);
const isLoading = ref(true);

// Fetch subcontractors on mount
onMounted(async () => {
  nextTick(async () => {
    try {
      subcontractors.value = await fetchSubcontractors();
    } catch (error) {
      console.error("Failed to fetch subcontractors:", error);
    } finally {
      isLoading.value = false;
    }
  });
});

// Open modal for adding or editing
const openModal = (subcontractor: Subcontractor | null = null) => {
  selectedSubcontractor.value = subcontractor;
  isModalOpen.value = true;
};

// Close modal
const closeModal = () => {
  isModalOpen.value = false;
  selectedSubcontractor.value = null;
};

// Handle save action (create or update)
const handleSave = async (subcontractorData: Partial<Subcontractor>) => {
  try {
    if (selectedSubcontractor.value) {
      // Update existing subcontractor
      const updatedSubcontractor = await updateSubcontractor(
        selectedSubcontractor.value.id,
        subcontractorData
      );
      // Update the list
      subcontractors.value = subcontractors.value.map((sub) =>
        sub.id === updatedSubcontractor?.id ? updatedSubcontractor : sub
      ) as Subcontractor[];
    } else {
      // Create new subcontractor
      const newSubcontractor = await createSubcontractor(subcontractorData);
      // Add to the list
      subcontractors.value.push(newSubcontractor as Subcontractor);
    }
    closeModal();
  } catch (error) {
    console.error("Failed to save subcontractor:", error);
  }
};

// Handle edit action
const handleEdit = (subcontractor: Subcontractor) => {
  openModal(subcontractor);
};

// Handle delete action
const handleDelete = async (id: number) => {
  try {
    await deleteSubcontractor(id);
    subcontractors.value = subcontractors.value.filter((sub) => sub.id !== id);
    console.log("Subcontractor deleted successfully");
  } catch (error) {
    console.error("Failed to delete subcontractor:", error);
  }
};
</script>
