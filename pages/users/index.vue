<template>
  <NuxtLayout name="default">
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-4">Users List</h1>
      <NuxtLink to="/users/create" class="btn btn-primary mb-4"
        >Add User</NuxtLink
      >

      <Table :items="users" />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import Table from "~/components/Table.vue";
import useCrud from "~/composables/userCrud";

const { fetchUsers } = useCrud();
const users = await fetchUsers();
</script>
