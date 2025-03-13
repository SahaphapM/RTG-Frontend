<template>
  <div class="p-6" v-if="authStore.user?.role === 'admin'">
    <!-- Header -->
    <div class="flex justify-between items-center pb-4">
      <div class="mb-4">
        <h1 class="text-2xl font-bold">
          {{ projectStore.project?.name }}
        </h1>
        <div>
          <p>Tax Invoice : {{ "No " + invoice.taxInvoice }}</p>
        </div>
      </div>
      <div class="flex gap-4">
        <button
          v-if="!isEditing && selectedInvoiceId"
          @click="isEditing = true"
          class="btn btn-warning w-32 text-white"
        >
          Edit
        </button>
        <div class="dropdown">
          <div
            tabindex="0"
            role="button"
            style="color: white"
            class="btn w-32 btn-primary text-white"
          >
            Export
          </div>
          <ul
            tabindex="0"
            class="dropdown-content menu bg-base-100 rounded-box z-[1] w-32 p-2 shadow font-semibold"
          >
            <li @click="exportInvoicePDF(true)">
              <a>Original</a>
            </li>
            <li @click="exportInvoicePDF(false)">
              <a>Copy</a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Invoice Selection -->
    <div class="flex justify-between">
      <div class="flex gap-4">
        <select
          :disabled="!selectedInvoiceId || isEditing"
          v-model="selectedInvoiceId"
          @change="selectInvoice"
          class="select select-bordered px-4 py-2 rounded-lg w-48"
        >
          <option :value="null" hidden :selected="selectedInvoiceId === null">
            New Invoice
          </option>
          <option
            v-for="(invoice, index) in invoices"
            :key="invoice.id! "
            :value="invoice.id"
            :class="{ 'bg-neutral-300': invoice.paidDate }"
          >
            Invoice {{ index + 1 }}
            <!-- Conditionally render the badge if the invoice is paid -->
            {{ invoice.paidDate ? "Paid" : "" }}
          </option>
        </select>

        <button
          class="btn btn-primary w-32 text-white"
          v-if="!isEditing"
          @click="addInvoice"
        >
          Add
        </button>
        <!-- Date Picker for Paid Date (only shown when editing) -->
        <div class="flex gap-2">
          <input
            v-if="invoice.paidDate"
            :disabled="!isEditing"
            type="date"
            v-model="invoice.paidDate"
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
                'btn-success': invoice.paidDate,
                'bg-neutral-400': !invoice.paidDate,
              }"
            >
              {{ invoice.paidDate ? "Paid" : "Unpaid" }}
            </div>
            <ul
              v-if="isDropdownOpen"
              tabindex="0"
              class="dropdown-content menu bg-base-100 rounded-box z-[1] w-32 p-2 shadow font-semibold"
            >
              <li @click.stop="setUnpaid"><a>Unpaid</a></li>
              <li @click.stop="setPaid"><a>Paid</a></li>
            </ul>
          </div>
        </div>
      </div>
      <!-- Total and Remaining Balance -->
      <div class="flex flex-col justify-end text-lg font-semibold items-end">
        <div class="flex gap-4">
          <div class="font-normal">Quotation Total:</div>
          <span> {{ jobQuotation?.priceOffered?.toLocaleString() }} </span>
          <div class="font-normal">Baht</div>
        </div>
        <div class="flex gap-4">
          <div class="font-normal">Remaining:</div>
          <span> {{ remainingBalance.toLocaleString() }} </span>
          <div class="font-normal">Baht</div>
        </div>
      </div>
    </div>

    <!-- Invoice Information -->
    <div class="grid grid-cols-2 gap-4 mt-4">
      <div>
        <label class="block font-semibold">Date:</label>
        <input
          :disabled="!isEditing"
          v-model="invoice.date"
          type="date"
          class="input input-bordered w-full"
        />
      </div>

      <div>
        <label class="block font-semibold">Our Ref:</label>
        <input
          :disabled="!isEditing"
          v-model="invoice.ourRef"
          type="text"
          class="input input-bordered w-full"
        />
      </div>
      <!-- <div>
        <label class="block font-semibold">Tax Invoice:</label>
        <input
          :disabled="!isEditing"
          v-model="invoice.taxInvoice"
          type="text"
          class="input input-bordered w-full"
        />
      </div> -->
      <!-- <div>
        <label class="block font-semibold">Our Tax ID:</label>
        <input
          :disabled="!isEditing"
          v-model="invoice.ourTax"
          type="text"
          maxlength="13"
          class="input input-bordered w-full"
        />
      </div> -->
      <!-- <div>
        <label class="block font-semibold">Customer Tax ID:</label>
        <input
          :disabled="!isEditing"
          v-model="invoice.cusTax"
          maxlength="13"
          type="text"
          class="input input-bordered w-full"
        />
      </div> -->
    </div>

    <!-- Invoice Table -->
    <InvoiceTable
      class="mt-4"
      :isEditing="isEditing"
      :details="invoice.invoiceDetails"
      :lebel="'Invoice'"
      @update:details="updateInvoiceDetails"
    />

    <!-- Discount & Total -->
    <div class="flex justify-between text-md mt-4">
      <div class="flex-grow">
        <label class="block font-semibold">Discount:</label>
        <input
          :disabled="!isEditing"
          v-model="invoice.discount"
          type="number"
          :step="1000"
          class="input input-bordered w-[25%] font-normal"
        />
      </div>
      <div class="text-right flex col">
        <div class="mx-10">
          <div>Sub Total</div>
          <div>Discount</div>
          <div>Vat {{ jobQuotation?.vatPercentage }}%</div>
          <div class="font-semibold text-lg">Total</div>
        </div>
        <div>
          <div>{{ totalInvoiceAmount.toLocaleString() }}</div>
          <div>{{ invoice.discount.toLocaleString() || "0" }}</div>
          <div>{{ vatPrice.toLocaleString() || "0" }}</div>
          <div class="font-semibold text-lg">
            {{ invoice.total.toLocaleString() }}
          </div>
        </div>
        <div class="mx-5">
          <div>Baht</div>
          <div>Baht</div>
          <div>Baht</div>
          <div class="font-semibold text-lg">Baht</div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block font-semibold">Payment Terms:</label>
        <input
          :disabled="!isEditing"
          v-model="invoice.invoiceTerms"
          type="text"
          class="input input-bordered w-full"
        />
      </div>
      <div>
        <label class="block font-semibold">Bank:</label>
        <input
          :disabled="!isEditing"
          v-model="invoice.bank"
          type="text"
          class="input input-bordered w-full"
        />
      </div>
      <div>
        <label class="block font-semibold">Account Name:</label>
        <input
          :disabled="!isEditing"
          v-model="invoice.accountName"
          type="text"
          class="input input-bordered w-full"
        />
      </div>
      <div>
        <label class="block font-semibold">Account Number:</label>
        <input
          :disabled="!isEditing"
          v-model="invoice.accountNumber"
          type="text"
          class="input input-bordered w-full"
        />
      </div>
      <div>
        <label class="block font-semibold">Branch:</label>
        <input
          :disabled="!isEditing"
          v-model="invoice.branch"
          type="text"
          class="input input-bordered w-full"
        />
      </div>
      <div>
        <label class="block font-semibold">SWIFT:</label>
        <input
          :disabled="!isEditing"
          v-model="invoice.swift"
          type="text"
          class="input input-bordered w-full"
        />
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="mt-6 flex gap-2">
      <button
        v-if="isEditing && selectedInvoiceId"
        @click="isDeleteModalOpen = true"
        class="btn btn-error w-32 text-white"
      >
        Delete
      </button>
      <ConfirmDelete
        v-if="isDeleteModalOpen"
        :isOpen="isDeleteModalOpen"
        title="Confirm Delete"
        message="Are you sure you want to delete this user?"
        confirmText="Yes, Delete"
        cancelText="Cancel"
        primary
        @confirm="confirmDeleteInvoice"
        @cancel="isDeleteModalOpen = false"
      />
      <div class="ml-auto">
        <div class="flex gap-4">
          <button
            @click="goBack"
            v-if="!isEditing"
            class="btn btn-primary w-32 text-white"
          >
            Back
          </button>
        </div>
        <div class="flex gap-4">
          <button
            v-if="isEditing"
            @click="cancelEdit"
            class="btn btn-error w-32 text-white"
          >
            Cancel
          </button>
          <button
            v-if="isEditing"
            @click="save(invoice)"
            class="btn btn-success w-32 text-white"
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
import useJobQuotationService from "~/composables/job-quotationService";
import useProjectService from "~/composables/projectService";
import type { JobQuotation } from "~/types/job-quotation";
import type { Invoice } from "~/types/invoice";
import type { InvoiceDetail } from "~/types/invoiceDetail";
import InvoiceTable from "@/components/project/InvoiceTable.vue";

