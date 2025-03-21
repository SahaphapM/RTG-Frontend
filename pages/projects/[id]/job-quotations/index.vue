<template>
  <div class="p-6" v-if="authStore.user?.role === 'admin'">
    <!-- Header -->
    <div class="flex justify-between items-center pb-4">
      <h1 class="text-2xl font-bold">{{ projectStore.project?.name }}</h1>
      <div class="flex gap-4">
        <button
          v-if="!isEditing && selectedQuotationId"
          @click="startEdit"
          class="btn btn-warning w-32 text-white"
        >
          Edit
        </button>
        <button
          class="btn btn-primary w-32 text-white"
          style="color: white"
          @click="exportToPDF"
        >
          Export
        </button>
      </div>
    </div>

    <!-- Job Quotation Selection & Customer Info -->
    <div class="flex justify-between items-center mt-4">
      <div class="flex gap-4">
        <select
          v-model="selectedQuotationId"
          @change="loadSelectedQuotation"
          :disabled="projectStore.project?.jobQuotations.length === 0"
          class="select select-bordered px-4 py-2 rounded-lg w-48"
        >
          <option :value="null" :hidden="true">New Job Quotation</option>
          <option
            class="text-md"
            v-for="(quote, index) in projectStore.project?.jobQuotations"
            :key="quote.id"
            :value="quote.id"
          >
            Job Quotation {{ index + 1 }}
          </option>
        </select>
        <button
          class="btn btn-primary w-32 text-white"
          @click="createNewQuotation"
          v-if="!isEditing"
        >
          New
        </button>
      </div>
      <!-- <div class="text-right w-[40%]">
        <p class="text-lg font-semibold">
          {{ projectStore.project?.customer?.name }}
        </p>
        <p class="text-lg">{{ projectStore.project?.customer?.email }}</p>
      </div> -->

      <!-- Price -->
      <div class="flex justify-end gap-4 items-center">
        <h2 class="text-lg font-semibold">Total Price</h2>

        <input
          v-model="quotation.priceOffered"
          type="text"
          class="input input-bordered w-64 text-right text-xl font-semibold"
          :disabled="!isEditing"
        />
        <span class="text-lg font-medium">Bath</span>
      </div>
    </div>

    <!-- Description -->
    <div class="mt-6">
      <h2 class="text-lg font-semibold">Description</h2>
      <textarea
        v-model="quotation.description"
        class="textarea textarea-bordered p-3 rounded-lg h-[130px] w-full text-lg"
        :disabled="!isEditing"
      />
    </div>

    <!-- Commercial Conditions -->
    <div class="grid grid-cols-2 gap-4 mt-2">
      <div>
        <h3 class="text-lg font-medium">Our Ref</h3>
        <input
          v-model="quotation.ourRef"
          type="text"
          class="input input-bordered w-full"
          :disabled="!isEditing"
        />
      </div>
      <div>
        <h3 class="text-lg font-medium">Payment</h3>
        <input
          v-model="quotation.invoiceTerms"
          type="text"
          class="input input-bordered w-full"
          :disabled="!isEditing"
        />
      </div>
      <div>
        <h3 class="text-lg font-medium">Delivery</h3>
        <input
          v-model="quotation.deliveryTime"
          type="text"
          class="input input-bordered w-full"
          :disabled="!isEditing"
        />
      </div>

      <div>
        <h3 class="text-lg font-medium">Vat %</h3>
        <input
          v-model="quotation.vatPercentage"
          type="number"
          class="input input-bordered w-full"
          :disabled="!isEditing"
        />
      </div>
    </div>

    <div>
      <h3 class="text-lg font-medium">Delivery Place</h3>
      <input
        v-model="quotation.deliveryPlace"
        type="text"
        class="input input-bordered w-full"
        :disabled="!isEditing"
      />
    </div>

    <!-- Message -->
    <div class="mt-4">
      <h2 class="text-lg font-medium mb-4">Message</h2>
      <textarea
        v-model="quotation.message"
        class="textarea textarea-bordered w-full h-[130px] border p-3 text-lg"
        :disabled="!isEditing"
      />
    </div>

    <!-- Action Buttons -->
    <div class="mt-6 flex justify-between gap-4">
      <div>
        <button
          v-if="isEditing && selectedQuotationId"
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
          @confirm="confirmDeleteInvoice"
          @cancel="isDeleteModalOpen = false"
        />
      </div>

      <div class="flex justify-end gap-4">
        <button
          @click="goBack"
          v-if="!isEditing"
          class="btn btn-primary w-32 text-white"
        >
          Back
        </button>
        <button
          @click="goNext"
          v-if="!isEditing"
          class="btn btn-primary w-32 text-white"
        >
          Next
        </button>
        <button
          v-if="isEditing"
          @click="cancelEdit"
          class="btn btn-error w-32 text-white"
        >
          Cancel
        </button>
        <button
          v-if="isEditing"
          @click="saveQuotation"
          class="btn btn-success w-32 text-white"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Watch } from "lucide-vue-next";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import ConfirmDelete from "~/components/ConfirmDelete.vue";
