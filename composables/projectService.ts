import { useFetch } from "#app";
import type { PaginationQuery, PaginationResponse } from "~/types/pagination";
import type { Project } from "~/types/project";

export default function useProjectService() {
  const config = useRuntimeConfig();

  // Reactive state
  const projects = ref<Project[]>([]);
  const totalPages = ref(1);
  const totalProjects = ref(0);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const API_URL = `${config.public.apiBase}/projects`;

  // Fetch users function
  const fetchProjects = async (query: PaginationQuery) => {
    isLoading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await useFetch<
        PaginationResponse<Project>
      >(API_URL, {
        query: query,
        credentials: "include",
      });
      if (fetchError.value) throw new Error(fetchError.value.message);

      projects.value = data.value?.data || [];
      totalProjects.value = data.value?.total || 0;
      totalPages.value = data.value?.totalPages || 1;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch projects.";
      console.error("Error fetching projects:", error.value);
    } finally {
      isLoading.value = false;
    }
  };

  // Fetch Project
  const fetchProject = async (id: number): Promise<Project> => {
    try {
      const { data } = await useFetch<Project>(
        `${config.public.apiBase}/projects/${id}`,
        {
          credentials: "include",
        }
      );
      console.log("data", data);
      return data.value || ({} as Project);
    } catch (error) {
      console.error("Error fetching project:", error);
      return {} as Project;
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
        credentials: "include",
      });

      return data;
    } catch (error: any) {
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
          price: Number(item.item.price),
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
      console.log("Sending project data:", projectData);

      // Send the request
      await useFetch(`${config.public.apiBase}/projects/${id}`, {
        method: "PUT",
        body: projectData,
        credentials: "include",
      });
    } catch (error: any) {
      console.error("Error updating project:", error.message);
    }
  };

  // Delete Project
  const deleteProject = async (id: number) => {
    try {
      const { error: fetchError } = await useFetch(
        `${config.public.apiBase}/projects/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (fetchError.value) throw new Error(fetchError.value.message);
    } catch (error: any) {
      console.error("Error deleting project:", error.message);
    }
  };

  return {
    fetchProject,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    projects,
    totalProjects,
    totalPages,
    isLoading,
    error,
  };
}
