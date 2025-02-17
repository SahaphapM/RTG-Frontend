<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">
        {{ isNewCertificate ? "New Certificate" : certificate?.name }}
      </h1>
      <button
        v-if="!isEditing"
        @click="isEditing = true"
        class="w-32 btn btn-warning"
      >
        Edit
      </button>
    </div>

    <div class="flex gap-10">
      <!-- Left: File Upload & Preview (Fixed Width) -->
      <div
        class="w-[40%] rounded-lg p-4 flex flex-col items-center justify-start"
      >
        <!-- Show PDF Preview -->
        <CertificateViewer v-if="previewUrl" :previewUrl="previewUrl" />
      </div>

      <!-- Right: Form Fields (Expands to Fill Remaining Space) -->
      <div class="flex-grow space-y-4">
        <!-- File Upload -->
        <div class="flex gap-10 mt-6">
          <div><h2 class="font-semibold text-lg">Upload PDF</h2></div>

          <div>
            <label
              class="border-dashed border-2 border-gray-500 rounded-lg p-6 text-center text-gray-600"
              :class="isEditing ? 'cursor-pointer' : 'cursor-default'"
            >
              <input
                type="file"
                class="hidden"
                accept="application/pdf"
                @change="handleFileUpload"
                :disabled="!isEditing"
              />
              <span v-if="!certificate.file">Click to upload PDF</span>
              <span v-else>{{ file?.name || certificate.file }}</span>
            </label>
          </div>
        </div>

        <!-- Name -->
        <div>
          <label class="block font-semibold mt-10">Name</label>
          <input
            v-model="certificate.name"
            type="text"
            class="input input-bordered w-full"
            :disabled="!isEditing"
            required
          />
        </div>

        <!-- Description -->
        <div>
          <label class="block font-semibold">Description</label>
          <textarea
            v-model="certificate.description"
            class="textarea textarea-bordered w-full"
            :disabled="!isEditing"
          ></textarea>
        </div>

        <!-- Subcontractor -->
        <div>
          <SubContractorSearch
            :modelValue="certificate.subcontractor"
            :isEditing="isEditing"
            @update:model-value="updateSubcontractor"
          />
        </div>

        <!-- Project -->
        <div>
          <label class="block font-semibold">Project</label>
          <ProjectSearch v-model="certificate.project" :disabled="!isEditing" />
        </div>

        <!-- Date -->
        <div>
          <label class="block font-semibold">Date</label>
          <input
            v-model="certificate.date"
            type="date"
            class="input input-bordered w-full"
            :disabled="!isEditing"
          />
        </div>
      </div>
    </div>

    <!-- Buttons -->
    <div class="flex justify-end items-center mt-4 gap-2" v-if="isEditing">
      <button
        type="button"
        @click="resetForm(), (isEditing = false)"
        class="btn btn-error w-32"
      >
        Cancel
      </button>
      <button @click="saveCertificate" class="btn btn-success w-32">
        Save
      </button>
    </div>

    <div class="h-5"></div>
    <div class="flex justify-end mt-4 gap-2" v-if="!isEditing">
      <button @click="goBack" class="btn btn-error w-32">Back</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import { useCertificateService } from "~/composables/certificatesService";
import type { Certificate } from "~/types/certificate";
import SubContractorSearch from "~/components/subcontractor/SubContractorSearch.vue";
import CertificateViewer from "~/components/certificate/CertificateViewer.vue";

const route = useRoute();
const router = useRouter();
const {
  fetchCertificate,
  createCertificate,
  updateCertificate,
  uploadCertificateFile,
  fetchCertificateFile,
} = useCertificateService();

const isEditing = ref(false);
const isNewCertificate = ref(false);
const certificate = ref<Certificate>({
  name: "",
  description: "",
  file: "",
  // iso date string YYYY-MM-DD
  date: new Date().toISOString().split("T")[0],
});

const file = ref<File | null>(null); // Store uploaded file
const previewUrl = ref<string | null>(null); // Store preview URL
const isUploading = ref(false);

// Load Certificate Data
onMounted(async () => {
  nextTick(async () => {
    if (route.params.id === "new") {
      isNewCertificate.value = true;
      isEditing.value = true;
    } else {
      resetForm();
    }
  });
});

// Handle File Upload
const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;

  // Store the selected file
  file.value = input.files[0];

  // Generate a preview URL for the PDF
  previewUrl.value = URL.createObjectURL(file.value);

  isUploading.value = true;
};

// Save Certificate
const saveCertificate = async () => {
  if (isNewCertificate.value) {
    const newCertificate = await createCertificate(certificate.value);
    if (newCertificate) {
      certificate.value = newCertificate;
      isNewCertificate.value = false;
      router.push(`/certificates/${newCertificate.id}`);
    }
  } else {
    await updateCertificate(certificate.value.id!, certificate.value);
  }

  if (isUploading.value && file.value && certificate.value.id) {
    const result = await uploadCertificateFile(
      certificate.value.id,
      file.value
    );
    if (result) {
      certificate.value.file = result.filename; // Update certificate file name after upload
    }
  }

  await resetForm();
};

// Reset Form
async function resetForm() {
  const data = await fetchCertificate(Number(route.params.id));
  if (data) {
    Object.assign(certificate.value, data);
    console.log("certificate.value", certificate.value);
  }

  if (certificate.value.file) {
    previewUrl.value = await fetchCertificateFile(certificate.value.file); // Fetch PDF URL
    file.value = null; // Reset selected file (since no new file is uploaded yet)
  }
  isEditing.value = false;
  isNewCertificate.value = false;
  isUploading.value = false;
}

const goBack = () => router.push("/certificates");

// Update subcontractor
const updateSubcontractor = (subcontractor: any) => {
  certificate.value.subcontractor = subcontractor;
};
</script>