import useJobQuotationService from "~/composables/job-quotationService";
import useProjectService from "~/composables/projectService";
import type { JobQuotation } from "~/types/job-quotation";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const projectStore = useProjectStore();
const {
  fetchByProjectId,
  updateJobQuotation,
  createJobQuotation,
  deleteJobQuotation,
} = useJobQuotationService();
const { fetchProject } = useProjectService();

const stateStore = useStateStore();
const isEditing = ref(false);
const selectedQuotationId = ref<number | null>(null);
const originalQuotation = ref<JobQuotation>();
const isDeleteModalOpen = ref(false);

const newQuotationTemplate: JobQuotation = {
  description: "",
  invoiceTerms: "",
  deliveryTime: "",
  deliveryPlace: "",
  vatPercentage: 7,
  message: "",
  priceOffered: 0,
  ourRef: "",
};

const quotation = ref<JobQuotation>({ ...newQuotationTemplate });

// Fetch project and initialize quotation
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

    projectStore.project = await fetchProject(Number(route.params.id));
    projectStore.project.jobQuotations = await fetchByProjectId(
      Number(route.params.id)
    );
    if (projectStore.project.jobQuotations.length > 0) {
      const lastIndex = projectStore.project.jobQuotations.length - 1;
      if (!projectStore.project.jobQuotations[lastIndex].id) return;
      selectedQuotationId.value =
        projectStore.project.jobQuotations[lastIndex].id;
      loadSelectedQuotation();
    } else {
      createNewQuotation();
    }
  });
});

// Load selected quotation
const loadSelectedQuotation = () => {
  if (!selectedQuotationId.value) return;
  const selected = projectStore.project?.jobQuotations.find(
    (q) => q.id === selectedQuotationId.value
  );
  if (selected) {
    quotation.value = JSON.parse(JSON.stringify(selected));
    if (!quotation.value.priceOffered)
      quotation.value.priceOffered =
        projectStore.project?.totalProjectPrice || 0;
    originalQuotation.value = JSON.parse(JSON.stringify(quotation.value));
  }
};

// Start edit mode
const startEdit = () => {
  isEditing.value = true;
};

// Save quotation
const saveQuotation = async () => {
  quotation.value.vatPercentage = Number(quotation.value.vatPercentage);

  console.log("quotation", quotation.value);

  if (!quotation.value.priceOffered) {
    quotation.value.priceOffered = projectStore.project?.totalProjectPrice || 0;
  }
  quotation.value.priceOffered = Number(quotation.value.priceOffered);

  if (quotation.value.id) {
    await updateJobQuotation(quotation.value.id, quotation.value);
  } else {
    const created = await createJobQuotation(
      projectStore.project?.id!,
      quotation.value
    );
    if (created?.id) {
      selectedQuotationId.value = created.id;
      projectStore.project?.jobQuotations.push(created);
    }
  }
  originalQuotation.value = JSON.parse(JSON.stringify(quotation.value));
  isEditing.value = false;
};

// Create a new quotation
const createNewQuotation = () => {
  isEditing.value = true;
  selectedQuotationId.value = null;
  quotation.value = { ...newQuotationTemplate };
  quotation.value.priceOffered = projectStore.project?.totalProjectPrice || 0;
};

