<template>
  <div class="flex flex-col items-center space-y-4">
    <canvas ref="pdfCanvas" class="border rounded-lg shadow-md"></canvas>

    <!-- Navigation Buttons -->
    <div class="flex space-x-4">
      <button
        @click="prevPage"
        :disabled="pageNum === 1"
        class="btn btn-primary"
      >
        Previous
      </button>
      <span>Page {{ pageNum }} / {{ totalPages }}</span>
      <button
        @click="nextPage"
        :disabled="pageNum === totalPages"
        class="btn btn-primary"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import * as pdfjsLib from "pdfjs-dist";

// ✅ Load PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";

const props = defineProps<{ pdfUrl: string }>();

const pdfDoc = ref<any>(null);
const pageNum = ref(1);
const totalPages = ref(0);
const pdfCanvas = ref<HTMLCanvasElement | null>(null);

const renderPage = async (num: number) => {
  if (!pdfDoc.value || !pdfCanvas.value) return;

  const page = await pdfDoc.value.getPage(num);
  const viewport = page.getViewport({ scale: 1.5 }); // Adjust scale for quality

  const canvas = pdfCanvas.value;
  const ctx = canvas.getContext("2d")!;
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  // Render PDF page into the canvas
  const renderContext = { canvasContext: ctx, viewport };
  await page.render(renderContext).promise;
};

// Load PDF
const loadPDF = async () => {
  if (!props.pdfUrl) return;

  const loadingTask = pdfjsLib.getDocument(props.pdfUrl);
  pdfDoc.value = await loadingTask.promise;
  totalPages.value = pdfDoc.value.numPages;

  renderPage(pageNum.value);
};

// Change Pages
const prevPage = () => {
  if (pageNum.value > 1) {
    pageNum.value--;
    renderPage(pageNum.value);
  }
};

const nextPage = () => {
  if (pageNum.value < totalPages.value) {
    pageNum.value++;
    renderPage(pageNum.value);
  }
};

// Watch for PDF URL changes
watch(() => props.pdfUrl, loadPDF);
onMounted(loadPDF);
</script>
