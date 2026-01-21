const PDFDocument = require('pdfkit');
const fs = require('fs').promises;
const path = require('path');

async function generateInvoicePDF(plan, user, transaction) {
  return new Promise(async (resolve, reject) => {
    try {
      // Create invoices directory
      const invoicesDir = path.join(__dirname, '../public/invoices');
      await fs.mkdir(invoicesDir, { recursive: true });
      
      // Create filename
      const timestamp = Date.now();
      const filename = `invoice_${plan.planSeqId}_${timestamp}.pdf`;
      const filePath = path.join(invoicesDir, filename);
      
      // Create a document
      const doc = new PDFDocument({ margin: 50 });
      
      // Pipe to file
      const stream = doc.pipe(fs.createWriteStream(filePath));
      
      // ==================== HEADER ====================
      doc.fontSize(25).text('INVOICE', { align: 'center' });
      doc.moveDown(0.5);
      
      // Invoice number and date
      doc.fontSize(10)
         .fillColor('#666666')
         .text(`Invoice #: INV-${plan.planSeqId}-${timestamp}`, { align: 'center' })
         .text(`Date: ${new Date().toLocaleDateString()}`, { align: 'center' });
      
      doc.moveDown(2);
      
      // ==================== COMPANY & BILL TO ====================
      const startX = 50;
      const columnWidth = 250;
      
      // Company Info (Left)
      doc.fontSize(12)
         .fillColor('#000000')
         .text('FinVal', startX, doc.y, { bold: true });
      
      doc.fontSize(10)
         .fillColor('#666666')
         .text('123 Business Street')
         .text('City, Country 12345')
         .text('support@finval.com')
         .text('+1 234 567 8900');
      
      // Bill To (Right)
      const billToX = startX + columnWidth;
      doc.fontSize(12)
         .fillColor('#000000')
         .text('BILL TO', billToX, doc.y - 100, { bold: true });
      
      doc.fontSize(10)
         .fillColor('#666666')
         .text(`${user.first_name || ''} ${user.last_name || ''}`, billToX)
         .text(user.email, billToX)
         .text(`Customer ID: ${user._id}`, billToX);
      
      doc.moveDown(4);
      
      // ==================== INVOICE TABLE ====================
      // Table Header
      doc.fillColor('#4CAF50')
         .rect(50, doc.y, 500, 25)
         .fill();
      
      doc.fillColor('#ffffff')
         .fontSize(11)
         .text('Description', 55, doc.y + 7)
         .text('Quantity', 300, doc.y + 7)
         .text('Unit Price', 380, doc.y + 7)
         .text('Amount', 470, doc.y + 7, { width: 80, align: 'right' });
      
      doc.moveDown();
      
      // Table Row - Plan Subscription
      const rowY = doc.y;
      doc.fillColor('#f9f9f9')
         .rect(50, rowY, 500, 30)
         .fill();
      
      doc.fillColor('#000000')
         .fontSize(10)
         .text(`${plan.planId?.name || 'Plan Subscription'}`, 55, rowY + 10)
         .text('1', 300, rowY + 10)
         .text(`$${plan.amount || 0}`, 380, rowY + 10)
         .text(`$${plan.amount || 0}`, 470, rowY + 10, { width: 80, align: 'right' });
      
      doc.moveDown(2);
      
      // ==================== PLAN DETAILS ====================
      doc.fontSize(12)
         .fillColor('#000000')
         .text('PLAN DETAILS', { underline: true });
      
      doc.moveDown(0.5);
      
      // Plan details in a nice format
      const details = [
        `Plan ID: ${plan.planSeqId}`,
        `Plan Type: ${plan.planType}`,
        `Reports Included: ${plan.balanceQuota || 0}`,
        `Access Days: ${plan.accessDays || 0}`,
        `Reports Used: ${plan.orders?.length || 0}`,
        `Reports Remaining: ${(plan.balanceQuota || 0) - (plan.orders?.length || 0)}`,
        `Purchase Date: ${new Date(plan.createdAt).toLocaleDateString()}`,
        `Expiry Date: ${new Date(plan.expiresAt).toLocaleDateString()}`,
        `Status: ${plan.planStatusType || 'Expired'}`
      ];
      
      details.forEach(detail => {
        doc.fontSize(10)
           .fillColor('#666666')
           .text(`• ${detail}`);
      });
      
      doc.moveDown(2);
      
      // ==================== TOTAL ====================
      const totalY = doc.y;
      doc.fillColor('#f0f0f0')
         .rect(300, totalY, 250, 80)
         .fill();
      
      doc.fontSize(11)
         .fillColor('#000000')
         .text('Subtotal:', 310, totalY + 10)
         .text(`$${plan.amount || 0}`, 470, totalY + 10, { width: 80, align: 'right' });
      
      doc.text('Tax (0%):', 310, totalY + 30)
         .text('$0.00', 470, totalY + 30, { width: 80, align: 'right' });
      
      doc.fontSize(14)
         .fillColor('#000000')
         .text('TOTAL:', 310, totalY + 55, { bold: true })
         .text(`$${plan.amount || 0}`, 470, totalY + 55, { width: 80, align: 'right', bold: true });
      
      doc.moveDown(4);
      
      // ==================== PAYMENT INFO ====================
      doc.fontSize(11)
         .fillColor('#000000')
         .text('PAYMENT INFORMATION', { underline: true });
      
      doc.moveDown(0.5);
      
      doc.fontSize(10)
         .fillColor('#666666')
         .text(`Payment Method: ${transaction?.gatewayType || 'Stripe'}`)
         .text(`Transaction ID: ${transaction?.txnId || 'N/A'}`)
         .text(`Payment Status: ${transaction?.status || 'Paid'}`);
      
      doc.moveDown(2);
      
      // ==================== FOOTER ====================
      doc.fontSize(9)
         .fillColor('#999999')
         .text('Thank you for your business!', { align: 'center' })
         .text('If you have any questions about this invoice, please contact support@finval.com', { align: 'center' })
         .text('This is an auto-generated invoice. No signature required.', { align: 'center' });
      
      // Finalize PDF
      doc.end();
      
      stream.on('finish', () => {
        resolve(`invoices/${filename}`);
      });
      
      stream.on('error', (error) => {
        reject(error);
      });
      
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { generateInvoicePDF };