// **Composables**
const {
  fetchJobQuotation,
  fetchInvoices,
  createInvoice,
  updateInvoice,
  deleteInvoice,
} = useJobQuotationService();

const { fetchProject } = useProjectService();
const authStore = useAuthStore();
const projectStore = useProjectStore();

// **Route**
const route = useRoute();
const router = useRouter();
const invoiceStore = useInvoiceStore();

// **Default Invoice Object**
const newInvoice = (): Invoice => ({
  date: new Date().toISOString().split("T")[0],
  ourRef: "",
  taxInvoice: "",
  paidDate: null,
  invoiceTerms: "",
  invoiceDetails: [],
  total: 0,
  bank: "",
  receivedBy: "",
  receivedDate: null,
  discount: 0,
  branch: "",
  accountName: "",
  accountNumber: "",
  swift: "",
});

// **State Variables**
const jobQuotation = ref<JobQuotation>();
const invoices = ref<Invoice[]>([]);
const invoice = ref<Invoice>(newInvoice());
const selectedInvoiceId = ref<number | null>(null);
const isEditing = ref(false);
const isDeleteModalOpen = ref(false);
// Invoice backup for canceling changes
const invoiceBackup = ref<Invoice>();

const fullPath = route.fullPath;
// Extract projectId and jobquotationid from the full path
const pathParts = fullPath.split("/");
const projectId = pathParts[2]; // extract the third part (index 2)

