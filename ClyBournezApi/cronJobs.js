// const cron = require('node-cron');
// const PlanRecord = require('./models/PlanRecord');
// const CustomersModel = require('./models/CustomersModel');
// const Transaction = require('./models/Transaction');
// const { generateInvoicePDF } = require('./services/invoiceService');

// // Run every day at 2 AM
// cron.schedule('0 2 * * *', async () => {
//   console.log('='.repeat(60));
//   console.log('📧 AUTOMATIC CRON JOB - Generating Professional Invoices');
//   console.log('='.repeat(60));

//   try {
//     // Find expired plans
//     const planrecords = await PlanRecord.find({
//       planStatusType: 'expired',
//       invoiceSent: 0
//     }).populate('planId');

//     console.log(`🔍 Found ${planrecords.length} expired plans\n`);

//     let processedCount = 0;

//     for (const plan of planrecords) {
//       try {
//         console.log(`📋 Processing Plan: ${plan.planSeqId}`);

//         // Get user
//         const user = await CustomersModel.findById(plan.userId);
//         if (!user) {
//           console.log(`   ❌ User not found`);
//           continue;
//         }

//         // Get transaction
//         const transaction = await Transaction.findOne({
//           customerId: plan.userId,
//           planSeqId: plan.planSeqId
//         });

//         // Generate PDF invoice
//         const invoicePath = await generateInvoicePDF(plan, user, transaction);
//         console.log(`   📄 Generated: ${invoicePath}`);

//         // Update database
//         await PlanRecord.updateOne(
//           { _id: plan._id },
//           {
//             $set: {
//               invoiceSent: 1,
//               invoicePath: invoicePath,
//               updatedAt: new Date()
//             }
//           }
//         );

//         console.log(`   ✅ Updated database\n`);
//         processedCount++;

//       } catch (error) {
//         console.error(`   ❌ Error: ${error.message}\n`);
//       }
//     }

//     console.log('='.repeat(60));
//     console.log('📊 CRON JOB COMPLETED');
//     console.log(`   ✅ Processed: ${processedCount}`);
//     console.log('='.repeat(60));

//   } catch (error) {
//     console.error('💥 Cron Job Error:', error);
//   }
// });

// console.log('✅ Cron jobs initialized');

// // Export for manual triggering if needed
// module.exports = {
//   runInvoiceCron: async () => {
//     // You can call this manually from an API if needed
//   }
// };