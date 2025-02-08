<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center pb-4">
      <h1 class="text-2xl font-bold mb-4">Repair Gear Box Gantry RTG No 8</h1>
      <div class="flex gap-2">
        <button
          v-if="!isEditing && selectedPaymentId"
          @click="isEditing = true"
          class="btn btn-warning w-32"
        >
          Edit
        </button>
        <button
          @click="exportPDF()"
          v-if="!isEditing"
          class="btn btn-primary w-32"
        >
          Export
        </button>
      </div>
    </div>

    <!-- Total and Remaining Balance -->
    <div class="flex justify-end text-xl gap-8 font-bold mb-4">
      <span
        >Quotation Amount:
        {{ jobQuotation?.priceOffered?.toLocaleString() }} Baht</span
      >
      <span>Remaining: {{ remainingBalance.toLocaleString() }} Baht</span>
    </div>

    <!-- Payment Selection -->
    <div class="flex gap-2">
      <select
        :disabled="!selectedPaymentId || isEditing"
        v-model="selectedPaymentId"
        @change="selectPayment"
        class="select select-bordered px-4 py-2 rounded-lg w-48"
      >
        <option :value="null" hidden :selected="selectedPaymentId === null">
          New Payment
        </option>
        <option
          v-for="payment in payments"
          :key="payment.id"
          :value="payment.id"
        >
          Payment {{ payment.id }}
        </option>
      </select>
      <button
        class="btn btn-primary w-32"
        v-if="!isEditing"
        @click="addPayment"
      >
        Add
      </button>
    </div>

    <!-- Payment Information -->
    <div class="grid grid-cols-2 gap-4 mt-4">
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
        <label class="block font-bold">Our Ref:</label>
        <input
          :disabled="!isEditing"
          v-model="payment.ourRef"
          type="text"
          class="input input-bordered w-full"
        />
      </div>
      <div>
        <label class="block font-bold">Tax Invoice:</label>
        <input
          :disabled="!isEditing"
          v-model="payment.taxInvoice"
          type="text"
          class="input input-bordered w-full"
        />
      </div>
      <div>
        <label class="block font-bold">Our Tax ID:</label>
        <input
          :disabled="!isEditing"
          v-model="payment.ourTax"
          type="text"
          class="input input-bordered w-full"
        />
      </div>
      <div>
        <label class="block font-bold">Customer Tax ID:</label>
        <input
          :disabled="!isEditing"
          v-model="payment.cusTax"
          type="text"
          class="input input-bordered w-full"
        />
      </div>
      <div>
        <label class="block font-bold">Payment Terms:</label>
        <input
          :disabled="!isEditing"
          v-model="payment.paymentTerms"
          type="text"
          class="input input-bordered w-full"
        />
      </div>
    </div>

    <!-- Payment Table -->
    <PaymentTable
      :isEditing="isEditing"
      :details="payment.paymentDetails"
      @update:details="updatePaymentDetails"
    />

    <!-- Discount & Total -->
    <div class="flex justify-between text-xl mt-4">
      <div>
        <label>Discount:</label>
        <input
          :disabled="!isEditing"
          v-model="payment.discount"
          type="number"
          class="input input-bordered w-24 ml-2 font-bold"
        />
      </div>
      <div>
        <div class="font-bold">
          Sub Total: {{ totalPaymentAmount.toLocaleString() }} Baht
        </div>
        <div class="font-bold">
          Total: {{ payment.total.toLocaleString() }} Baht
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4 mt-4">
      <div>
        <label class="block font-bold">Bank:</label>
        <input
          :disabled="!isEditing"
          v-model="payment.bank"
          type="text"
          class="input input-bordered w-full"
        />
      </div>
      <div>
        <label class="block font-bold">Account Name:</label>
        <input
          :disabled="!isEditing"
          v-model="payment.accountName"
          type="text"
          class="input input-bordered w-full"
        />
      </div>
      <div>
        <label class="block font-bold">Account Number:</label>
        <input
          :disabled="!isEditing"
          v-model="payment.accountNumber"
          type="text"
          class="input input-bordered w-full"
        />
      </div>
      <div>
        <label class="block font-bold">Branch:</label>
        <input
          :disabled="!isEditing"
          v-model="payment.branch"
          type="text"
          class="input input-bordered w-full"
        />
      </div>
      <div>
        <label class="block font-bold">SWIFT:</label>
        <input
          :disabled="!isEditing"
          v-model="payment.swift"
          type="text"
          class="input input-bordered w-full"
        />
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="mt-6 flex gap-2">
      <button
        v-if="!isEditing && payment.id"
        @click="isDeleteModalOpen = true"
        class="btn btn-error w-32"
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
        @confirm="confirmDeletePayment"
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
            @click="save(payment)"
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
import PaymentTable from "~/components/project/PaymentTable.vue";
import useJobQuotationService from "~/composables/job-quotationService";
import type { JobQuotation } from "~/types/job-quotation";
import type { Payment } from "~/types/payment";
import type { PaymentDetail } from "~/types/paymentDetail";

// **Composables**
const {
  fetchJobQuotation,
  fetchPayments,
  createPayment,
  updatePayment,
  deletePayment,
} = useJobQuotationService();

// **Route**
const route = useRoute();
const router = useRouter();

