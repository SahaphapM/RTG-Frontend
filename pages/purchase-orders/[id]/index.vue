<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center pb-4">
      <h1 class="text-2xl font-bold mb-4">Purchase Order Detail</h1>
      <div class="flex gap-2">
        <button
          v-if="!isEditing"
          @click="isEditing = !isEditing"
          class="btn btn-warning w-32"
        >
          Edit
        </button>
        <button
          @click="exportPurchaseOrder"
          v-if="!isEditing"
          class="btn btn-primary w-32"
        >
          Export
        </button>
      </div>
    </div>

    <!-- Purchase Order Information -->
    <div class="grid grid-cols-2 gap-4 mt-4">
      <div>
        <label class="block font-bold">PO Number:</label>
        <input
          :disabled="!isEditing"
          v-model="purchaseOrder.number"
          type="text"
          class="input input-bordered w-full"
        />
      </div>
      <div>
        <label class="block font-bold">QT Number:</label>
        <input
          :disabled="!isEditing"
          v-model="purchaseOrder.qtNumber"
          type="text"
          class="input input-bordered w-full"
        />
      </div>
      <div>
        <SubContractorSearch
          :modelValue="purchaseOrder.subcontractor"
          :isEditing="isEditing"
          @update:model-value="updateSubcontractor"
        />
      </div>
      <div>
        <CustomerSearch
          :modelValue="purchaseOrder.customer"
          :isEditing="isEditing"
        />
      </div>
      <div>
        <label class="block font-bold">Date:</label>
        <input
          :disabled="!isEditing"
          v-model="formattedDate"
          type="date"
          class="input input-bordered w-full"
        />
      </div>
      <div>
        <label class="block font-bold">Tax ID:</label>
        <input
          :disabled="!isEditing"
          v-model="purchaseOrder.taxId"
          type="text"
          class="input input-bordered w-full"
        />
      </div>
      <div>
        <label class="block font-bold">Our Ref:</label>
        <input
          :disabled="!isEditing"
          v-model="purchaseOrder.ourRef"
          type="text"
          class="input input-bordered w-full"
        />
      </div>
      <div>
        <label class="block font-bold">Vat:</label>
        <input
          :disabled="!isEditing"
          v-model="purchaseOrder.vat"
          type="number"
          class="input input-bordered w-full"
        />
      </div>
    </div>

    <!-- Order Details Table -->
    <PaymentTable
      v-if="isEditing || purchaseOrder.orderDetails.length > 0"
      :isEditing="isEditing"
      :details="purchaseOrder.orderDetails"
      @update:details="updateOrderDetails"
    />

    <!-- Discount & Total -->
    <div class="flex justify-between text-md mt-2">
      <div>
        <label class="block font-bold">Discount:</label>
        <input
          :disabled="!isEditing"
          v-model="purchaseOrder.discount"
          type="number"
          class="input input-bordered w-60"
        />
      </div>
      <div class="text-right flex col">
        <div class="mx-10">
          <div>Sub Total</div>
          <div>Discount</div>
          <div>Vat {{ purchaseOrder.vat }}%</div>
          <div class="font-bold text-lg">Total</div>
        </div>
        <div>
          <div>{{ subTotal.toLocaleString() }}</div>
          <div>{{ purchaseOrder.discount.toLocaleString() }}</div>
          <div>
            {{ vat.toLocaleString() }}
          </div>
          <div class="font-bold text-lg">
            {{ totalAmount.toLocaleString() }}
          </div>
        </div>
        <div class="mx-5">
          <div>Baht</div>
          <div>Baht</div>
          <div>Baht</div>
          <div class="font-bold text-lg">Baht</div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="mt-6 flex gap-2">
      <button
        v-if="!isEditing && purchaseOrder.id"
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
        @confirm="confirmDeletePurchaseOrder"
        @cancel="isDeleteModalOpen = false"
      />
      <div class="ml-auto">
        <button
          @click="goBack"
          v-if="!isEditing"
          class="btn btn-secondary w-32"
        >
          Back
        </button>
        <div class="flex gap-2">
          <button
            v-if="isEditing"
            @click="cancelEdit"
            class="btn btn-secondary w-32"
          >
            Cancel
          </button>
          <button
            v-if="isEditing"
            @click="savePurchaseOrder"
            class="btn btn-success w-32"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue";
import CustomerSearch from "~/components/project/customerSearch.vue";
import PaymentTable from "~/components/project/InvoiceTable.vue";
import SubContractorSearch from "~/components/subcontractor/SubContractorSearch.vue";
import usePurchaseOrderService from "~/composables/purchase-orderService";
import type { OrderDetail } from "~/types/orderDetail";
import type { PurchaseOrder } from "~/types/purchase-order";
import type { Subcontractor } from "~/types/subcontractor";

