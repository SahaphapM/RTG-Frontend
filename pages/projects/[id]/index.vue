<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-4">
      <div class="flex flex-col">
        <h1 class="text-2xl font-semibold">
          {{ isNewProject ? "New Project" : projectStore.project?.name }}
        </h1>
        <div class="flex gap-2">
          <h1 class="text-md">PROJECT No.</h1>
          <h1 class="text-md">{{ projectStore.project?.number }}</h1>
        </div>
      </div>

      <button
        v-if="!isEditing"
        @click="isEditing = true"
        class="w-32 btn btn-warning"
      >
        Edit
      </button>
    </div>

    <!-- Project Form -->
    <ProjectForm :form="form" :isEditing="isEditing" />

    <!-- Project Order -->
    <ProjectOrder
      :projectItems="form.projectItems"
      :isEditing="isEditing"
      @increase-amount="increaseAmount"
      @decrease-amount="decreaseAmount"
      @add-item="addItem"
      @remove-item="removeItem"
    />
    <div class="justify-end"></div>

    <!-- Buttons -->
    <div class="flex justify-between mt-4" v-if="isEditing">
      <div>
        <button
          v-if="isEditing && projectStore.project?.id"
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
          @confirm="confirmDeleteProject"
          @cancel="isDeleteModalOpen = false"
        />
      </div>
      <div class="flex gap-4">
        <button
          type="button"
          @click="resetForm(), (isEditing = false)"
          class="btn btn-error w-32"
        >
          Cancel
        </button>
        <button @click="saveProject" class="btn btn-success w-32">Save</button>
      </div>
    </div>

    <div class="flex justify-end gap-4" v-if="!isEditing">
      <button @click="goBack" class="btn btn-primary w-32">Back</button>
      <button @click="goNext" class="btn btn-primary w-32">Next</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import useProjectService from "~/composables/projectService";
import type { ProjectItem } from "~/types/projectItem";
import type { Customer } from "~/types/customer";
import ProjectOrder from "~/components/project/ProjectOrder.vue";
import type { Item } from "~/types/item";
import type { Project } from "~/types/project";
import ConfirmDelete from "~/components/ConfirmDelete.vue";

const route = useRoute();
const router = useRouter();
const { fetchProject, createProject, updateProject, deleteProject } =
  useProjectService();
const projectStore = useProjectStore();

const isNewProject = ref(false);
const isEditing = ref(false);
const isDeleteModalOpen = ref(false);

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const form = ref<Project>({
  name: "",
  number: "",
  description: "",
  customer: null as Customer | null,
  startDate: formatDate(new Date()), // Format to "YYYY-MM-DD"
  endDate: formatDate(new Date()), // Format to "YYYY-MM-DD"
  projectItems: [] as ProjectItem[],
  totalProjectPrice: 0,
  jobQuotations: [],
});

// Load project data
onMounted(async () => {
  if (route.params.id === "new") {
    isNewProject.value = true;
    isEditing.value = true;
  } else {
    await nextTick(); // รอให้ DOM อัปเดต
    projectStore.project = await fetchProject(Number(route.params.id));
    resetForm();
  }
});

// Save Project
const saveProject = async () => {
  if (isNewProject.value) {
    const updatedProject = await createProject(form.value);
    if (updatedProject) {
      projectStore.project = updatedProject;
      resetForm();
      isNewProject.value = false;

      // เปลี่ยนเส้นทางไปยังหน้าใหม่พร้อมกับ ID ของ project
      router.push(`/projects/${updatedProject.id}`);
    }
  } else {
    // Update existing project
    if (!projectStore.project?.id) return window.alert("Project ID not found");
    await updateProject(projectStore.project.id, form.value);
  }
  isEditing.value = false;
};

const resetForm = () => {
  if (projectStore.project) {
    form.value = {
      ...projectStore.project,
      // id: projectStore.project.id,
      // name: projectStore.project.name,
      // description: projectStore.project.description,
      // customer: projectStore.project.customer || null,
      // startDate: projectStore.project.startDate || new Date().toISOString(),
      // endDate: projectStore.project.endDate || new Date().toISOString(),
      // projectItems: projectStore.project.projectItems
      //   ? JSON.parse(JSON.stringify(projectStore.project.projectItems))
      //   : [], // Ensure it's always an array
      // totalProjectPrice: projectStore.project.totalProjectPrice || 0,
    };
  }
};

const goBack = () => router.push("/projects");

const goNext = () => {
  projectStore.project = projectStore.project;
  router.push(`/projects/${route.params.id}/job-quotations`);
};

////////// item ////////////

const increaseAmount = (index: number) => {
  form.value.projectItems[index].quantity++;
};

const decreaseAmount = (index: number) => {
  if (form.value.projectItems[index].quantity > 1) {
    form.value.projectItems[index].quantity--;
  }
};

const addItem = (item: Item) => {
  // check if item already exists
  const existingItem = form.value.projectItems.find(
    (i) => i.item.id === item.id
  );
  if (existingItem) {
    existingItem.quantity++;
    return;
  }

  form.value.projectItems.push({
    quantity: 1,
    price: item.price,
    totalPrice: item.price,
    item: item,
  });
};

const removeItem = (index: number) => {
  form.value.projectItems.splice(index, 1);
};

// **Delete Project**
const confirmDeleteProject = async () => {
  try {
    if (projectStore.project) {
      await deleteProject(projectStore.project.id!);
      router.push("/projects");
    }
  } catch (error) {
    console.error("Failed to delete purchase order:", error);
  }
};

definePageMeta({
  middleware: "auth-role",
});
</script>
