<template>
  <div class="mt-4">
    <!-- Add New Item Button -->
    <div class="flex justify-end mb-4">
      <button v-if="isEditing" @click="addItem" class="btn btn-primary w-32">
        Add Item
      </button>
    </div>

    <!-- Table -->
    <table class="table-auto w-full border border-gray-300">
      <thead>
        <tr class="bg-gray-200 text-center">
          <th class="p-2 border w-12 font-semibold">Item</th>
          <!-- <th class="p-2 border w-1/5">Name</th> -->
          <th class="p-2 border w-2/5 font-semibold">Description</th>
          <th class="p-2 border w-16 font-semibold">QTY</th>
          <th class="p-2 border w-24 font-semibold">Unit Price</th>
          <th class="p-2 border w-24 text-right font-semibold">Amount</th>
          <th class="p-2 border w-16 font-semibold" v-if="isEditing">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(detail, index) in details"
          :key="index"
          class="border text-center"
        >
          <td class="p-2 border">{{ index + 1 }}</td>
          <!-- <td class="p-2 border">
            <input
              v-model="detail.name"
              type="text"
              class="input input-bordered w-full"
              :disabled="!isEditing"
            />
          </td> -->
          <td class="p-2 border">
            <textarea
              v-model="detail.description"
              class="textarea textarea-bordered w-full resize-none h-4"
              :disabled="!isEditing"
              @input="autoResize($event)"
            ></textarea>
          </td>
          <td class="p-2 border">
            <input
              v-model.number="detail.qty"
              type="number"
              :step="5"
              class="input input-bordered text-center w-full"
              min="1"
              :disabled="!isEditing"
            />
          </td>
          <td class="p-2 border">
            <input
              type="number"
              :step="10000"
              v-model.number="detail.unitPrice"
              class="input input-bordered text-right w-full"
              min="0"
              :disabled="!isEditing"
            />
          </td>
          <td class="p-2 border text-right">
            {{
              (
                (detail.unitPrice || 0) * (detail.qty || 0) || ""
              ).toLocaleString()
            }}
          </td>
          <td class="p-2 border" v-if="isEditing">
            <button class="btn btn-error btn-sm" @click="removeRow(index)">
              <TrashIcon class="w-4 h-4" color="white" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { TrashIcon } from "lucide-vue-next";
import { defineProps, defineEmits } from "vue";

// Props to receive details
const props = defineProps(["details", "isEditing"]);

// Emit event for updating details in parent
const emit = defineEmits(["update:details"]);

// Emit updates whenever a field changes
const updateDetails = () => {
  emit("update:details", props.details);
};

// Add a new row
const addItem = () => {
  props.details.push({
    description: "",
    qty: 1,
    unitPrice: 0,
  });
  updateDetails();
};

const autoResize = (event: any) => {
  const textarea = event.target;
  textarea.style.height = "auto"; // Reset height to auto
  textarea.style.height = `${textarea.scrollHeight}px`; // Set height to scrollHeight
};

// Remove a row and emit update
const removeRow = (index: number) => {
  props.details.splice(index, 1);
  updateDetails();
};

// Watch for changes in details and emit update
watch(
  () => props.details,
  () => {
    updateDetails();
  },
  { deep: true }
);
</script>
