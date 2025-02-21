<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center pb-4">
      <h1 class="text-2xl font-bold mb-4">{{ projectStore.project?.name }}</h1>
      <div class="flex gap-2">
        <button
          v-if="!isEditing && selectedInvoiceId"
          @click="isEditing = true"
          class="btn btn-warning w-32"
        >
          Edit
        </button>
        <button
          @click="exportInvoicePDF(invoice)"
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

    <!-- Invoice Selection -->
    <div class="flex gap-2">
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
          v-for="invoice in invoices"
          :key="invoice.id!"
          :value="invoice.id"
        >
          Invoice {{ invoice.id }}
        </option>
      </select>
      <button
        class="btn btn-primary w-32"
        v-if="!isEditing"
        @click="addInvoice"
      >
        Add
      </button>
    </div>

    <!-- Invoice Information -->
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
          v-model="invoice.ourRef"
          type="text"
          class="input input-bordered w-full"
        />
      </div>
      <div>
        <label class="block font-bold">Tax Invoice:</label>
        <input
          :disabled="!isEditing"
          v-model="invoice.taxInvoice"
          type="text"
          class="input input-bordered w-full"
        />
      </div>
      <div>
        <label class="block font-bold">Our Tax ID:</label>
        <input
          :disabled="!isEditing"
          v-model="invoice.ourTax"
          type="text"
          class="input input-bordered w-full"
        />
      </div>
      <div>
        <label class="block font-bold">Customer Tax ID:</label>
        <input
          :disabled="!isEditing"
          v-model="invoice.cusTax"
          type="text"
          class="input input-bordered w-full"
        />
      </div>
      <div>
        <label class="block font-bold">Invoice Terms:</label>
        <input
          :disabled="!isEditing"
          v-model="invoice.invoiceTerms"
          type="text"
          class="input input-bordered w-full"
        />
      </div>
    </div>

    <!-- Invoice Table -->
    <InvoiceTable
      :isEditing="isEditing"
      :details="invoice.invoiceDetails"
      @update:details="updateInvoiceDetails"
    />

    <!-- Discount & Total -->
    <div class="flex justify-between text-md mt-2">
      <div>
        <label class="block font-bold">Discount:</label>
        <input
          :disabled="!isEditing"
          v-model="invoice.discount"
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
          <div>{{ totalInvoiceAmount.toLocaleString() }}</div>
          <div>{{ invoice.discount.toLocaleString() }}</div>
          <div>{{ invoice.total.toLocaleString() }}</div>
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
          v-model="invoice.bank"
          type="text"
          class="input input-bordered w-full"
        />
      </div>
      <div>
        <label class="block font-bold">Account Name:</label>
        <input
          :disabled="!isEditing"
          v-model="invoice.accountName"
          type="text"
          class="input input-bordered w-full"
        />
      </div>
      <div>
        <label class="block font-bold">Account Number:</label>
        <input
          :disabled="!isEditing"
          v-model="invoice.accountNumber"
          type="text"
          class="input input-bordered w-full"
        />
      </div>
      <div>
        <label class="block font-bold">Branch:</label>
        <input
          :disabled="!isEditing"
          v-model="invoice.branch"
          type="text"
          class="input input-bordered w-full"
        />
      </div>
      <div>
        <label class="block font-bold">SWIFT:</label>
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
        v-if="!isEditing && invoice.id"
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
        @confirm="confirmDeleteInvoice"
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
            @click="save(invoice)"
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
const projectStore = useProjectStore();
const stateStore = useStateStore();

// **Route**
const route = useRoute();
const router = useRouter();

