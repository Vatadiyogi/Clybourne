// backend/src/utils/dataMapper.js

class DataMapper {
  /**
   * Map order data to report template structure
   * @param {Object} orderData - The order data from MongoDB
   * @param {Object} calculations - Calculated values from services
   * @returns {Object} - Formatted data for report template
   */
  static mapOrderToReport(orderData, calculations) {
    // Extract basic company info
    const companyInfo = orderData.business || {};
    const financialData = orderData.finance || {};
    const forecastData = orderData.forcast_inc_stmt || [];
    
    // Get valuation results
    const dcf = calculations.dcfService || {};
    const relative = calculations.relValService || {};
    
    return {
      // =========== BASIC COMPANY INFO ===========
      companyName: companyInfo.companyName || "Company Name",
      reportDate: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      
      // =========== PAGE 1 DATA ===========
      disclaimerText: "Valuation of Company is based on the information provided by the client and we have not conducted any audit on the accuracy of the numbers.",
      
      // =========== PAGE 2: COMPANY SUMMARY ===========
      companyDetails: {
        name: companyInfo.companyName || "N/A",
        country: companyInfo.country || "N/A",
        currency: financialData.valueType || "INR",
        type: companyInfo.typeOfCompany || "Private",
        yearsInBusiness: companyInfo.companyAge || "N/A",
        industry: companyInfo.industry || "N/A"
      },
      
      companySummary: this.generateCompanySummary(companyInfo),
      
      currentOperations: {
        developmentPhase: companyInfo.developmentPhase || "Early Stage",
        scalableProduct: companyInfo.scalableProduct ? "Yes" : "No",
        profitability: financialData.netProfit > 0 ? "Yes" : "No",
        currentBusinessLevels: companyInfo.earningTrend || "Increasing Profits",
        equity: companyInfo.equityCapital ? "Yes" : "No",
        debt: companyInfo.debtCapital ? "Yes" : "No"
      },
      
      operatingPerformance: {
        period: `${financialData.dataYear || new Date().getFullYear()} - ${(financialData.dataYear || new Date().getFullYear()) + 1}`,
        metrics: [
          { label: "Revenue", value: this.formatCurrency(financialData.sales, financialData.valueType) },
          { label: "EBITDA", value: this.formatCurrency(financialData.ebitda, financialData.valueType) },
          { label: "EBITDA Margin", value: `${((financialData.ebitda / financialData.sales) * 100).toFixed(1)}%` },
          { label: "Net Profit", value: this.formatCurrency(financialData.netProfit, financialData.valueType) },
          { label: "Net Profit Margin", value: `${((financialData.netProfit / financialData.sales) * 100).toFixed(1)}%` },
          { label: "Cash in Hand", value: this.formatCurrency(financialData.cashBalance, financialData.valueType) }
        ],
        description: this.generatePerformanceDescription(companyInfo, financialData),
        cashDescription: `As of ${new Date().getFullYear()}, the Company held a cash balance of ${this.formatCurrency(financialData.cashBalance, financialData.valueType)}.`
      },
      
      // =========== PAGE 3: CHART DATA ===========
      chartData: {
        revenue: this.generateForecastChartData(forecastData, 'salesGrowthRate', 'Revenue'),
        cogs: this.generateForecastChartData(forecastData, 'cogs', 'COGS'),
        ebitda: this.generateForecastChartData(forecastData, 'ebitdaMargin', 'EBITDA'),
        profit: this.generateForecastChartData(forecastData, 'netProfitMargin', 'Net Profit'),
        cash: this.generateCashForecastData(forecastData, financialData)
      },
      
      // =========== PAGE 4: VALUATION SUMMARY ===========
      valuation: {
        enterpriseValue: relative.EnterpriseAvgValue || 0,
        netDebt: relative.netDebt || 0,
        equityValue: relative.weightAvgEquityValue || 0,
        totalValue: (relative.weightAvgEquityValue || 0) + (relative.netDebt || 0),
        currency: financialData.valueType || "INR"
      },
      
      // =========== PAGE 5: DCF DATA ===========
      dcfData: {
        years: calculations.backEndService?.years || [2023, 2024, 2025, 2026, 2027],
        ebitda: this.extractDCFValues(calculations.backEndService?.workIncStmt, 'EBITDA'),
        adjustments: this.generateAdjustments(calculations.dcfService),
        workingCapital: this.extractDCFValues(calculations.backEndService?.workCashFlowStmt, 'changeInWorkingCapital'),
        capex: this.extractDCFValues(calculations.backEndService?.workCashFlowStmt, 'capitalExpenditure'),
        wacc: dcf.wacc || 0,
        presentValues: dcf.workDcfFCFF?.presentValue || []
      },
      
      // =========== PAGE 6: FINANCIAL STATEMENTS ===========
      incomeStatement: this.generateIncomeStatement(calculations.backEndService),
      cashFlowStatement: this.generateCashFlowStatement(calculations.backEndService),
      
      // =========== MULTIPLES DATA ===========
      multiples: {
        pe: calculations.relValService?.PE || {},
        ps: calculations.relValService?.PS || {},
        evSales: calculations.relValService?.EV_SALES || {},
        evEbitda: calculations.relValService?.EV_EBITDA || {}
      },
      
      // =========== IMAGE URLs ===========
      imageUrls: {
        logo: "http://localhost:5050/assets/logo.png",
        logo3: "http://localhost:5050/assets/logo3.png",
        footIcon: "http://localhost:5050/assets/logo3.png"
      }
    };
  }
  
