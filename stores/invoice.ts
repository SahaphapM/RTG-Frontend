import type { Invoice } from "~/types/invoice";

export const useInvoiceStore = defineStore("invoice", () => {
  async function exportInvoicePDF(
    invoice: Invoice,
    original: boolean,
    subtotal: number,
    vat: number,
    vatPercentage: number,
    pathParts: string[],
    fetchProject: Function
  ) {
    const project = await fetchProject(Number(pathParts[2]));
    const stateStore = useStateStore();
    const { default: jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;
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

      doc.setFont("Sarabun");
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
      yPos += 5;

      // Invoice Header
      doc.setFont("Sarabun", "bold");
      doc.setFontSize(18);
      doc.text("TAX INVOICE / RECEIPT", marginLeft, (yPos += 10));
      doc.setFontSize(15);
      doc.setTextColor(0, 153, 0);
      doc.text(` ${original ? "ORIGINAL" : "COPY"}`, marginRight, yPos, {
        align: "right",
      });
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
            `No ${invoice.taxInvoice || ""}`,
            "Our Tax ID :",
            invoice.ourTax || "",
          ],
        ],
        theme: "grid",
        styles: {
          fontSize: 10,
          cellPadding: 2,
          textColor: [0, 0, 0],
          lineColor: [0, 0, 0],
        },

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
          font: "Sarabun",
          lineColor: [0, 0, 0],
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
          lineColor: [0, 0, 0],
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
          detail.qty === 1 && detail.unitPrice === 0 ? "" : detail.qty,
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
          font: "Sarabun",
          lineColor: [0, 0, 0],
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

      // คำนวณจำนวนแถวเปล่าที่เหลือจนกว่าจะเต็มหน้า
      const pageHeight = doc.internal.pageSize.getHeight();

      const remainingHeight = pageHeight - yPos - 50; // เว้นระยะห่าง 20 หน่วยจากขอบล่าง
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
          1: { cellWidth: 90 },
          2: { cellWidth: 15, halign: "right" },
          3: { cellWidth: 30, halign: "right" },
          4: { cellWidth: 30, halign: "right" },
        },
      });

      yPos = (doc as any).lastAutoTable.finalY;

      // Add Total and VAT in a new table
      autoTable(doc, {
        startY: yPos,
        body: [
          ["", "Sub Total", `${subtotal.toLocaleString()}   baht`],
          // if have discount show discount if not then don't show discount

          ["", "Discount", `${invoice.discount.toLocaleString() || 0}   baht`],
          ["", `V.A.T.  ${vatPercentage} %`, `${vat.toLocaleString()}   baht`],
        ],
        // foot: [],
        theme: "grid",
        styles: { fontSize: 10, lineColor: [0, 0, 0] }, // Light gray background
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

      yPos = (doc as any).lastAutoTable.finalY + 0.1;

      // Add Grand Total in a new table
      autoTable(doc, {
        startY: yPos,
        body: [["", "Grand Total", `${invoice.total.toLocaleString()} baht`]],

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

      console.log(invoice.invoiceTerms);
      // Example: Adding Invoice Terms
      autoTable(doc, {
        startY: yPos,
        head: [["Payment Terms"]],
        body: [[invoice.invoiceTerms || "ไม่มีค่า"]],
        theme: "grid",
        styles: {
          fontSize: 10,
          cellPadding: 2,
          textColor: [0, 0, 0],
          font: "Sarabun",
          lineColor: [0, 0, 0],
        },
        headStyles: { fillColor: [r, g, b] },
        columnStyles: { 0: { cellWidth: 180, halign: "left" } },
      });
      yPos = (doc as any).lastAutoTable.finalY + 5;

      autoTable(doc, {
        startY: yPos,
        head: [["Bank Details", ""]],
        body: [
          ["Bank :", invoice.bank],
          ["Account Name :", invoice.accountName],
          ["Account Number :", invoice.accountNumber],
          ["Branch :", invoice.branch],
          ["SWIFT :", invoice.swift],
        ],
        // .filter((row) => row[0] !== "" && row[0] !== null) // Filter out empty or null rows
        // .map((row) => row), // Map to ensure we get the same format for each row
        theme: "grid",
        styles: {
          fontSize: 10,
          cellPadding: 2,
          textColor: [0, 0, 0],
          font: "Sarabun",
          lineColor: [0, 0, 0],
        },
        headStyles: { fillColor: [r, g, b], halign: "left" },
        columnStyles: {
          0: { cellWidth: 35, halign: "left" },
          1: { cellWidth: 145, halign: "left" },
        },
      });

      yPos = (doc as any).lastAutoTable.finalY + 10;

      // Example: Adding Receiving Details
      autoTable(doc, {
        startY: yPos,
        body: [
          ["Received by :", invoice.receivedBy || ""],
          ["Date :", invoice.receivedDate || ""],
        ],
        theme: "grid",
        styles: {
          fontSize: 10,
          cellPadding: 2,
          textColor: [0, 0, 0],
          font: "Sarabun",
          lineColor: [0, 0, 0],
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
  }
  return { exportInvoicePDF };
});