// **Default Payment Object**
const newPayment = (): Payment => ({
  id: null,
  date: new Date(),
  ourRef: "",
  taxInvoice: "",
  ourTax: "",
  cusTax: "",
  paidDate: null,
  paymentTerms: "",
  paymentDetails: [
    // {
    //   description: "",
    //   qty: 0,
    //   unitPrice: 0,
    // },
  ],
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
const payments = ref<Payment[]>([]);
const payment = ref<Payment>(newPayment());
const selectedPaymentId = ref<number | null>(null);
const isEditing = ref(false);
const isDeleteModalOpen = ref(false);

// **Fetch Data on Mount**
onMounted(async () => {
  nextTick(async () => {
    await refresh();
  });
});

const refresh = async () => {
  jobQuotation.value = await fetchJobQuotation(Number(route.params.id));

  const data = await fetchPayments(Number(route.params.id));
  if (data.length > 0) {
    payments.value = data;
    selectedPaymentId.value = payments.value[0].id;
    payment.value = payments.value[0];
    isEditing.value = isEditing.value;
  } else {
    payments.value = [];
    selectedPaymentId.value = null;
    payment.value = newPayment();
    isEditing.value = !isEditing.value;
  }
};

// if payment date is null, set it to current date
// const formattedDate = computed(() => {
//   const date = payment.value.date;
//   if (!date) {
//     return new Date().toISOString().split("T")[0];
//   }
//   return date.toISOString().split("T")[0];
// });

// **Compute Total in Real-Time**
const totalPaymentAmount = computed(() => {
  const detailsTotal = payment.value.paymentDetails.reduce(
    (sum, detail) => sum + (detail.qty || 0) * (detail.unitPrice || 0),
    0
  );

  console.log("detailsTotalotal", detailsTotal);

  const total = Math.max(detailsTotal - (payment.value.discount || 0), 0);
  payment.value.total = total;
  console.log("payment total", payment.value.total);
  return detailsTotal;
});

// **Handle Details Update**
const updatePaymentDetails = (details: PaymentDetail[]) => {
  payment.value.paymentDetails = details;
};

// **Compute Remaining Balance**
const remainingBalance = computed(() => {
  if (!jobQuotation.value) return 0;

  const totalPaid = payments.value.reduce((sum, pay) => {
    // Exclude the payment with the current selectedPaymentId
    return pay.id !== selectedPaymentId.value
      ? sum + (pay.total || 0) - (pay.discount || 0)
      : sum;
  }, 0);

  // Add the total of the current payment being edited
  const currentPaymentTotal = payment.value?.total || 0;

  return jobQuotation.value.priceOffered - (totalPaid + currentPaymentTotal);
});

// **Select Payment**
const selectPayment = () => {
  payment.value =
    payments.value.find((p) => p.id === selectedPaymentId.value) ||
    newPayment();
};

// **Add New Payment**
const addPayment = () => {
  selectedPaymentId.value = null;
  isEditing.value = !isEditing.value;
  const paymentsLength = payments.value.length;
  payment.value = newPayment();
  payment.value.accountName = payments.value[paymentsLength]?.accountName;
  payment.value.accountNumber = payments.value[paymentsLength]?.accountNumber;
  payment.value.branch = payments.value[paymentsLength]?.branch;
  payment.value.swift = payments.value[paymentsLength]?.swift;
  payment.value.paymentTerms =
    payments.value[paymentsLength]?.paymentTerms || "";
  payment.value.taxInvoice = payments.value[paymentsLength]?.taxInvoice || "";
  payment.value.ourRef = payments.value[paymentsLength]?.ourRef || "";
  payment.value.ourTax = payments.value[paymentsLength]?.ourTax || "";
  payment.value.cusTax = payments.value[paymentsLength]?.cusTax || "";
  payment.value.bank = payments.value[paymentsLength]?.bank || "";
  payment.value.receivedBy = payments.value[paymentsLength]?.receivedBy || "";
};

const cancelEdit = () => {
  if (payments.value[0]) {
    payment.value = JSON.parse(JSON.stringify(payments.value[0])); // Restore original

    selectedPaymentId.value = payment.value.id || null;
    isEditing.value = !isEditing.value;
  } else {
    isEditing.value = !isEditing.value;
  }
};

const goBack = () => {
  const fullPath = route.fullPath;

  // Extract projectId and jobquotationid from the full path
  const pathParts = fullPath.split("/");
  const projectId = pathParts[2]; // extract the third part (index 2)

  // Use the extracted values to navigate back
  router.push(`/projects/${projectId}/job-quotations`);
};

const exportPDF = () => {};

const save = async (payment: Payment) => {
  console.log("payment", payment.paymentDetails);
  if (payment.id) {
    const data = await updatePayment(payment);
    console.log("data", data);
  } else {
    if (jobQuotation.value?.id) {
      const data = await createPayment(jobQuotation.value.id, payment);
      if (data) {
        payment.id = data.id;
        selectedPaymentId.value = data.id;
        payments.value.push(data);
      }
    }
  }
  isEditing.value = !isEditing.value;
};

const confirmDeletePayment = async () => {
  if (selectedPaymentId.value) {
    await deletePayment(selectedPaymentId.value);
  }

  isDeleteModalOpen.value = false;
  await refresh();
};

const formattedDate = computed({
  get() {
    if (!payment.value.date) return "";
    const date = new Date(payment.value.date);
    return date.toISOString().split("T")[0]; // Convert to YYYY-MM-DD format
  },
  set(value: string) {
    payment.value.date = new Date(value);
  },
});
</script>
