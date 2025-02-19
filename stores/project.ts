import { defineStore } from "pinia";
import { ref } from "vue";
import useProjectService from "~/composables/projectService";
import type { PaginationQuery } from "~/types/pagination";
import type { Project } from "~/types/project";

export const useProjectStore = defineStore("project", () => {
  const {
    isLoading,
    totalProjects,
    totalPages,
    projects,
    error,
    fetchProject,
    fetchProjects,
  } = useProjectService();

  const isEditing = ref(false);
  const project = ref<Project | null>(null);

  // Default pagination params
  const query = ref<PaginationQuery>({
    page: 1,
    limit: 10,
    search: "",
    sortBy: "number",
    order: "ASC",
  });

  // **Wrapper function to fetch
  const getProjects = async () => {
    console.log("query", query.value);
    await fetchProjects(query.value); // This will update the `users` state automatically
  };

  return {
    projects,
    isLoading,
    getProjects,
    fetchProject,
    isEditing,
    project,
    totalProjects,
    totalPages,
    query,
  };
});