// สถานะการแสดงผลของ input และ dropdown
const isDropdownOpen = ref(false);

// **Fetch Data on Mount**
onMounted(async () => {
  nextTick(async () => {
    await authStore.initAuth();
    if (!authStore.user) {
      window.alert("User is not authenticated, redirecting to login.");
      router.push("/login");
      return;
    } else if (authStore.user.role !== "admin") {
      router.push("/projects");
      return;
    }
    await refresh();
  });
});

const refresh = async () => {
  jobQuotation.value = await fetchJobQuotation(Number(route.params.id));

  const data = await fetchInvoices(Number(route.params.id));
  if (data.length > 0) {
    const lastIndex = data.length - 1;
    invoices.value = data;
    selectedInvoiceId.value = invoices.value[lastIndex].id || null;
    invoice.value = invoices.value[lastIndex];
    isEditing.value = isEditing.value;
  } else {
    invoices.value = [];
    selectedInvoiceId.value = null;
    invoice.value = newInvoice();
    isEditing.value = !isEditing.value;
  }
  console.log("refresh invoices", invoice.value.invoiceDetails);
};

// **Compute Total in Real-Time**
const totalInvoiceAmount = computed(() => {
  const detailsTotal = invoice.value.invoiceDetails.reduce(
    (sum, detail) => sum + (detail.qty || 0) * (detail.unitPrice || 0),
    0
  );
  const total = Math.max(detailsTotal - (invoice.value.discount || 0), 0);

  return detailsTotal;
});

const vatPrice = computed(() => {
  const totalDiscount = totalInvoiceAmount.value - invoice.value.discount;
  const vatPercentage = jobQuotation.value?.vatPercentage
    ? jobQuotation.value?.vatPercentage
    : 7;
  const vat = (totalDiscount * vatPercentage) / 100;
  invoice.value.total = totalDiscount + vat;
  return vat;
});

// **Handle Details Update**
const updateInvoiceDetails = (details: InvoiceDetail[]) => {
  invoice.value.invoiceDetails = details;
  console.log("Updating invoice details:", invoice.value.invoiceDetails);
};

// **Compute Remaining Balance**
const remainingBalance = computed(() => {
  if (!jobQuotation.value) return 0;

  const totalPaid = invoices.value.reduce((sum, pay) => {
    // Exclude the invoice with the current selectedInvoiceId
    return pay.id !== invoice.value.id
      ? sum +
          (pay.invoiceDetails.reduce(
            (detailSum, detail) => detailSum + (detail.unitPrice || 0),
            0
          ) || 0)
      : sum;
  }, 0);
  return (
    jobQuotation.value.priceOffered - (totalPaid + totalInvoiceAmount.value)
  );
});

