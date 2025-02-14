<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center pb-4">
      <h1 class="text-2xl font-bold">{{ projectStore.project?.name }}</h1>
      <div class="flex gap-2">
        <button
          v-if="!isEditing && quotation.id"
          @click="isEditing = true"
          class="btn btn-warning w-32"
        >
          Edit
        </button>

        <button class="btn btn-outline w-32" @click="exportToPDF">
          Export
        </button>
      </div>
    </div>

    <!-- Job Quotation Selection & Customer Info -->
    <div class="flex justify-between items-center mt-4">
      <div class="flex gap-2">
        <select
          v-model="selectedQuotationId"
          :disabled="!selectedQuotationId"
          @change="selectQuotation"
          class="select select-bordered px-4 py-2 rounded-lg w-48"
        >
          <option :value="null" :hidden="true">New Job Quotation</option>
          <option
            v-for="quote in jobQuotations"
            :key="quote.id"
            :value="quote.id"
          >
            Job Quotation {{ quote.id }}
          </option>
        </select>
        <button
          class="btn btn-primary w-32"
          @click="addQuotation"
          v-if="!isEditing"
        >
          New
        </button>
      </div>
      <div class="text-right w-[40%]">
        <p class="text-xl font-semibold">
          {{ projectStore.project?.customer?.name }}
        </p>
        <p class="text-lg">{{ projectStore.project?.customer?.email }}</p>
      </div>
    </div>

    <!-- Description -->
    <div class="mt-6">
      <h2 class="text-2xl font-semibold mb-4">Description</h2>
      <textarea
        v-model="quotation.description"
        class="w-full textarea textarea-bordered p-3 rounded-lg h-[150px] text-lg"
        :disabled="!isEditing"
      />
    </div>

    <!-- Project Item Total -->
    <div class="mt-6 flex justify-end">
      <h2 class="text-2xl mt-2 mx-10">Price offered</h2>
      <div
        class="p-3 px-5 text-xl border font-medium bg-gray-100 text-black rounded-lg"
      >
        {{
          quotation.priceOffered?.toLocaleString() ||
          projectStore.project?.totalProjectPrice?.toLocaleString()
        }}
      </div>
      <div class="mx-4 mt-3 text-lg">Baht</div>
    </div>

    <!-- Commercial Conditions -->
    <div class="grid grid-cols-2 gap-4 mt-2">
      <div>
        <h3 class="text-xl font-medium">Payment</h3>
        <input
          v-model="quotation.paymentTerms"
          type="text"
          class="input input-bordered w-full"
          :disabled="!isEditing"
        />
      </div>
      <div>
        <h3 class="text-xl font-medium">Delivery</h3>
        <input
          v-model="quotation.deliveryTime"
          type="text"
          class="input input-bordered w-full"
          :disabled="!isEditing"
        />
      </div>
      <div>
        <h3 class="text-xl font-medium">Delivery Place</h3>
        <input
          v-model="quotation.deliveryPlace"
          type="text"
          class="input input-bordered w-full"
          :disabled="!isEditing"
        />
      </div>
      <div>
        <h3 class="text-xl font-medium">Vat %</h3>
        <input
          v-model="quotation.vatPercentage"
          type="text"
          class="input input-bordered w-full"
          :disabled="!isEditing"
        />
      </div>
    </div>

    <!-- Message -->
    <div class="mt-4">
      <h2 class="text-xl font-medium mb-4">Message</h2>
      <textarea
        v-model="quotation.message"
        class="textarea textarea-bordered w-full h-[150px] border p-3 text-lg"
        :disabled="!isEditing"
      />
    </div>

    <!-- Best Regards -->
    <div class="mt-4">
      <h2 class="text-xl font-medium mb-4">Best Regards</h2>
      <textarea
        v-model="quotation.bestRegards"
        class="textarea textarea-bordered w-full border p-3 h-24 text-lg"
        :disabled="!isEditing"
      />
    </div>

    <!-- Action Buttons -->
    <div class="mt-6 flex justify-end gap-2">
      <button @click="goBack" v-if="!isEditing" class="btn btn-secondary w-32">
        Back
      </button>
      <button @click="goNext" v-if="!isEditing" class="btn btn-primary w-32">
        Next
      </button>
      <button
        v-if="isEditing"
        @click="cancelEdit"
        class="btn btn-secondary w-32"
      >
        Cancel
      </button>
      <button
        v-if="isEditing"
        @click="saveQuotation(quotation)"
        class="btn btn-success w-32"
      >
        Save
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { JobQuotation } from "~/types/job-quotation";
import useJobQuotationService from "~/composables/job-quotationService";
import useProjectService from "~/composables/projectService";

const route = useRoute();
const router = useRouter();
const projectStore = useProjectStore();
const { updateJobQuotation, createJobQuotation } = useJobQuotationService();
const { fetchProject } = useProjectService();

