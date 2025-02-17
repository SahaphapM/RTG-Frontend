import { ref } from "vue";
import { useFetch } from "#app"; // Ensure this is correct for your Nuxt setup
import type { Certificate } from "~/types/certificate";

export const useCertificateService = () => {
  const loading = ref(false);
  const errorMessage = ref<string | null>(null);
  const config = useRuntimeConfig();
  const API_BASE = (config.public.apiBase as string) + "/certificates";

  // ✅ Fetch a specific certificate by ID
  const fetchCertificate = async (id: number) => {
    loading.value = true;
    errorMessage.value = null;
    try {
      const { data, error } = await useFetch<Certificate>(`${API_BASE}/${id}`);
      if (error.value) {
        throw new Error(error.value.message);
      }
      return data.value;
    } catch (error: any) {
      errorMessage.value = error.message || "Failed to fetch certificate.";
      console.error("Error fetching certificate:", errorMessage.value);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const fetchCertificateFile = async (filename: string) => {
    loading.value = true;
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
      loading.value = false;
    }
  };
  // ✅ Fetch all certificates
  const fetchCertificates = async () => {
    loading.value = true;
    errorMessage.value = null;

    try {
      const { data, error } = await useFetch<Certificate[]>(`${API_BASE}`);

      if (error.value) {
        throw new Error(error.value.message);
      }

      return data.value || [];
    } catch (error: any) {
      errorMessage.value = error.message || "An unexpected error occurred.";
      console.error("Error fetching certificates:", errorMessage.value);
    } finally {
      loading.value = false;
    }
  };

  // ✅ Create a new certificate (without file)
  const createCertificate = async (certificate: Partial<Certificate>) => {
    loading.value = true;
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
      loading.value = false;
    }
  };

  // ✅ Upload file for a certificate
  const uploadCertificateFile = async (id: number, file: File) => {
    loading.value = true;
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
      errorMessage.value = error.message || "Error uploading file.";
      console.error("Error uploading certificate file:", errorMessage.value);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // ✅ Download certificate file
  const downloadCertificate = async (filename: string) => {
    loading.value = true;
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
      errorMessage.value = error.message || "Error downloading file.";
      console.error("Error downloading certificate:", errorMessage.value);
    } finally {
      loading.value = false;
    }
  };

  // ✅ Update a certificate (without file)
  const updateCertificate = async (
    id: number,
    certificate: Partial<Certificate>
  ) => {
    loading.value = true;
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
      loading.value = false;
    }
  };

  // ✅ Delete a certificate
  const deleteCertificate = async (id: number) => {
    loading.value = true;
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
      loading.value = false;
    }
  };

  return {
    loading,
    errorMessage,
    fetchCertificate,
    fetchCertificates,
    fetchCertificateFile,
    createCertificate,
    uploadCertificateFile,
    downloadCertificate,
    updateCertificate,
    deleteCertificate,
  };
};
