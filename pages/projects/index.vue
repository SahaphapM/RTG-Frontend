<template>
  <div class="p-6">
    <div class="flex items-center mb-6">
      <h1 class="text-2xl font-bold w-[50%]">Project Management</h1>
      <div class="flex gap-4 w-[50%] justify-end">
        <!-- Search Input -->
        <div class="w-[70%] min-w-[150px]">
          <input
            v-model="projectStore.query.search"
            placeholder="Search Projects"
            class="input input-bordered w-full"
          />
        </div>
        <NuxtLink to="/projects/new" class="btn btn-primary w-32"
          >Add New</NuxtLink
        >
      </div>
    </div>

    <Table
      :role="authStore.user?.role"
      :projects="projectStore.projects"
      :isLoading="projectStore.isLoading"
      @edit="editProject"
      @delete="confirmDeleteProject"
    />
    <ConfirmDelete
      v-if="isDeleteModalOpen"
      :isOpen="isDeleteModalOpen"
      title="Confirm Delete"
      message="Are you sure you want to delete this Project?"
      confirmText="Yes, Delete"
      cancelText="Cancel"
      @confirm="toDeleteProject()"
      @cancel="isDeleteModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Table from "~/components/project/Table.vue";
import useProjectService from "~/composables/projectService";
import type { Project } from "~/types/project";

const { deleteProject } = useProjectService();
const projectStore = useProjectStore();
const isDeleteModalOpen = ref(false);
const projectToDelete = ref<number | null>(null);

const authStore = useAuthStore();

onMounted(async () => {
  await nextTick(async () => {
    await projectStore.getProjects();
  });
});

const editProject = (project: Project) => {
  navigateTo(`/projects/${project.id}`);
  projectStore.isEditing = true;
};

const confirmDeleteProject = async (id: number) => {
  projectToDelete.value = id;
  isDeleteModalOpen.value = true;
};

const toDeleteProject = async () => {
  console.log("projectToDelete.value", projectToDelete.value);
  if (projectToDelete.value) {
    await deleteProject(projectToDelete.value);
    isDeleteModalOpen.value = false;
    projectToDelete.value = null;
    await projectStore.getProjects();
  }
};
</script>
