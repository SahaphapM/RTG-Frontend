<template>
  <div class="p-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold">
        {{ isNewCertificate ? "New Certificate" : certificate?.name }}
      </h1>
      <div class="flex gap-4">
        <button
          v-if="!isEditing"
          @click="isEditing = true"
          class="w-32 btn btn-warning text-white"
        >
          Edit
        </button>
        <button
          v-if="certificate.file"
          @click="downloadCertificate(certificate.file)"
          class="w-32 btn btn-success text-white"
        >
          Download
        </button>
      </div>
    </div>

    <div class="flex gap-10">
      <!-- Left: File Upload & Preview (Fixed Width) -->
      <div class="w-[40%] mt-5">
        <div class="rounded-lg flex flex-col items-center">
          <CertificateViewer :previewUrl="previewUrl || examplePdf" />
          <div class="mt-2 font-semibold">
            {{ certificate.file || file?.name }}
          </div>
        </div>
      </div>

      <!-- Right: Form Fields (Expands to Fill Remaining Space) -->
      <div class="flex-grow flex flex-col justify-between mt-5">
        <div class="space-y-4">
          <!-- File Upload -->
          <div v-if="isEditing">
            <label class="block font-semibold">Upload </label>
            <div class="flex items-center">
              <label
                class="flex items-center border-dashed border-2 border-neutral-500 rounded-lg px-4 py-2 text-center bg-neutral-100 text-gray-600 cursor-pointer hover:bg-neutral-300 hover:border-neutral-700 transition-all"
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
          </div>

          <!-- Name & Date -->
          <div class="flex gap-4">
            <div>
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
        <div
          class="flex items-end mt-auto gap-2"
          :class="isEditing ? 'justify-between' : 'justify-end'"
        >
          <button
            v-if="isEditing && certificate.id"
            @click="isDeleteModalOpen = true"
            class="btn btn-error w-32"
          >
            Delete
          </button>
          <ConfirmDelete
            v-if="isDeleteModalOpen"
            :isOpen="isDeleteModalOpen"
            title="Confirm Delete"
            message="Are you sure you want to delete this purchase order?"
            confirmText="Yes, Delete"
            cancelText="Cancel"
            @confirm="toDeleteCertificate"
            @cancel="isDeleteModalOpen = false"
          />
          <div class="flex gap-4">
            <button
              type="button"
              @click="resetForm(), (isEditing = false)"
              class="btn btn-error w-32 text-white"
              v-if="isEditing"
            >
              Cancel
            </button>
            <button
              @click="saveCertificate"
              class="btn btn-success w-32 text-white"
              v-if="isEditing"
            >
              Save
            </button>
            <button
              @click="goBack"
              class="btn btn-primary w-32"
              v-if="!isEditing"
            >
              Back
            </button>
          </div>
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
  deleteCertificate,
  downloadCertificate,
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
const isDeleteModalOpen = ref(false);

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
  let newCertificate;
  if (isNewCertificate.value) {
    newCertificate = await createCertificate(certificate.value);
    if (newCertificate) {
      certificate.value = newCertificate;
      isNewCertificate.value = false;
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
  if (newCertificate) {
    router.push(`/certificates/${newCertificate.id}`);
    return;
  } else {
    await resetForm();
  }
};

// Reset Form
async function resetForm() {
  const data = await fetchCertificate(Number(route.params.id));
  if (data) {
    certificate.value = data;
  }

  if (certificate.value.file && certificate.value.file !== "") {
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

const download = async (name: string) => {
  if (name) {
    await downloadCertificate(name);
  }
};

// Delete Certificate
const toDeleteCertificate = async () => {
  if (certificate.value) {
    await deleteCertificate(certificate.value.id!);
    isDeleteModalOpen.value = false;
    router.push("/certificates");
  }
};
definePageMeta({
  middleware: "auth-role",
});
</script>
