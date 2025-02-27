<template>
  <div class="mt-4">
    <!-- Add New Item Button -->
    <div class="flex justify-between items-end">
      <div class="font-semibold text-md">Invoice Items</div>
      <button
        v-if="isEditing"
        @click="addItem"
        class="btn btn-primary w-32 mb-2"
      >
        Add Item
      </button>
    </div>

    <!-- Table -->
    <div class="table-container">
      <table v-if="isEditing || details.length" class="custom-table">
        <thead>
          <tr class="text-center">
            <th class="w-10 font-semibold">No.</th>
            <!-- <th class=" w-1/5">Name</th> -->
            <th class="font-semibold">Description</th>
            <th class="w-40 font-semibold text-center">QTY</th>
            <th class="w-52 font-semibold text-center">Unit Price</th>
            <th class="w-60 text-right font-semibold">Amount</th>
            <th class="w-28 font-semibold text-center" v-if="isEditing">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(detail, index) in details" :key="index" class="">
            <td class="">{{ index + 1 }}</td>
            <!-- <td class="">
            <input
              v-model="detail.name"
              type="text"
              class="input input-bordered w-full"
              :disabled="!isEditing"
            />
          </td> -->
            <td>
              <textarea
                v-model="detail.description"
                class="textarea textarea-bordered w-full h-[10px]"
                :disabled="!isEditing"
              ></textarea>
            </td>
            <td class="">
              <input
                v-model.number="detail.qty"
                type="number"
                :step="5"
                class="input input-bordered text-center w-full"
                min="1"
                :disabled="!isEditing"
              />
            </td>
            <td class="">
              <input
                type="number"
                :step="10000"
                v-model.number="detail.unitPrice"
                class="input input-bordered text-right w-full pr-8"
                min="0"
                :disabled="!isEditing"
              />
            </td>
            <td class="text-right">
              {{
                (
                  (detail.unitPrice || 0) * (detail.qty || 0) || ""
                ).toLocaleString()
              }}
            </td>
            <td class="text-center" v-if="isEditing">
              <button class="btn btn-error btn-sm" @click="removeRow(index)">
                <TrashIcon class="w-4 h-4" color="white" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
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

// Watch for changes in isEditing and emit update
watch(
  () => props.isEditing === false,
  () => {
    if (props.details.length === 1) {
      if (
        props.details[0].description === "" &&
        props.details[0].unitPrice === 0 &&
        props.details[0].qty === 1
      ) {
        console.log("Removing row...", props.isEditing);
        removeRow(0);
      }
    }
  }
);

onMounted(() => {
  if (props.details.length === 0) addItem();
});
</script>

<style scoped>
.table-container {
  overflow-x: auto;
  background: #ffffff;
  border-radius: 8px;
}
/* Table */
.custom-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ddd;
}

/* Table Header */
.custom-table thead tr {
  background: rgb(231, 231, 231);

  text-align: left;
  font-size: 15px;
  color: #1d1d1d;
}

.custom-table th {
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  font-weight: 600;
  border-bottom: 1px solid #ddd;
}

/* Table Body */
.custom-table td {
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}
</style>
