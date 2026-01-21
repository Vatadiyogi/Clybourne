// backend/src/services/ReportDataService.js
const moment = require('moment');

class ReportDataService {
  prepareReportData(order, calculations) {
    // Extract data from order and calculations
    const business = order.business || {};
    const finance = order.finance || {};
    const forecast = order.forcast_inc_stmt || [];
    
    return {
      // Page 1
      companyName: business.companyName || "Company Name",
      reportDate: moment().format('Do MMMM, YYYY'),
      disclaimerText: "Valuation of Company is based on the information provided by the client...",
      
      // Page 2
      companyDetails: {
        name: business.companyName || "Company Name",
        country: business.country || "Country",
        currency: finance.valueType || "INR",
        type: business.typeOfCompany || "Private",
        yearsInBusiness: business.companyAge || "N/A",
        industry: business.industry || "N/A"
      },
      
      // Page 3 - Chart Data
      chartData: {
        revenue: {
          labels: ['2025', '2026', '2027', '2028', '2029'],
          data: this.extractForecastData(forecast, 'salesGrowthRate', [6.5, 6.7, 7.0, 7.2, 7.5])
        },
        cogs: {
          labels: ['2025', '2026', '2027', '2028', '2029'],
          data: this.extractForecastData(forecast, 'cogs', [3.5, 3.6, 3.7, 3.8, 3.9])
        },
        ebitda: {
          labels: ['2025', '2026', '2027', '2028', '2029'],
          data: this.extractForecastData(forecast, 'ebitdaMargin', [-1, 2, 3, 4, 5]),
          margins: this.extractForecastData(forecast, 'ebitdaMargin', [-10, 2, 5, 10, 12])
        }
      },
      
      // Page 4 - Valuation
      valuation: {
        totalValue: calculations.relValService?.weightAvgEquityValue || 0,
        equityValue: calculations.relValService?.weightAvgEquityValue || 0,
        netDebt: calculations.relValService?.netDebt || 0,
        currency: finance.valueType || "INR"
      },
      
      // Page 5 - DCF Data
      dcfData: {
        years: [2023, 2024, 2025, 2026, 2027],
        ebitda: this.extractDCFData(calculations.backEndService?.workIncStmt, 'ebitda', [100, 200, 250, 300, 150]),
        wacc: calculations.dcfService?.wacc || 35
      },
      
      // Page 6 - Financial Statements
      incomeStatement: {
        years: [2024, 2025, 2026, 2027, 2028, 2029],
        revenue: this.extractFinancialData(calculations.backEndService?.workIncStmt, 'revenue', [120, 180, 250, 300, 500, 550]),
        cogs: this.extractFinancialData(calculations.backEndService?.workIncStmt, 'costOfGoodsSold', [60, 90, 125, 150, 250, 275]),
        ebitda: this.extractFinancialData(calculations.backEndService?.workIncStmt, 'ebitda', [12, 18, 25, 30, 50, 55])
      },
      
      // Multiples
      multiples: {
        pe: calculations.relValService?.PE || {},
        ps: calculations.relValService?.PS || {},
        evSales: calculations.relValService?.EV_SALES || {},
        evEbitda: calculations.relValService?.EV_EBITDA || {}
      }
    };
  }
  
  extractForecastData(forecast, field, defaultValue) {
    if (!forecast || forecast.length === 0) return defaultValue;
    return forecast.slice(0, 5).map(item => item[field] || 0);
  }
  
  extractDCFData(workStmt, field, defaultValue) {
    if (!workStmt || !workStmt[field]) return defaultValue;
    return workStmt[field].slice(0, 5);
  }
  
  extractFinancialData(workStmt, field, defaultValue) {
    if (!workStmt || !workStmt[field]) return defaultValue;
    return workStmt[field].slice(0, 6);
  }
}

module.exports = new ReportDataService();