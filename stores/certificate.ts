import { defineStore } from "pinia";
import { ref } from "vue";
import type { PaginationQuery } from "~/types/pagination";

export const useCertificateStore = defineStore("certificate", () => {
  const {
    certificates,
    totalPages,
    totalCertificates,
    isLoading,
    fetchCertificates,
    deleteCertificate,
  } = useCertificateService();

  // Default pagination params
  const query = ref<PaginationQuery>({
    page: 1,
    limit: 10,
    search: "",
    sortBy: "id",
    order: "DESC",
  });

  // **Wrapper function to fetch certificates (calls fetchCertificates from composable)**
  const getCertificates = async () => {
    await fetchCertificates(query.value); // This will update the `certificates` state automatically
  };

  return {
    certificates,
    totalCertificates,
    totalPages,
    isLoading,
    getCertificates,
    deleteCertificate,
    query,
  };
});
