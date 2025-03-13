import { useFetch } from "#app";
import type { PaginationQuery, PaginationResponse } from "~/types/pagination";
import type { PurchaseOrder } from "~/types/purchase-order";

export default function usePurchaseOrderService() {
  const config = useRuntimeConfig();

  // Reactive state
  const purchaseOrders = ref<PurchaseOrder[]>([]);
  const totalPages = ref(1);
  const totalPurchaseOrders = ref(0);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const errorMessage = ref<string | null>(null);
  const API_URL = `${config.public.apiBase}/purchase-orders`;

  // Fetch Purchase Orders
  const fetchPurchaseOrders = async (query: PaginationQuery) => {
    isLoading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await useFetch<
        PaginationResponse<PurchaseOrder>
      >(API_URL, {
        query: query,
        credentials: "include",
      });
      if (fetchError.value) throw new Error(fetchError.value.message);

      purchaseOrders.value = data.value?.data || [];
      totalPages.value = data.value?.totalPages || 1;
      totalPurchaseOrders.value = data.value?.total || 0;
    } catch (error: any) {
      console.error("Error fetching purchase orders:", error.message);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchQuotationFile = async (filename: string) => {
    isLoading.value = true;
    errorMessage.value = null;
    try {
      const response = await fetch(
        `${config.public.apiBase}/uploads/quotations/${filename}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/pdf",
          },
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch certificate file.");
      }
      return URL.createObjectURL(await response.blob());
    } catch (error: any) {
      errorMessage.value = error.message || "Failed to fetch certificate file.";
      console.error("Error fetching certificate file:", errorMessage.value);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  // Fetch Single Purchase Order
  const fetchPurchaseOrder = async (id: number): Promise<PurchaseOrder> => {
    try {
      const { data, error } = await useFetch<PurchaseOrder>(
        `${API_URL}/${id}`,
        { credentials: "include" }
      );

      if (error.value) {
        throw new Error(error.value.message);
      }
      console.log("data", data.value);
      return data.value || ({} as PurchaseOrder);
    } catch (error: any) {
      console.error("Error fetching purchase order:", error.message);
      return {} as PurchaseOrder;
    }
  };

  // Create Purchase Order with error handling
  const createPurchaseOrder = async (purchaseOrder: Partial<PurchaseOrder>) => {
    try {
      const { data, error } = await useFetch<PurchaseOrder>(API_URL, {
        method: "POST",
        body: purchaseOrder,
        credentials: "include",
      });

      if (error.value) {
        throw new Error(error.value.message);
      }

      return data.value || ({} as PurchaseOrder);
    } catch (error: any) {
      console.error("Error creating purchase order:", error.message);
      return {} as PurchaseOrder;
    }
  };

  // ✅ Upload file for a certificate
  const uploadQoutationFile = async (id: number, file: File) => {
    isLoading.value = true;
    errorMessage.value = null;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_URL}/upload/${id}`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      console.log("response", response);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to upload file.");
      }

      return result;
    } catch (error: any) {
      errorMessage.value = error.message || "Error upisLoading file.";
      console.error("Error upisLoading quotation file:", errorMessage.value);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  // ✅ Download certificate file
  const downloadQoutation = async (filename: string) => {
    isLoading.value = true;
    errorMessage.value = null;

    try {
      const response = await fetch(`${API_URL}/download/${filename}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to download file.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error: any) {
      errorMessage.value = error.message || "Error downisLoading file.";
      console.error("Error downisLoading quotation:", errorMessage.value);
    } finally {
      isLoading.value = false;
    }
  };

  // Update Purchase Order
  const updatePurchaseOrder = async (
    id: number,
    purchaseOrder: Partial<PurchaseOrder>
  ) => {
    console.log("Sending purchase order data:", purchaseOrder);
    try {
      await useFetch(`${API_URL}/${id}`, {
        method: "PATCH",
        body: purchaseOrder,
        credentials: "include",
      });
    } catch (error: any) {
      console.error("Error updating purchase order:", error.message);
    }
  };

  // Delete Purchase Order
  const deletePurchaseOrder = async (id: number) => {
    try {
      await useFetch(`${API_URL}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
    } catch (error: any) {
      console.error("Error deleting purchase order:", error.message);
    }
  };

  function convertNumberToThaiText(amount: number): string {
    console.log("amount", amount);
    const thaiNumbers = [
      "ศูนย์",
      "หนึ่ง",
      "สอง",
      "สาม",
      "สี่",
      "ห้า",
      "หก",
      "เจ็ด",
      "แปด",
      "เก้า",
    ];
    const units = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน"];

    let [integerPart, decimalPart] = Number(amount).toFixed(2).split(".");

    let result =
      convertIntegerToText(parseInt(integerPart), thaiNumbers, units) + "บาท";
    if (decimalPart === "00") {
      result += "ถ้วน";
    } else {
      result +=
        convertIntegerToText(parseInt(decimalPart), thaiNumbers, units) +
        "สตางค์";
    }

    return result;
  }

  function convertIntegerToText(
    num: number,
    thaiNumbers: string[],
    units: string[]
  ): string {
    let text = "";
    const numStr = num.toString();

    for (let i = 0; i < numStr.length; i++) {
      const digit = parseInt(numStr[i]);
      const unitIndex = numStr.length - i - 1;

      if (digit === 0) continue;

      if (unitIndex === 1 && digit === 1) {
        text += "สิบ";
      } else if (unitIndex === 1 && digit === 2) {
        text += "ยี่สิบ";
      } else if (
        unitIndex !== 0 ||
        digit !== 1 ||
        unitIndex === numStr.length - 1
      ) {
        text += thaiNumbers[digit];
      }

      text += units[unitIndex % units.length];
    }

    return text.replace(/หนึ่งสิบ/g, "สิบ");
  }

  const exportPOToPDF = async (
    purchaseOrder: PurchaseOrder,
    notoThaiSanNormal: string,
    notoThaiSanBold: string,
    subTotal: number,
    vat: number
  ) => {
    const { default: jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;

    // Add Noto Sans Thai font
    var callAddFont = function (this: any) {
      this.addFileToVFS("NotoSansThai-Regular-normal.ttf", notoThaiSanNormal);
      this.addFont("NotoSansThai-Regular-normal.ttf", "NotoSansThai", "normal");
      this.addFileToVFS("NotoSansThai-Bold-normal.ttf", notoThaiSanBold);
      this.addFont("NotoSansThai-Bold-normal.ttf", "NotoSansThai", "bold");
    };
    jsPDF.API.events.push(["addFonts", callAddFont]);

    const doc = new jsPDF({
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    });
    const marginLeft = 14;
    let yPos = 10;

    // Load and add the logo
    const img = new Image();
    img.src = "/image/purchaselogo.png";
    img.onload = () => {
      // Get the page width
      const pageWidth = doc.internal.pageSize.getWidth();

      // Center the image
      const imageWidth = 110;
      const imageX = (pageWidth - imageWidth) / 2; // Calculate the center X position
      doc.addImage(img, "PNG", imageX, yPos, imageWidth, 25);
      yPos += 30;

      // Center the header text
      doc.setFont("NotoSansThai", "bold");
      doc.setFontSize(11);

      const text = "PURCHASE ORDER";
      const textWidth = doc.getTextWidth(text);
      const textX = (pageWidth - textWidth) / 2; // Calculate the center X position
      doc.text(text, textX, yPos);

      // Draw underline
      doc.setDrawColor(0); // Black color for underline
      doc.setLineWidth(0.5); // Thickness of the line
      doc.line(textX, yPos + 1, textX + textWidth, yPos + 1); // (x1, y1, x2, y2)

      yPos += 10;

      // Company Details (Left)
      doc.setFont("NotoSansThai", "bold");
      doc.setFontSize(10);
      let lineHeight = 7;
      const leftX = marginLeft;
      let currentY = yPos; // Use currentY to track the vertical position

      // Left Column
      doc.text(`${purchaseOrder.subcontractor!.name || ""}`, leftX, currentY);
      currentY += lineHeight;
      doc.setFont("NotoSansThai", "normal");
      doc.setFontSize(9);
      doc.text(
        `${purchaseOrder.subcontractor!.address || ""}`,
        leftX,
        currentY
      );
      currentY += lineHeight;
      doc.text(
        `${purchaseOrder.subcontractor!.contact || "sdfsdfdsfd"}`,
        leftX,
        currentY
      );
      currentY += lineHeight;
      doc.setFont("NotoSansThai", "bold");
      doc.setFontSize(10);
      doc.text(
        `เลขประจําตัวผู้เสียภาษี ${purchaseOrder.subcontractor!.taxId || ""}`,
        leftX,
        currentY
      );

      // Purchase Order Info (Right)
      doc.setFont("NotoSansThai", "bold");
      const rightX = 193;
      currentY = yPos; // Reset currentY for the right column

      doc.text(
        `Bangkok ${new Date().toLocaleDateString("en-GB")}`,
        rightX,
        currentY,
        { align: "right" }
      );
      currentY += lineHeight;

      // Set "Our ref." to red
      doc.setTextColor(255, 0, 0);
      doc.setFontSize(9);
      doc.text(`Our ref. ${purchaseOrder.ourRef || ""}`, rightX, currentY, {
        align: "right",
      });
      currentY += lineHeight * 2;

      // Set text color back to black for P.O. No.
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.text(`P.O. No. ${purchaseOrder.number || ""}`, rightX + 1, currentY, {
        align: "right",
      });

      yPos = currentY + lineHeight;

      // Order Details Table
      autoTable(doc, {
        startY: yPos,
        head: [["ลำดับ", "รายการ", "จํานวน", "ราคา/หน่วย", "ราคารวม"]],
        body: purchaseOrder.orderDetails.map((detail, index) => [
          index + 1,
          detail.description.toLocaleString(),
          (detail.qty === 1 && detail.total === 0
            ? ""
            : detail.qty || 0
          ).toLocaleString(),
          (detail.unitPrice || "").toLocaleString(),
          (
            detail.total || (detail.qty || 0) * (detail.unitPrice || 0)
          ).toLocaleString(),
        ]),
        theme: "grid",
        styles: {
          fontSize: 10,
          cellPadding: 2,
          textColor: [0, 0, 0],
          lineColor: [0, 0, 0],
        },
        headStyles: {
          fillColor: [204, 228, 243],
          textColor: [0, 0, 0],
          font: "NotoSansThai",
          halign: "center",
        }, // Light blue header
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: 85 },
          2: { cellWidth: 20, halign: "right" },
          3: { cellWidth: 32, halign: "right" },
          4: { cellWidth: 30, halign: "right" },
        },
      });

      yPos = (doc as any).lastAutoTable.finalY;

      // Quotation Number
      autoTable(doc, {
        startY: yPos,
        body: [
          ["", "*** รายละเอียดตามใบเสนอราคาแนบ", "", "", ""],
          ["", `${"       " + (purchaseOrder.qtNumber || "")}`, "", "", ""],
        ],
        theme: "grid",
        styles: {
          fontSize: 10,
          cellPadding: 2,
          // red text color
          textColor: [255, 0, 0],
          font: "NotoSansThai",
          fontStyle: "bold",
          lineColor: [0, 0, 0],
        },
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: 85 },
          2: { cellWidth: 20, halign: "right" },
          3: { cellWidth: 32, halign: "right" },
          4: { cellWidth: 30, halign: "right" },
        },
      });

      yPos = (doc as any).lastAutoTable.finalY;

      // คำนวณจำนวนแถวเปล่าที่เหลือจนกว่าจะเต็มหน้า
      const pageHeight = doc.internal.pageSize.getHeight();

      const remainingHeight = pageHeight - yPos - 80; // เว้นระยะห่าง 20 หน่วยจากขอบล่าง
      console.log("yPos", yPos);
      console.log("pageHeight", pageHeight);
      console.log(" remainingHeight", remainingHeight);
      const rowHeight = 8; // กำหนดความสูงของแต่ละแถว
      const emptyRowsCount = Math.floor(remainingHeight / rowHeight);

      // เพิ่มแถวเปล่า
      const emptyRows = [];
      for (let i = 0; i < emptyRowsCount; i++) {
        emptyRows.push(["", "", "", "", ""]); // เพิ่มแถวเปล่า
      }

      // แสดงตารางแถวเปล่า
      autoTable(doc, {
        startY: yPos,
        body: emptyRows,
        theme: "grid",
        styles: {
          fontSize: 10,
          cellPadding: 2,
          lineColor: [0, 0, 0],
        },
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: 85 },
          2: { cellWidth: 20, halign: "right" },
          3: { cellWidth: 32, halign: "right" },
          4: { cellWidth: 30, halign: "right" },
        },
      });

      yPos = (doc as any).lastAutoTable.finalY;

      // Total, Discount, and VAT
      let tableBody = [["", "Sub Total:", `${subTotal.toLocaleString()} Baht`]];

      if (purchaseOrder.discount && purchaseOrder.discount > 0) {
        tableBody.push([
          "",
          "Discount:",
          `${purchaseOrder.discount.toLocaleString()} Baht`,
        ]);
      }

      tableBody.push([
        "",
        `VAT ${purchaseOrder.vat}%`,
        `${vat.toLocaleString()} Baht`,
      ]);

      // Render the table
      autoTable(doc, {
        startY: yPos,
        body: tableBody,
        theme: "grid",
        styles: { fontSize: 10, textColor: [0, 0, 0], lineColor: [0, 0, 0] },
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: 105, halign: "right" },
          2: { cellWidth: 62, halign: "right" },
        },
      });

      yPos = (doc as any).lastAutoTable.finalY;

      // Foot //////////////
      autoTable(doc, {
        startY: yPos,
        body: [
          [
            "",
            `${convertNumberToThaiText(purchaseOrder.total)} `,
            `${purchaseOrder.total.toLocaleString()} Baht`,
          ],
        ],
        theme: "grid",
        styles: {
          fontSize: 10,
          cellPadding: 4,
          font: "NotoSansThai",
          textColor: [0, 0, 0],
          lineColor: [0, 0, 0],
        },
        columnStyles: {
          0: { cellWidth: 15 },
          1: {
            cellWidth: 105,
            halign: "center",
            fontStyle: "bold",
          },
          2: { cellWidth: 62, halign: "right", fontStyle: "bold" },
        },
      });

      yPos = (doc as any).lastAutoTable.finalY + 12;
      // ✅ Centered Address Example
      doc.setFont("NotoSansThai", "normal");
      doc.setFontSize(9);
      doc.setTextColor(0, 102, 204); // Blue color

      const addressText = [
        "44/47 Mu Ban Harmony Ville, Sukhaphiban 5, Soi 80, Sub district Or-Ingoen, District Saimai,",
        "Bangkok 10220 Thailand – I.D. Tax 0105554041131",
        "Tel. +66 2 057 7577, -- +66 8 0050 5462, -- +66 8 5318 9200 Fax. +66 2 998 1936",
        "Email: a.socrate@zoho.com, tang.microtecnologysrl@gmail.com",
      ];

      addressText.forEach((line, index) => {
        const textWidth = doc.getTextWidth(line);
        const textX = (pageWidth - textWidth) / 2;
        doc.text(line, textX, yPos + index * 4);
      });

      yPos += addressText.length * 6 + 10;

      // Save and download the PDF
      doc.save(`Purchase_Order_${purchaseOrder.number || "New"}.pdf`);
    };
  };

  return {
    fetchPurchaseOrder,
    fetchPurchaseOrders,
    createPurchaseOrder,
    updatePurchaseOrder,
    deletePurchaseOrder,
    exportPOToPDF,
    uploadQoutationFile,
    fetchQuotationFile,
    downloadQoutation,
    purchaseOrders,
    totalPurchaseOrders,
    totalPages,
    isLoading,
    error,
  };
}
