<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">
        {{ isNewProject ? "New Project" : project?.name }}
      </h1>
      <button
        v-if="!isEditing"
        @click="isEditing = true"
        class="btn btn-warning"
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

    <!-- Buttons -->
    <div class="flex justify-end mt-6" v-if="isEditing">
      <button
        type="button"
        @click="resetForm(), (isEditing = false)"
        class="btn btn-secondary mr-2"
      >
        Cancel
      </button>
      <button @click="saveProject" class="btn btn-success">Save</button>
    </div>

    <div class="h-5"></div>
    <div class="flex justify-end gap-2" v-if="!isEditing">
      <button @click="goBack" class="btn btn-secondary">Back</button>
      <button @click="goNext" class="btn btn-primary">Next</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import useProjectService from "~/composables/projectService";
import type { Project } from "~/types/project";
import type { ProjectItem } from "~/types/projectItem";
import type { Customer } from "~/types/customer";
import ProjectOrder from "~/components/project/ProjectOrder.vue";
import type { Item } from "~/types/item";

const route = useRoute();
const router = useRouter();
const { fetchProject, createProject, updateProject } = useProjectService();

const isNewProject = ref(false);
const project = ref<Project | null>(null);
const isEditing = ref(false);

const form = ref({
  name: "",
  description: "",
  customer: null as Customer | null,
  startDate: new Date(),
  endDate: new Date(),
  projectItems: [] as ProjectItem[],
});

// Load project data
onMounted(async () => {
  if (route.params.id === "new") {
    isNewProject.value = true;
    isEditing.value = true;
  } else {
    nextTick(async () => {
      project.value = await fetchProject(Number(route.params.id));
      resetForm();
    });
  }
});

// Save Project
const saveProject = async () => {
  if (isNewProject.value) {
    await createProject(form.value);
  } else {
    await updateProject(project.value!.id, form.value);
  }
  isEditing.value = false;
};

const resetForm = () => {
  if (project.value) {
    form.value = {
      name: project.value.name,
      description: project.value.description,
      customer: project.value.customer || null,
      startDate: project.value.startDate || new Date(),
      endDate: project.value.endDate || new Date(),
      projectItems: project.value.projectItems
        ? JSON.parse(JSON.stringify(project.value.projectItems))
        : [], // Ensure it's always an array
    };
    console.log("form", form.value);
  }
};

const goBack = () => router.push("/projects");

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
</script>
