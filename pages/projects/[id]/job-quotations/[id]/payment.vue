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
          @click="exportInvoicePDF(payment)"
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
    <div class="flex justify-between text-md mt-2">
      <div>
        <label class="block font-bold">Discount:</label>
        <input
          :disabled="!isEditing"
          v-model="payment.discount"
          type="number"
          class="input input-bordered w-60 font-bold"
        />
      </div>
      <div class="text-right flex col">
        <div class="mx-10">
          <div>Sub Total</div>
          <div>Discount</div>
          <div>Total</div>
        </div>
        <div class="font-bold">
          <div>{{ totalPaymentAmount.toLocaleString() }}</div>
          <div>{{ payment.discount.toLocaleString() }}</div>
          <div>{{ payment.total.toLocaleString() }}</div>
        </div>
        <div class="mx-5">
          <div>Baht</div>
          <div>Baht</div>
          <div>Baht</div>
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
import useProjectService from "~/composables/projectService";
import type { JobQuotation } from "~/types/job-quotation";
import type { Payment } from "~/types/payment";
import type { PaymentDetail } from "~/types/paymentDetail";
import type { Project } from "~/types/project";

// **Composables**
const {
  fetchJobQuotation,
  fetchPayments,
  createPayment,
  updatePayment,
  deletePayment,
} = useJobQuotationService();

const { fetchProject } = useProjectService();
const projectStore = useProjectStore();

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
    {
      name: "",
      description: "",
    },
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
  console.log("payments", payment.value.paymentDetails);
};

// **Compute Total in Real-Time**
const totalPaymentAmount = computed(() => {
  const detailsTotal = payment.value.paymentDetails.reduce(
    (sum, detail) => sum + (detail.qty || 0) * (detail.unitPrice || 0),
    0
  );
  const total = Math.max(detailsTotal - (payment.value.discount || 0), 0);
  payment.value.total = total;
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
    return pay.id !== payment.value.id
      ? sum + (pay.total || 0) + (pay.discount || 0)
      : sum;
  }, 0);
  return Math.max(
    jobQuotation.value.priceOffered - (totalPaid + totalPaymentAmount.value),
    0
  );
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