// Cancel edit
const cancelEdit = () => {
  selectedQuotationId.value = originalQuotation.value?.id || null;
  quotation.value = originalQuotation.value || { ...newQuotationTemplate };
  if (!quotation.value.id) {
    router.push(`/projects/${route.params.id}`);
    return;
  }
  isEditing.value = false;
};

// Navigation functions
const goBack = () => router.push(`/projects/${route.params.id}`);
const goNext = () =>
  router.push(
    `/projects/${route.params.id}/job-quotations/${selectedQuotationId.value}/invoice`
  );

const confirmDeleteInvoice = async () => {
  if (selectedQuotationId.value) {
    await deleteJobQuotation(selectedQuotationId.value);
  }

  projectStore.project?.jobQuotations.splice(
    projectStore.project?.jobQuotations.findIndex(
      (q) => q.id === selectedQuotationId.value
    ),
    1
  );
  if (projectStore.project?.jobQuotations.length) {
    const lastIndex = projectStore.project?.jobQuotations.length - 1;
    selectedQuotationId.value =
      projectStore.project?.jobQuotations[lastIndex].id || null;
    quotation.value = projectStore.project?.jobQuotations[lastIndex];
  } else {
    selectedQuotationId.value = null;
    quotation.value = { ...newQuotationTemplate };
  }

  isDeleteModalOpen.value = false;
};

