<template>
  <div class="overflow-x-auto bg-base-100 border border-gray-200 rounded-lg">
    <table class="table w-full table-fixed">
      <!-- Table Header -->
      <thead>
        <tr class="bg-base-300 text-base-content border-b text-lg text-left">
          <th class="py-4 px-6 w-16">ID</th>
          <th class="py-4 px-6 w-40">Name</th>
          <th class="py-4 px-6 w-40">Email</th>
          <th class="py-4 px-6 w-32">Position</th>
          <th class="py-4 px-6 w-24">Role</th>
          <th class="py-4 px-6 w-32 text-center">Actions</th>
        </tr>
      </thead>

      <!-- Table Body (Loading Placeholder) -->
      <tbody v-if="isLoading">
        <tr v-for="n in 5" :key="n">
          <td v-for="i in 6" :key="i" class="py-4 px-6">
            <div class="h-4 bg-gray-200 rounded w-full"></div>
          </td>
        </tr>
      </tbody>

      <!-- Table Body (Users Loaded) -->
      <tbody v-else>
        <tr
          v-for="user in users"
          :key="user.id"
          class="hover border-b border-gray-200"
        >
          <td class="py-4 px-6">{{ user.id }}</td>
          <td class="py-4 px-6">{{ user.name }}</td>
          <td class="py-4 px-6">{{ user.email }}</td>
          <td class="py-4 px-6">{{ user.position }}</td>
          <td class="py-4 px-6">
            <span :class="['badge px-3 py-2 bg-gray-200 text-gray-800 ']">
              {{ user.role }}
            </span>
          </td>
          <td class="px-6 text-center flex justify-center gap-2">
            <button
              @click="$emit('edit', user)"
              class="btn btn-sm btn-warning w-16"
            >
              Edit
            </button>
            <button
              @click="$emit('delete', user.id)"
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
          <th colspan="6" class="py-4 px-6 text-center">
            <div class="btn-group">
              <button class="btn btn-primary mr-2">Previous</button>
              <button class="btn btn-primary mr-2">Next</button>
            </div>
          </th>
        </tr>
      </tfoot> -->
    </table>
  </div>
</template>

<script setup lang="ts">
import { DeleteIcon, EditIcon, TrashIcon } from "lucide-vue-next";
import { defineProps, defineEmits } from "vue";
import type { User } from "~/types/user";

defineProps<{ users: User[]; isLoading: boolean }>();
defineEmits(["edit", "delete"]);
</script>