const save = async (payment: Payment) => {
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

const exportInvoicePDF = async (payment: Payment) => {
  const pathParts = route.fullPath.split("/");
  console.log("pathParts", pathParts);
  const project = await fetchProject(Number(pathParts[2]));

  const { default: jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;
  const doc = new jsPDF({
    unit: "mm",
    format: "a4",
    orientation: "portrait",
  });

  var callAddFont = function (this: any) {
    this.addFileToVFS(
      "NotoSansThai-Regular-normal.ttf",
      projectStore.notoThaiSanNormal
    );
    this.addFont("NotoSansThai-Regular-normal.ttf", "NotoSansThai", "normal");
    this.addFileToVFS(
      "NotoSansThai-Bold-normal.ttf",
      projectStore.notoThaiSanBold
    );
    this.addFont("NotoSansThai-Bold-normal.ttf", "NotoSansThai", "bold");
  };
  jsPDF.API.events.push(["addFonts", callAddFont]);

  let yPos = 8;
  const marginLeft = 14;
  const marginRight = 192;

  // Load and add the logo
  const logoPath = "/image/microtecnology-red-logo.jpg"; // Ensure this path is correct
  const img = new Image();
  img.src = logoPath;

  img.onload = function () {
    // Logo
    doc.addImage(img, "PNG", marginLeft - 2, yPos, 100, 24);

    // Head Office
    yPos += 10;

    doc.setFont("NotoSansThai");
    doc.setFontSize(10);
    //red text color
    doc.setTextColor(255, 0, 0);
    doc.text("HEAD OFFICE", marginRight, yPos, { align: "right" });
    doc.text("MICROTECNOLOGY SRL CO.,LTD", marginRight, (yPos += 5), {
      align: "right",
    });
    doc.text("Tax ID 0105554041131", marginRight, (yPos += 5), {
      align: "right",
    });
    doc.text("T: +66 (0)80 050 5462", marginRight, (yPos += 5), {
      align: "right",
    });
    doc.text("E: Socrate@microtecnologysrl.com", marginRight, (yPos += 5), {
      align: "right",
    });
    doc.text(
      "44/47 Muu Baan Harmony view Sukhaphiban 5",
      marginRight,
      (yPos += 5),
      { align: "right" }
    );
    doc.text(
      "Soi 80, Saimai, Or-ingoen, Bangkok 10220 Thailand",
      marginRight,
      (yPos += 5),
      { align: "right" }
    );
    yPos += 10;

    // Invoice Header
    doc.setFont("NotoSansThai", "bold");
    doc.setFontSize(18);
    doc.text("TAX INVOICE / RECEIPT", marginLeft, (yPos += 10));
    doc.setFontSize(15);
    doc.setTextColor(0, 153, 0);
    doc.text("ORIGINAL", marginRight, yPos, { align: "right" });
    doc.setTextColor(0);
    yPos += 6;

    // light blue color
    const lightBlue = [204, 228, 243];

    const r = lightBlue[0];
    const g = lightBlue[1];
    const b = lightBlue[2];

    // Header Details
    const paymentDate = payment.date ? new Date(payment.date) : new Date();
    autoTable(doc, {
      startY: yPos,
      // head: [["Field", "Value"]], // Header row
      body: [
        [
          "Date :",
          paymentDate.toLocaleDateString("en-GB"),
          "Our Ref :",
          payment.ourRef || "",
        ],
        [
          "Tax Invoice :",
          payment.taxInvoice || "",
          "Our Tax ID :",
          payment.ourTax || "",
        ],
      ],
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 2, textColor: [0, 0, 0] },

      columnStyles: {
        0: {
          cellWidth: 30,
          halign: "left",
          fillColor: [r, g, b],
          fontStyle: "bold",
        }, // Field column
        1: { cellWidth: 60, halign: "left" }, // Value column
        2: {
          cellWidth: 30,
          halign: "left",
          fillColor: [r, g, b],
          fontStyle: "bold",
        }, // Value column
        3: { cellWidth: 60, halign: "left" }, // Value column
      },
    });
    yPos = (doc as any).lastAutoTable.finalY + 5;

    autoTable(doc, {
      startY: yPos,
      head: [["Customer Details"]], // Header row
      body: [
        [project.customer?.name || ""],
        [project.customer?.email || ""],
        [project.customer?.contact || ""],
        [project.customer?.address || ""],
      ],
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 2,
        textColor: [0, 0, 0],
        font: "NotoSansThai",
      },
      headStyles: {
        fillColor: [r, g, b],
      },
      columnStyles: {
        0: { cellWidth: 180, halign: "left" }, // Field column
      },
    });

    yPos = (doc as any).lastAutoTable.finalY;

    autoTable(doc, {
      startY: yPos,
      body: [["Tax ID: ", payment.cusTax || ""]],
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 2,
        textColor: [0, 0, 0],
      },

      columnStyles: {
        0: {
          cellWidth: 120,
          halign: "right",
          fontStyle: "bold",
          fillColor: [r, g, b],
        }, // Field column
        1: { cellWidth: 60, halign: "left", fontStyle: "bold" }, // Value column
      },
    });

    yPos = (doc as any).lastAutoTable.finalY + 10;

    // Add your main table first
    autoTable(doc, {
      startY: yPos,
      head: [["Item", "Description", "QTY", "Unit Price", "Amount"]],
      body: payment.paymentDetails.map((detail, index) => [
        index + 1,
        doc.splitTextToSize(detail.description || "", 80),
        detail.qty ? detail.qty : "",
        (detail.unitPrice || "").toLocaleString(),
        (detail.qty && (detail.unitPrice || 0)
          ? (detail.qty || 1) * (detail.unitPrice || 0)
          : ""
        ).toLocaleString(),
      ]),
      theme: "grid",

      styles: {
        fontSize: 10,
        cellPadding: 2,
        textColor: [0, 0, 0],
        font: "NotoSansThai",
      },
      headStyles: {
        fillColor: [r, g, b], // Light blue color for the header background
        textColor: [0, 0, 0], // White text color
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 15, halign: "center" }, // Item #
        1: { cellWidth: 90 }, // Description
        2: { cellWidth: 15, halign: "center" }, // QTY
        3: { cellWidth: 30, halign: "center" }, // Unit Price
        4: { cellWidth: 30, halign: "center" }, // Total Amount
      },
    });

    yPos = (doc as any).lastAutoTable.finalY;

    // Add Total and VAT in a new table
    autoTable(doc, {
      startY: yPos,
      body: [
        ["", "Sub Total", `${payment.total.toLocaleString()}   baht`],
        [
          "",
          `V.A.T.  ${jobQuotation.value?.vatPercentage} %`,
          `${(
            (payment.total * (jobQuotation.value?.vatPercentage || 7)) /
            100
          ).toLocaleString()}   baht`,
        ],
      ],
      // foot: [],
      theme: "grid",
      styles: { fontSize: 10 }, // Light gray background
      columnStyles: {
        0: { cellWidth: 15 }, // Empty space for alignment
        1: {
          cellWidth: 105,
          halign: "right",
          textColor: [0, 0, 0],
        }, // Labels
        2: {
          cellWidth: 60,
          halign: "right",
          textColor: [0, 0, 0],
        }, // Values
      },
    });

    yPos = (doc as any).lastAutoTable.finalY;

    // Add Grand Total in a new table
    autoTable(doc, {
      startY: yPos,
      body: [
        ["", "Grand Total", `${(payment.total * 1.07).toLocaleString()} baht`],
      ],
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 4 }, // Increase cell padding for all rows
      columnStyles: {
        0: { cellWidth: 15, fillColor: [r, g, b] }, // Empty space for alignment
        1: {
          cellWidth: 105,
          halign: "right",
          fontStyle: "bold",
          textColor: [0, 0, 0],
          // fill light gray
          fillColor: [r, g, b],
        }, // Labels
        2: {
          cellWidth: 60,
          halign: "right",
          fontStyle: "bold",
          textColor: [0, 0, 0],
          fillColor: [r, g, b],
        }, // Values
      },
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;
    console.log("yPos", yPos);

    // Example: Adding Payment Terms
    autoTable(doc, {
      startY: yPos,
      head: [["Payment Terms"]],
      body: [[payment.paymentTerms || ""]],
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 2, textColor: [0, 0, 0] },
      headStyles: { fillColor: [r, g, b] },
      columnStyles: { 0: { cellWidth: 180, halign: "left" } },
    });
    yPos = (doc as any).lastAutoTable.finalY + 5;

    // Example: Adding Bank Details
    autoTable(doc, {
      startY: yPos,
      head: [["Bank Details"]],
      body: [
        [payment.bank || ""],
        [payment.accountName || ""],
        [payment.accountNumber || ""],
        [payment.branch || ""],
        [payment.swift || ""],
      ],
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 2,
        textColor: [0, 0, 0],
        font: "NotoSansThai",
      },
      headStyles: { fillColor: [r, g, b] },
      columnStyles: { 0: { cellWidth: 180, halign: "left" } },
    });
    yPos = (doc as any).lastAutoTable.finalY + 10;

    // Example: Adding Receiving Details
    autoTable(doc, {
      startY: yPos,
      body: [
        ["Received by :", payment.receivedBy || ""],
        ["Date :", payment.receivedDate?.toLocaleDateString("en-GB") || ""],
      ],
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 2,
        textColor: [0, 0, 0],
        font: "NotoSansThai",
      },
      columnStyles: {
        0: {
          cellWidth: 30,
          halign: "left",
          fillColor: [r, g, b],
          fontStyle: "bold",
        },
        1: { cellWidth: 150, halign: "left" },
        2: {
          cellWidth: 30,
          halign: "left",
          fillColor: [r, g, b],
          fontStyle: "bold",
        },
        3: { cellWidth: 150, halign: "left" },
      },
    });

    // Save and download the PDF
    doc.save(`Invoice_${payment.id || "New"}.pdf`);
  };
};
</script>
