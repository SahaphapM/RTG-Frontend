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
    console.log("Sending project data:", project);
    try {
      const data = await $fetch<Project>(`${config.public.apiBase}/projects`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: project,
      });

      return data;
    } catch (error) {
      console.error("Error creating project:", error);
      if (error.data) {
        console.error("Error details:", error.data); // เพิ่ม log นี้
      }
    }
  };

  // Update Project
  const updateProject = async (id: number, project: Partial<Project>) => {
    try {
      // Transform `projectItems` to use `itemId`
      const formattedProjectItems =
        project.projectItems?.map((item) => ({
          itemId: item.item.id, // Ensure only `itemId` is sent
          quantity: item.quantity,
          price: item.item.price,
        })) || [];

      // Create the final payload
      const projectData = {
        name: project.name,
        description: project.description,
        number: project.number,
        startDate: project.startDate,
        endDate: project.endDate,
        customerId: project.customer?.id, // Ensure only `customerId` is sent
        projectItems: formattedProjectItems, // Use transformed items
      };

      // Send the request
      await useFetch(`${config.public.apiBase}/projects/${id}`, {
        method: "PUT",
        body: projectData,
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
