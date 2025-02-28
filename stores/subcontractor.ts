import { defineStore } from "pinia";
import { ref } from "vue";
import useSubcontractorService from "~/composables/subcontractorService";
import type { PaginationQuery } from "~/types/pagination";
import type { Subcontractor } from "~/types/subcontractor";

export const useSubcontractorStore = defineStore("subcontractor", () => {
  const {
    subcontractors,
    totalPages,
    totalSubcontractors,
    isLoading,
    fetchSubcontractors,
    deleteSubcontractor,
  } = useSubcontractorService();

  // Default pagination params
  const query = ref<PaginationQuery>({
    page: 1,
    limit: 10,
    search: "",
    sortBy: "id",
    order: "ASC",
  });

  // **Wrapper function to fetch subcontractors (calls fetchSubcontractors from composable)**
  const getSubcontractors = async () => {
    console.log("query", query.value);
    await fetchSubcontractors(query.value); // This will update the `subcontractors` state automatically
  };

  return {
    subcontractors,
    totalSubcontractors,
    totalPages,
    isLoading,
    getSubcontractors,
    deleteSubcontractor,
    query,
  };
});
