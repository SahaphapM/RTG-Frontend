<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center pb-4">
      <div class="flex flex-col">
        <h1 class="text-2xl font-semibold">Purchase Order Detail</h1>
        <div class="flex gap-2">
          <h1 class="text-md">No.</h1>
          <h1 class="text-md">{{ purchaseOrder.number }}</h1>
        </div>
      </div>
      <div class="flex gap-2">
        <button
          v-if="!isEditing"
          @click="isEditing = !isEditing"
          class="btn btn-warning w-32 text-white"
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

    <div class="flex gap-10">
      <div class="w-[40%]">
        <div class="rounded-lg flex flex-col items-center">
          <CertificateViewer :previewUrl="previewUrl || examplePdf" />
        </div>
        <!-- File Upload -->
        <div v-if="isEditing" class="flex mt-5 items-center justify-center">
          <label
            class="flex items-center border-dashed border-2 border-neutral-500 rounded-lg px-4 py-2 text-center bg-neutral-100 text-gray-600 cursor-pointer hover:bg-neutral-300 hover:border-neutral-700 transition-all"
            :class="isEditing ? 'cursor-pointer' : 'cursor-default'"
          >
            <input
              type="file"
              class="hidden"
              accept="application/pdf"
              @change="handleFileUpload"
              :disabled="!isEditing"
            />
            <span v-if="!purchaseOrder.file">Click to upload PDF</span>
            <span v-else
              >{{ file?.name ? file.name : purchaseOrder.file }}
            </span>
            <HardDriveUpload class="w-7 h-7 ml-5" />
          </label>
        </div>
      </div>
      <div class="flex-grow mt-6 items-center">
        <div class="flex gap-4">
          <div class="flex-grow">
            <label class="block text-md font-semibold mt-2">QT Number:</label>
            <input
              :disabled="!isEditing"
              v-model="purchaseOrder.qtNumber"
              type="text"
              class="input input-bordered w-full"
            />
          </div>
          <!-- Date Picker for Paid Date (only shown when editing) -->
          <div class="gap-2 w-[50%] mb-4">
            <label class="block text-md font-semibold mt-2">Delivery:</label>
            <div class="flex gap-2">
              <input
                v-if="purchaseOrder.shippedDate"
                :disabled="!isEditing"
                type="date"
                v-model="purchaseOrder.shippedDate"
                class="input input-bordered w-full"
              />
              <div class="dropdown">
                <div
                  tabindex="0"
                  role="button"
                  style="color: white"
                  class="btn w-32"
                  @click="isDropdownOpen = true"
                  :class="{
                    'btn-success': purchaseOrder.shippedDate,
                    'bg-neutral-400': !purchaseOrder.shippedDate,
                  }"
                >
                  {{ purchaseOrder.shippedDate ? "Shipped" : "Shipping" }}
                </div>
                <ul
                  v-if="isDropdownOpen"
                  tabindex="0"
                  class="dropdown-content menu bg-base-100 rounded-box z-[1] w-32 p-2 shadow font-semibold"
                >
                  <li @click.stop="setShipping"><a>shipping</a></li>
                  <li @click.stop="setShipped"><a>shipped</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-4">
          <label class="block font-semibold">Our Ref:</label>
          <input
            :disabled="!isEditing"
            v-model="purchaseOrder.ourRef"
            type="text"
            class="input input-bordered w-full"
          />
        </div>
        <div class="mb-4">
          <SubContractorSearch
            :modelValue="purchaseOrder.subcontractor"
            :isEditing="isEditing"
            @update:model-value="updateSubcontractor"
          />
        </div>
        <div class="mb-4">
          <CustomerSearch
            :modelValue="purchaseOrder.customer"
            :isEditing="isEditing"
          />
        </div>
        <div class="mb-4">
          <label class="block font-semibold">Date:</label>
          <input
            :disabled="!isEditing"
            v-model="formattedDate"
            type="date"
            class="input input-bordered w-full"
          />
        </div>

        <div class="mb-4">
          <label class="block font-semibold">Description:</label>
          <textarea
            :disabled="!isEditing"
            v-model="purchaseOrder.description"
            class="textarea textarea-bordered w-full text-lg min-h-32"
          ></textarea>
        </div>
      </div>
    </div>

    <div>
      <!-- Order Details Table -->
      <PaymentTable
        v-if="isEditing || purchaseOrder.orderDetails.length > 0"
        :isEditing="isEditing"
        :details="purchaseOrder.orderDetails"
        @update:details="updateOrderDetails"
      />
    </div>

    <!-- Discount & Total -->
    <div
      class="flex justify-between text-md mt-4"
      v-if="purchaseOrder.orderDetails.length > 0"
    >
      <div class="flex gap-4">
        <div>
          <label class="block font-semibold">Vat:</label>
          <input
            :disabled="!isEditing"
            v-model="purchaseOrder.vat"
            type="number"
            class="input input-bordered w-full"
          />
        </div>
        <div>
          <label class="block font-semibold">Discount:</label>
          <input
            :disabled="!isEditing"
            v-model="purchaseOrder.discount"
            type="number"
            class="input input-bordered w-full"
          />
        </div>
      </div>
      <div class="text-right flex col">
        <div class="mx-10">
          <div>Sub Total</div>
          <div>Discount</div>
          <div>Vat {{ purchaseOrder.vat }}%</div>
          <div class="font-semibold">Total</div>
        </div>
        <div>
          <div>{{ subTotal.toLocaleString() }}</div>
          <div>{{ purchaseOrder.discount.toLocaleString() }}</div>
          <div>
            {{ vat.toLocaleString() }}
          </div>
          <div class="font-semibold">
            {{ totalAmount.toLocaleString() }}
          </div>
        </div>
        <div class="mx-5">
          <div>Baht</div>
          <div>Baht</div>
          <div>Baht</div>
          <div class="font-semibold">Baht</div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="mt-6 flex gap-2">
      <button
        v-if="isEditing && purchaseOrder.id"
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
        <button @click="goBack" v-if="!isEditing" class="btn btn-primary w-32">
          Back
        </button>
        <div class="flex gap-2">
          <button
            v-if="isEditing"
            @click="cancelEdit"
            class="btn btn-error w-32"
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
import { HardDriveUpload } from "lucide-vue-next";
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
  uploadQoutationFile,
  fetchQuotationFile,
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
    taxId: "",
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
  vat: 7,
  qtNumber: "",
  ourRef: "",
  file: null,
  name: "",
  shippedDate: null,
});