  // =========== HELPER METHODS ===========
  
  static formatCurrency(value, currency = 'INR') {
    if (!value) return `${currency} 0`;
    const inMillions = value / 1000000;
    return `${currency} ${inMillions.toFixed(1)}M`;
  }
  
  static generateCompanySummary(companyInfo) {
    return `${companyInfo.companyName || 'The company'} operates in the ${companyInfo.industry || 'financial services'} sector. ` +
           `With ${companyInfo.companyAge || 'several'} years in business, the company has established itself as a ` +
           `${companyInfo.typeOfCompany || 'private'} entity ${companyInfo.country ? 'in ' + companyInfo.country : ''}.`;
  }
  
  static generatePerformanceDescription(companyInfo, financialData) {
    const revenue = financialData.sales || 0;
    const profitMargin = ((financialData.netProfit || 0) / (revenue || 1) * 100).toFixed(1);
    
    return `The Company operates in the ${companyInfo.industry || 'financial services'} sector and reported revenue of ` +
           `${this.formatCurrency(revenue, financialData.valueType)} in FY ${financialData.dataYear || new Date().getFullYear()}, ` +
           `achieving a Net Profit Margin of ${profitMargin}%.`;
  }
  
  static generateForecastChartData(forecastData, field, label) {
    if (!forecastData || forecastData.length === 0) {
      return {
        labels: ['2025', '2026', '2027', '2028', '2029'],
        data: [0, 0, 0, 0, 0]
      };
    }
    
    const data = forecastData.slice(0, 5).map(item => item[field] || 0);
    const labels = forecastData.slice(0, 5).map((_, index) => 
      (new Date().getFullYear() + index + 1).toString()
    );
    
    return { labels, data };
  }
  
  static generateCashForecastData(forecastData, financialData) {
    const baseCash = financialData.cashBalance || 0;
    const years = [1, 2, 3, 4, 5];
    
    return {
      labels: years.map(year => (new Date().getFullYear() + year).toString()),
      cashIn: years.map(year => baseCash * (1 + 0.15 * year)), // Simulated growth
      cashOut: years.map(year => baseCash * (1 + 0.12 * year)) // Simulated outflow
    };
  }
  
  static extractDCFValues(workStmt, field) {
    if (!workStmt || !workStmt[field]) return [0, 0, 0, 0, 0];
    return workStmt[field].slice(0, 5);
  }
  
