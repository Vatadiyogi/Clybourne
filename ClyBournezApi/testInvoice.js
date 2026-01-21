const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Create a simple invoice
function createTestInvoice() {
  console.log('🔄 Creating test invoice...');
  
  const invoicesDir = path.join(__dirname, 'public/invoices');
  if (!fs.existsSync(invoicesDir)) {
    fs.mkdirSync(invoicesDir, { recursive: true });
  }
  
  const filename = `invoice_test_${Date.now()}.pdf`;
  const filePath = path.join(invoicesDir, filename);
  
  // Create a document
  const doc = new PDFDocument({ margin: 50 });
  
  // Pipe to file
  doc.pipe(fs.createWriteStream(filePath));
  
  // Add content
  doc.fontSize(25).text('TEST INVOICE', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text('Plan ID: 5');
  doc.text('Customer: test@example.com');
  doc.text('Amount: $99.00');
  doc.text('Status: Paid');
  
  // Finalize
  doc.end();
  
  console.log(`✅ Created: ${filePath}`);
  console.log(`📁 Test URL: http://localhost:5050/invoices/${filename}`);
}

createTestInvoice();