// **State Variables**
const purchaseOrder = ref<PurchaseOrder>(newPurchaseOrder());
const selectedPurchaseOrderId = ref<number | null>(null);
const isEditing = ref(false);
const isDeleteModalOpen = ref(false);

const file = ref<File | null>(null); // Store uploaded file
const previewUrl = ref<string | null>(null); // Store preview URL
const isUploading = ref(false);
const examplePdf = "/pdf/sample.pdf"; // ✅ Correct Path

// สถานะการแสดงผลของ input และ dropdown
const showDateInput = ref(false);
const isDropdownOpen = ref(false);

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

const vat = computed(() => {
  return (
    (purchaseOrder.value.vat *
      (subTotal.value - purchaseOrder.value.discount)) /
    100
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

// Handle File Upload
const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;

  // Store the selected file
  file.value = input.files[0];

  // Generate a preview URL for the PDF
  previewUrl.value = URL.createObjectURL(file.value);

  isUploading.value = true;
};

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
    if (purchaseOrder.value.file) {
      previewUrl.value = await fetchQuotationFile(purchaseOrder.value.file); // Fetch PDF URL
      file.value = null;
    }

    // set shipped date
    if (purchaseOrder.value.shippedDate) {
      showDateInput.value = true;
    }
    isEditing.value = false;
  }
};

// **Update Order Details**
const updateOrderDetails = (details: OrderDetail[]) => {
  purchaseOrder.value.orderDetails = details;
};

// **Update Subcontractor**
const updateSubcontractor = (subcontractor: Subcontractor) => {
  purchaseOrder.value.subcontractor = subcontractor;
};

// **Save Purchase Order**
const savePurchaseOrder = async () => {
  try {
    if (purchaseOrder.value.id) {
      purchaseOrder.value.total =
        subTotal.value - purchaseOrder.value.discount + vat.value;
      await updatePurchaseOrder(purchaseOrder.value.id, purchaseOrder.value);
    } else {
      console.log("save New");
      const savedPurchaseOrder = await createPurchaseOrder(purchaseOrder.value);

      if (savedPurchaseOrder) {
        purchaseOrder.value = savedPurchaseOrder;
        router.push(`/purchase-orders/${savedPurchaseOrder.id}`);
      }
    }

    if (isUploading.value && file.value && purchaseOrder.value.id) {
      const result = await uploadQoutationFile(
        purchaseOrder.value.id,
        file.value
      );
      if (result) {
        purchaseOrder.value.file = result.filename; // Update certificate file name after upload
      }
    }
    isEditing.value = false;
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
  exportPOToPDF(
    purchaseOrder.value,
    stateStore.notoThaiSanNormal,
    stateStore.notoThaiSanBold
  );
};

// ฟังก์ชันที่ใช้ตั้งค่าว่า "setShipped"
const setShipped = () => {
  showDateInput.value = true; // แสดง input ของวันที่เมื่อเลือก Paid
  purchaseOrder.value.shippedDate = new Date().toISOString().split("T")[0]; // ตั้งค่าวันที่ปัจจุบันเป็น paidDate
  if (!isEditing.value) savePurchaseOrder();
  isDropdownOpen.value = false; // ปิด dropdown หลังจากเลือก Paid
};

// ฟังก์ชันที่ใช้ตั้งค่าว่า "Unpaid"
const setShipping = () => {
  purchaseOrder.value.shippedDate = null; // ลบค่า paidDate เมื่อเลือก Unpaid
  showDateInput.value = false; // ซ่อน input วันที่เมื่อเลือก Unpaid
  if (!isEditing.value) savePurchaseOrder();
  isDropdownOpen.value = false; // ปิด dropdown หลังจากเลือก Unpaid
};
</script>
