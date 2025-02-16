<template>
  <div class="overflow-x-auto bg-base-100 border border-gray-200 rounded-lg">
    <table class="table w-full">
      <thead>
        <tr class="bg-base-300 text-base-content text-lg">
          <th class="py-4 px-6">ID</th>
          <th class="py-4 px-6">Name</th>
          <th class="py-4 px-6">Type</th>
          <!-- <th class="py-4 px-6">Address</th> -->
          <th class="py-4 px-6">Email</th>
          <th class="py-4 px-6">Contact</th>
          <th class="py-4 px-6 text-center">Actions</th>
        </tr>
      </thead>

      <tbody v-if="isLoading">
        <tr v-for="n in 5" :key="n">
          <td v-for="i in 7" :key="i" class="py-4 px-6">
            <div class="h-4 bg-gray-200 rounded w-full"></div>
          </td>
        </tr>
      </tbody>

      <tbody>
        <tr
          v-for="subcontractor in subcontractors"
          :key="subcontractor.id"
          class="hover border-b border-gray-300"
        >
          <td class="py-4 px-6">{{ subcontractor.id }}</td>
          <td class="py-4 px-6">{{ subcontractor.name }}</td>
          <td class="py-4 px-6">{{ subcontractor.type }}</td>
          <!-- <td class="py-4 px-6">{{ subcontractor.address }}</td> -->
          <td class="py-4 px-6">{{ subcontractor.email }}</td>
          <td class="py-4 px-6">{{ subcontractor.contact }}</td>
          <td class="py-4 px-6 text-center">
            <button
              @click="$emit('edit', subcontractor)"
              class="btn btn-warning btn-sm w-16 mr-2"
            >
              Edit
            </button>
            <button
              @click="$emit('delete', subcontractor.id)"
              class="btn btn-error btn-sm w-16"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
      <!-- Table Footer pagination -->
      <!-- <tfoot>
        <tr>
          <th colspan="7" class="py-4 px-6 text-center gap-2">
            <div class="btn-group">
              <button class="btn btn-primary">Previous</button>
              <button class="btn btn-primary">Next</button>
            </div>
          </th>
        </tr>
      </tfoot> -->
    </table>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import type { Subcontractor } from "~/types/subcontractor";

defineProps<{ subcontractors: Subcontractor[]; isLoading: boolean }>();
defineEmits(["edit", "delete"]);
</script>
