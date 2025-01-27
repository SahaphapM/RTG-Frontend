import { useFetch } from "#app";
import type { Project } from "~/types/project";

export default function useProjectService() {
  const config = useRuntimeConfig();

  // Fetch Project
  const fetchProject = async (id: number): Promise<Project> => {
    try {
      const { data } = await useFetch<Project>(
        `${config.public.apiBase}/projects/${id}`
      );
      return data.value || ({} as Project);
    } catch (error) {
      console.error("Error fetching project:", error);
      return {} as Project;
    }
  };

  // Fetch Projects
  const fetchProjects = async (): Promise<Project[]> => {
    try {
      const { data } = await useFetch<Project[]>(
        `${config.public.apiBase}/projects`
      );
      return data.value || [];
    } catch (error) {
      console.error("Error fetching projects:", error);
      return [];
    }
  };

  // Create Project
  const createProject = async (project: Partial<Project>) => {
    try {
      const { data } = await useFetch<Project>(
        `${config.public.apiBase}/projects`,
        {
          method: "POST",
          body: project,
        }
      );
      return data.value;
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  // Update Project
  const updateProject = async (id: number, project: Partial<Project>) => {
    try {
      await useFetch(`${config.public.apiBase}/projects/${id}`, {
        method: "PUT",
        body: project,
      });
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  // Delete Project
  const deleteProject = async (id: number) => {
    try {
      await useFetch(`${config.public.apiBase}/projects/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  return {
    fetchProject,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  };
}