const jobQuotations = ref<JobQuotation[]>([]);
const isEditing = ref(false);
const originalQuotation = ref<JobQuotation | null>(null);
const newQuotation = <JobQuotation>{
  description: "",
  paymentTerms: "",
  deliveryTime: "",
  deliveryPlace: "",
  vatPercentage: 7,
  bestRegards: "",
  message: "",
  payments: [],
  customerRef: "",
  agentName: "",
  priceOffered: 0,
};

const quotation = ref<JobQuotation>(JSON.parse(JSON.stringify(newQuotation)));
const selectedQuotationId = ref<number | null>(null);

onMounted(async () => {
  nextTick(async () => {
    if (!projectStore.project?.jobQuotations) {
      const projectData = await fetchProject(Number(route.params.id));
      projectStore.project = projectData;
      jobQuotations.value = projectStore.project.jobQuotations || [];
      if (jobQuotations.value[0].id) {
        quotation.value = { ...jobQuotations.value[0] }; // Set initial values
        selectedQuotationId.value = jobQuotations.value[0].id;
        originalQuotation.value = JSON.parse(JSON.stringify(quotation.value)); // Deep Copy
      }
    } else {
      jobQuotations.value = projectStore.project?.jobQuotations;
      quotation.value.priceOffered =
        projectStore.project.totalProjectPrice || 0;
      quotation.value = projectStore.project.jobQuotations[0];

      originalQuotation.value = JSON.parse(JSON.stringify(quotation.value)); // Deep Copy
    }
  });
});

// Save Quotation
const saveQuotation = async (selectedQuotation: JobQuotation) => {
  selectedQuotation.vatPercentage = Number(selectedQuotation.vatPercentage);
  console.log("selectedQuotation is there have id", selectedQuotation);
  if (selectedQuotation.id) {
    await updateJobQuotation(selectedQuotation.id, selectedQuotation);
  } else {
    if (!projectStore.project) return;

    const created = await createJobQuotation(
      projectStore.project.id,
      selectedQuotation
    );
    if (created)
      (selectedQuotationId.value = created.id || null),
        jobQuotations.value.push(created);
  }
  originalQuotation.value = JSON.parse(JSON.stringify(selectedQuotation)); // Save new values
  isEditing.value = false;
};

const addQuotation = () => {
  selectedQuotationId.value = null;
  quotation.value = newQuotation;
  quotation.value.priceOffered = projectStore.project?.totalProjectPrice || 0;
  isEditing.value = true;
};

// Update quotation data when selection changes
const selectQuotation = () => {
  if (!selectedQuotationId.value) return;
  const selected = jobQuotations.value.find(
    (q) => q.id === selectedQuotationId.value
  );
  if (selected) {
    console.log("selected", selected);
    quotation.value = JSON.parse(JSON.stringify(selected)); // Deep copy
    originalQuotation.value = JSON.parse(JSON.stringify(quotation.value));
  }
};

// Cancel Edit and Reset
const cancelEdit = () => {
  console.log("originalQuotation.value", originalQuotation.value);
  quotation.value = JSON.parse(JSON.stringify(originalQuotation.value)); // Restore original
  console.log("quotation.value", quotation.value);

  selectedQuotationId.value = quotation.value.id ? quotation.value.id : null;
  isEditing.value = !isEditing.value;
};

const goBack = () => {
  router.push(`/projects/${route.params.id}`);
};

const goNext = () => {
  console.log("selectedQuotationId.value", selectedQuotationId.value);
  router.push(
    `/projects/${route.params.id}/job-quotations/${selectedQuotationId.value}/payment`
  );
};

