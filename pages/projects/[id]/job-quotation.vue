<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center pb-4">
      <h1 class="text-2xl font-bold">{{ projectStore.project?.name }}</h1>
      <div class="flex gap-2">
        <button
          v-if="!isEditing && quotation.id"
          @click="isEditing = true"
          class="btn btn-warning w-32"
        >
          Edit
        </button>

        <button class="btn btn-outline w-32">Export</button>
      </div>
    </div>

    <!-- Job Quotation Selection & Customer Info -->
    <div class="flex justify-between items-center mt-4">
      <div class="flex gap-2">
        <select
          v-model="selectedQuotationId"
          :disabled="!selectedQuotationId"
          @change="selectQuotation"
          class="select select-bordered px-4 py-2 rounded-lg w-48"
        >
          <option :value="null" :hidden="true">New Job Quotation</option>
          <option
            v-for="quote in jobQuotations"
            :key="quote.id"
            :value="quote.id"
          >
            Job Quotation {{ quote.id }}
          </option>
        </select>
        <button
          class="btn btn-primary w-32"
          @click="addQuotation"
          v-if="!isEditing"
        >
          New
        </button>
      </div>
      <div class="text-right">
        <p class="text-xl font-semibold">
          {{ projectStore.project?.customer?.name }}
        </p>
        <p class="text-lg">{{ projectStore.project?.customer?.address }}</p>
      </div>
    </div>

    <!-- Description -->
    <div class="mt-6">
      <h2 class="text-2xl font-semibold mb-4">Description</h2>
      <textarea
        v-model="quotation.description"
        class="w-full textarea textarea-bordered p-3 rounded-lg"
        :disabled="!isEditing"
      />
    </div>

    <!-- Project Item Total -->
    <div class="mt-6 flex justify-end">
      <h2 class="text-2xl mt-2 mx-10">Price offered</h2>
      <div
        class="p-3 px-5 text-xl border font-medium bg-gray-100 text-black rounded-lg"
      >
        {{
          quotation.priceOffered?.toLocaleString() ||
          projectStore.project?.totalProjectPrice?.toLocaleString()
        }}
      </div>
      <div class="mx-4 mt-3 text-lg">Baht</div>
    </div>

    <!-- Commercial Conditions -->
    <div class="grid grid-cols-2 gap-4 mt-2">
      <div>
        <h3 class="text-xl font-medium">Payment</h3>
        <input
          v-model="quotation.paymentTerms"
          type="text"
          class="input input-bordered w-full"
          :disabled="!isEditing"
        />
      </div>
      <div>
        <h3 class="text-xl font-medium">Delivery</h3>
        <input
          v-model="quotation.deliveryTime"
          type="text"
          class="input input-bordered w-full"
          :disabled="!isEditing"
        />
      </div>
      <div>
        <h3 class="text-xl font-medium">Delivery Place</h3>
        <input
          v-model="quotation.deliveryPlace"
          type="text"
          class="input input-bordered w-full"
          :disabled="!isEditing"
        />
      </div>
      <div>
        <h3 class="text-xl font-medium">Vat %</h3>
        <input
          v-model="quotation.vatPercentage"
          type="text"
          class="input input-bordered w-full"
          :disabled="!isEditing"
        />
      </div>
    </div>

    <!-- Message -->
    <div class="mt-4">
      <h2 class="text-xl font-medium mb-4">Message</h2>
      <textarea
        v-model="quotation.message"
        class="textarea textarea-bordered w-full border p-3 h-24"
        :disabled="!isEditing"
      />
    </div>

    <!-- Best Regards -->
    <div class="mt-4">
      <h2 class="text-xl font-medium mb-4">Best Regards</h2>
      <textarea
        v-model="quotation.bestRegards"
        class="textarea textarea-bordered w-full border p-3 h-24"
        :disabled="!isEditing"
      />
    </div>

    <!-- Action Buttons -->
    <div class="mt-6 flex justify-end gap-2">
      <button @click="goBack" v-if="!isEditing" class="btn btn-secondary w-32">
        Back
      </button>
      <button @click="goNext" v-if="!isEditing" class="btn btn-primary w-32">
        Next
      </button>
      <button
        v-if="isEditing"
        @click="cancelEdit"
        class="btn btn-secondary w-32"
      >
        Cancel
      </button>
      <button
        v-if="isEditing"
        @click="saveQuotation(quotation)"
        class="btn btn-success w-32"
      >
        Save
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { JobQuotation } from "~/types/job-quotation";
import useJobQuotationService from "~/composables/job-quotationService";
import useProjectService from "~/composables/projectService";

