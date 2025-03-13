<template>
  <div class="table-container">
    <table class="custom-table">
      <thead>
        <tr>
          <th @click="setSorting('id')" class="cursor-pointer w-20">
            <div class="flex">ID <SortDescIcon class="sort-icon" /></div>
          </th>
          <th
            @click="setSorting('name')"
            class="cursor-pointer ellipsis-cell-long"
          >
            <div class="flex">Name <SortDescIcon class="sort-icon" /></div>
          </th>
          <th @click="setSorting('description')">
            <div class="cursor-pointer flex">
              Description <SortDescIcon class="sort-icon" />
            </div>
          </th>

          <th>
            <div class="flex">Project</div>
          </th>
          <th>
            <div class="flex">Subcontractor</div>
          </th>
          <th @click="setSorting('date')" class="cursor-pointer">
            <div class="flex">Date <SortDescIcon class="sort-icon" /></div>
          </th>
          <th class="text-center w-32">Actions</th>
        </tr>
      </thead>

      <tbody v-if="isEditing">
        <tr v-for="n in 5" :key="n">
          <td v-for="i in 5" :key="i">
            <div class="h-4 bg-gray-200 rounded w-full"></div>
          </td>
        </tr>
      </tbody>

      <tbody>
        <tr
          v-for="(certificate, index) in certificates"
          :key="certificate.id"
          class="hover"
          @click="certificate.id ? navigateToCertificate(certificate.id) : ''"
        >
          <td>{{ index + 1 }}</td>
          <td class="ellipsis-cell">{{ certificate.name }}</td>
          <td class="ellipsis-cell">{{ certificate.description }}</td>

          <!-- <td>
            <a
              v-if="certificate.file"
              :href="`${API_BASE}/download/${certificate.file}`"
              target="_blank"
              class="text-blue-600 underline"
            >
              {{ certificate.file }}
            </a>
            <span v-else class="text-gray-400 italic">No file</span>
          </td> -->
          <td class="description-cell">{{ certificate.project?.name }}</td>
          <td class="description-cell">
            {{ certificate.subcontractor?.name }}
          </td>
          <td>{{ certificate.date }}</td>
          <td>
            <div class="text-center justify-center flex gap-2">
              <button
                @click="
                  certificate.id ? navigateToCertificate(certificate.id) : ''
                "
                class="btn btn-warning btn-sm w-16"
              >
                Edit
              </button>

              <!-- <button
                v-if="certificate.file"
                @click.stop="$emit('download', certificate.file)"
                class="btn btn-success btn-sm w-16"
              >
                PDF
              </button> -->
              <button
                @click.stop="$emit('delete', certificate.id)"
                class="btn btn-error btn-sm w-16"
              >
                Delete
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination Controls -->
    <div class="pagination">
      <!-- First Page Button (Hidden on First Page) -->
      <button v-if="certificateStore.query.page > 1" @click="goToFirstPage">
        <<
      </button>

      <button @click="prevPage" :disabled="certificateStore.query.page === 1">
        <ChevronLeft />
      </button>

      <span>
        {{ certificateStore.query.page }} /
        {{ certificateStore.totalPages }}
      </span>

      <button
        @click="nextPage"
        :disabled="certificateStore.query.page === certificateStore.totalPages"
      >
        <ChevronRight />
      </button>
      <!-- Last Page Button (Hidden on Last Page) -->
      <button
        v-if="certificateStore.query.page < certificateStore.totalPages"
        @click="goToLastPage"
      >
        >>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeft, ChevronRight, SortDescIcon } from "lucide-vue-next";
import { defineProps, defineEmits } from "vue";
import type { Certificate } from "~/types/certificate";

const config = useRuntimeConfig();
const router = useRouter();
const certificateStore = useCertificateStore();

const API_BASE = (config.public.apiBase as string) + "/certificates";

defineProps<{ certificates: Certificate[]; isEditing: boolean }>();
defineEmits(["edit", "delete", "download"]);

const navigateToCertificate = (id: number) => {
  router.push(`/certificates/${id}`);
};

// Store the timeout ID
let debounceTimeout = ref<NodeJS.Timeout | null>(null);

// Watch for search or sorting changes and fetch data with a delay
watch(
  () => certificateStore.query.search,
  () => {
    console.log("Search query changed:", certificateStore.query.search);
    if (debounceTimeout.value) clearTimeout(debounceTimeout.value);
    debounceTimeout.value = setTimeout(async () => {
      await certificateStore.getCertificates();
    }, 200);
  }
);

watch(
  () => [
    certificateStore.query,
    certificateStore.query.page,
    certificateStore.query.sortBy,
    certificateStore.query.order,
  ],
  async () => {
    await certificateStore.getCertificates();
  }
);

// Sorting function
const setSorting = (field: string) => {
  certificateStore.query.sortBy = field;
  certificateStore.query.order =
    certificateStore.query.order === "ASC" ? "DESC" : "ASC";
};

// ✅ Go to First Page
const goToFirstPage = () => {
  certificateStore.query.page = 1;
  certificateStore.getCertificates();
};

// ✅ Go to Last Page
const goToLastPage = () => {
  certificateStore.query.page = certificateStore.totalPages;
  certificateStore.getCertificates();
};

// Pagination functions
const prevPage = () => {
  if (certificateStore.query.page > 1) certificateStore.query.page--;
};
const nextPage = () => {
  if (certificateStore.query.page < certificateStore.totalPages)
    certificateStore.query.page++;
};

onMounted(async () => {
  nextTick(async () => {
    await certificateStore.getCertificates();
    console.log("certificateStore.certificates", certificateStore.certificates);
  });
});
</script>

<style scoped>
/* Container */
.table-container {
  overflow-x: auto;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Table */
.custom-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ddd;
}

/* Table Header */
.custom-table thead tr {
  background: rgb(231, 231, 231);
  text-align: left;
  font-size: 15px;
  color: #1d1d1d;
}

.custom-table th {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  font-weight: 600;
  border-bottom: 2px solid #ddd;
}

/* Table Body */
.custom-table td {
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

/* Alignments */
.text-center {
  text-align: center;
}
.text-right {
  text-align: right;
}

/* Row Hover Effect */
.custom-table tbody tr:hover {
  background: #f9fafb;
  cursor: pointer;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 10px;
}

.pagination button {
  padding: 6px 10px;
  font-size: 12px;
  border: none;
  cursor: pointer;
  background: rgb(207, 207, 207);
  color: #7c7c7c;
  border-radius: 4px;
}
.pagination button:disabled {
  background: #f0f0f0;
  cursor: not-allowed;
}

/* Sorting Icon */
.sort-icon {
  color: #5a5a5a;
  width: 15px;
  height: 15px;
  margin-top: 5px;
  margin-left: 4px;
}

.description-cell {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px; /* Adjust this width according to your design */
}
</style>
