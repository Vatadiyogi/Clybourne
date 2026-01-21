// backend/src/services/PdfService.js
const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const ejs = require('ejs');

class PdfService {
    constructor() {
        this.browser = null;
        this.templateCache = null;
    }

    async getBrowser() {
        if (!this.browser) {
            console.log('🚀 Launching new browser instance...');
            this.browser = await puppeteer.launch({
                headless: 'new',
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-gpu',
                    '--window-size=1920,1080'
                ],
                timeout: 30000
            });
            console.log('✅ Browser launched successfully');
        }
        return this.browser;
    }

    async getTemplate() {
        if (!this.templateCache) {
            try {
                // Try to load your EJS template
                const templatePath = path.join(__dirname, '../../views/valuation-report.ejs');
                console.log('📄 Loading EJS template from:', templatePath);

                const templateContent = await fs.readFile(templatePath, 'utf-8');
                this.templateCache = templateContent;
                console.log('✅ Template loaded successfully');
            } catch (error) {
                console.error('❌ Error loading template:', error.message);
                // Fallback to simple template
                this.templateCache = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                        <title>Valuation Report</title>
                        <style>
                            body { font-family: Arial; padding: 20px; }
                            h1 { color: #333; }
                            table { border-collapse: collapse; width: 100%; }
                            th, td { border: 1px solid #ddd; padding: 8px; }
                            th { background: #f5f5f5; }
                        </style>
                    </head>
                    <body>
                        <h1>Valuation Report for <%= companyName %></h1>
                        <p>Order: <%= orderId %></p>
                        <p>Date: <%= new Date().toLocaleDateString() %></p>
                        <hr>
                        <p>This is a fallback template.</p>
                    </body>
                    </html>
                `;
            }
        }
        return this.templateCache;
    }

    async generatePdfFromEjs(data) {
        console.log('=== GENERATING PDF FROM EJS ===');

        let browser;
        let page;

        try {
            // 1. Get browser instance
            browser = await this.getBrowser();
            page = await browser.newPage();

            // 2. Get template - FIXED to use actual EJS template
            let template;
            try {
                // Try multiple template locations
                const possiblePaths = [
                    path.join(__dirname, '../../views/valuation-report.ejs'),
                    path.join(__dirname, '../../../views/valuation-report.ejs'),
                    path.join(process.cwd(), 'views/valuation-report.ejs'),
                    path.join(process.cwd(), 'backend/views/valuation-report.ejs'),
                    path.join(process.cwd(), 'src/views/valuation-report.ejs')
                ];

                for (const templatePath of possiblePaths) {
                    try {
                        template = await fs.readFile(templatePath, 'utf-8');
                        console.log(`✅ Template found at: ${templatePath}`);
                        break;
                    } catch (err) {
                        // Continue to next path
                    }
                }

                if (!template) {
                    throw new Error('Template not found in any location');
                }
            } catch (templateError) {
                console.error('❌ Template error:', templateError.message);
                // Use fallback template with more details
                template = this.getFallbackTemplate();
            }

            // 3. Prepare complete data for EJS template
            const completeData = {
                // Basic data
                companyName: data.companyName || "Company",
                orderId: data.orderId || "N/A",
                reportDate: new Date().toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                }),

                // Pass ALL data from route
                ...data._additionalData, // This contains your full report data

                // Valuation data
                valuation: data.valuation || {
                    finalValue: 0,
                    dcfValue: 0,
                    weightedAvgValue: 0
                },

                // Checkbox values
                checkBoxesValues: data.checkBoxesValues || {},

                // Financial data
                financialData: data.financialData || {
                    revenue: 0,
                    ebitda: 0,
                    netProfit: 0
                },

                // Helper functions
                formatCurrency: function (num) {
                    if (num == null || isNaN(num)) return '$0';
                    if (num >= 1000000) return '$' + (num / 1000000).toFixed(2) + 'M';
                    if (num >= 1000) return '$' + (num / 1000).toFixed(2) + 'K';
                    return '$' + num.toLocaleString();
                },
                formatNumber: function (num) {
                    if (num == null || isNaN(num)) return "0";
                    return num.toLocaleString();
                },
                formatPercentage: function (num) {
                    if (num == null || isNaN(num)) return "0%";
                    return num.toFixed(1) + '%';
                }
            };

            console.log('🎨 Rendering EJS template with complete data...');

            // 4. Render EJS template with complete data
            const ejs = require('ejs');
            const html = ejs.render(template, completeData);

            if (!html || html.trim().length === 0) {
                throw new Error('Generated HTML is empty');
            }

            console.log(`📊 HTML generated: ${html.length} bytes`);

            // 5. Save HTML for debugging
            try {
                const debugDir = path.join(__dirname, '../../../debug');
                await fs.mkdir(debugDir, { recursive: true });
                await fs.writeFile(path.join(debugDir, 'pdf-complete.html'), html);
                console.log('💾 Complete HTML saved to: debug/pdf-complete.html');
            } catch (debugError) {
                console.log('⚠️ Could not save debug HTML:', debugError.message);
            }

            // 6. Set page content
            await page.setContent(html, {
                waitUntil: 'networkidle0',
                timeout: 30000
            });

            // 7. Wait for fonts and resources
            await page.evaluate(() => document.fonts.ready);
            await new Promise(resolve => setTimeout(resolve, 2000));

            // 8. Generate PDF
            console.log('🖨️  Generating PDF...');
            const pdfBuffer = await page.pdf({
                format: 'A4',
                printBackground: true,
                margin: {
                    top: '20mm',
                    right: '15mm',
                    bottom: '20mm',
                    left: '15mm'
                },
                displayHeaderFooter: true,
                headerTemplate: '<div style="font-size: 8px; color: #666; width: 100%; text-align: center;">Valuation Report</div>',
                footerTemplate: `
                <div style="font-size: 8px; text-align: center; width: 100%; padding: 10px;">
                    Page <span class="pageNumber"></span> of <span class="totalPages"></span> | 
                    Generated on ${new Date().toLocaleDateString()}
                </div>
            `,
                preferCSSPageSize: true
            });

            console.log(`✅ PDF generated: ${pdfBuffer.length} bytes`);

            // 9. Validate PDF
            const pdfHeader = pdfBuffer.toString('utf8', 0, 4);
            console.log(`PDF header: "${pdfHeader}"`);

            if (pdfHeader !== '%PDF') {
                console.error('❌ ERROR: Generated PDF is invalid');
                throw new Error('Invalid PDF generated');
            }

            return pdfBuffer;

        } catch (error) {
            console.error('❌ PDF generation error:', error.message);
            console.error('Stack:', error.stack);

            // Try fallback with the HTML we have
            if (html) {
                console.log('Trying fallback with generated HTML...');
                return await this.generateDirectPdf(html);
            }

            // Final fallback
            return await this.generateSimplePdf(data);

        } finally {
            if (page) {
                await page.close().catch(e => console.log('Page close error:', e));
            }
        }
    }

    async generateDirectPdf(html) {
        console.log('📄 Generating direct PDF from HTML...');

        let browser;
        let page;

        try {
            browser = await this.getBrowser();
            page = await browser.newPage();

            await page.setContent(html, {
                waitUntil: 'networkidle0',
                timeout: 30000
            });

            await new Promise(resolve => setTimeout(resolve, 1000));

            const pdfBuffer = await page.pdf({
                format: 'A4',
                margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' }
            });

            console.log(`✅ Direct PDF generated: ${pdfBuffer.length} bytes`);
            return pdfBuffer;

        } catch (error) {
            console.error('❌ Direct PDF failed:', error.message);
            throw error;
        } finally {
            if (page) await page.close();
        }
    }

    getFallbackTemplate() {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Valuation Report</title>
            <style>
                body { font-family: Arial; padding: 30px; }
                h1 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
                h2 { color: #34495e; margin-top: 30px; }
                .info-card { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                th { background: #3498db; color: white; font-weight: bold; }
                .highlight { background: #e8f4fc; padding: 15px; border-left: 4px solid #3498db; }
                .value { font-weight: bold; color: #27ae60; }
            </style>
        </head>
        <body>
            <h1>VALUATION REPORT</h1>
            
            <div class="info-card">
                <h2><%= companyName %></h2>
                <p><strong>Order ID:</strong> <%= orderId %></p>
                <p><strong>Report Date:</strong> <%= reportDate %></p>
                <p><strong>Industry:</strong> <%= companyDetails?.industry || 'N/A' %></p>
                <p><strong>Country:</strong> <%= companyDetails?.country || 'N/A' %></p>
            </div>
            
            <h2>Financial Summary</h2>
            <table>
                <tr>
                    <th>Metric</th>
                    <th>Value</th>
                </tr>
                <tr>
                    <td>Revenue</td>
                    <td class="value"><%= formatCurrency(financialData?.revenue || 0) %></td>
                </tr>
                <tr>
                    <td>EBITDA</td>
                    <td class="value"><%= formatCurrency(financialData?.ebitda || 0) %></td>
                </tr>
                <tr>
                    <td>Net Profit</td>
                    <td class="value"><%= formatCurrency(financialData?.netProfit || 0) %></td>
                </tr>
            </table>
            
            <h2>Valuation Summary</h2>
            <table>
                <tr>
                    <th>Method</th>
                    <th>Value</th>
                </tr>
                <tr>
                    <td>DCF Valuation</td>
                    <td class="value"><%= formatCurrency(valuation?.dcfValue || 0) %></td>
                </tr>
                <tr>
                    <td>Comparable Companies</td>
                    <td class="value"><%= formatCurrency(valuation?.finalValue || 0) %></td>
                </tr>
                <tr>
                    <td><strong>Final Weighted Value</strong></td>
                    <td class="value" style="color: #e74c3c; font-size: 1.2em;">
                        <%= formatCurrency(valuation?.weightedAvgValue || 0) %>
                    </td>
                </tr>
            </table>
            
            <div class="highlight">
                <h3>Net Debt: <%= formatCurrency(netDebt || 0) %></h3>
                <h3>Enterprise Value: <%= formatCurrency(valuation?.enterpriseValue || 0) %></h3>
            </div>
            
            <% if (checkBoxesValues && Object.keys(checkBoxesValues).length > 0) { %>
            <h2>Valuation Methods Used</h2>
            <ul>
                <% if (checkBoxesValues.checkBoxPE_1) { %><li>P/E Multiple (1 yr forward)</li><% } %>
                <% if (checkBoxesValues.checkBoxPS_1) { %><li>P/S Multiple (1 yr forward)</li><% } %>
                <% if (checkBoxesValues.checkBoxEV_SALES_1) { %><li>EV/Sales Multiple (1 yr forward)</li><% } %>
                <% if (checkBoxesValues.checkBoxEV_EBITDA_1) { %><li>EV/EBITDA Multiple (1 yr forward)</li><% } %>
            </ul>
            <% } %>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #7f8c8d;">
                <p>Generated by Valuation System on <%= new Date().toLocaleString() %></p>
                <p>This is a comprehensive valuation report based on DCF and comparable company analysis.</p>
            </div>
        </body>
        </html>
    `;
    }

    async generateSimplePdfFix(data) {
        console.log('📄 Generating SIMPLE FIX PDF...');

        let browser;
        let page;

        try {
            browser = await this.getBrowser();
            page = await browser.newPage();

            // Very simple HTML
            const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Test PDF</title>
                <style>
                    body { font-family: Arial; padding: 20px; }
                    h1 { color: #333; }
                </style>
            </head>
            <body>
                <h1>Test PDF Generation</h1>
                <p>Company: ${data.companyName || 'Test Company'}</p>
                <p>Date: ${new Date().toLocaleDateString()}</p>
                <p>This is a test PDF to check if generation works.</p>
                <p>If you can see this, PDF generation is working!</p>
            </body>
            </html>
        `;

            await page.setContent(html, { waitUntil: 'networkidle0' });

            // Wait a bit
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Generate VERY SIMPLE PDF (no headers/footers)
            const pdfBuffer = await page.pdf({
                format: 'A4',
                margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' }
            });

            console.log(`✅ Simple PDF generated: ${pdfBuffer.length} bytes`);

            // Save for inspection
            const debugPath = path.join(__dirname, '../../../debug/simple-test.pdf');
            await fs.writeFile(debugPath, pdfBuffer);
            console.log(`💾 Saved to: ${debugPath}`);

            return pdfBuffer;

        } catch (error) {
            console.error('❌ Simple PDF failed:', error.message);
            throw error;
        } finally {
            if (page) await page.close();
        }
    }

    async cleanup() {
        if (this.browser) {
            console.log('🔒 Closing browser instance...');
            await this.browser.close().catch(e => console.log('Browser close error:', e));
            this.browser = null;
            console.log('✅ Browser closed');
        }
    }
}

module.exports = new PdfService();