import { ref } from "vue";
import { useFetch } from "#app"; // Ensure this is correct for your Nuxt setup
import type { Certificate } from "~/types/certificate";
import type { PaginationQuery, PaginationResponse } from "~/types/pagination";

export const useCertificateService = () => {
  const isLoading = ref(false);
  const totalPages = ref(1);
  const totalCertificates = ref(0);
  const error = ref<string | null>(null);
  const certificates = ref<Certificate[]>([]);
  const errorMessage = ref<string | null>(null);
  const config = useRuntimeConfig();
  const API_BASE = (config.public.apiBase as string) + "/certificates";

  // ✅ Fetch a specific certificate by ID
  const fetchCertificate = async (id: number) => {
    isLoading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await useFetch<Certificate>(
        `${API_BASE}/${id}`
      );

      if (fetchError.value) throw new Error(fetchError.value.message);

      return data.value;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch certificate.";
      console.error("Error fetching certificate:", error.value);
    } finally {
      isLoading.value = false;
    }
  };

  // Fetch certificates with pagination
  const fetchCertificates = async (query: PaginationQuery) => {
    isLoading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await useFetch<
        PaginationResponse<Certificate>
      >(API_BASE, {
        query: query,
      });

      if (fetchError.value) throw new Error(fetchError.value.message);

      certificates.value = data.value?.data || [];
      totalCertificates.value = data.value?.total || 0;
      totalPages.value = data.value?.totalPages || 1;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch certificates.";
      console.error("Error fetching certificates:", error.value);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchCertificateFile = async (filename: string) => {
    isLoading.value = true;
    errorMessage.value = null;
    try {
      const response = await fetch(
        `${config.public.apiBase}/uploads/certificates/${filename}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/pdf",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch certificate file.");
      }
      return URL.createObjectURL(await response.blob());
    } catch (error: any) {
      errorMessage.value = error.message || "Failed to fetch certificate file.";
      console.error("Error fetching certificate file:", errorMessage.value);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  // ✅ Create a new certificate (without file)
  const createCertificate = async (certificate: Partial<Certificate>) => {
    isLoading.value = true;
    errorMessage.value = null;

    try {
      const { data, error } = await useFetch<Certificate>(`${API_BASE}`, {
        method: "POST",
        body: certificate,
      });

      if (error.value) {
        throw new Error(error.value.message);
      }

      if (data.value) {
        return data.value;
      }

      return data.value;
    } catch (error: any) {
      errorMessage.value = error.message || "Failed to create certificate.";
      console.error("Error creating certificate:", errorMessage.value);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  // ✅ Upload file for a certificate
  const uploadCertificateFile = async (id: number, file: File) => {
    isLoading.value = true;
    errorMessage.value = null;

    console.log("file", file);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_BASE}/upload/${id}`, {
        method: "POST",
        body: formData,
      });

      console.log("response", response);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to upload file.");
      }

      return result;
    } catch (error: any) {
      errorMessage.value = error.message || "Error upisLoading file.";
      console.error("Error upisLoading certificate file:", errorMessage.value);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  // ✅ Download certificate file
  const downloadCertificate = async (filename: string) => {
    isLoading.value = true;
    errorMessage.value = null;

    try {
      const response = await fetch(`${API_BASE}/download/${filename}`);

      if (!response.ok) {
        throw new Error("Failed to download file.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error: any) {
      errorMessage.value = error.message || "Error downisLoading file.";
      console.error("Error downisLoading certificate:", errorMessage.value);
    } finally {
      isLoading.value = false;
    }
  };

  // ✅ Update a certificate (without file)
  const updateCertificate = async (
    id: number,
    certificate: Partial<Certificate>
  ) => {
    isLoading.value = true;
    errorMessage.value = null;

    try {
      const { data, error } = await useFetch<Certificate>(`${API_BASE}/${id}`, {
        method: "PATCH",
        body: certificate,
      });

      if (error.value) {
        throw new Error(error.value.message);
      }

      if (data.value) {
        return data.value;
      }

      return data.value;
    } catch (error: any) {
      errorMessage.value = error.message || "Failed to update certificate.";
      console.error("Error updating certificate:", errorMessage.value);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  // ✅ Delete a certificate
  const deleteCertificate = async (id: number) => {
    isLoading.value = true;
    errorMessage.value = null;

    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete certificate.");
      }

      return result;
    } catch (error: any) {
      errorMessage.value = error.message || "Error deleting certificate.";
      console.error("Error deleting certificate:", errorMessage.value);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    errorMessage,
    fetchCertificate,
    fetchCertificates,
    fetchCertificateFile,
    createCertificate,
    uploadCertificateFile,
    downloadCertificate,
    updateCertificate,
    deleteCertificate,
    certificates,
    totalPages,
    totalCertificates,
  };
};
