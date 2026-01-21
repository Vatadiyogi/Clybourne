// backend/src/routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const PdfService = require('../../../services/PdfService.js'); // Import the service
const puppeteer = require("puppeteer");
// Cleanup function
const cleanup = async () => {
    await PdfService.cleanup();
};

// ============ ROUTES ============

// POST /api/reports/generate - Generate and download PDF
router.post('/generate', async (req, res) => {
    try {
        const {
            companyName,
            orderId,
            valuation = {},
            financials = [],
            assumptions = [],
            clientName,
            analystName,
            analystTitle,
            ...otherData
        } = req.body;

        // Validate required fields
        if (!companyName) {
            return res.status(400).json({
                success: false,
                error: 'Company name is required'
            });
        }

        if (!valuation.finalValue && valuation.finalValue !== 0) {
            return res.status(400).json({
                success: false,
                error: 'Valuation amount is required'
            });
        }

        console.log(`Generating report for: ${companyName}`);

        // Generate PDF using PdfService
        const pdfBuffer = await PdfService.generatePdf({
            companyName,
            orderId,
            valuation: {
                finalValue: valuation.finalValue || 0,
                dcfValue: valuation.dcfValue || valuation.finalValue || 0,
                comparableValue: valuation.comparableValue || valuation.finalValue || 0,
                transactionValue: valuation.transactionValue || valuation.finalValue || 0,
                methodology: valuation.methodology || 'Discounted Cash Flow & Comparable Analysis',
                asOfDate: valuation.asOfDate || new Date().toISOString().split('T')[0]
            },
            financials: financials.map(f => ({
                year: f.year || new Date().getFullYear(),
                revenue: f.revenue || 0,
                ebitda: f.ebitda || 0,
                netIncome: f.netIncome || 0,
                growthRate: f.growthRate || 0
            })),
            assumptions,
            clientName,
            analystName,
            analystTitle,
            ...otherData
        });

        // Create filename
        const safeCompanyName = companyName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const fileName = `valuation_report_${safeCompanyName}_${Date.now()}.pdf`;

        // Set response headers
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${fileName}"`,
            'Content-Length': pdfBuffer.length,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'X-Report-Status': 'success',
            'X-Company-Name': companyName
        });

        // Send PDF
        res.send(pdfBuffer);

        console.log(`Report generated successfully for: ${companyName}`);

    } catch (error) {
        console.error('PDF generation error:', error);

        res.status(500).json({
            success: false,
            error: 'Failed to generate valuation report',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// GET /api/reports/generate/:orderId
router.get('/generate/:orderId', async (req, res) => {
  console.log('📄 PDF Request received for order:', req.params.orderId);
  
  try {
    const { orderId } = req.params;
    
    // Your existing PDF generation...
    const sampleData = {
      companyName: `Company ${orderId}`,
      orderId: orderId,
      valuation: {
        finalValue: 1000000,
        dcfValue: 950000,
        comparableValue: 1050000,
        transactionValue: 980000,
        methodology: 'DCF Analysis',
        asOfDate: new Date().toISOString().split('T')[0]
      }
    };

    const pdfBuffer = await PdfService.generatePdf(sampleData);
    
    console.log('✅ PDF generated, size:', pdfBuffer.length, 'bytes');
    
    // 🚨 CRITICAL: Set proper headers for PDF download
    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Valuation_Report_${orderId}.pdf"`,
      'Content-Length': pdfBuffer.length,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Expose-Headers': 'Content-Disposition'
    });
    
    // Send the PDF buffer
    res.end(pdfBuffer);
    
    console.log('✅ PDF sent to client');
    
  } catch (error) {
    console.error('❌ PDF generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate PDF',
      message: error.message 
    });
  }
});

// GET /api/reports/health - Health check endpoint
router.get('/health', async (req, res) => {
    try {
        // Quick test generation
        const testBuffer = await PdfService.generatePdf({
            companyName: 'Test Company',
            valuation: {
                finalValue: 1000000,
                asOfDate: new Date().toISOString().split('T')[0]
            }
        });

        res.json({
            status: 'healthy',
            service: 'pdf-generation',
            timestamp: new Date().toISOString(),
            pdfSize: testBuffer.length,
            message: 'PDF service is working correctly'
        });

    } catch (error) {
        res.status(500).json({
            status: 'unhealthy',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// GET /api/reports/template - View HTML template
router.get('/template', async (req, res) => {
    try {
        const templatePath = path.join(__dirname, '../templates/valuation-report.html');
        const templateContent = await fs.readFile(templatePath, 'utf-8');

        res.set('Content-Type', 'text/html');
        res.send(templateContent);
    } catch (error) {
        res.status(404).json({
            error: 'Template not found',
            path: '../templates/valuation-report.html'
        });
    }
});

 
// NEW: Simple PDF endpoint that definitely works
router.get('/simple/:orderId', async (req, res) => {
  console.log('Simple PDF endpoint called for order:', req.params.orderId);
  
  let browser;
  try {
    // Launch browser
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // SUPER SIMPLE HTML - no templates, no Handlebars
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial; padding: 20px; }
          h1 { color: #333; }
        </style>
      </head>
      <body>
        <h1>✅ VALUATION REPORT</h1>
        <h2>Order: ${req.params.orderId}</h2>
        <p>Company: Test Company</p>
        <p>Date: ${new Date().toLocaleDateString()}</p>
        <p>Value: $1,000,000</p>
        <hr>
        <p><strong>THIS IS A WORKING PDF!</strong></p>
        <p>If you can see this, PDF generation works!</p>
      </body>
      </html>
    `;
    
    await page.setContent(html);
    
    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' }
    });
    
    await page.close();
    await browser.close();
    
    console.log('PDF generated, size:', pdfBuffer.length);
    
    // Set headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="report_${req.params.orderId}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    // Send PDF
    res.send(pdfBuffer);
    
    console.log('PDF sent successfully!');
    
  } catch (error) {
    console.error('Simple PDF error:', error);
    
    // Close browser if it exists
    if (browser) {
      try { await browser.close(); } catch(e) {}
    }
    
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'PDF generation failed'
    });
  }
});

// GET /api/reports/sample-data - Get sample data structure
router.get('/sample-data', (req, res) => {
    res.json({
        description: 'Sample data structure for valuation report',
        required: ['companyName', 'valuation.finalValue'],
        sample: {
            companyName: 'Your Company Name',
            orderId: 'Optional order reference',
            clientName: 'Optional client name',
            analystName: 'Optional analyst name',
            valuation: {
                finalValue: 1000000, // Required
                dcfValue: 950000,
                comparableValue: 1050000,
                transactionValue: 980000,
                methodology: 'DCF & Comparable Analysis',
                asOfDate: '2024-01-15'
            },
            financials: [
                {
                    year: 2023,
                    revenue: 500000,
                    ebitda: 125000,
                    netIncome: 85000,
                    growthRate: 15
                }
            ],
            assumptions: [
                'Assumption 1',
                'Assumption 2',
                'Assumption 3'
            ]
        }
    });
});

// Error handling middleware for this router
router.use((error, req, res, next) => {
    console.error('Report route error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error in report generation',
        requestId: req.id || Date.now()
    });
});

// Cleanup on process exit
process.on('SIGINT', async () => {
    console.log('Cleaning up browser instance...');
    await cleanup();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('Cleaning up browser instance...');
    await cleanup();
    process.exit(0);
});

module.exports = router;