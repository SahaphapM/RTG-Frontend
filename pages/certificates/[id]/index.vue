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

    <div class="flex gap-10 min-h-[500px]">
      <!-- Left: File Upload & Preview (Fixed Width) -->
      <div class="w-[40%] rounded-lg p-4 flex flex-col items-center">
        <CertificateViewer :previewUrl="previewUrl || examplePdf" />
      </div>

      <!-- Right: Form Fields (Expands to Fill Remaining Space) -->
      <div class="flex-grow flex flex-col justify-between mt-10">
        <div class="space-y-4">
          <!-- File Upload -->
          <div class="flex gap-10 mt-4 items-center">
            <div><h2 class="font-semibold text-lg">Upload PDF</h2></div>
            <label
              class="flex items-center border-dashed border-2 border-gray-500 rounded-lg p-6 text-center bg-gray-100 text-gray-600 h-16 w-full"
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
              <HardDriveUpload class="w-7 h-7 ml-5" />
            </label>
          </div>

          <!-- Name & Date -->
          <div class="flex gap-4">
            <div class="flex-grow">
              <label class="block font-semibold">Name</label>
              <input
                v-model="certificate.name"
                type="text"
                class="input input-bordered w-full"
                :disabled="!isEditing"
                required
              />
            </div>
            <div>
              <label class="block font-semibold">Date</label>
              <input
                v-model="formattedDate"
                type="date"
                class="input input-bordered w-full"
                :disabled="!isEditing"
              />
            </div>
          </div>

          <!-- Description -->
          <div>
            <label class="block font-semibold">Description</label>
            <textarea
              v-model="certificate.description"
              class="textarea textarea-bordered text-lg w-full h-[150px]"
              :disabled="!isEditing"
            ></textarea>
          </div>

          <!-- Project & Subcontractor -->
          <div class="flex gap-4">
            <div class="w-1/2">
              <ProjectSearch
                :modelValue="certificate.project!"
                :isEditing="isEditing"
                @update:model-value="updateProject"
              />
            </div>
            <div class="w-1/2">
              <SubContractorSearch
                :modelValue="certificate.subcontractor!"
                :isEditing="isEditing"
                @update:model-value="updateSubcontractor"
              />
            </div>
          </div>
        </div>

        <!-- Buttons (Aligned to Bottom) -->
        <div class="flex justify-end items-end mt-auto gap-2">
          <button
            type="button"
            @click="resetForm(), (isEditing = false)"
            class="btn btn-error w-32"
            v-if="isEditing"
          >
            Cancel
          </button>
          <button
            @click="saveCertificate"
            class="btn btn-success w-32"
            v-if="isEditing"
          >
            Save
          </button>
          <button @click="goBack" class="btn btn-error w-32" v-if="!isEditing">
            Back
          </button>
        </div>
      </div>
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
import { HardDriveUpload } from "lucide-vue-next";
import ProjectSearch from "~/components/certificate/ProjectSearch.vue";
import type { Project } from "~/types/project";

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
  subcontractor: null,
  project: null,
});

const file = ref<File | null>(null); // Store uploaded file
const previewUrl = ref<string | null>(null); // Store preview URL
const isUploading = ref(false);
const examplePdf = "/pdf/sample.pdf"; // ✅ Correct Path

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

const formattedDate = computed({
  get: () => certificate.value.date,
  set: (value) => (certificate.value.date = value),
});

// Handle File Upload
const handleFileUpload = (event: Event) => {
  console.log("handleFileUpload");
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
    certificate.value = data;
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

// Update project
const updateProject = (project: Project) => {
  certificate.value.project = project;
};
</script>
