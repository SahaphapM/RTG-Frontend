<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Add New Project</h1>
    <ProjectModal @save="saveProject" @close="goBack" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import useProjectService from "~/composables/projectService";
import type { Project } from "~/types/project";

const router = useRouter();
const { createProject } = useProjectService();

const saveProject = async (projectData: Omit<Project, "id">) => {
  await createProject(projectData);
  router.push("/projects"); // Redirect after adding
};

const goBack = () => {
  router.push("/projects"); // Go back if canceled
};
</script>