  static generateAdjustments(dcfService) {
    // Generate adjustments array based on DCF calculations
    const adjustments = [0, 0, 0, 0, 0];
    if (dcfService.terminalFCFF) {
      adjustments.push(dcfService.terminalFCFF);
    }
    return adjustments;
  }
  
  static generateIncomeStatement(backEndService) {
    if (!backEndService?.workIncStmt) {
      return this.getDefaultIncomeStatement();
    }
    
    const stmt = backEndService.workIncStmt;
    const years = backEndService.years || [2024, 2025, 2026, 2027, 2028, 2029];
    
    return {
      years: years.slice(0, 6),
      revenue: stmt.revenue?.slice(0, 6) || [],
      cogs: stmt.costOfGoodsSold?.slice(0, 6) || [],
      ebitda: stmt.ebitda?.slice(0, 6) || [],
      ebitdaMargin: stmt.ebitdaMargin?.slice(0, 6) || [],
      depreciation: stmt.depreciation?.slice(0, 6) || [],
      interestExpenses: stmt.interestExpense?.slice(0, 6) || [],
      ebit: stmt.ebit?.slice(0, 6) || [],
      netProfit: stmt.netProfit?.slice(0, 6) || [],
      netProfitMargin: stmt.netProfitMargin?.slice(0, 6) || []
    };
  }
  
  static generateCashFlowStatement(backEndService) {
    if (!backEndService?.workCashFlowStmt) {
      return this.getDefaultCashFlowStatement();
    }
    
    const stmt = backEndService.workCashFlowStmt;
    const years = backEndService.years || [2024, 2025, 2026, 2027, 2028, 2029];
    
    return {
      years: years.slice(0, 6),
      netProfit: stmt.netProfit?.slice(0, 6) || [],
      depreciation: stmt.depreciation?.slice(0, 6) || [],
      receivables: stmt.changeInReceivables?.slice(0, 6) || [],
      inventories: stmt.changeInInventory?.slice(0, 6) || [],
      payables: stmt.changeInPayables?.slice(0, 6) || [],
      capitalExpenditure: stmt.capitalExpenditure?.slice(0, 6) || [],
      netCashMovement: stmt.netCashFlow?.slice(0, 6) || [],
      yearEndCashBalance: stmt.cashBalance?.slice(0, 6) || []
    };
  }
  
  static getDefaultIncomeStatement() {
    return {
      years: [2024, 2025, 2026, 2027, 2028, 2029],
      revenue: [120, 180, 250, 300, 500, 550],
      cogs: [60, 90, 125, 150, 250, 275],
      ebitda: [12, 18, 25, 30, 50, 55],
      ebitdaMargin: [10, 10, 10, 10, 10, 10],
      depreciation: [0.05, 0.04, 0.04, 0.04, 0.03, 0.03],
      interestExpenses: [0.36, 0.71, 0.71, 0.71, 0.71, 0.71],
      ebit: [10, 15, 20, 25, 45, 50],
      netProfit: [6, 12, 17, 20, 40, 45],
      netProfitMargin: [5, 5, 5, 5, 5, 5]
    };
  }
  
  static getDefaultCashFlowStatement() {
    return {
      years: [2024, 2025, 2026, 2027, 2028, 2029],
      netProfit: [6, 12, 17, 20, 40, 45],
      depreciation: [0.05, 0.04, 0.04, 0.04, 0.03, 0.03],
      receivables: [2, 2, 2, 2, 2, 2],
      inventories: [-2, -2, -2, -2, -2, -2],
      payables: [-1, -1, -1, -1, -1, -1],
      capitalExpenditure: [3, 3, 3, 3, 3, 3],
      netCashMovement: [15, 12, 15, 18, 20, 25],
      yearEndCashBalance: [20, 32, 47, 65, 85, 110]
    };
  }
}

module.exports = DataMapper;