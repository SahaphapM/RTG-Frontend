<template>
  <div class="relative">
    <label class="block font-semibold">Project</label>
    <div class="relative w-full">
      <input
        v-model="searchQuery"
        @focus="showDropdown = true"
        type="text"
        class="input input-bordered w-full pr-10"
        :disabled="!isEditing"
        required
      />
      <Search
        class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
      />
      <!-- Search Icon -->
    </div>

    <ul
      v-if="showDropdown && filteredProjects.length"
      class="absolute w-full bg-white shadow-lg border rounded-lg z-10 mt-1"
    >
      <li
        v-for="project in filteredProjects"
        :key="project.id"
        @click="selectProject(project)"
        class="p-2 hover:bg-gray-100 cursor-pointer"
      >
        {{ project.name }}
        <div class="text-xs text-gray-500">{{ project.number }}</div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { Search } from "lucide-vue-next";
import { ref, computed, defineProps, defineEmits, watch, onMounted } from "vue";
import useProjectService from "~/composables/projectService";
import type { Project } from "~/types/project";

const props = defineProps<{
  modelValue: Project | null;
  isEditing: boolean;
}>();
const emit = defineEmits(["update:modelValue"]);

const { fetchProjects } = useProjectService();
const searchQuery = ref("");
const showDropdown = ref(false);

const selectedProject = ref<Project | null>(null);
const projects = ref<Project[]>([]);

// Filtered projects based on search query
const filteredProjects = computed(() =>
  searchQuery.value
    ? projects.value.filter((project: Project) =>
        project.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    : []
);

// Select a project from the dropdown
const selectProject = (project: Project) => {
  searchQuery.value = project.name;
  selectedProject.value = project;
  emit("update:modelValue", project);
  showDropdown.value = false;
};

// Watch for changes in modelValue
watch(
  () => props.modelValue,
  (newValue) => {
    console.log("newValue", newValue);
    selectedProject.value = newValue;
    searchQuery.value = newValue ? newValue.name : "";
    emit("update:modelValue", newValue);
  },
  { immediate: true }
);

// Fetch projects on mount
onMounted(async () => {
  nextTick(async () => {
    projects.value = await fetchProjects();
  });
});
</script>
