<template>
  <div class="p-6">
    <!-- Header Section -->
    <div class="flex items-center mb-6">
      <h1 class="text-2xl font-bold w-[50%]">Certificate Management</h1>
      <div class="flex gap-4 w-[50%] justify-end">
        <!-- Search Input -->
        <div class="w-[70%] min-w-[150px]">
          <input
            v-model="certificateStore.query.search"
            placeholder="Search Certificates"
            class="input input-bordered w-full"
          />
        </div>
        <!-- Action Buttons -->
        <div class="flex justify-end">
          <button
            class="btn btn-primary w-32"
            @click="router.push('/certificates/new')"
          >
            Add New
          </button>
        </div>
      </div>
    </div>

    <!-- Certificates Table -->
    <Table
      :certificates="certificateStore.certificates"
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

const { downloadCertificate } = useCertificateService();

const certificateStore = useCertificateStore();
const router = useRouter();
const isEditing = ref(false);

// Fetch all certificates on mount
onMounted(async () => {
  nextTick(async () => {
    await certificateStore.getCertificates();
  });
});

const download = async (name: string) => {
  if (name) {
    await downloadCertificate(name);
  }
};
// Update Certificates
const updateCertificates = (updatedCertificates: Certificate[]) => {
  certificateStore.certificates = updatedCertificates;
};
</script>