const exportToPDF = async () => {
  if (!quotation.value || !projectStore.project) {
    console.error("Error: Job Quotation or Project Data is not available");
    return;
  }

  // ✅ Dynamically import jsPDF
  const { default: jsPDF } = await import("jspdf");

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

  // Add custom font (Noto Sans Thai)

  const doc = new jsPDF({
    unit: "mm",
    format: "a4",
    orientation: "portrait",
  });

  const marginLeft = 14; // Left margin
  const marginRight = 14; // Right margin distance
  const marginRightAlign = 200 - 5; // Right margin distance
  const maxWidth = 180; // Max text width before wrapping
  let yPos = 10; // Initial Y position

  // ✅ Load the logo image
  const logoPath = "/image/microtecnology-logo.png"; // Ensure correct path
  const img = new Image();
  img.src = logoPath;

  img.onload = function () {
    // ✅ Add the logo (align top-left)
    doc.addImage(img, "PNG", marginLeft - 2, yPos - 5, 110, 25);

    yPos += 4; // Move Y down after logo

    doc.setFont("NotoSansThai", "normal");
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
    doc.setFont("NotoSansThai", "bold");
    doc.setFontSize(11);
    doc.text(
      `Bangkok: ${new Date().toLocaleDateString("en-GB")}`,
      marginLeft,
      yPos
    );
    doc.text(
      `Our ref: ${quotation.value.customerRef || ""}`,
      marginLeft,
      (yPos += 6)
    );

    // let splitDescription = doc.splitTextToSize(description, maxWidth);
    // doc.text(splitDescription, marginLeft, (yPos += 8));

    // ✅ Customer Address (Right-Aligned)
    doc.setFont("NotoSansThai", "bold");
    doc.setFontSize(12);
    doc.text(
      `${projectStore.project?.customer?.name}`,
      companyX - 20,
      (yPos -= 6)
    );

    const exampleAddress =
      `${projectStore.project?.customer?.address}` || "no address";
    // "456 Elm Street, Suite 3, Los Angeles, CA 90001, USA456 Elm Street, Suite 3, Los Angeles, CA 90001, USA Road: Laksi: Bangkok 10210-0299: Thailand";
    let wrappedAddress = doc.splitTextToSize(exampleAddress, 80);

    // ✅ Print wrapped address and adjust Y position
    doc.setFont("NotoSansThai", "normal");
    doc.setFontSize(12);
    doc.text(wrappedAddress, companyX - 20, (yPos += 8));

    // ✅ Increase Y position dynamically based on the number of lines
    yPos += wrappedAddress.length * 4 + 2; // Moves down depending on text lines

    // ✅ Attention Line
    doc.setFont("NotoSansThai", "bold");
    doc.setFontSize(12);
    doc.text(
      `Attn: ${quotation.value.agentName || "Mr. Robert Smith secretary"}`,
      marginLeft,
      (yPos += 10)
    );

    // ✅ Job Quotation Subject
    doc.setFontSize(12);
    doc.setFont("NotoSansThai", "normal");
    doc.text(
      `Subject : ${projectStore.project?.name || ""}`,
      marginLeft,
      (yPos += 10)
    );
    yPos += 10;

    // ✅ Proposal Message (Auto-Wrap)
    doc.setFontSize(12);
    let message = "We would like to propose our best price for:";
    let splitMessage = doc.splitTextToSize(message, maxWidth);
    doc.text(splitMessage, marginLeft + 15, (yPos += 5));

    // คำนวณ yPos โดยเพิ่มตามจำนวนบรรทัด
    yPos += splitMessage.length * 6 - 5; // แต่ละบรรทัดเพิ่ม yPos 6 หน่วย

    // ✅ Job Description (Auto-Wrap)
    doc.setFont("NotoSansThai", "bold");
    doc.setFontSize(12);
    doc.text(`${projectStore.project?.name || ""}`, marginLeft, (yPos += 8));

    let description = `${quotation.value.description || ""}`;
    let splitDescription = doc.splitTextToSize(description, maxWidth);
    doc.setFontSize(12);
    doc.text(splitDescription, marginLeft, (yPos += 6));

    // คำนวณ yPos สำหรับ description
    yPos += splitDescription.length * 6; // เพิ่ม yPos ตามจำนวนบรรทัดของ description

    // ✅ Price Offered (Right-Aligned)
    doc.setFont("NotoSansThai", "bold");
    let priceText = `${quotation.value.priceOffered?.toLocaleString()} Baht`;
    let pageWidth = doc.internal.pageSize.getWidth();
    doc.text(priceText, pageWidth - marginLeft, yPos, { align: "right" });

    doc.text(priceText, pageWidth - marginRight, yPos, {
      align: "right",
    });

    // ✅ Commercial Conditions (Formatted as Text)
    yPos += 10;
    doc.setFont("NotoSansThai", "bold");
    doc.setFontSize(12);
    // ✅ Define Text & Position
    let textCommercial = "Commercial Condition";
    let textXCommercial = marginLeft; // Left margin for alignment
    let textYCommercial = (yPos += 2); // Adjust Y position

    // ✅ Draw Text
    doc.text(textCommercial, textXCommercial, textYCommercial);

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
        "Payment",
        quotation.value.paymentTerms || "100% at 30 Days after delivery",
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
      doc.setFont("NotoSansThai", "bold");
      doc.text(`${label}:`, marginLeft, yPos);
      doc.setFont("NotoSansThai", "normal");
      let wrappedValue = doc.splitTextToSize(value, maxWidth);
      doc.text(wrappedValue, marginLeft + 40, yPos);
      yPos += 4 + wrappedValue.length * 2; // Adjust spacing dynamically
    });

    // ✅ Closing Message
    yPos += 5;
    doc.setFont("NotoSansThai", "normal");
    doc.setFontSize(12);

    let closingMessage = `${quotation.value.message || ""}`;
    // `         Hoping the above proposal is of interest to you and that it meets your requirements  We look forward to working with you in the future, we remain available for further clarifications you might need to make in the future and we look forward to working with you in the future .`;

    let splitClosingMessage = doc.splitTextToSize(closingMessage, maxWidth);
    doc.text(splitClosingMessage, marginLeft, yPos);

    // ✅ Best Regards & Signature
    yPos += splitClosingMessage.length * 6 - 5;

    doc.text("Best regards.", marginLeft, yPos);
    doc.setFont("NotoSansThai", "bold");
    doc.text("Socrate Alexiadis", marginLeft, (yPos += 8));
    doc.text("CEO", marginLeft, (yPos += 4));
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
</script>

<style scoped>
button {
  font-weight: 700;
}
</style>
