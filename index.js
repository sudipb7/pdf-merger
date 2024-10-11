const fs = require("fs");
const path = require("path");
const { PDFDocument } = require("pdf-lib");

async function mergePDFs(inputDirectory) {
  try {
    // Group PDF files
    const files = fs.readdirSync(inputDirectory);
    const pdfFiles = files.filter(file => file.toLowerCase().endsWith(".pdf"));
    const sortedPdfFiles = pdfFiles.sort((a, b) => {
      const aNumber = parseInt(a.split(" ")[0]);
      const bNumber = parseInt(b.split(" ")[0]);
      return aNumber - bNumber;
    });

    // Create a new PDF document
    const mergedPdf = await PDFDocument.create();

    // Merge all chapters
    for (const file of sortedPdfFiles) {
      console.log(`Processing ${file}...`);
      const pdfBytes = fs.readFileSync(path.join(inputDirectory, file));
      const pdf = await PDFDocument.load(pdfBytes);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach(page => mergedPdf.addPage(page));
    }

    // Save the merged PDF
    const mergedPdfBytes = await mergedPdf.save();
    const outputPath = path.join(inputDirectory, `Complete.pdf`);
    fs.writeFileSync(outputPath, mergedPdfBytes);

    console.log(`Successfully merged ${sortedPdfFiles.length} PDFs`);
  } catch (error) {
    console.error("Error merging PDFs:", error);
  }
}

async function main() {
  const directories = [
    "../../University/Sem 2/Communication Skills and Personality Development/",
    "../../University/Sem 2/Digital Logic/",
    "../../University/Sem 2/Operating System/",
  ];

  for (const directory of directories) {
    await mergePDFs(path.join(__dirname, directory));
  }

  console.log("All PDFs merged successfully");
}

main();
