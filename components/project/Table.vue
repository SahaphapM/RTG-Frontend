<template>
  <div class="overflow-x-auto bg-base-100 shadow-lg rounded-lg p-4">
    <table class="table w-full border border-gray-200">
      <thead>
        <tr class="bg-base-300 text-base-content text-lg">
          <th class="py-4 px-6">ID</th>
          <th class="py-4 px-6">Project Name</th>
          <th class="py-4 px-6">Customer</th>
          <th class="py-4 px-6">Start Date</th>
          <th class="py-4 px-6">End Date</th>
          <th class="py-4 px-6">Total Price</th>
          <th class="py-4 px-6 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="project in projects"
          :key="project.id"
          class="hover border-b border-gray-300 cursor-pointer"
          @click="navigateToProject(project.id)"
        >
          <td class="py-4 px-6">{{ project.id }}</td>
          <td class="py-4 px-6">{{ project.name }}</td>
          <td class="py-4 px-6">{{ project.customer?.name }}</td>
          <td class="py-4 px-6">{{ project.startDate }}</td>
          <td class="py-4 px-6">{{ project.endDate }}</td>
          <td class="py-4 px-6">{{ project.totalProjectPrice }}</td>
          <td class="py-4 px-6 text-center">
            <button
              @click.stop="$emit('edit', project)"
              class="btn btn-warning btn-sm mr-2"
            >
              Edit
            </button>
            <button
              @click.stop="$emit('delete', project.id)"
              class="btn btn-error btn-sm"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import { useRouter } from "vue-router";
import type { Project } from "~/types/project";

const props = defineProps<{ projects: Project[] }>();
const emit = defineEmits(["edit", "delete"]);
const router = useRouter();

const navigateToProject = (id: number) => {
  router.push(`/projects/${id}`);
};
</script>
