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

    <!-- Form Section -->
    <form @submit.prevent="saveProject">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block font-bold">Name</label>
          <input
            v-model="form.name"
            type="text"
            class="input input-bordered w-full"
            :disabled="!isEditing"
            required
          />
        </div>
        <div>
          <label class="block font-bold">Customer</label>
          <div class="flex">
            <input
              v-model="form.customerName"
              type="text"
              class="input input-bordered w-full"
              :disabled="!isEditing"
              required
            />
            <button class="btn btn-secondary ml-2" v-if="isEditing">
              Search
            </button>
            <button class="btn btn-primary ml-2" v-if="isEditing">
              New Customer
            </button>
          </div>
        </div>
      </div>

      <div class="mt-4">
        <label class="block font-bold">Description</label>
        <textarea
          v-model="form.description"
          class="textarea textarea-bordered w-full"
          :disabled="!isEditing"
        ></textarea>
      </div>

      <!-- Date Selection -->
      <div class="grid grid-cols-2 gap-4 mt-4">
        <div>
          <label class="block font-bold">Start Date</label>
          <input
            v-model="form.startDate"
            type="date"
            class="input input-bordered w-full"
            :disabled="!isEditing"
          />
        </div>
        <div>
          <label class="block font-bold">End Date</label>
          <input
            v-model="form.endDate"
            type="date"
            class="input input-bordered w-full"
            :disabled="!isEditing"
          />
        </div>
      </div>

      <!-- Project Order -->
      <div class="mt-6">
        <h2 class="text-xl font-bold">Project Order</h2>
        <div class="flex justify-between mb-2">
          <button v-if="isEditing" class="btn btn-secondary">Search</button>
          <button v-if="isEditing" class="btn btn-primary">New Item</button>
        </div>

        <table class="table w-full border border-gray-200">
          <thead>
            <tr class="bg-base-300 text-lg">
              <th>No.</th>
              <th>Name</th>
              <th>Price</th>
              <th>Amount</th>
              <th>Value</th>
              <th v-if="isEditing">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in form.projectItems" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.item.name }}</td>
              <td>{{ item.price || item.item.price }}</td>
              <td>
                <div class="flex items-center">
                  <button
                    @click="decreaseAmount(index)"
                    class="btn btn-sm"
                    v-if="isEditing"
                  >
                    ➖
                  </button>
                  <span class="mx-2">{{ item.quantity }}</span>
                  <button
                    @click="increaseAmount(index)"
                    class="btn btn-sm"
                    v-if="isEditing"
                  >
                    ➕
                  </button>
                </div>
              </td>
              <td>
                {{
                  (
                    item.price || item.item.price * item.quantity
                  ).toLocaleString()
                }}
              </td>
              <td v-if="isEditing">
                <button @click="removeItem(index)" class="btn btn-error btn-sm">
                  🗑
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="flex justify-between mt-4">
          <span><strong>Item Amount:</strong> {{ totalAmount }}</span>
          <span
            ><strong>Total:</strong>
            {{ totalValue.toLocaleString() }} Bath</span
          >
        </div>
      </div>

      <!-- Buttons -->
      <div class="flex justify-end mt-6">
        <button
          type="button"
          @click="cancelEdit"
          class="btn btn-secondary mr-2"
        >
          Cancel
        </button>
        <button type="submit" class="btn btn-success" v-if="isEditing">
          Save
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import useProjectService from "~/composables/projectService";
import type { Project } from "~/types/project";
import type { ProjectItem } from "~/types/projectItem";

const route = useRoute();
const router = useRouter();
const { fetchProject, createProject, updateProject } = useProjectService();

const isEditing = ref(false);
const isNewProject = ref(false);
const project = ref<Project | null>(null);
const form = ref({
  name: "",
  description: "",
  customerName: "",
  startDate: new Date(),
  endDate: new Date(),
  projectItems: [] as ProjectItem[],
});

// Load project data
onMounted(async () => {
  nextTick(async () => {
    if (route.params.id === "new") {
      isNewProject.value = true;
      isEditing.value = true;
    } else {
      const id = Number(route.params.id);
      project.value = await fetchProject(id);

      console.log(project.value);
      if (!project.value) {
        router.push("/projects"); // Redirect if not found
        return;
      }

      form.value = {
        name: project.value.name,
        description: project.value.description,
        customerName: project.value.customer?.name || "",
        startDate: project.value.startDate || new Date(),
        endDate: project.value.endDate || new Date(),
        projectItems: project.value.projectItems || [],
      };
    }
  });
});

// Save Project
const saveProject = async () => {
  if (isNewProject.value) {
    await createProject(form.value);
  } else {
    await updateProject(project.value!.id, form.value);
  }
  router.push("/projects");
};

// Cancel Edit
const cancelEdit = () => {
  if (isNewProject.value) {
    router.push("/projects");
  } else {
    isEditing.value = false;
  }
};

// Manage Items
const increaseAmount = (index: number) =>
  form.value.projectItems[index].quantity++;
const decreaseAmount = (index: number) => {
  if (form.value.projectItems[index].quantity > 1)
    form.value.projectItems[index].quantity--;
};
const removeItem = (index: number) => form.value.projectItems.splice(index, 1);

const totalAmount = computed(() =>
  form.value.projectItems.reduce((sum, item) => sum + item.quantity, 0)
);
const totalValue = computed(() =>
  form.value.projectItems.reduce(
    (sum, item) => sum + item.item.price * item.quantity,
    0
  )
);
</script>