// **Select Invoice**
const selectInvoice = () => {
  invoice.value =
    invoices.value.find((p) => p.id === selectedInvoiceId.value) ||
    newInvoice();

  invoiceBackup.value = { ...invoice.value };
};

// **Add New Invoice**
const addInvoice = () => {
  selectedInvoiceId.value = null;
  isEditing.value = !isEditing.value;
  const invoicesLength = invoices.value.length;
  invoice.value = newInvoice();
  // invoice.value.accountName = invoices.value[invoicesLength]?.accountName;
  // invoice.value.accountNumber = invoices.value[invoicesLength]?.accountNumber;
  // invoice.value.branch = invoices.value[invoicesLength]?.branch;
  // invoice.value.swift = invoices.value[invoicesLength]?.swift;
  // invoice.value.invoiceTerms =
  //   invoices.value[invoicesLength]?.invoiceTerms || "";
  // invoice.value.taxInvoice = invoices.value[invoicesLength]?.taxInvoice || "";
  // invoice.value.ourRef = invoices.value[invoicesLength]?.ourRef || "";
  // invoice.value.ourTax = invoices.value[invoicesLength]?.ourTax || "";
  // invoice.value.cusTax = invoices.value[invoicesLength]?.cusTax || "";
  // invoice.value.bank = invoices.value[invoicesLength]?.bank || "";
  // invoice.value.receivedBy = invoices.value[invoicesLength]?.receivedBy || "";
};

const cancelEdit = () => {
  // Restore the original invoice
  if (invoiceBackup.value) {
    invoice.value = { ...invoiceBackup.value };
    selectedInvoiceId.value = invoice.value.id || null;
    isEditing.value = !isEditing.value;
  } else if (invoices.value[invoices.value.length - 1]) {
    invoice.value = JSON.parse(
      JSON.stringify(invoices.value[invoices.value.length - 1])
    ); // Restore original

    selectedInvoiceId.value = invoice.value.id || null;
  }
  if (!invoice.value.id) {
    router.push(`/projects/${projectId}/job-quotations`);
    return;
  }
  isEditing.value = !isEditing.value;
};

const goBack = () => {
  // Use the extracted values to navigate back
  router.push(`/projects/${projectId}/job-quotations`);
};

const save = async (invoiceInput: Invoice) => {
  console.log("invoiceInput", invoiceInput);
  if (invoiceInput.id) {
    const data = await updateInvoice(invoiceInput);
  } else {
    if (jobQuotation.value?.id) {
      const data = await createInvoice(jobQuotation.value.id, invoiceInput);

      if (data) {
        invoice.value = data;
        selectedInvoiceId.value = data.id || null;
        invoices.value.push(data);
      }
    }
  }

  isEditing.value = false;
};

const confirmDeleteInvoice = async () => {
  if (selectedInvoiceId.value) {
    await deleteInvoice(selectedInvoiceId.value);
  }
  isEditing.value = !isEditing.value;
  isDeleteModalOpen.value = false;
  await refresh();
};

// ฟังก์ชันที่ใช้ตั้งค่าว่า "Paid"
const setPaid = () => {
  invoice.value.paidDate = new Date().toISOString().split("T")[0]; // ตั้งค่าวันที่ปัจจุบันเป็น paidDate
  if (!isEditing.value) save(invoice.value);
  isDropdownOpen.value = false; // ปิด dropdown หลังจากเลือก Paid
};

// ฟังก์ชันที่ใช้ตั้งค่าว่า "Unpaid"
const setUnpaid = () => {
  invoice.value.paidDate = null; // ลบค่า paidDate เมื่อเลือก Unpaid
  if (!isEditing.value) save(invoice.value);
  isDropdownOpen.value = false; // ปิด dropdown หลังจากเลือก Unpaid
};

function exportInvoicePDF(isOriginal: boolean) {
  // invoice, true, totalInvoiceAmount, vatPrice
  const pathParts = route.fullPath.split("/");
  invoiceStore.exportInvoicePDF(
    invoice.value,
    isOriginal,
    Number(totalInvoiceAmount.value),
    Number(vatPrice.value),
    Number(jobQuotation.value?.vatPercentage),
    pathParts
  );
}

definePageMeta({
  middleware: "auth-role",
});
</script>