// Export PDF (Implementation remains the same)
const exportToPDF = async () => {
  if (!quotation.value || !projectStore.project) {
    console.error("Error: Job Quotation or Project Data is not available");
    return;
  }

  // ✅ Dynamically import jsPDF
  const { default: jsPDF } = await import("jspdf");

  // โหลดฟอนต์ให้แน่ใจว่าพร้อมใช้งานก่อนสร้าง PDF
  const [saraban, sarabanBold] = await Promise.all([
    stateStore.saraban,
    stateStore.sarabanBold,
  ]);

  const doc = new jsPDF({
    unit: "mm",
    format: "a4",
    orientation: "portrait",
  });

  // เพิ่มฟอนต์ลงใน PDF
  doc.addFileToVFS("Sarabun-Regular-normal.ttf", saraban);
  doc.addFont("Sarabun-Regular-normal.ttf", "Sarabun", "normal");
  doc.addFileToVFS("Sarabun-Bold-normal.ttf", sarabanBold);
  doc.addFont("Sarabun-Bold-normal.ttf", "Sarabun", "bold");

  // ตั้งค่าฟอนต์ที่ใช้
  doc.setFont("Sarabun");

  const marginLeft = 14; // Left margin
  const marginRight = 14; // Right margin distance
  const marginRightAlign = 200 - 5; // Right margin distance
  const maxWidth = 180; // Max text width before wrapping
  let yPos = 10; // Initial Y position

  // ✅ Load the logo image
  const logoPath = "/image/microtecnology-logo.png"; // Ensure correct path
  const img = new Image();
  img.src = logoPath;

  const pageHeight = doc.internal.pageSize.height; // ความสูงของหน้ากระดาษ A4

  const checkPageBreak = (extraHeight = 10) => {
    if (yPos + extraHeight > pageHeight - 20) {
      doc.addPage(); // ✅ เพิ่มหน้ากระดาษใหม่
      yPos = 18; // ✅ รีเซ็ตตำแหน่ง yPos ให้เริ่มต้นที่ขอบบนของหน้ากระดาษใหม่
    }
  };

  img.onload = function () {
    // ✅ Add the logo (align top-left)
    doc.addImage(img, "PNG", marginLeft - 2, yPos - 5, 110, 25);

    yPos += 4; // Move Y down after logo

    doc.setFont("Sarabun", "normal");
    console.log(doc.getFontList());
    doc.setFontSize(10);
    // set text alignment right

    doc.setTextColor(0, 0, 255);
    const companyX = 140; // Align right
    doc.text("MICROTECNOLOGY SRL CO. LTD.", marginRightAlign, yPos, {
      align: "right",
    });
    doc.text("Tax ID: 0105554041131", marginRightAlign, (yPos += 4), {
      align: "right",
    });
    doc.text(
      "E: Socrate@microtecnologysrl.com",
      marginRightAlign,
      (yPos += 4),
      {
        align: "right",
      }
    );
    doc.text("T: +66 (0)80 050 5462", marginRightAlign, (yPos += 4), {
      align: "right",
    });
    doc.text("44/47 Moo Baan Harmony view,", marginRightAlign, (yPos += 4), {
      align: "right",
    });
    doc.text("Sukhaphiban 5, Soi 80, Saimai,", marginRightAlign, (yPos += 4), {
      align: "right",
    });
    doc.text("Bangkok 10220 Thailand", marginRightAlign, (yPos += 4), {
      align: "right",
    });
    yPos += 14; // Extra space after address

    // ✅ Reset text color to black for the rest
    doc.setTextColor(0, 0, 0);

    // ✅ Date & Reference (Left-Aligned)
    doc.setFont("Sarabun", "bold");
    doc.setFontSize(11);
    doc.text(
      `Bangkok: ${new Date().toLocaleDateString("en-GB")}`,
      marginLeft,
      yPos
    );
    doc.text(
      `Our ref: ${quotation.value.ourRef || ""}`,
      marginLeft,
      (yPos += 6)
    );

    // let splitDescription = doc.splitTextToSize(description, maxWidth);
    // doc.text(splitDescription, marginLeft, (yPos += 8));

    // ✅ Customer Address (Right-Aligned)
    doc.setFont("Sarabun", "bold");
    doc.setFontSize(12);
    // wrapped customer long name
    let wrappedCustomerName = doc.splitTextToSize(
      `${projectStore.project?.customer?.name}`,
      80
    );
    doc.text(wrappedCustomerName, companyX - 20, (yPos -= 6));

    // ✅ Increase Y position dynamically based on the number of lines
    yPos += wrappedCustomerName.length * 3;

    const exampleAddress =
      `${projectStore.project?.customer?.address}` || "no address";
    // "456 Elm Street, Suite 3, Los Angeles, CA 90001, USA456 Elm Street, Suite 3, Los Angeles, CA 90001, USA Road: Laksi: Bangkok 10210-0299: Thailand";
    let wrappedAddress = doc.splitTextToSize(exampleAddress, 80);

    // ✅ Print wrapped address and adjust Y position
    doc.setFont("Sarabun", "normal");
    doc.setFontSize(12);
    doc.text(wrappedAddress, companyX - 20, (yPos += 8));

    // ✅ Increase Y position dynamically based on the number of lines
    yPos += wrappedAddress.length * 4 + 2; // Moves down depending on text lines

    // ✅ Attention Line
    doc.setFont("Sarabun", "bold");
    doc.setFontSize(12);
    doc.text(
      `Attn: ${projectStore.project?.customer?.agentName}`,
      marginLeft,
      (yPos += 10)
    );

    // ✅ Job Quotation Subject
    doc.setFontSize(12);
    doc.setFont("Sarabun", "normal");
    doc.text(
      `Subject : ${projectStore.project?.name || ""}`,
      marginLeft,
      (yPos += 10)
    );
    yPos += 10;

    // ✅ Proposal Message (Auto-Wrap)
    doc.setFontSize(12);
    let message = "We would like to propose our best price for";
    let splitMessage = doc.splitTextToSize(message, maxWidth);
    doc.text(splitMessage, marginLeft + 15, (yPos += 5));

    // คำนวณ yPos โดยเพิ่มตามจำนวนบรรทัด
    yPos += splitMessage.length * 6 - 5; // แต่ละบรรทัดเพิ่ม yPos 6 หน่วย

    // ✅ Job Description (Auto-Wrap)
    doc.setFont("Sarabun", "bold");
    doc.setFontSize(12);
    doc.text(`${projectStore.project?.name || ""}`, marginLeft, (yPos += 8));

    let description = `${quotation.value.description || ""}`;
    let splitDescription = doc.splitTextToSize(description, maxWidth);
    doc.setFontSize(12);
    doc.text(splitDescription, marginLeft, (yPos += 6));

    // คำนวณ yPos สำหรับ description
    yPos += splitDescription.length * 6; // เพิ่ม yPos ตามจำนวนบรรทัดของ description

    // ✅ Price Offered (Right-Aligned)
    doc.setFont("Sarabun", "bold");
    let priceText = `${quotation.value.priceOffered?.toLocaleString()} Baht`;
    let pageWidth = doc.internal.pageSize.getWidth();
    doc.text(priceText, pageWidth - marginLeft, yPos, { align: "right" });

    // ✅ Commercial Conditions (Formatted as Text)
    yPos += 10;
    doc.setFont("Sarabun", "bold");
    doc.setFontSize(12);
    // ✅ Define Text & Position
    let textCommercial = "Commercial Condition";
    let textXCommercial = marginLeft; // Left margin for alignment
    let textYCommercial = (yPos += 2); // Adjust Y position

    // ✅ Draw Text
    doc.text(textCommercial, textXCommercial, textYCommercial);

    checkPageBreak(12); // ✅ ตรวจสอบว่ามีที่ว่างพอไหมก่อนเพิ่มหัวข้อใหม่

    // ✅ Measure Text Width & Draw Underline
    let textWidthCommercial = doc.getTextWidth(textCommercial); // Get the width of the text
    doc.line(
      textXCommercial,
      textYCommercial + 1.5,
      textXCommercial + textWidthCommercial,
      textYCommercial + 1.5
    ); // (x1, y1, x2, y2)
    doc.setFontSize(12);

    let conditions = [
      [
        "Invoice",
        quotation.value.invoiceTerms || "100% at 30 Days after delivery",
      ],
      [
        "Delivery",
        quotation.value.deliveryTime || "2 months after receiving your P.O.",
      ],
      ["Delivery Place", quotation.value.deliveryPlace || "At your I C D 1"],
      ["V.A.T", `${quotation.value.vatPercentage || 7} %`],
    ];

    yPos += 10;
    conditions.forEach(([label, value]) => {
      doc.setFont("Sarabun", "bold");
      doc.text(`${label}:`, marginLeft, yPos);
      doc.setFont("Sarabun", "normal");
      let wrappedValue = doc.splitTextToSize(value, maxWidth);
      doc.text(wrappedValue, marginLeft + 40, yPos);
      yPos += 4 + wrappedValue.length * 2; // Adjust spacing dynamically
    });

    // ✅ Closing Message
    yPos += 5;

    checkPageBreak(12); // ✅ ตรวจสอบว่ามีที่ว่างพอไหมก่อนเพิ่มหัวข้อใหม่

    doc.setFont("Sarabun", "normal");
    doc.setFontSize(12);

    // เว้นวรรค
    const spaceText = "               " + quotation.value.message || "";

    let closingMessage = `${spaceText || ""}`;
    // `         Hoping the above proposal is of interest to you and that it meets your requirements  We look forward to working with you in the future, we remain available for further clarifications you might need to make in the future and we look forward to working with you in the future .`;

    let splitClosingMessage = doc.splitTextToSize(closingMessage, maxWidth);
    doc.text(splitClosingMessage, marginLeft, yPos);

    const addHight = splitClosingMessage.length === 1 ? 8 : 0;

    // ✅ Best Regards & Signature
    yPos += splitClosingMessage.length * 6 + addHight;

    checkPageBreak(12); // ✅ ตรวจสอบว่ามีที่ว่างพอไหมก่อนเพิ่มหัวข้อใหม่

    doc.setFontSize(11);
    doc.text("Best regards.", marginLeft, yPos);
    doc.setFontSize(12);
    doc.setFont("Sarabun", "bold");
    doc.text("Socrate Alexiadis", marginLeft, (yPos += 8));
    doc.text("CEO", marginLeft, (yPos += 5));
    // ✅ Define Text & Position
    let text = "MICROTECNOLOGY SRL CO. LTD.";
    let textX = marginLeft; // Left margin for alignment
    let textY = (yPos += 8); // Adjust Y position

    // ✅ Draw Text
    doc.text(text, textX, textY);

    // ✅ Measure Text Width & Draw Underline
    let textWidth = doc.getTextWidth(text); // Get the width of the text
    doc.line(textX, textY + 1.5, textX + textWidth, textY + 1.5); // (x1, y1, x2, y2)

    // ✅ Save and Download the PDF
    doc.save(`Job_Quotation_${quotation.value.id || "New"}.pdf`);
  };
};

definePageMeta({
  middleware: "auth-role",
});
</script>
