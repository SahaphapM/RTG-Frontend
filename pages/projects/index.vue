<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Project Management</h1>
      <NuxtLink to="/projects/new" class="btn btn-primary w-32"
        >Add New</NuxtLink
      >
    </div>

    <Table
      :projects="projectStore.projects"
      :isLoading="projectStore.isLoading"
      @edit="editProject"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Table from "~/components/project/Table.vue";
import type { Project } from "~/types/project";

const projectStore = useProjectStore();
const isDeleteModalOpen = ref(false);
const projectToDelete = ref<number | null>(null);

onMounted(async () => {
  await nextTick(async () => {
    projectStore.getProjects();
  });
});

const editProject = (project: Project) => {
  navigateTo(`/projects/${project.id}`);
  projectStore.isEditing = true;
};

const confirmDeleteProject = (id: number) => {
  projectToDelete.value = id;
  isDeleteModalOpen.value = true;
};
</script>
