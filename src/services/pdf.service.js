const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

exports.generateProposalPDF = (proposalId, clientName, items, totalAmount) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const fileName = `proposal-${proposalId}-${Date.now()}.pdf`;
      const uploadDir = path.join(__dirname, "../../uploads/proposals");
      
      // Ensure directory exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, fileName);
      const writeStream = fs.createWriteStream(filePath);

      doc.pipe(writeStream);

      // Header
      doc.fontSize(25).text("Digitize Your Biz", { align: "center" });
      doc.moveDown();
      doc.fontSize(18).text("Project Proposal", { align: "center" });
      doc.moveDown();

      // Client Info
      doc.fontSize(12).text(`Client: ${clientName}`);
      doc.text(`Date: ${new Date().toLocaleDateString()}`);
      doc.moveDown();

      // Line Items
      doc.text("Services Included:", { underline: true });
      doc.moveDown(0.5);

      items.forEach((item) => {
        doc.text(`- ${item.description}: $${item.price}`);
      });

      doc.moveDown();
      doc.fontSize(14).text(`Total Amount: $${totalAmount}`, { bold: true });

      doc.end();

      writeStream.on("finish", () => {
        // Return relative path for DB storage
        resolve(`uploads/proposals/${fileName}`);
      });

      writeStream.on("error", (err) => {
        reject(err);
      });
    } catch (error) {
      reject(error);
    }
  });
};