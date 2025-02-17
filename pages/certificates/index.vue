<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Certificates</h1>

      <!-- Action Buttons -->
      <div class="flex justify-end">
        <button class="btn btn-primary w-32" @click="openModal(null)">
          Add New
        </button>
      </div>
    </div>

    <!-- Certificates Table -->
    <Table
      :certificates="certificates"
      :isEditing="isEditing"
      @download="download"
      @update:certificates="updateCertificates"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Table from "@/components/certificate/Table.vue"; // Certificate Table Component
//   import CertificateModal from "@/components/CertificateModal.vue"; // Certificate Modal Component
import { useCertificateService } from "@/composables/certificatesService";
import type { Certificate } from "@/types/certificate";

const {
  fetchCertificates,
  createCertificate,
  downloadCertificate,
  updateCertificate,
  deleteCertificate,
} = useCertificateService();

const certificates = ref<Certificate[]>([]);
const isEditing = ref(false);
const showModal = ref(false);
const selectedCertificate = ref<Certificate | null>(null);

// Fetch all certificates on mount
onMounted(async () => {
  nextTick(async () => {
    await loadCertificates();
    console.log(certificates.value);
  });
});

const loadCertificates = async () => {
  try {
    const data = await fetchCertificates();
    if (data) {
      certificates.value = data;
    }
  } catch (error) {
    console.error("Error fetching certificates:", error);
  }
};

const download = async (name: string) => {
  if (name) {
    await downloadCertificate(name);
  }
};

// Open Modal for New or Edit Certificate
const openModal = (certificate: Certificate | null) => {
  selectedCertificate.value = certificate
    ? { ...certificate }
    : { name: "", description: "", file: "" };
  showModal.value = true;
};

// Handle Saving a Certificate
const handleSave = async (certificate: Certificate) => {
  try {
    if (certificate.id) {
      await updateCertificate(certificate.id, certificate);
    } else {
      await createCertificate(certificate);
    }
    await loadCertificates();
    showModal.value = false;
  } catch (error) {
    console.error("Error saving certificate:", error);
  }
};

// Update Certificates
const updateCertificates = (updatedCertificates: Certificate[]) => {
  certificates.value = updatedCertificates;
};
</script>