const route = useRoute();
const router = useRouter();
const projectStore = useProjectStore();
const { fetchByProjectId, updateJobQuotation, createJobQuotation } =
  useJobQuotationService();
const { fetchProject } = useProjectService();

const jobQuotations = ref<JobQuotation[]>([]);
const isEditing = ref(false);
const originalQuotation = ref<JobQuotation | null>(null);
const newQuotation = ref<JobQuotation>({
  description: "",
  paymentTerms: "",
  deliveryTime: "",
  deliveryPlace: "",
  vatPercentage: 0,
  bestRegards: "",
  message: "",
  payments: [],
});

const quotation = ref<JobQuotation>({
  description: "",
  paymentTerms: "",
  deliveryTime: "",
  deliveryPlace: "",
  vatPercentage: 0,
  bestRegards: "",
  priceOffered: 0,
  message: "",
  payments: [],
});
const selectedQuotationId = ref<number | null>(null);

onMounted(async () => {
  nextTick(async () => {
    if (!projectStore.project?.jobQuotations) {
      projectStore.project = await fetchProject(Number(route.params.id));
      jobQuotations.value = projectStore.project?.jobQuotations;
      if (jobQuotations.value[0].id) {
        quotation.value = { ...jobQuotations.value[0] }; // Set initial values
      }
    } else {
      jobQuotations.value = projectStore.project?.jobQuotations;
    }
    quotation.value.priceOffered = projectStore.project.totalProjectPrice || 0;
    quotation.value = projectStore.project.jobQuotations[0];
    selectedQuotationId.value =
      projectStore.project.jobQuotations[0].id || null;
    originalQuotation.value = JSON.parse(JSON.stringify(quotation.value)); // Deep Copy
  });
});

// Save Quotation
const saveQuotation = async (selectedQuotation: JobQuotation) => {
  selectedQuotation.vatPercentage = Number(selectedQuotation.vatPercentage);
  console.log("selectedQuotation is there have id", selectedQuotation);
  if (selectedQuotation.id) {
    await updateJobQuotation(selectedQuotation.id, selectedQuotation);
  } else {
    if (!projectStore.project) return;

    const created = await createJobQuotation(
      projectStore.project.id,
      selectedQuotation
    );
    if (created)
      (selectedQuotationId.value = created.id || null),
        jobQuotations.value.push(created);
  }
  originalQuotation.value = JSON.parse(JSON.stringify(selectedQuotation)); // Save new values
  isEditing.value = false;
};

const addQuotation = () => {
  selectedQuotationId.value = null;
  quotation.value = newQuotation.value;
  isEditing.value = true;
};

// Update quotation data when selection changes
const selectQuotation = () => {
  if (!selectedQuotationId.value) return;
  const selected = jobQuotations.value.find(
    (q) => q.id === selectedQuotationId.value
  );
  if (selected) {
    console.log("selected", selected);
    quotation.value = JSON.parse(JSON.stringify(selected)); // Deep copy
  }
};

// Cancel Edit and Reset
const cancelEdit = () => {
  quotation.value = JSON.parse(JSON.stringify(originalQuotation.value)); // Restore original

  selectedQuotationId.value = quotation.value.id || null;
  isEditing.value = !isEditing.value;
};

const goBack = () => {
  router.push(`/projects/${route.params.id}`);
};

const goNext = () => {
  alert("Proceeding to the next step...");
};
</script>

<style scoped>
button {
  font-weight: 700;
}
</style>