// **Composables**
const {
  fetchPurchaseOrder,
  createPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
  exportPOToPDF,
} = usePurchaseOrderService();

// ** State Store
const stateStore = useStateStore();

// **Route**
const route = useRoute();
const router = useRouter();

// **Default Purchase Order Object**
const newPurchaseOrder = (): PurchaseOrder => ({
  number: "",
  description: "",
  date: new Date().toISOString().split("T")[0],
  subcontractor: {
    name: "",
    address: "",
    email: "",
    contact: "",
  }, // กำหนดค่าเริ่มต้นเป็น object ว่าง
  customer: {
    name: "",
    email: "",
    contact: "",
    address: "",
  }, // กำหนดค่าเริ่มต้นเป็น object ว่าง
  orderDetails: [],
  total: 0,
  discount: 0,
  vat: 0,
  qtNumber: "",
  taxId: "",
  ourRef: "",
});

// **State Variables**
const purchaseOrder = ref<PurchaseOrder>(newPurchaseOrder());
const selectedPurchaseOrderId = ref<number | null>(null);
const isEditing = ref(false);
const isDeleteModalOpen = ref(false);

// **Computed Properties**
const formattedDate = computed({
  get: () => purchaseOrder.value.date,
  set: (value) => (purchaseOrder.value.date = value),
});

const subTotal = computed(() => {
  return purchaseOrder.value.orderDetails.reduce(
    (sum, detail) => sum + (detail.qty || 0) * (detail.unitPrice || 0),
    0
  );
});

const totalAmount = computed(() => {
  return subTotal.value - purchaseOrder.value.discount + vat.value;
});

// **Fetch Data on Mount**
onMounted(async () => {
  if (route.params.id === "new") {
    isEditing.value = !isEditing.value;
  } else {
    nextTick(async () => {
      await refresh();
    });
  }
});

const refresh = async () => {
  if (route.params.id) {
    const data = await fetchPurchaseOrder(Number(route.params.id));

    // Assign the fetched data to the purchaseOrder object
    // แต่ถ้า data.subcontractor เป็น null ให้คงค่าเดิมของ purchaseOrder.value.subcontractor
    if (data.subcontractor === null) {
      data.subcontractor = purchaseOrder.value.subcontractor;
    }

    // ถ้า data.customer เป็น null ให้คงค่าเดิมของ purchaseOrder.value.customer
    if (data.customer === null) {
      data.customer = purchaseOrder.value.customer;
    }

    // Assign the updated data to purchaseOrder.value
    Object.assign(purchaseOrder.value, data);
    isEditing.value = false;
  }
};

// **Update Order Details**
const updateOrderDetails = (details: OrderDetail[]) => {
  purchaseOrder.value.orderDetails = details;
  console.log("Updating order details:", purchaseOrder);
};

// **Update Subcontractor**
const updateSubcontractor = (subcontractor: Subcontractor) => {
  purchaseOrder.value.subcontractor = subcontractor;
};

const vat = computed(() => {
  return (
    (purchaseOrder.value.vat *
      (subTotal.value - purchaseOrder.value.discount)) /
    100
  );
});

// **Save Purchase Order**
const savePurchaseOrder = async () => {
  try {
    if (purchaseOrder.value.id) {
      console.log("Updating purchase order:", purchaseOrder.value);
      purchaseOrder.value.total =
        subTotal.value - purchaseOrder.value.discount + vat.value;
      await updatePurchaseOrder(purchaseOrder.value.id, purchaseOrder.value);
    } else {
      await createPurchaseOrder(purchaseOrder.value);
    }
    await refresh();
  } catch (error) {
    console.error("Failed to save purchase order:", error);
  }
};

// **Delete Purchase Order**
const confirmDeletePurchaseOrder = async () => {
  try {
    if (purchaseOrder.value.id) {
      await deletePurchaseOrder(purchaseOrder.value.id);
      router.push("/purchase-orders");
    }
  } catch (error) {
    console.error("Failed to delete purchase order:", error);
  }
};

// **Cancel Edit**
const cancelEdit = () => {
  isEditing.value = false;
  refresh();
};

// **Go Back**
const goBack = () => {
  router.push("/purchase-orders");
};

// **Export Purchase Order**
const exportPurchaseOrder = () => {
  console.log("Exporting purchase order:", purchaseOrder.value);
  exportPOToPDF(
    purchaseOrder.value,
    stateStore.notoThaiSanNormal,
    stateStore.notoThaiSanBold
  );
};
</script>