// **Default Invoice Object**
const newInvoice = (): Invoice => ({
  id: null,
  date: new Date(),
  ourRef: "",
  taxInvoice: "",
  ourTax: "",
  cusTax: "",
  paidDate: null,
  invoiceTerms: "",
  invoiceDetails: [
    {
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
const invoices = ref<Invoice[]>([]);
const invoice = ref<Invoice>(newInvoice());
const selectedInvoiceId = ref<number | null>(null);
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

  const data = await fetchInvoices(Number(route.params.id));
  if (data.length > 0) {
    invoices.value = data;
    selectedInvoiceId.value = invoices.value[0].id;
    invoice.value = invoices.value[0];
    isEditing.value = isEditing.value;
  } else {
    invoices.value = [];
    selectedInvoiceId.value = null;
    invoice.value = newInvoice();
    isEditing.value = !isEditing.value;
  }
  console.log("invoices", invoice.value.invoiceDetails);
};

// **Compute Total in Real-Time**
const totalInvoiceAmount = computed(() => {
  const detailsTotal = invoice.value.invoiceDetails.reduce(
    (sum, detail) => sum + (detail.qty || 0) * (detail.unitPrice || 0),
    0
  );
  const total = Math.max(detailsTotal - (invoice.value.discount || 0), 0);
  invoice.value.total = total;
  return detailsTotal;
});

// **Handle Details Update**
const updateInvoiceDetails = (details: InvoiceDetail[]) => {
  invoice.value.invoiceDetails = details;
};

// **Compute Remaining Balance**
const remainingBalance = computed(() => {
  if (!jobQuotation.value) return 0;

  const totalPaid = invoices.value.reduce((sum, pay) => {
    // Exclude the invoice with the current selectedInvoiceId
    return pay.id !== invoice.value.id
      ? sum + (pay.total || 0) + (pay.discount || 0)
      : sum;
  }, 0);
  return Math.max(
    jobQuotation.value.priceOffered - (totalPaid + totalInvoiceAmount.value),
    0
  );
});

// **Select Invoice**
const selectInvoice = () => {
  invoice.value =
    invoices.value.find((p) => p.id === selectedInvoiceId.value) ||
    newInvoice();
};

// **Add New Invoice**
const addInvoice = () => {
  selectedInvoiceId.value = null;
  isEditing.value = !isEditing.value;
  const invoicesLength = invoices.value.length;
  invoice.value = newInvoice();
  invoice.value.accountName = invoices.value[invoicesLength]?.accountName;
  invoice.value.accountNumber = invoices.value[invoicesLength]?.accountNumber;
  invoice.value.branch = invoices.value[invoicesLength]?.branch;
  invoice.value.swift = invoices.value[invoicesLength]?.swift;
  invoice.value.invoiceTerms =
    invoices.value[invoicesLength]?.invoiceTerms || "";
  invoice.value.taxInvoice = invoices.value[invoicesLength]?.taxInvoice || "";
  invoice.value.ourRef = invoices.value[invoicesLength]?.ourRef || "";
  invoice.value.ourTax = invoices.value[invoicesLength]?.ourTax || "";
  invoice.value.cusTax = invoices.value[invoicesLength]?.cusTax || "";
  invoice.value.bank = invoices.value[invoicesLength]?.bank || "";
  invoice.value.receivedBy = invoices.value[invoicesLength]?.receivedBy || "";
};

const cancelEdit = () => {
  if (invoices.value[0]) {
    invoice.value = JSON.parse(JSON.stringify(invoices.value[0])); // Restore original

    selectedInvoiceId.value = invoice.value.id || null;
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

const save = async (invoice: Invoice) => {
  if (invoice.id) {
    const data = await updateInvoice(invoice);
    console.log("data", data);
  } else {
    if (jobQuotation.value?.id) {
      const data = await createInvoice(jobQuotation.value.id, invoice);
      if (data) {
        invoice.id = data.id;
        selectedInvoiceId.value = data.id;
        invoices.value.push(data);
      }
    }
  }
  isEditing.value = !isEditing.value;
};

const confirmDeleteInvoice = async () => {
  if (selectedInvoiceId.value) {
    await deleteInvoice(selectedInvoiceId.value);
  }

  isDeleteModalOpen.value = false;
  await refresh();
};

const formattedDate = computed({
  get() {
    if (!invoice.value.date) return "";
    const date = new Date(invoice.value.date);
    return date.toISOString().split("T")[0]; // Convert to YYYY-MM-DD format
  },
  set(value: string) {
    invoice.value.date = new Date(value);
  },
});

const exportInvoicePDF = async (invoice: Invoice) => {
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
      stateStore.notoThaiSanNormal
    );
    this.addFont("NotoSansThai-Regular-normal.ttf", "NotoSansThai", "normal");
    this.addFileToVFS(
      "NotoSansThai-Bold-normal.ttf",
      stateStore.notoThaiSanBold
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
    const invoiceDate = invoice.date ? new Date(invoice.date) : new Date();
    autoTable(doc, {
      startY: yPos,
      // head: [["Field", "Value"]], // Header row
      body: [
        [
          "Date :",
          invoiceDate.toLocaleDateString("en-GB"),
          "Our Ref :",
          invoice.ourRef || "",
        ],
        [
          "Tax Invoice :",
          invoice.taxInvoice || "",
          "Our Tax ID :",
          invoice.ourTax || "",
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
      body: [["Tax ID: ", invoice.cusTax || ""]],
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
      body: invoice.invoiceDetails.map((detail, index) => [
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
        ["", "Sub Total", `${invoice.total.toLocaleString()}   baht`],
        [
          "",
          `V.A.T.  ${jobQuotation.value?.vatPercentage} %`,
          `${(
            (invoice.total * (jobQuotation.value?.vatPercentage || 7)) /
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
        ["", "Grand Total", `${(invoice.total * 1.07).toLocaleString()} baht`],
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

    // Example: Adding Invoice Terms
    autoTable(doc, {
      startY: yPos,
      head: [["Invoice Terms"]],
      body: [[invoice.invoiceTerms || ""]],
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
        [invoice.bank || ""],
        [invoice.accountName || ""],
        [invoice.accountNumber || ""],
        [invoice.branch || ""],
        [invoice.swift || ""],
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
        ["Received by :", invoice.receivedBy || ""],
        ["Date :", invoice.receivedDate?.toLocaleDateString("en-GB") || ""],
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
    doc.save(`Invoice_${invoice.id || "New"}.pdf`);
  };
};
</script>
