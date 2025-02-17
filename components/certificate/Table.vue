<template>
  <div class="overflow-x-auto bg-base-100 border border-gray-200 rounded-lg">
    <table class="table w-full">
      <thead>
        <tr class="bg-base-300 text-base-content text-lg rounded-lg">
          <th class="py-4 px-4">ID</th>
          <th class="py-4 px-6">Name</th>
          <th class="py-4 px-6">Description</th>
          <th class="py-4 px-6">File</th>
          <th class="py-4 px-6 text-center">Actions</th>
        </tr>
      </thead>

      <tbody v-if="isEditing">
        <tr v-for="n in 5" :key="n">
          <td v-for="i in 5" :key="i" class="py-4 px-6">
            <div class="h-4 bg-gray-200 rounded w-full"></div>
          </td>
        </tr>
      </tbody>

      <tbody>
        <tr
          v-for="(certificate, index) in certificates"
          :key="certificate.id"
          class="hover border-b border-gray-300 cursor-pointer"
          @click="certificate.id ? navigateToCertificate(certificate.id) : ''"
        >
          <td class="py-4 px-6">{{ index + 1 }}</td>
          <td class="py-4 px-6">{{ certificate.name }}</td>
          <td class="py-4 px-6">{{ certificate.description }}</td>
          <td class="py-4 px-6">
            <a
              v-if="certificate.file"
              :href="`${API_BASE}/download/${certificate.file}`"
              target="_blank"
              class="text-blue-600 underline"
            >
              {{ certificate.file }}
            </a>
            <span v-else class="text-gray-400 italic">No file</span>
          </td>
          <td class="py-4 px-6 text-center">
            <button
              @click="
                certificate.id ? navigateToCertificate(certificate.id) : ''
              "
              class="btn btn-warning btn-sm w-16 mr-2"
            >
              Edit
            </button>
            <!-- <button
              @click="$emit('delete', certificate.id)"
              class="btn btn-error btn-sm w-16"
            >
              Delete
            </button> -->
            <button
              v-if="certificate.file"
              @click.stop="$emit('download', certificate.file)"
              class="btn btn-success btn-sm w-16 ml-2"
            >
              PDF
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import type { Certificate } from "~/types/certificate";

const config = useRuntimeConfig();
const router = useRouter();

const API_BASE = (config.public.apiBase as string) + "/certificates";

defineProps<{ certificates: Certificate[]; isEditing: boolean }>();
defineEmits(["edit", "delete", "download"]);

const navigateToCertificate = (id: number) => {
  router.push(`/certificates/${id}`);
};
</script>
