import { defineStore } from "pinia";
import { ref } from "vue";
import useProjectService from "~/composables/projectService";
import type { Project } from "~/types/project";

export const useProjectStore = defineStore("project", () => {
  const {
    fetchProject,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  } = useProjectService();

  const isEditing = ref(false);
  const projects = ref<Project[]>([]);
  const project = ref<Project | null>(null);
  const isLoading = ref(false);

  // Fetch Projects
  const getProjects = async () => {
    isLoading.value = true;
    try {
      projects.value = await fetchProjects();
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    projects,
    isLoading,
    getProjects,
    fetchProject,
    createProject,
    updateProject,
    deleteProject,
    isEditing,
    project,
  };
});
