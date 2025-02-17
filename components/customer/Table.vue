<template>
  <div class="overflow-x-auto bg-base-100 border border-gray-200 rounded-lg">
    <table class="table w-full">
      <thead>
        <tr class="bg-base-300 text-base-content text-lg rounded-lg">
          <th class="py-4 px-6">ID</th>
          <th class="py-4 px-6">Name</th>
          <th class="py-4 px-6">Email</th>
          <th class="py-4 px-6">Contact</th>
          <th class="py-4 px-6 text-center">Actions</th>
        </tr>
      </thead>

      <tbody v-if="isLoading">
        <tr v-for="n in 5" :key="n">
          <td v-for="i in 5" :key="i" class="py-4 px-6">
            <div class="h-4 bg-gray-200 rounded w-full"></div>
          </td>
        </tr>
      </tbody>

      <tbody>
        <tr
          v-for="customer in customers"
          :key="customer.id"
          class="hover border-b border-gray-300"
        >
          <td class="py-4 px-6">{{ customer.id }}</td>
          <td class="py-4 px-6">{{ customer.name }}</td>
          <td class="py-4 px-6">{{ customer.email }}</td>
          <td class="py-4 px-6">{{ customer.contact }}</td>
          <td class="py-4 px-6 text-center">
            <button
              @click="$emit('edit', customer)"
              class="btn btn-warning btn-sm w-16 mr-2"
            >
              Edit
            </button>
            <button
              @click="$emit('delete', customer.id), console.log(customer.id)"
              class="btn btn-error btn-sm w-16"
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
import type { Customer } from "~/types/customer";

defineProps<{ customers: Customer[]; isLoading: boolean }>();
defineEmits(["edit", "delete"]);
</script>
