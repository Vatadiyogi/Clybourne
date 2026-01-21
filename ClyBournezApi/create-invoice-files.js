const fs = require('fs').promises;
const path = require('path');
const mongoose = require('mongoose');

// ✅ USE YOUR MONGODB CONNECTION STRING
const MONGODB_URI = 'mongodb+srv://vishnu:741374666@devdexaadiyogi.gtsxnin.mongodb.net/';

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
}

// Import your models (adjust paths based on your structure)
const PlanRecord = require('./models/plan-record.model');
const CustomersModel = require('./models/customers.model');

// Function to create PDF content
function createPDFContent(plan, user) {
  const invoiceDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const purchaseDate = new Date(plan.createdAt).toLocaleDateString();
  const expiryDate = new Date(plan.expiresAt).toLocaleDateString();
  const planName = plan.planId?.name || 'Plan Subscription';
  const userName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Customer';
  
  return Buffer.from(`
%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/Resources <<
/Font <<
/F1 4 0 R
/F2 5 0 R
>>
>>
/MediaBox [0 0 612 792]
/Contents 6 0 R
>>
endobj
4 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica-Bold
>>
endobj
5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj
6 0 obj
<<
/Length 600
>>
stream
BT
/F1 24 Tf
200 750 Td
(INVOICE) Tj
/F2 10 Tf
-128 -30 Td
(Invoice #: INV-${plan.planSeqId}-${Date.now()}) Tj
0 -15 Td
(Date: ${invoiceDate}) Tj
0 -30 Td
(----------------------------------------------------------------) Tj
/F1 14 Tf
0 -25 Td
(BILL TO:) Tj
/F2 12 Tf
0 -20 Td
(${userName}) Tj
0 -15 Td
(${user.email}) Tj
0 -30 Td
(----------------------------------------------------------------) Tj
/F1 14 Tf
0 -25 Td
(PLAN DETAILS:) Tj
/F2 12 Tf
0 -20 Td
(Plan: ${planName}) Tj
0 -15 Td
(Plan ID: ${plan.planSeqId}) Tj
0 -15 Td
(Plan Type: ${plan.planType}) Tj
0 -15 Td
(Reports: ${plan.balanceQuota || 0}) Tj
0 -15 Td
(Access Days: ${plan.accessDays || 0}) Tj
0 -15 Td
(Purchase: ${purchaseDate}) Tj
0 -15 Td
(Expiry: ${expiryDate}) Tj
0 -30 Td
(----------------------------------------------------------------) Tj
/F1 16 Tf
0 -25 Td
(Amount: $${plan.amount || 0}.00) Tj
/F2 12 Tf
0 -30 Td
(Status: Paid | Method: Online) Tj
0 -30 Td
(----------------------------------------------------------------) Tj
0 -25 Td
(Thank you for your business!) Tj
ET
endstream
endobj
xref
0 7
0000000000 65535 f
0000000010 00000 n
0000000053 00000 n
0000000112 00000 n
0000000250 00000 n
0000000345 00000 n
0000000440 00000 n
trailer
<<
/Size 7
/Root 1 0 R
>>
startxref
1100
%%EOF
`.trim());
}

async function generateRealInvoices() {
  try {
    console.log('🚀 Starting invoice generation...\n');
    
    // Connect to database
    await connectDB();
    
    // Create invoices directory
    const invoicesDir = path.join(__dirname, 'public/invoices');
    await fs.mkdir(invoicesDir, { recursive: true });
    console.log(`📁 Directory ready: ${invoicesDir}\n`);
    
    // Get all plans that have invoicePath but maybe no file
    const plans = await PlanRecord.find({
      invoicePath: { $exists: true, $ne: null }
    }).populate('planId');
    
    console.log(`📊 Found ${plans.length} plans in database\n`);
    
    if (plans.length === 0) {
      console.log('⚠️  No plans found with invoice paths');
      console.log('💡 Run cron-send-invoice first to generate invoice paths');
      console.log('   URL: http://localhost:5050/api/plan/cron-send-invoice');
      await mongoose.connection.close();
      return;
    }
    
    let successCount = 0;
    
    for (const plan of plans) {
      try {
        console.log(`📋 Processing: Plan ${plan.planSeqId}`);
        
        // Get user
        const user = await CustomersModel.findById(plan.userId);
        if (!user) {
          console.log(`   ❌ User not found for plan ${plan.planSeqId}`);
          continue;
        }
        
        // Get filename from invoicePath
        const filename = plan.invoicePath.split('/').pop();
        const filePath = path.join(invoicesDir, filename);
        
        // Create PDF with actual data
        const pdfBuffer = createPDFContent(plan, user);
        await fs.writeFile(filePath, pdfBuffer);
        
        console.log(`   ✅ Generated: ${filename}`);
        console.log(`      Customer: ${user.email}`);
        console.log(`      Plan: ${plan.planId?.name || 'N/A'}`);
        console.log(`      Amount: $${plan.amount || 0}`);
        console.log('');
        
        successCount++;
        
      } catch (planError) {
        console.error(`   ❌ Error: ${planError.message}`);
      }
    }
    
    console.log('='.repeat(50));
    console.log('🎉 GENERATION COMPLETE');
    console.log(`✅ Success: ${successCount}/${plans.length}`);
    console.log(`📁 Files in: ${invoicesDir}`);
    console.log('='.repeat(50));
    
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    
  } catch (error) {
    console.error('💥 Fatal error:', error.message);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

// Run the generator
generateRealInvoices();