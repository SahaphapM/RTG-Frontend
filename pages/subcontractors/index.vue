<template>
  <div class="p-6">
    <!-- Header Section -->
    <div class="flex items-center mb-6">
      <h1 class="text-2xl font-bold w-[50%]">Subcontractor Management</h1>
      <div class="flex gap-4 w-[50%] justify-end">
        <!-- Search Input -->
        <div class="w-[70%] min-w-[150px]">
          <input
            v-model="subcontractorStore.query.search"
            placeholder="Search Subcontractors"
            class="input input-bordered w-full"
          />
        </div>
        <button @click="openModal()" class="btn btn-primary w-32">
          Add New
        </button>
      </div>
    </div>

    <SubcontractorTable
      :subcontractors="subcontractors"
      :isLoading="isLoading"
      @edit="handleEdit"
      @delete="confirmDeleteProject"
    />
    <SubcontractorModal
      v-if="isModalOpen"
      :subcontractor="selectedSubcontractor"
      @save="handleSave"
      @close="closeModal"
    />
    <!-- Reusable Delete Confirmation Modal -->
    <ConfirmDelete
      v-if="isDeleteModalOpen"
      :isOpen="isDeleteModalOpen"
      title="Confirm Delete"
      message="Are you sure you want to delete this user?"
      confirmText="Yes, Delete"
      cancelText="Cancel"
      @confirm="toDeleteSubcontractor"
      @cancel="isDeleteModalOpen = false"
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

const subcontractorStore = useSubcontractorStore();
const subcontractors = ref<Subcontractor[]>([]);
const selectedSubcontractor = ref<Subcontractor | null>(null);
const isModalOpen = ref(false);
const isLoading = ref(true);
const isDeleteModalOpen = ref(false);
const subcontractorToDelete = ref<number | null>(null);

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
    if (selectedSubcontractor.value?.id) {
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

const confirmDeleteProject = async (id: number) => {
  subcontractorToDelete.value = id;
  isDeleteModalOpen.value = true;
};

const toDeleteSubcontractor = async () => {
  console.log("subcontractorToDelete.value", subcontractorToDelete.value);
  if (subcontractorToDelete.value) {
    await deleteSubcontractor(subcontractorToDelete.value);
    isDeleteModalOpen.value = false;
    subcontractorToDelete.value = null;
    await subcontractorStore.getSubcontractors();
  }
};
</script>
