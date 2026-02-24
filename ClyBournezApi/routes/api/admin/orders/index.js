const router = require('express').Router();
var BackEndService = require('../../../../Calculations/back-end.service');
var mongoose = require("mongoose");
const Orders = require('../../../../models/orders.model');
const Customers = require('../../../../models/customers.model');
const Admins = require('../../../../models/user.model');
const Country = require('../../../../models/Country.model');
const Company = require('../../../../models/companies.model');
const BusinessDataModel = require('../../../../models/businessdata.model');
const HistoricalTrends = require('../../../../models/historicaltrends.model');
const TurnoverFactor = require('../../../../models/turnoverfactor.model');
const Plan = require('../../../../models/plan.model');
const PlanRecord = require('../../../../models/plan-record.model');
var BackEndService = require('../../../../Calculations/back-end.service');
var DcfService = require("../../../../Calculations/dcf.service");
var RelativeValuationService = require("../../../../Calculations/relative-valuation.service");
var BackEndAvgService = require("../../../../Calculations/back-end-avg-service");
const fs = require('fs');
const path = require('path');
const moment = require("moment");
const EmailTemplate = require("../../../../email/sendMail");
const { APIURL } = process.env;
const EjsRenderer = require('../../../../utils/EjsRenderer');
const ReportDataService = require('../../../../services/ReportDataService');
const axios = require('axios'); // If you want to use axios
const PDFDocument = require('pdfkit');

router.get('/:orderId/report-ejs', async (req, res) => {
    console.log('=== EJS REPORT ROUTE CALLED ===');
    console.log('Order ID:', req.params.orderId);

    console.log('Format:', req.query.format);

    try {
        const orderId = req.params.orderId;
        const axios = require('axios'); // Make sure to add this at the top of your file

        // 1. Fetch order with basic data
        let order = await Orders.findById(orderId)
            .populate({
                path: 'matadata.customerId',
                select: 'first_name last_name email phone activePlanType activeSeqId'
            })
            .populate({
                path: 'assigned_to',
                select: 'name'
            })
            .populate({
                path: 'plan.planOrderId',
                select: 'planSeqId planStatus'
            })
            .lean();

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        console.log('Order11111 found:', order.weightAvgEquityValue);
        // console.log('Order found:', order);
        // console.log('Order123 found:', order.EnterpriseMinValue);

        // 2. Fetch valuation data from API
        let valuationData = {};
        try {
            const valuationDataResponse = await axios.get(
                `http://localhost:${process.env.PORT || 3000}/api/admin/orders/valuation-data/${orderId}`,
                { timeout: 10000 }
            );

            if (valuationDataResponse.status === 200) {
                console.log('✅ Successfully fetched pre-calculated valuation data');
                valuationData = valuationDataResponse.data;
            } else {
                console.log('⚠️ Could not fetch pre-calculated data');
            }
        } catch (apiError) {
            console.error('❌ Error fetching from valuation-data API:', apiError.message);
        }

        // console.log("ValuationData:", valuationData);

        // 3. Extract the valuation data into variables with proper defaults
        const {
            workDcfFCFF = [],
            workIncStmt = [],
            workCashFlowStmt = [],
            workBackEndInputs = {},
            workBackEndTableAvg = {},
            companyEquityAvgValue = 0,
            companyEquityMinValue = 0,
            companyEquityMaxValue = 0,
            terminalFCFF = 0,
            terminalPresentFCFF = 0,
            enterpriseValue = 0,
            wacc = 0,
            adjustedBeta = 0,
            PE = {},
            PE_1 = {},
            PS = {},
            PS_1 = {},
            EV_SALES = {},
            EV_SALES_1 = {},
            EV_EBITDA = {},
            EV_EBITDA_1 = {},
            EnterpriseAvgValue = 0,
            EnterpriseMinValue = 0,
            EnterpriseMaxValue = 0,
            weightAvgEquityValue = 0,
            weightMinEquityValue = 0,
            weightMaxEquityValue = 0,
            ValuationCheckBox = {}, // This might be null
            netDebt = 0,
            years = []
        } = valuationData;
        // console.log("valuationDDDDDDDDDDDDD", valuationData)
        // Add this after fetching valuation data (around line 63-70):

        // console.log('=== DEBUG: Valuation Data from API ===');
        // console.log('1. Company Equity Values:');
        // console.log('   - companyEquityMinValue:', companyEquityMinValue);
        // console.log('   - companyEquityAvgValue:', companyEquityAvgValue);
        // console.log('   - companyEquityMaxValue:', companyEquityMaxValue);
        // console.log('2. Enterprise Values:');
        // console.log('   - EnterpriseMinValue:', EnterpriseMinValue);
        // console.log('   - EnterpriseAvgValue:', EnterpriseAvgValue);
        // console.log('   - EnterpriseMaxValue:', EnterpriseMaxValue);
        // console.log('3. Weighted Values:');
        // console.log('   - weightMinEquityValue:', weightMinEquityValue);
        // console.log('   - weightAvgEquityValue:', weightAvgEquityValue);
        // console.log('   - weightMaxEquityValue:', weightMaxEquityValue);
        // console.log('4. Enterprise Value (DCF):', enterpriseValue);
        // console.log('5. Net Debt:', netDebt);
        // console.log('=== END DEBUG ===');


        // 3.5. Fallback to order object if values are missing from API response
        const finalWeightAvgEquityValue = weightAvgEquityValue || order.weightAvgEquityValue || 0;
        const finalNetDebt = netDebt || order.netDebt || 0;
        const finalEnterpriseAvgValue = (EnterpriseAvgValue && EnterpriseAvgValue !== 0)
            ? EnterpriseAvgValue
            : (order.EnterpriseAvgValue && order.EnterpriseAvgValue !== 0
                ? order.EnterpriseAvgValue
                : (finalWeightAvgEquityValue + finalNetDebt));

        // 4. Create safe checkbox values object
        // Check if ValuationCheckBox exists and is not null, otherwise use defaults
        const safeValuationCheckBox = ValuationCheckBox || {
            checkBoxPE: false,
            checkBoxPE_1: false,
            checkBoxPS: false,
            checkBoxPS_1: false,
            checkBoxEV_SALES: false,
            checkBoxEV_SALES_1: false,
            checkBoxEV_EBITDA: false,
            checkBoxEV_EBITDA_1: false
        };

        // Also check order.checkBoxesValues as fallback
        const orderCheckBoxes = order.checkBoxesValues || {};

        // Merge checkbox values (order values take precedence)
        const finalCheckBoxesValues = {
            checkBoxPE: orderCheckBoxes.checkBoxPE || safeValuationCheckBox.checkBoxPE || false,
            checkBoxPE_1: orderCheckBoxes.checkBoxPE_1 || safeValuationCheckBox.checkBoxPE_1 || false,
            checkBoxPS: orderCheckBoxes.checkBoxPS || safeValuationCheckBox.checkBoxPS || false,
            checkBoxPS_1: orderCheckBoxes.checkBoxPS_1 || safeValuationCheckBox.checkBoxPS_1 || false,
            checkBoxEV_SALES: orderCheckBoxes.checkBoxEV_SALES || safeValuationCheckBox.checkBoxEV_SALES || false,
            checkBoxEV_SALES_1: orderCheckBoxes.checkBoxEV_SALES_1 || safeValuationCheckBox.checkBoxEV_SALES_1 || false,
            checkBoxEV_EBITDA: orderCheckBoxes.checkBoxEV_EBITDA || safeValuationCheckBox.checkBoxEV_EBITDA || false,
            checkBoxEV_EBITDA_1: orderCheckBoxes.checkBoxEV_EBITDA_1 || safeValuationCheckBox.checkBoxEV_EBITDA_1 || false
        };

        // console.log('Using checkbox values:', finalCheckBoxesValues);
        const correctWeightAvgEquityValue = order.weightAvgEquityValue || 0;
        const correctWeightMinEquityValue = order.weightMinEquityValue || 0;
        const correctWeightMaxEquityValue = order.weightMaxEquityValue || 0;

        // For Equity Values (for speedometers), use order values
        const correctEquityValues = {
            avg: correctWeightAvgEquityValue, // This is 208,089,246.92
            min: correctWeightMinEquityValue,
            max: correctWeightMaxEquityValue
        };
        const dcfEnterpriseValue = order.EnterpriseAvgValue || 0;
        // 5. Prepare DCF table data with safe values
        const dcfTableData = {
            ebitda: workDcfFCFF.slice(0, 5).map(item => item?.ebitda || 0),
            taxAdjustment: workDcfFCFF.slice(0, 5).map(item => item?.interestTaxImpactAdj || 0),
            workingCapital: workDcfFCFF.slice(0, 5).map(item => item?.workCapChange || 0),
            capex: workDcfFCFF.slice(0, 5).map(item => item?.capex || 0),
            fcff: workDcfFCFF.slice(0, 5).map(item => item?.freeCashFlow || 0),
            presentValue: workDcfFCFF.slice(0, 5).map(item => item?.presentFreeCashFlow || 0),
            terminalValue: terminalFCFF,
            terminalTax: 0,
            wacc: wacc,
            enterpriseValue: enterpriseValue,
            // Enterprise Value Average = Weighted Average Equity Value + Net Debt (from Summary Valuation)
            enterpriseAvgValue: dcfEnterpriseValue,
            netDebt: finalNetDebt,
            equityValue: correctEquityValues.avg,
            equityValueMin: correctEquityValues.min,
            equityValueMax: correctEquityValues.max,
            // enterpriseValue: enterpriseValue,
            // enterpriseAvgValue: finalEnterpriseAvgValue,
            // weightAvgEquityValue: valuationData.weightAvgEquityValue,
            enterpriseValueMin: EnterpriseMinValue || 0,
            enterpriseValueMax: EnterpriseMaxValue || 0,
            years: years.slice(1, 6).map(year => year?.toString() || '2024'),
            wdcfWeight: workBackEndInputs?.dcfWeightPercentage || 12,
            weights: {
                dcf: workBackEndInputs?.dcfWeightPercentage || 12,
                pe: finalCheckBoxesValues.checkBoxPE ? 20 : 0,
                ps1: finalCheckBoxesValues.checkBoxPS_1 ? 10 : 0,
                evSales1: finalCheckBoxesValues.checkBoxEV_SALES_1 ? 35 : 0
            }
        };
        // Also add debug for the DCF table data:
        // console.log('=== DCF Table Data Debug ===');
        // console.log('dcfTableData.equityValue:', dcfTableData.equityValue);
        // console.log('dcfTableData.equityValueMin:', dcfTableData.equityValueMin);
        // console.log('dcfTableData.equityValueMax:', dcfTableData.equityValueMax);
        // console.log('dcfTableData.enterpriseAvgValue:', dcfTableData.enterpriseAvgValue);
        // console.log('=== END DCF Debug ===');
        // Add Terminal Value to years if needed
        if (dcfTableData.years.length < 6) {
            dcfTableData.years.push('Terminal');
        }
        let interestRate = 0;
        if (order.forcast_inc_stmt?.length > 0) {
            interestRate = Number(order.forcast_inc_stmt[0].interestRate) || 0;
        }

        let corTaxRate = 0;
        if (order.back_end_inputs) {
            corTaxRate = Number(order.back_end_inputs.corpTaxRate) || 0;
        }

        const costOfDebt = (interestRate / 100) * (1 - corTaxRate / 100);

        // console.log("Final costOfDebt %:", (costOfDebt * 100).toFixed(2) + "%");
        // Add cost calculations for key assumptions
        let treasureRate = 0;
        let adjustedBetaa = 0;
        let equityRiskPremium = 0;
        let centryRiskPremium = 0;
        let alpha = 0;
        // for adjbeta
        let weightOfAdjBeta = 0;
        let un_lev_beta = 0;
        let cmpnyDiscFactor = 0;
        let weightOfMktBeta = 0;

        if (workBackEndInputs) {
            treasureRate = workBackEndInputs.treasuryondRate;
            equityRiskPremium = workBackEndInputs.equityRiskPremium;
            centryRiskPremium = workBackEndInputs.cntryRiskPremium;
            alpha = workBackEndInputs.alpha;
            weightOfAdjBeta = workBackEndInputs.weightOfAdjBeta;
            cmpnyDiscFactor = workBackEndInputs.cmpnyDiscFactor;
            weightOfMktBeta = workBackEndInputs.weightOfMktBeta;
            un_lev_beta = workBackEndTableAvg.un_lev_beta;
        }
        adjustedBetaa = (weightOfAdjBeta / 100 * (un_lev_beta + cmpnyDiscFactor / 100)) + weightOfMktBeta / 100;
        // console.log("adjustedBetaaadjustedBetaaadjustedBetaa ", adjustedBetaa)
        const costOfEquity = treasureRate / 100 + (adjustedBetaa * equityRiskPremium / 100) + centryRiskPremium / 100 + alpha / 100;
        // adjustedBetaa= 0.53884
        // const costOfEquity = 2.2 / 100 + (adjustedBetaa * 5.4/100) + 0.68/100 + 25 / 100;
        const workBackEndInputsWithCosts = {
            ...workBackEndInputs,
            costOfEquity: costOfEquity * 100, // Rough estimate - you might have actual calculation
            costOfDebt: (costOfDebt * 100).toFixed(2),
            equityRiskPremium: workBackEndInputs?.equityRiskPremium || 12,
            cmpnyDiscFactor: workBackEndInputs?.cmpnyDiscFactor || 10,
            perpetualGrowthRate: workBackEndInputs?.perpetualGrowthRate || 12
        };

        // 6. Prepare chart data
        const chartData = {
            revenue: {
                labels: (workIncStmt || []).map((item, index) => item?.year || (2026 + index)),
                data: (workIncStmt || []).map(item => item?.sales || 0)
            },

            cogs: {
                labels: (workIncStmt || []).map((item, index) => item?.year || (2026 + index)),
                data: (workIncStmt || []).map(item => item?.cogs || 0)
            },

            ebitda: {
                labels: (workIncStmt || []).map((item, index) => item?.year || (2026 + index)),
                data: (workIncStmt || []).map(item => item?.ebitda || 0),
                margins: (workIncStmt || []).map(item => {
                    const sales = item?.sales || 0;
                    const ebitda = item?.ebitda || 0;
                    return sales !== 0 ? (ebitda / sales) * 100 : 0;
                })
            },

            profit: {
                labels: (workIncStmt || []).map((item, index) => item?.year || (2026 + index)),
                data: (workIncStmt || []).map(item => item?.netProfit || 0),
                margins: (workIncStmt || []).map(item => {
                    const sales = item?.sales || 0;
                    const netProfit = item?.netProfit || 0;
                    return sales !== 0 ? (netProfit / sales) * 100 : 0;
                })
            },

            cash: {
                labels: (workCashFlowStmt || []).map((item, index) => 2026 + index),
                // Cash In = Positive cash flow items (yearEndCash if positive)
                cashIn: (workCashFlowStmt || []).map(item => {
                    // Use yearEndCash directly for cash in
                    const yearEndCash = item?.yearEndCash || 0;
                    return Math.max(0, yearEndCash); // Only positive values
                }),
                cashOut: (workDcfFCFF || []).map(item => {
                    const freeCashFlow = item?.freeCashFlow || 0;
                    return Math.max(0, freeCashFlow); // Only positive values
                })
            }
        };
        // 7. Prepare method comparison data
        const activeMethods = [];
        const equityValues = [];
        const equityMinValues = []; // Min equity values for each method
        const equityMaxValues = []; // Max equity values for each method
        const methodLabels = [];

        // DCF Method - Always include if value exists
        if (companyEquityAvgValue !== undefined && !isNaN(companyEquityAvgValue)) {
            activeMethods.push('DCF');
            equityValues.push(Math.abs(companyEquityAvgValue));
            equityMinValues.push(Math.abs(companyEquityMinValue || companyEquityAvgValue));
            equityMaxValues.push(Math.abs(companyEquityMaxValue || companyEquityAvgValue));
            methodLabels.push('DCF');
            // console.log('Added DCF method with value:', companyEquityAvgValue);
        }

        // P/E Method - use finalCheckBoxesValues (regular, not forward)
        if (finalCheckBoxesValues.checkBoxPE && PE && PE.equityValue !== undefined) {
            activeMethods.push('P/E');
            equityValues.push(Math.abs(PE.equityValue));
            equityMinValues.push(Math.abs(PE.minEqValue || PE.equityValue));
            equityMaxValues.push(Math.abs(PE.maxEqValue || PE.equityValue));
            methodLabels.push('P/E');
            // console.log('Added P/E method with value:', PE.equityValue);
        }

        // P/S Method - use finalCheckBoxesValues (regular, not forward)
        if (finalCheckBoxesValues.checkBoxPS && PS && PS.equityValue !== undefined) {
            activeMethods.push('P/S');
            equityValues.push(Math.abs(PS.equityValue));
            equityMinValues.push(Math.abs(PS.minEqValue || PS.equityValue));
            equityMaxValues.push(Math.abs(PS.maxEqValue || PS.equityValue));
            methodLabels.push('P/S');
            // console.log('Added P/S method with value:', PS.equityValue);
        }

        // EV/Sales Method - use finalCheckBoxesValues (regular, not forward)
        if (finalCheckBoxesValues.checkBoxEV_SALES && EV_SALES && EV_SALES.equityValue !== undefined) {
            activeMethods.push('EV/Sales');
            equityValues.push(Math.abs(EV_SALES.equityValue));
            equityMinValues.push(Math.abs(EV_SALES.minEqValue || EV_SALES.equityValue));
            equityMaxValues.push(Math.abs(EV_SALES.maxEqValue || EV_SALES.equityValue));
            methodLabels.push('EV/Sales');
            // console.log('Added EV/Sales method with value:', EV_SALES.equityValue);
        }

        // EV/EBITDA Method - use finalCheckBoxesValues (regular, not forward)
        if (finalCheckBoxesValues.checkBoxEV_EBITDA && EV_EBITDA && EV_EBITDA.equityValue !== undefined) {
            activeMethods.push('EV/EBITDA');
            equityValues.push(Math.abs(EV_EBITDA.equityValue));
            equityMinValues.push(Math.abs(EV_EBITDA.minEqValue || EV_EBITDA.equityValue));
            equityMaxValues.push(Math.abs(EV_EBITDA.maxEqValue || EV_EBITDA.equityValue));
            methodLabels.push('EV/EBITDA');
            // console.log('Added EV/EBITDA method with value:', EV_EBITDA.equityValue);
        }

        // Also check the forward versions if needed
        if (finalCheckBoxesValues.checkBoxPE_1 && PE_1 && PE_1.equityValue !== undefined && PE_1.equityValue !== 0) {
            activeMethods.push('P/E One Year Fwd');
            equityValues.push(Math.abs(PE_1.equityValue));
            equityMinValues.push(Math.abs(PE_1.minEqValue || PE_1.equityValue));
            equityMaxValues.push(Math.abs(PE_1.maxEqValue || PE_1.equityValue));
            methodLabels.push('P/E 1YF');
            // console.log('Added P/E One Year Forward method with value:', PE_1.equityValue);
        }

        if (finalCheckBoxesValues.checkBoxPS_1 && PS_1 && PS_1.equityValue !== undefined && PS_1.equityValue !== 0) {
            activeMethods.push('P/S One Year Fwd');
            equityValues.push(Math.abs(PS_1.equityValue));
            equityMinValues.push(Math.abs(PS_1.minEqValue || PS_1.equityValue));
            equityMaxValues.push(Math.abs(PS_1.maxEqValue || PS_1.equityValue));
            methodLabels.push('P/S 1YF');
            // console.log('Added P/S One Year Forward method with value:', PS_1.equityValue);
        }

        if (finalCheckBoxesValues.checkBoxEV_SALES_1 && EV_SALES_1 && EV_SALES_1.equityValue !== undefined && EV_SALES_1.equityValue !== 0) {
            activeMethods.push('EV/Sales One Year Fwd');
            equityValues.push(Math.abs(EV_SALES_1.equityValue));
            equityMinValues.push(Math.abs(EV_SALES_1.minEqValue || EV_SALES_1.equityValue));
            equityMaxValues.push(Math.abs(EV_SALES_1.maxEqValue || EV_SALES_1.equityValue));
            methodLabels.push('EV/Sales 1YF');
            // console.log('Added EV/Sales One Year Forward method with value:', EV_SALES_1.equityValue);
        }

        if (finalCheckBoxesValues.checkBoxEV_EBITDA_1 && EV_EBITDA_1 && EV_EBITDA_1.equityValue !== undefined && EV_EBITDA_1.equityValue !== 0) {
            activeMethods.push('EV/EBITDA One Year Fwd');
            equityValues.push(Math.abs(EV_EBITDA_1.equityValue));
            equityMinValues.push(Math.abs(EV_EBITDA_1.minEqValue || EV_EBITDA_1.equityValue));
            equityMaxValues.push(Math.abs(EV_EBITDA_1.maxEqValue || EV_EBITDA_1.equityValue));
            methodLabels.push('EV/EBITDA 1YF');
            // console.log('Added EV/EBITDA One Year Forward method with value:', EV_EBITDA_1.equityValue);
        }

        // console.log('Total methods found:', activeMethods.length);
        // console.log('Active methods:', activeMethods);
        // console.log('Equity values:', equityValues);

        // If no methods were added (only DCF), check if we should include based on other criteria
        if (activeMethods.length <= 1) {
            // console.log('Warning: Only DCF method found or no methods found');
            // console.log('Checkbox values:', finalCheckBoxesValues);
            // console.log('PE equityValue:', PE?.equityValue);
            // console.log('PS equityValue:', PS?.equityValue);
            // console.log('EV_SALES equityValue:/', EV_SALES?.equityValue);
            // console.log('EV_EBITDA equityValue:', EV_EBITDA?.equityValue);
        }

        // Calculate actual weight percentages based on DCF weight and number of checked methods
        const dcfWeightPercentage = workBackEndInputs?.dcfWeightPercentage || 0;
        const dcfWeight = dcfWeightPercentage / 100;

        // Count checked relative valuation methods (excluding DCF)
        const relativeMethodsCount = activeMethods.filter(m => m !== 'DCF').length;

        // Calculate relative weight percentage: (1 - dcfWeight) / count
        const relativeWeightPercent = relativeMethodsCount > 0
            ? ((1 - dcfWeight) / relativeMethodsCount) * 100
            : 0;

        // Build weight percentages array and methodWeights object
        const actualWeightPercentages = [];
        const methodWeights = {};

        activeMethods.forEach((method) => {
            let weightPercent = 0;

            if (method === 'DCF') {
                // DCF weight comes from dcfWeightPercentage
                weightPercent = dcfWeightPercentage;
            } else {
                // All other methods share the remaining weight equally
                weightPercent = relativeWeightPercent;
            }

            // Ensure weightPercent is a number and handle null/undefined
            weightPercent = typeof weightPercent === 'number' && !isNaN(weightPercent) ? weightPercent : 0;

            actualWeightPercentages.push(weightPercent);
            methodWeights[method] = weightPercent;
        });

        // Use actual weight percentages instead of calculated ones
        const weightPercentages = actualWeightPercentages;

        // Ensure we have at least 4 weights for the circular charts
        while (weightPercentages.length < 4) {
            weightPercentages.push(0);
        }

        // Calculate min, base, max values
        let minValue = equityValues.length > 0 ? Math.min(...equityValues) : 0;
        let maxValue = equityValues.length > 0 ? Math.max(...equityValues) : 0;
        let baseValue = equityValues.length > 0 ?
            equityValues.reduce((sum, val) => sum + val, 0) / equityValues.length : 0;

        // If all values are 0, set reasonable defaults
        if (maxValue === 0 && minValue === 0 && equityValues.length > 0) {
            minValue = 0;
            maxValue = Math.max(...equityValues.filter(val => val > 0)) || 100;
            baseValue = maxValue / 2;
        }

        // Format values for display
        const formatValueForDisplay = (val) => {
            if (val >= 1000000) {
                return '$' + (val / 1000000).toFixed(1) + 'M';
            }
            if (val >= 1000) {
                return '$' + (val / 1000).toFixed(1) + 'K';
            }
            return '$' + val.toFixed(1);
        };

        const getFinancialYear = (finYrEndMonth, finYrEnd) => {
            // finYrEndMonth: e.g., "March", "Dec", "Jun"
            // finYrEnd: e.g., "2025", "2026"

            const months = {
                'January': 1, 'Feburary': 2, 'March': 3, 'April': 4, 'Apr': 4,
                'May': 5, 'June': 6, 'July': 7, 'Jul': 7,
                'August': 8, 'September': 9, 'October': 10, 'November': 11, 'December': 12,
                 
            };

            // Get the month number
            const endMonthNum = months[finYrEndMonth] || 3; // default to March if not found

            // Convert end year to number
            const endYear = parseInt(finYrEnd);

            // Calculate start year and month
            let startYear, startMonth;

            if (endMonthNum === 12) { // If FY ends in Dec
                startYear = endYear;
                startMonth = 1; // January
            } else { // For all other months (Jan-Nov)
                startYear = endYear - 1;
                startMonth = endMonthNum + 1;
            }

            // Convert month numbers back to names
            const monthNames = {
                1: 'January', 2: 'Feburary', 3: 'March', 4: 'April',
                5: 'May', 6: 'June', 7: 'July', 8: 'August',
                9: 'September', 10: 'October', 11: 'November', 12: 'December'
            };

            const startMonthName = monthNames[startMonth];
            const endMonthName = finYrEndMonth;

            return `${startMonthName} ${startYear} - ${endMonthName} ${endYear}`;
        };

        // const baseUrl = process.env.NODE_ENV === 'production'
        //     ? process.env.APIURL
        //     : `http://localhost:${process.env.PORT || 3000}`;

        // 8. Prepare report data with only API data
        const reportData = {
            // baseUrl: baseUrl,
            // Store the raw API data
            apiValuationData: valuationData,
            workIncStmt: workIncStmt,
            workCashFlowStmt: workCashFlowStmt,
            years: years,
            chartData: chartData,

            // Company Info
            companyName: order.business?.companyName || "Company Name",

            // similarCompany: order.business?.similarCompany || "NA",
            reportDate: new Date().toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }),

            // Special charts data
            activeMethods: activeMethods,
            methodLabels: methodLabels,
            equityValues: equityValues,
            equityMinValues: equityMinValues, // Min equity values for each checked method
            equityMaxValues: equityMaxValues, // Max equity values for each checked method
            weightPercentages: weightPercentages,
            methodWeights: methodWeights, // Mapping of method names to weight percentages (only checked methods)
            minValue: minValue,
            baseValue: baseValue,
            maxValue: maxValue,
            formattedMinValue: formatValueForDisplay(minValue),
            formattedBaseValue: formatValueForDisplay(baseValue),
            formattedMaxValue: formatValueForDisplay(maxValue),

            companyDetails: {
                enterpriseValueMin: order.EnterpriseMinValue,
                enterpriseValueAvg: order.EnterpriseAvgValue,
                enterpriseValueMax: order.EnterpriseMaxValue,
                weightAvgEquityValue:order.weightAvgEquityValue,
                name: order.business?.companyName || "N/A",
                country: order.business?.country || "N/A",
                description: order.business?.description || "N/A",
                adminDescription: order.business?.adminDescription || order.business?.description,
                currency: order.business?.currency || "USD",
                similarCompany: order.business?.similarCompany || "N/A",
                type: order.business?.companyType || "N/A",
                yearsInBusiness: order.business?.companyAge || "N/A",
                industry: order.business?.industryType || "N/A",
                developmentStage: order.business?.developmentStage || "N/A",
                scalable: order.business?.scalable || "N/A",
                earningTrend: order.business?.earningTrend || "N/A",
                financialYear: `${getFinancialYear(order.business.FinYrEndMonth, order.business.FinYrEnd)}`,
                financialYearEnd: order.business?.FinYrEnd || 2024,
                isProfitable: (order.finance?.netProfit || 0) > 0,
                hasEquity: (order.finance?.equity || 0) > 0,
                hasDebt: (order.finance?.debtLoan || 0) > 0,
                unitOfNumber: order.finance?.unitOfNumber || "N/A",
                valueType: order.finance?.valueType || "N/A",
                competitor2: order.back_end_table[0][0].trim(),
                FinYrEndMonth: order.business?.FinYrEndMonth || "N/A",

            },

            // Financial Data
            financialData: {
                revenue: order.finance?.sales || 0,
                cogs: order.finance?.costOfSales || 0,
                ebitda: order.finance?.ebitda || 0,
                depreciation: order.finance?.depreciation || 0,
                interestExpense: order.finance?.interestExpense || 0,
                netProfit: order.finance?.netProfit || 0,
                cashBalance: order.finance?.cashBalance || 0,
                debt: order.finance?.debtLoan || 0,
                equity: order.finance?.equity || 0,
                receivables: order.finance?.receivables || 0,
                inventories: order.finance?.inventories || 0,
                payables: order.finance?.payables || 0,
                netFixedAssets: order.finance?.netFixedAssets || 0,
                netDebt: netDebt,
                ebitdaMargin: order.finance?.ebitda && order.finance?.sales ?
                    (order.finance.ebitda / order.finance.sales) * 100 : 0,
                netProfitMargin: order.finance?.netProfit && order.finance?.sales ?
                    (order.finance.netProfit / order.finance.sales) * 100 : 0
            },

            // DCF Table Data
            dcfTableData: dcfTableData,

            // DCF Weight Percentage (for easy access in EJS template)
            dcfWeightPercentage: workBackEndInputs?.dcfWeightPercentage || 0,

            // Work Back End Inputs for Key Assumptions
            workBackEndInputs: workBackEndInputsWithCosts,

            // Adjusted Beta
            adjustedBeta: adjustedBeta,

            // DCF Metrics
            dcfData: {
                equityValue: companyEquityAvgValue,
                enterpriseValue: enterpriseValue,
                wacc: wacc,
                adjustedBeta: adjustedBeta,
                terminalFCFF: terminalFCFF,
                terminalPresentFCFF: terminalPresentFCFF || (terminalFCFF / Math.pow(1 + (wacc / 100), 5))
            },

            // Individual Multiples Data
            PE: PE,
            PE_1: PE_1,
            PS: PS,
            PS_1: PS_1,
            EV_SALES: EV_SALES,
            EV_SALES_1: EV_SALES_1,
            EV_EBITDA: EV_EBITDA,
            EV_EBITDA_1: EV_EBITDA_1,

            // Valuation Summary
            valuation: {
                totalValue: Math.round(weightAvgEquityValue),
                equityValue: Math.round(weightAvgEquityValue),
                netDebt: netDebt,
                currency: order.finance?.valueType || "USD",
                dcfValue: Math.round(companyEquityAvgValue),
                weightedAvgValue: Math.round(weightAvgEquityValue),
                // Enterprise Value Average = Weighted Average Equity Value + Net Debt
                enterpriseAvgValue: (EnterpriseAvgValue && EnterpriseAvgValue !== 0 && !isNaN(EnterpriseAvgValue))
                    ? EnterpriseAvgValue
                    : ((weightAvgEquityValue + netDebt) || 0)
            },

            // Enterprise Value Average (for easy access in EJS)
            // Enterprise Value Average = Weighted Average Equity Value + Net Debt (from Summary Valuation table)
            enterpriseAvgValue: finalEnterpriseAvgValue,

            // Checkbox Values - use the safe version
            checkBoxesValues: finalCheckBoxesValues,

            // Helper functions for formatting
            formatCurrency: function (num, currency = 'USD') {
                if (typeof num !== 'number' || isNaN(num)) return `${currency} 0.00`;
                const absValue = Math.abs(num).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
                return num < 0 ? `${currency} (${absValue})` : `${currency} ${absValue}`;
            },
            formatCurrencySymbol: function (num, currency = '$') {
                if (typeof num !== 'number' || isNaN(num)) return `${currency}0.00`;
                const absValue = Math.abs(num).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
                return num < 0 ? `${currency}(${absValue})` : `${currency}${absValue}`;
            },
            formatNumber: function (num) {
                if (typeof num !== 'number' || isNaN(num)) return "0.00";
                const absValue = Math.abs(num).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
                return num < 0 ? `(${absValue})` : absValue;
            },

            formatDCFValue: function (num) {
                if (typeof num !== 'number' || isNaN(num)) return "-";
                if (num === 0) return "-";

                const withCommas = function (n) {
                    return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                };

                // Handle negative values with parentheses like formatParentheses
                if (num < 0) {
                    const absoluteValue = Math.abs(num);
                    const truncated = Math.floor(absoluteValue * 100) / 100;
                    return `(${withCommas(truncated)})`;
                }

                // Truncate to 2 decimals without rounding, then add comma separator
                const truncated = Math.floor(num * 100) / 100;
                return withCommas(truncated);
            },
            formatPercentage: function (num) {
                // if (typeof num !== 'number' || isNaN(num)) return "0.0%";
                const absValue = Math.abs(num).toLocaleString('en-US', {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1
                });
                return num < 0 ? `(${absValue})%` : `${absValue}%`;
            },
            formatParentheses: function (num) {
                if (typeof num !== 'number' || isNaN(num)) return "0.00";
                const absValue = Math.abs(num).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
                return num < 0 ? `(${absValue})` : absValue;
            },
            formatDecimal: function (num) {
                if (typeof num !== 'number' || isNaN(num)) return "0.0";
                return num.toFixed(1);
            },
            formatMultiple: function (num) {
                // Check if num is a valid number and not 0
                if (typeof num !== 'number' || isNaN(num) || num === 0) {
                    return "N/A";
                }
                // Format to 2 decimal places
                return parseFloat(num).toFixed(2);
            },

            /**
             * Format number with comma as thousands separator (e.g. 38595.77 -> "38,595.77").
             * @param {number} num - value to format
             * @param {number} [decimals=2] - decimal places (default 2)
             * @returns {string}
             */
            formatThousands: function (num, decimals) {
                if (typeof num !== 'number' || isNaN(num)) return "0.00";
                const d = decimals != null ? decimals : 2;
                const absValue = Math.abs(num).toLocaleString('en-US', {
                    minimumFractionDigits: d,
                    maximumFractionDigits: d
                });
                return num < 0 ? `(${absValue})` : absValue;
            },

            /**
             * For valuation summary only: scale value to next unit when 4+ digits in current unit.
             * e.g. 38595.77 Millions -> { value: "38.60", unit: "Billions" } so you get "NGN 38.60 Billions".
             * @param {number} value - numeric value in the given unit
             * @param {string} unitOfNumber - "Thousands" | "Millions" | "Billions" | "Trillions"
             * @returns {{ value: string, unit: string }}
             */
            formatValuationSummaryValue: function (value, unitOfNumber) {
                const u = (unitOfNumber || "Millions").toLowerCase();
                const units = ["thousands", "millions", "billions", "trillions"];
                const idx = units.indexOf(u);
                if (typeof value !== 'number' || isNaN(value)) {
                    return { value: "0.00", unit: unitOfNumber || "Millions" };
                }
                let num = value;
                let label = unitOfNumber || "Millions";
                const threshold = 1000;
                if (idx >= 0 && idx < 3 && Math.abs(num) >= threshold) {
                    num = num / threshold;
                    label = idx === 0 ? "Millions" : idx === 1 ? "Billions" : "Trillions";
                }
                const absValue = Math.abs(num).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
                const formatted = num < 0 ? `(${absValue})` : absValue;
                return { value: formatted, unit: label };
            }
        };
        console.log("helko", reportData.companyDetails.financialYear);
        // console.log("✅ Report data prepared from API");
        // console.log("🔍 Enterprise Value Debug:");
        console.log(" companyDetails", order.business);
        console.log("  - EnterpriseAvgValue from order:", order.EnterpriseAvgValue);
        // console.log("  - weightAvgEquityValue from API:", weightAvgEquityValue);
        // console.log("  - weightAvgEquityValue from order:", order.weightAvgEquityValue);
        // console.log("  - finalWeightAvgEquityValue:", finalWeightAvgEquityValue);
        // console.log("  - netDebt from API:", netDebt);
        // console.log("  - netDebt from order:", order.netDebt);
        // console.log("  - finalNetDebt:", finalNetDebt);
        // console.log("  - Calculated (finalWeightAvgEquityValue + finalNetDebt):", finalWeightAvgEquityValue + finalNetDebt);
        console.log("  - finalEnterpriseAvgValue:", finalEnterpriseAvgValue);
        console.log("  - enterpriseValue (DCF):", enterpriseValue);
        console.log("  - valuation.enterpriseAvgValue:", reportData.valuation.enterpriseAvgValue);
        console.log("  - dcfTableData.enterpriseAvgValue:", reportData.dcfTableData.enterpriseAvgValue);
        console.log("  - Top-level enterpriseAvgValue:", reportData.enterpriseAvgValue);
        // console.log("similarcompany", reportData.similarCompany);
        // console.log("DCF Equity Value:", reportData.dcfData.equityValue);
        // console.log("Enterprise Value:", reportData.dcfData.enterpriseValue);
        // console.log("Checkbox values:", reportData.checkBoxesValues);
        // console.log("activeMethods:", reportData.activeMethods);
        // console.log("methodLabels:", reportData.methodLabels);
        console.log("equityValues:", reportData.equityValues);
        console.log("equityMinValues:", reportData.equityMinValues);
        console.log("equityMaxValues:", reportData.equityMaxValues);
        // console.log("minValue:", reportData.minValue);
        // console.log("maxValue:", reportData.maxValue);
        // console.log("baseValue:", reportData.baseValue);

        // 9. Render EJS template
        const ejs = require('ejs');
        const fs = require('fs').promises;
        const path = require('path');

        const templatePath = path.join(__dirname, '../../../../views/valuation-report.ejs');

        let template;
        try {
            template = await fs.readFile(templatePath, 'utf-8');
            console.log('Template loaded successfully');
        } catch (templateError) {
            console.error('Template loading error:', templateError.message);
            template = `<!DOCTYPE html><html><head><title>Valuation Report</title></head><body><h1>Report Template Not Found</h1></body></html>`;
        }

        const html = ejs.render(template, reportData);
        // Replace the PDF generation part (around line 246-300) with this:

        // 10. Return based on format
        // req.query.format = 'html';
        if (req.query.format === 'html') {
            res.setHeader('Content-Type', 'text/html');
            res.send(html);
        } else {
            // PDF generation
            console.log('🔄 Starting PDF generation...');
            try {
                const puppeteer = require('puppeteer');

                // Launch browser with proper settings for PDF
                const browser = await puppeteer.launch({
                    headless: 'new',
                    args: ["--no-sandbox", "--disable-setuid-sandbox"],
                    timeout: 60000
                });
                const page = await browser.newPage();

                await page.setViewport({ width: 1280, height: 2000 });

                await page.setContent(html, { waitUntil: "networkidle0" });

                const pdfBuffer = await page.pdf({
                    format: 'A4',
                    printBackground: true,
                    margin: { top: '40px', right: '20px', bottom: '40px', left: '20px' },
                    displayHeaderFooter: true,

                    // headerTemplate: '<div style="font-size: 10px; text-align: center; color: #666; width: 100%;">Valuation Report</div>',
                    // footerTemplate: '<div style="font-size: 10px; text-align: center; color: #666; width: 100%;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>',
                    preferCSSPageSize: true,
                    timeout: 60000
                });

                await browser.close();

                res.setHeader("Content-Type", "application/pdf");
                res.setHeader(
                    "Content-Disposition",
                    "attachment; filename=report.pdf"
                );
                res.setHeader("Content-Length", pdfBuffer.length);

                return res.end(pdfBuffer);

            } catch (pdfError) {
                console.error('❌ PDF Generation Error:', pdfError.message);
                console.error('PDF Generation Stack:', pdfError.stack);

                // Create a simple error PDF as fallback
                const { PDFDocument, rgb } = require('pdf-lib');
                const pdfDoc = await PDFDocument.create();
                const page = pdfDoc.addPage([595, 842]); // A4 size

                page.drawText('Error Generating PDF Report', {
                    x: 50,
                    y: 700,
                    size: 20,
                    color: rgb(1, 0, 0),
                });

                page.drawText(`Order ID: ${orderId}`, {
                    x: 50,
                    y: 650,
                    size: 12,
                    color: rgb(0, 0, 0),
                });

                page.drawText(`Error: ${pdfError.message}`, {
                    x: 50,
                    y: 620,
                    size: 10,
                    color: rgb(0, 0, 0),
                });

                page.drawText('Please try again or contact support.', {
                    x: 50,
                    y: 590,
                    size: 12,
                    color: rgb(0, 0, 0),
                });

                const pdfBytes = await pdfDoc.save();

                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename="Valuation-Report-${orderId}-error.pdf"`);
                res.send(pdfBytes);
            }
        }

        console.log('=== EJS REPORT ROUTE COMPLETED SUCCESSFULLY ===');

    } catch (error) {
        console.error('=== EJS REPORT ROUTE ERROR ===');
        console.error('Error:', error.message);
        console.error('Stack:', error.stack);
        res.status(500).json({
            message: 'Error generating report',
            error: error.message,
            stack: error.stack
        });
    }
});
// HELPER FUNCTION: Create actual report HTML
function createActualReportHtml(reportData, order, valuationData) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Valuation Report - ${reportData.companyName}</title>
            <style>
                /* Your actual CSS here */
                body { font-family: Arial; padding: 30px; }
                h1 { color: #2c3e50; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { border: 1px solid #ddd; padding: 12px; }
                th { background: #3498db; color: white; }
                .value { font-weight: bold; color: #27ae60; }
            </style>
        </head>
        <body>
            <h1>VALUATION REPORT</h1>
            <h2>${reportData.companyName}</h2>
            <p>Order: ${reportData.orderId} | Date: ${reportData.reportDate}</p>
            <hr>
            
            <h2>Financial Summary</h2>
            <table>
                <tr><th>Metric</th><th>Value</th></tr>
                <tr><td>Revenue</td><td class="value">${reportData.formatCurrency(reportData.financialData.revenue)}</td></tr>
                <tr><td>EBITDA</td><td class="value">${reportData.formatCurrency(reportData.financialData.ebitda)}</td></tr>
                <tr><td>Net Profit</td><td class="value">${reportData.formatCurrency(reportData.financialData.netProfit)}</td></tr>
            </table>
            
            <h2>Valuation Results</h2>
            <table>
                <tr><th>Method</th><th>Value</th></tr>
                <tr><td>DCF Value</td><td class="value">${reportData.formatCurrency(reportData.valuation.dcfValue)}</td></tr>
                <tr><td>Weighted Average</td><td class="value">${reportData.formatCurrency(reportData.valuation.weightedAvgValue)}</td></tr>
                <tr><td>Enterprise Value</td><td class="value">${reportData.formatCurrency(reportData.valuation.enterpriseValue)}</td></tr>
                <tr><td>Net Debt</td><td>${reportData.formatCurrency(reportData.valuation.netDebt)}</td></tr>
            </table>
            
            <h2>Company Details</h2>
            <p><strong>Industry:</strong> ${reportData.companyDetails.industry}</p>
            <p><strong>Country:</strong> ${reportData.companyDetails.country}</p>
            <p><strong>Company Type:</strong> ${reportData.companyDetails.companyType}</p>
            
            <div style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
                <p>Generated by Valuation System</p>
                <p>Report ID: ${reportData.orderId}</p>
                <p>Generated on: ${new Date().toLocaleString()}</p>
            </div>
        </body>
        </html>
    `;
}

// HELPER FUNCTION: Generate PDF directly
async function generatePdfDirectly(html) {
    const puppeteer = require('puppeteer');

    const browser = await puppeteer.launch({
        headless: 'new',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage'
        ],
        timeout: 60000
    });

    const page = await browser.newPage();

    await page.setContent(html, {
        waitUntil: 'networkidle0',
        timeout: 30000
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' }
    });

    await browser.close();

    return pdfBuffer;
}

// HELPER FUNCTION: Create error PDF
async function createErrorPdf(error, orderId) {
    const html = `
        <!DOCTYPE html>
        <html>
        <head><title>Error Report</title></head>
        <body>
            <h1>PDF Generation Error</h1>
            <p>Order: ${orderId}</p>
            <p>Error: ${error.message}</p>
            <p>Please contact support.</p>
        </body>
        </html>
    `;

    return await generatePdfDirectly(html);
}

router.get('/:orderId/test-actual-pdf', async (req, res) => {
    console.log('🔫 TESTING ACTUAL PDF GENERATION');

    try {
        const orderId = req.params.orderId;

        // 1. Get your ACTUAL data
        const order = await Orders.findById(orderId)
            .populate({
                path: 'matadata.customerId',
                select: 'first_name last_name'
            })
            .lean();

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        console.log(`Testing PDF for: ${order.business?.companyName}`);

        // 2. Fetch valuation data
        let valuationData = {};
        try {
            const axios = require('axios');
            const response = await axios.get(
                `http://localhost:${process.env.PORT || 3000}/api/admin/orders/valuation-data/${orderId}`,
                { timeout: 5000 }
            );
            valuationData = response.data || {};
        } catch (error) {
            console.log('Using mock data for testing');
            valuationData = {
                companyEquityAvgValue: 1500000,
                enterpriseValue: 1800000,
                weightAvgEquityValue: 1450000,
                netDebt: 350000,
                wacc: 12.5
            };
        }

        // 3. Create ACTUAL HTML with your data
        const actualHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>ACTUAL Valuation Report</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        margin: 0;
                        padding: 40px;
                        color: #333;
                        line-height: 1.6;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 40px;
                        padding-bottom: 20px;
                        border-bottom: 3px solid #2c3e50;
                    }
                    h1 {
                        color: #2c3e50;
                        font-size: 32px;
                        margin: 0 0 10px 0;
                    }
                    h2 {
                        color: #3498db;
                        margin: 30px 0 15px 0;
                    }
                    .company-info {
                        background: #f8f9fa;
                        padding: 25px;
                        border-radius: 8px;
                        margin: 20px 0;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 25px 0;
                    }
                    th {
                        background: #3498db;
                        color: white;
                        padding: 15px;
                        text-align: left;
                    }
                    td {
                        padding: 12px 15px;
                        border: 1px solid #ddd;
                    }
                    tr:nth-child(even) {
                        background: #f9f9f9;
                    }
                    .highlight {
                        background: #e8f4fc;
                        padding: 20px;
                        border-radius: 8px;
                        margin: 25px 0;
                        border-left: 5px solid #3498db;
                    }
                    .value {
                        font-weight: bold;
                        color: #27ae60;
                    }
                    .total {
                        font-weight: bold;
                        color: #e74c3c;
                        font-size: 18px;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>VALUATION REPORT</h1>
                    <h2>${order.business?.companyName || 'Company'}</h2>
                    <p>Order ID: ${orderId} | Date: ${new Date().toLocaleDateString()}</p>
                </div>
                
                <div class="company-info">
                    <h2>Company Information</h2>
                    <p><strong>Company:</strong> ${order.business?.companyName || 'N/A'}</p>
                    <p><strong>Industry:</strong> ${order.business?.industryType || 'N/A'}</p>
                    <p><strong>Country:</strong> ${order.business?.country || 'N/A'}</p>
                    <p><strong>Customer:</strong> ${order.matadata?.customerId?.first_name || ''} ${order.matadata?.customerId?.last_name || ''}</p>
                </div>
                
                <h2>Financial Summary</h2>
                <table>
                    <tr>
                        <th>Metric</th>
                        <th>Value</th>
                    </tr>
                    <tr>
                        <td>Revenue</td>
                        <td class="value">$${(order.finance?.sales || 0).toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td>EBITDA</td>
                        <td class="value">$${(order.finance?.ebitda || 0).toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td>Net Profit</td>
                        <td class="value">$${(order.finance?.netProfit || 0).toLocaleString()}</td>
                    </tr>
                </table>
                
                <div class="highlight">
                    <h2>Valuation Results</h2>
                    <p><strong>DCF Equity Value:</strong> <span class="value">$${(valuationData.companyEquityAvgValue || 0).toLocaleString()}</span></p>
                    <p><strong>Weighted Average Value:</strong> <span class="value">$${(valuationData.weightAvgEquityValue || 0).toLocaleString()}</span></p>
                    <p><strong>Enterprise Value:</strong> <span class="value">$${(valuationData.enterpriseValue || 0).toLocaleString()}</span></p>
                    <p><strong>Net Debt:</strong> $${(valuationData.netDebt || 0).toLocaleString()}</p>
                    <p><strong>WACC:</strong> ${(valuationData.wacc || 0).toFixed(2)}%</p>
                </div>
                
                <h2>Analysis Summary</h2>
                <p>This is your ACTUAL valuation report with real data from the database.</p>
                <p>The company valuation is based on DCF analysis and comparable company metrics.</p>
                
                <div style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 12px; color: #7f8c8d;">
                    <p>Generated by Valuation System | ${new Date().toLocaleString()}</p>
                    <p>This report is confidential and proprietary.</p>
                </div>
            </body>
            </html>
        `;

        // 4. Generate PDF DIRECTLY (no service, no EJS)
        const puppeteer = require('puppeteer');

        console.log('🚀 Launching Puppeteer for ACTUAL PDF...');
        const browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--window-size=1920,1080'
            ],
            timeout: 60000
        });

        const page = await browser.newPage();

        // Set viewport
        await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });

        console.log('📄 Setting HTML content...');
        await page.setContent(actualHtml, {
            waitUntil: ['networkidle0', 'domcontentloaded'],
            timeout: 30000
        });

        // Wait for everything to load
        console.log('⏳ Waiting for page to render...');
        await page.evaluate(() => document.fonts.ready);
        await new Promise(resolve => setTimeout(resolve, 3000));

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
            headerTemplate: '<div style="font-size: 10px; color: #666; width: 100%; text-align: center;">Valuation Report</div>',
            footerTemplate: `
                <div style="font-size: 8px; text-align: center; width: 100%; padding: 10px;">
                    Page <span class="pageNumber"></span> of <span class="totalPages"></span> | 
                    ${order.business?.companyName || 'Company'} | ${new Date().toLocaleDateString()}
                </div>
            `,
            preferCSSPageSize: true
        });

        console.log(`✅ PDF Generated: ${pdfBuffer.length} bytes`);

        // Close browser
        await page.close();
        await browser.close();

        // Verify PDF
        const pdfHeader = pdfBuffer.toString('utf8', 0, 4);
        console.log(`PDF Header: "${pdfHeader}"`);

        if (pdfHeader !== '%PDF') {
            throw new Error('Invalid PDF generated');
        }

        // 5. FORCE DOWNLOAD
        console.log('📥 Sending PDF for download...');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="ACTUAL-Valuation-Report-${orderId}.pdf"`);
        res.setHeader('Content-Length', pdfBuffer.length);

        // Write file to disk for debugging
        const fs = require('fs');
        fs.writeFileSync(`ACTUAL-REPORT-${orderId}.pdf`, pdfBuffer);
        console.log(`💾 Also saved to: ACTUAL-REPORT-${orderId}.pdf`);

        res.end(pdfBuffer);

    } catch (error) {
        console.error('❌ TEST FAILED:', error.message);
        console.error('Stack:', error.stack);

        // Return detailed error
        res.status(500).json({
            success: false,
            message: 'PDF Generation Test Failed',
            error: error.message,
            stack: error.stack,
            fix: 'Check Puppeteer installation and memory'
        });
    }
});


router.get('/', async (req, res) => {
    try {
        // Extract filter parameters from the request query
        const {
            orderId,
            customerNames,
            companyNames,
            country,
            orderStatus,
            assignedTo,
            custody,
            role,
            user_id
        } = req.query;

        // Build the filter object
        const filter = {};

        if (orderId) filter.orderId = orderId;
        if (customerNames) filter['matadata.customerId'] = new mongoose.Types.ObjectId(customerNames);
        if (companyNames) filter['business.companyName'] = companyNames;
        if (country) filter['business.country'] = country;
        if (orderStatus) filter['matadata.status'] = orderStatus;
        if (assignedTo) filter.assigned_to = new mongoose.Types.ObjectId(assignedTo);
        if (custody) filter.custody = custody;

        // Add role-based filtering
        if (role === 'ReportAdmin') {
            if (!user_id) {
                return res.status(400).json({ message: 'User ID is required for ReportAdmin role' });
            }
            filter.assigned_to = new mongoose.Types.ObjectId(user_id);
        } else if (role === 'SuperAdmin') {
            // No additional filtering needed for SuperAdmin
        } else {
            return res.status(403).json({ message: 'Access denied' });
        }

        const orders = await Orders.aggregate([
            {
                $match: filter
            },
            {
                $sort: { orderId: -1 } // Sort by orderId in descending order
            },
            {
                $lookup: {
                    from: 'users', // The name of the users collection
                    localField: 'assigned_to',
                    foreignField: '_id',
                    as: 'assignedUser'
                }
            },
            {
                $unwind: {
                    path: '$assignedUser',
                    preserveNullAndEmptyArrays: true // Keeps the order even if no assignedUser
                }
            },
            // New $lookup to get the plan data
            {
                $lookup: {
                    from: 'planrecords', // The name of the PlanRecord collection
                    localField: 'plan.planOrderId', // Reference field in orders
                    foreignField: '_id', // Field in PlanRecord
                    as: 'planData' // Output array field for the joined data
                }
            },
            {
                $unwind: {
                    path: '$planData',
                    preserveNullAndEmptyArrays: true // If no planData, it will still return the order
                }
            },
            {
                $project: {
                    'business.companyName': 1,
                    'business.country': 1,
                    'contact.name': 1,
                    'contact.email': 1,
                    'assigned_to': 1,
                    'assignedUser.name': 1, // Assuming User has a name field
                    'createdAt': 1,
                    'submittedOn': 1,
                    'due_date': 1,
                    'custody': 1,
                    'matadata.status': 1,
                    'orderId': 1,
                    'planData.planSeqId': 1, // Add fields from planData
                    'planData.planName': 1
                }
            }
        ]);

        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get dropdown values
router.get('/dropdowns', async (req, res) => {
    try {
        const customers = await Customers.find().select('id email').sort({ email: 1 });
        const customerplans = await Customers.find().select('id first_name last_name email').sort({ first_name: 1 });
        const companies = await Orders.aggregate([
            {
                $group: {
                    _id: "$business.companyName", // Group by companyName
                }
            },
            {
                $sort: {
                    _id: 1 // Sort alphabetically by companyName
                }
            },
            {
                $project: {
                    companyName: "$_id", // Rename _id to companyName
                    _id: 0  // Exclude the _id field from the final output
                }
            }
        ]);
        const countries = await Country.find().select('id, name').sort({ name: 1 });
        const assignedTo = await Admins.find().select('id, name').sort({ name: 1 });

        res.json({ customers, companies, countries, assignedTo, customerplans });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a specific plan
router.get('/:orderId', async (req, res) => {
    try {
        // Fetch order details and populate customer data
        let order = await Orders.findById(req.params.orderId).populate({
            path: 'matadata.customerId',
            select: 'first_name last_name email phone activePlanType activeSeqId'
        }).populate({
            path: 'assigned_to',
            select: 'name'
        })
            .populate({
                path: 'plan.planOrderId', // Populate plan data
                select: 'planSeqId planStatus'
            });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        let initialOrder = req.query.type;

        if (order.initial_input) {
            order = initialOrder === 'initials' ? order.initial_input : order;
        }

        const assignedTo = order.assigned_to;
        const customer = order.matadata.customerId;
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        let submittedBy = null;
        let submittedByName = "";

        if (order.custody === 'Company') {
            if (order.submittedByRole === 'Admin') {
                const admin = await Admins.findById(order.submittedBy).select('name');
                if (admin) {
                    submittedBy = admin._id;
                    submittedByName = admin.name;
                }
            } else {
                const customerSubmitter = await Customers.findById(order.submittedBy).select('first_name last_name');
                if (customerSubmitter) {
                    submittedBy = customerSubmitter._id;
                    submittedByName = `${customerSubmitter.first_name} ${customerSubmitter.last_name}`;
                }
            }
        } else if (order.custody === 'Customer') {
            if (order.submittedByRole === 'Admin') {
                const admin = await Admins.findById(order.submittedBy).select('name');
                if (admin) {
                    submittedBy = admin._id;
                    submittedByName = admin.name;
                }
            } else {
                const customerSubmitter = await Customers.findById(order.submittedBy).select('first_name last_name');
                if (customerSubmitter) {
                    submittedBy = customerSubmitter._id;
                    submittedByName = `${customerSubmitter.first_name} ${customerSubmitter.last_name}`;
                }
            }
        }

        let companyAgeDiscountFactor = 0;
        let companyAgeAlphaFactor = 0;
        let earningTrendDiscountFactor = 0;
        let backEndService = null;
        //Calculation Part of Order
        if (order.business && order.finance && order.forcast_inc_stmt && order.forcast_bal_sheet) {
            backEndService = new BackEndService.BackEndService(undefined, order);

            // Get additional data from Businessdata collection for companyAge
            const companyAgeData = await BusinessDataModel.findOne({ display_value: order.business.companyAge }).select('discount_factor alpha_factor');
            companyAgeDiscountFactor = companyAgeData ? companyAgeData.discount_factor : 0;
            companyAgeAlphaFactor = companyAgeData ? companyAgeData.alpha_factor : 0;

            // Get additional data from Historicaltrends collection for earningTrend
            const earningTrendData = await HistoricalTrends.findOne({ display_value: order.business.earningTrend }).select('discount_factor');
            earningTrendDiscountFactor = earningTrendData ? earningTrendData.discount_factor : 0;
        }

        let finData = {};
        let forecastData = {};
        //Create Graph Data 
        if (order.finance) {
            finData = {
                sales: [order.finance.sales],
                costOfSales: [order.finance.costOfSales],
                ebitda: [order.finance.ebitda],
                netProfit: [order.finance.netProfit],
                cashBalance: [order.finance.cashBalance],
                year: [order.finance.dataYear, order.finance.dataYear + 1, order.finance.dataYear + 2, order.finance.dataYear + 3, order.finance.dataYear + 4, order.finance.dataYear + 5],
                valueType: [order.finance.valueType]
            }
        }

        if (order.forcast_inc_stmt) {
            let values1 = [order.forcast_inc_stmt[0].salesGrowthRate, order.forcast_inc_stmt[1].salesGrowthRate, order.forcast_inc_stmt[2].salesGrowthRate, order.forcast_inc_stmt[3].salesGrowthRate, order.forcast_inc_stmt[4].salesGrowthRate];
            let values2 = [order.forcast_inc_stmt[0].cogs, order.forcast_inc_stmt[1].cogs, order.forcast_inc_stmt[2].cogs, order.forcast_inc_stmt[3].cogs, order.forcast_inc_stmt[4].cogs];
            let values3 = [order.forcast_inc_stmt[0].ebitdaMargin, order.forcast_inc_stmt[1].ebitdaMargin, order.forcast_inc_stmt[2].ebitdaMargin, order.forcast_inc_stmt[3].ebitdaMargin, order.forcast_inc_stmt[4].ebitdaMargin];
            let values4 = [order.forcast_inc_stmt[0].netProfitMargin, order.forcast_inc_stmt[1].netProfitMargin, order.forcast_inc_stmt[2].netProfitMargin, order.forcast_inc_stmt[3].netProfitMargin, order.forcast_inc_stmt[4].netProfitMargin];

            forecastData = [
                { label: "Forecasted Sales Growth Rate (Y-o-Y) (%)", values: values1 },
                { label: "Forecasted COGS (as % of revenue) (%)", values: values2 },
                { label: "Forecasted EBITDA Margin (%)", values: values3 },
                { label: "Forecasted Net Profit Margin (%)", values: values4 }
            ]
        }

        let documents = await buildDocumentUrls(order);

        //Get Turn Over Factors Data for Order
        const turnoverfactors = await TurnoverFactor.find();
        // Construct response object with both order and customer data
        const responseData = {
            orderId: order._id,
            customer: {
                customerId: customer._id,
                customerName: `${customer.first_name} ${customer.last_name}`,
                customerEmail: customer.email,
                customerContact: customer.phone,
                planType: customer.activePlanType,
                planSeq: customer.activePlanSeqId,
                // Add other relevant customer fields as needed
            },
            order: {
                systemOrderId: order.orderId,
                status: order.matadata.status,
                createdOn: order.createdAt,
                customerSequence: order.customerOrderSequence,
                submittedBy: submittedBy ? { userId: submittedBy, userName: submittedByName } : null,
                submittedOn: order.submittedOn,
                companyName: order.business.companyName,
                reportDueDate: order.due_date,
                checkBoxesValues: order.checkBoxesValues || {},  // Add this line
                completedOn: order.completedOn,
                country: order.business.country,
                assignedTo: assignedTo ? assignedTo.name : null,
                resubmittedOn: order.last_submitted_date,
                custody: order.custody,
                revisedCompletedOn: order.revisedCompletedOn,
                valuationStatus: order.valuationStatus,
                assignedId: order.assigned_to,
                documents: documents,
                planData: order.plan,
                business: {
                    business: order.business,
                    companyAgeDiscountFactor: companyAgeDiscountFactor,
                    companyAgeAlphaFactor: companyAgeAlphaFactor,
                    earningTrendDiscountFactor: earningTrendDiscountFactor,
                    turnoverFactor: turnoverfactors
                },
                // Add other relevant order fields as needed
            },
            calculations: {
                finance: order.finance,
                forecast_inc_stmt: order.forcast_inc_stmt,
                forecast_bal_sheet: order.forcast_bal_sheet,
                forecast_rip_days: order.forcast_rip_days,
                back_end_inputs: order.back_end_inputs,
                back_end_table: order.back_end_table,
                workIncStmt: backEndService ? backEndService.workIncStmt : null,
                workBalSheet: backEndService ? backEndService.workBalSheet : null,
                workCashFlowStmt: backEndService ? backEndService.workCashFlowStmt : null,
                years: backEndService ? backEndService.years : null,
                backend_inputs: order.back_end_inputs,
                business: order.business,
                graphData: {
                    finData: finData,
                    forecastData: forecastData
                },
            }
        };

        res.json(responseData);
    } catch (err) {
        console.error('Error fetching order and customer data:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get a specific plan
router.get('/customer-plan/:userId', async (req, res) => {
    const { userId } = req.params;

    // Validate userId format (if using MongoDB ObjectId)
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID format' });
    }

    try {
        const plans = await PlanRecord.find({
            userId: userId
        })
            .populate('planId')
            .sort({ createdAt: -1 });

        return res.status(200).json({ message: 'Plan Fetched', data: plans });
    } catch (err) {
        console.error('Error fetching order and customer data:', err);
        return res.status(500).json({ message: 'Internal server error', error: err.message }); // Consider removing error message in production
    }
});

// UPDATE route: this will update the details valuation Parameters  
router.put("/valuation-parameters/:_id", async (req, res) => {
    const { back_end_inputs } = req.body;

    // Find the query by ID
    const query = await Orders.findById(req.params._id);

    if (query) {
        // Update the query with new back_end_inputs and back_end_table
        // Update only the fields that are provided in the request
        if (back_end_inputs) {
            query.back_end_inputs = back_end_inputs;
        }

        // Save the updated query
        const updatedQuery = await query.save();

        if (updatedQuery) {
            return res.status(202).json({
                message: 'Parameter Saved',
            });
        }

    } else {
        return res.status(500).json({ message: 'Internal server error' });
    }
});

//Update the excel  
router.put("/:_id", async (req, res) => {
    const { _id } = req.params;
    const { back_end_table } = req.body;

    if (!_id || !back_end_table) {
        return res.status(400).json({ message: 'Invalid request parameters' });
    }

    try {
        // Find the order by ID
        const query = await Orders.findById(_id);

        if (!query) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update the order with new back_end_table
        query.back_end_table = back_end_table;

        // Proceed with calculations
        const backEndAvgService = new BackEndAvgService.BackEndAvgService(back_end_table);
        const backEndService = new BackEndService.BackEndService(backEndAvgService, query);
        const dcfService = new DcfService.DcfService(backEndService, query);

        // 🔧 FIX: Preserve existing checkbox values when updating back_end_table
        // Don't overwrite user's saved preferences with auto-checked values
        const existingCheckBoxes = query.checkBoxesValues || {};
        const relValService = new RelativeValuationService.RelativeValuationService(dcfService, backEndService, existingCheckBoxes);

        // Store CheckBox Values - preserve user preferences, don't overwrite with auto-checked values
        // Only update if ValuationCheckBox has valid structure, otherwise keep existing
        if (relValService.ValuationCheckBox && Object.keys(relValService.ValuationCheckBox).length > 0) {
            // Merge: use existing values as base, only update if service provides valid values
            query.checkBoxesValues = {
                ...existingCheckBoxes,
                ...relValService.ValuationCheckBox
            };
        }
        // If ValuationCheckBox is null/empty, keep existing checkBoxesValues unchanged

        // Save the updated order
        const updatedQuery = await query.save();

        // Return the response with calculated values
        return res.status(200).json({
            message: 'Query Detail',
            query: updatedQuery,
            workIncStmt: backEndService.workIncStmt,
            workBalSheet: backEndService.workBalSheet,
            workCashFlowStmt: backEndService.workCashFlowStmt,
            workBackEndInputs: backEndService.workBackEndInputs,
            workBackEndTableAvg: backEndService.workBackEndTableAvg,
            workDcfFCFF: dcfService.workDcfFCFF,
            companyEquityAvgValue: dcfService.companyEquityAvgValue,
            companyEquityMinValue: dcfService.companyEquityMinValue,
            companyEquityMaxValue: dcfService.companyEquityMaxValue,
            terminalFCFF: dcfService.terminalFCFF,
            terminalPresentFCFF: dcfService.terminalPresentFCFF,
            wacc: dcfService.wacc,
            PE: relValService.PE,
            PE_1: relValService.PE_1,
            PS: relValService.PS,
            PS_1: relValService.PS_1,
            EV_SALES: relValService.EV_SALES,
            EV_SALES_1: relValService.EV_SALES_1,
            EV_EBITDA: relValService.EV_EBITDA,
            EV_EBITDA_1: relValService.EV_EBITDA_1,
            EnterpriseAvgValue: relValService.EnterpriseAvgValue,
            EnterpriseMinValue: relValService.EnterpriseMinValue,
            EnterpriseMaxValue: relValService.EnterpriseMaxValue,
            ValuationCheckBox: relValService.ValuationCheckBox,
            RelativeWeightPercent: relValService.RelativeWeightPercent,
            netDebt: relValService.netDebt
        });
    } catch (error) {
        console.error("Error processing the request", error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

router.put('/store-valuation-data/:_id', async (req, res) => {
    // Find the query by ID
    const query = await Orders.findById(req.params._id);

    if (query) {
        query.valuationStatus = 1;

        // Update the order with new back_end_table
        let back_end_table = query.back_end_table;

        // Proceed with calculations
        const backEndAvgService = new BackEndAvgService.BackEndAvgService(back_end_table);
        const backEndService = new BackEndService.BackEndService(backEndAvgService, query);
        const dcfService = new DcfService.DcfService(backEndService, query);
        const relValService = new RelativeValuationService.RelativeValuationService(dcfService, backEndService, undefined);

        // Store CheckBox Values
        query.checkBoxesValues = relValService.ValuationCheckBox;

        // Save the updated order
        const updatedQuery = await query.save();
        console.log("updated wuery", updatedQuery);
        if (updatedQuery) {
            return res.status(200).json({
                message: 'Valuation Generated Successfully',
            });
        }
    }
});

router.get('/valuation-data/:_id', async function (req, res) {
    // Fetch order fresh from database (no caching)
    const query = await Orders.findById(req.params._id);

    if (query) {
        console.log('=== VALUATION DATA REQUEST ===');
        console.log('Order ID:', req.params._id);
        console.log('CheckBoxesValues from DB:', JSON.stringify(query.checkBoxesValues));

        // Proceed with calculations if either back_end_inputs or back_end_table is missing
        const backEndAvgService = new BackEndAvgService.BackEndAvgService(query.back_end_table);
        const backEndService = new BackEndService.BackEndService(backEndAvgService, query);
        const dcfService = new DcfService.DcfService(backEndService, query);

        // Use checkbox values directly from the order (fresh from DB)
        const checkBoxesValues = query.checkBoxesValues || {};
        console.log('Using checkBoxesValues for calculations:', JSON.stringify(checkBoxesValues));

        const relValService = new RelativeValuationService.RelativeValuationService(dcfService, backEndService, checkBoxesValues);

        // Convert Mongoose document to plain object for JSON response
        const queryObject = query.toObject ? query.toObject() : query;

        // Return the response with calculated values
        return res.status(200).json({
            message: 'Query Detail',
            query: queryObject,
            checkBoxesValues: checkBoxesValues, // Explicitly include checkbox values at root level
            workIncStmt: backEndService.workIncStmt,
            workBalSheet: backEndService.workBalSheet,
            workCashFlowStmt: backEndService.workCashFlowStmt,
            workBackEndInputs: backEndService.workBackEndInputs,
            workBackEndTableAvg: backEndService.workBackEndTableAvg,
            workDcfFCFF: dcfService.workDcfFCFF,
            companyEquityAvgValue: dcfService.companyEquityAvgValue,
            companyEquityMinValue: dcfService.companyEquityMinValue,
            companyEquityMaxValue: dcfService.companyEquityMaxValue,
            terminalFCFF: dcfService.terminalFCFF,
            terminalPresentFCFF: dcfService.terminalPresentFCFF,
            terminalDiscountFactor: dcfService.terminalDiscountFactor,
            enterpriseValue: dcfService.enterpriseValue,
            wacc: dcfService.wacc,
            adjustedBeta: dcfService.adjustedBeta,
            PE: relValService.PE,
            PE_1: relValService.PE_1,
            PS: relValService.PS,
            PS_1: relValService.PS_1,
            EV_SALES: relValService.EV_SALES,
            EV_SALES_1: relValService.EV_SALES_1,
            EV_EBITDA: relValService.EV_EBITDA,
            EV_EBITDA_1: relValService.EV_EBITDA_1,
            EnterpriseAvgValue: relValService.EnterpriseAvgValue,
            EnterpriseMinValue: relValService.EnterpriseMinValue,
            EnterpriseMaxValue: relValService.EnterpriseMaxValue,
            weightAvgEquityValue: relValService.weightAvgEquityValue,
            weightMinEquityValue: relValService.weightMinEquityValue,
            weightMaxEquityValue: relValService.weightMaxEquityValue,
            ValuationCheckBox: relValService.ValuationCheckBox,
            RelativeWeightPercent: relValService.RelativeWeightPercent,
            netDebt: relValService.netDebt,
            years: backEndService.years,
        });
    } else {
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// UPDATE ADMIN DESCRIPTION ENDPOINT
router.put('/valuation-data/:id/admin-description', async (req, res) => {
    try {
        const { id } = req.params;
        const { adminDescription } = req.body;

        console.log('Updating admin description for order:', id);
        console.log('New description:', adminDescription);

        // Find and update the order
        const updatedOrder = await Orders.findByIdAndUpdate(
            id,
            {
                $set: {
                    'business.adminDescription': adminDescription || null
                }
            },
            { new: true } // Return the updated document
        );

        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        console.log('Admin description updated successfully');

        return res.status(200).json({
            success: true,
            message: 'Admin description updated successfully',
            data: {
                adminDescription: updatedOrder.business?.adminDescription || null
            }
        });

    } catch (error) {
        console.error('Error updating admin description:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update admin description',
            error: error.message
        });
    }
});

router.delete('/reset-data/:_id', async function (req, res) {
    const query = await Orders.findById(req.params._id);

    if (query) {

        // Update the order to remove back_end_table
        query.back_end_table = null; // or remove it completely based on your schema
        await query.save();

        res.status(200).json({ message: 'Back_end_table deleted successfully' });

    } else {
        return res.status(500).json({ message: 'Internal server error' });
    }
})

//Calculate The Values Based on the Checkboxes

router.put('/checkbox-calculations/:_id', async (req, res) => {
    try {
        const orderId = req.params._id;
        const checkBoxValues = req.body.checkBoxValues;

        console.log('=== CHECKBOX SAVE REQUEST ===');
        console.log('Order ID:', orderId);
        console.log('Received checkBoxValues:', JSON.stringify(checkBoxValues));

        if (!checkBoxValues || checkBoxValues === null || checkBoxValues === undefined) {
            return res.status(400).json({ message: 'checkBoxValues is required' });
        }

        // Prepare checkbox values with explicit boolean conversion
        const updatedCheckBoxesValues = {
            checkBoxPE: Boolean(checkBoxValues.checkBoxPE),
            checkBoxPE_1: Boolean(checkBoxValues.checkBoxPE_1),
            checkBoxPS: Boolean(checkBoxValues.checkBoxPS),
            checkBoxPS_1: Boolean(checkBoxValues.checkBoxPS_1),
            checkBoxEV_SALES: Boolean(checkBoxValues.checkBoxEV_SALES),
            checkBoxEV_SALES_1: Boolean(checkBoxValues.checkBoxEV_SALES_1),
            checkBoxEV_EBITDA: Boolean(checkBoxValues.checkBoxEV_EBITDA),
            checkBoxEV_EBITDA_1: Boolean(checkBoxValues.checkBoxEV_EBITDA_1),
            // Include the includeCheckBox fields if they exist
            includeCheckBoxPE: checkBoxValues.includeCheckBoxPE !== undefined ? Boolean(checkBoxValues.includeCheckBoxPE) : false,
            includeCheckBoxPE_1: checkBoxValues.includeCheckBoxPE_1 !== undefined ? Boolean(checkBoxValues.includeCheckBoxPE_1) : false,
            includeCheckBoxPS: checkBoxValues.includeCheckBoxPS !== undefined ? Boolean(checkBoxValues.includeCheckBoxPS) : false,
            includeCheckBoxPS_1: checkBoxValues.includeCheckBoxPS_1 !== undefined ? Boolean(checkBoxValues.includeCheckBoxPS_1) : false,
            includeCheckBoxEV_SALES: checkBoxValues.includeCheckBoxEV_SALES !== undefined ? Boolean(checkBoxValues.includeCheckBoxEV_SALES) : false,
            includeCheckBoxEV_SALES_1: checkBoxValues.includeCheckBoxEV_SALES_1 !== undefined ? Boolean(checkBoxValues.includeCheckBoxEV_SALES_1) : false,
            includeCheckBoxEV_EBITDA: checkBoxValues.includeCheckBoxEV_EBITDA !== undefined ? Boolean(checkBoxValues.includeCheckBoxEV_EBITDA) : false,
            includeCheckBoxEV_EBITDA_1: checkBoxValues.includeCheckBoxEV_EBITDA_1 !== undefined ? Boolean(checkBoxValues.includeCheckBoxEV_EBITDA_1) : false,
        };

        console.log('Prepared checkBoxesValues for save:', JSON.stringify(updatedCheckBoxesValues));

        // Fetch the order for calculations
        const order = await Orders.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Perform calculations with the updated checkbox values
        const backEndAvgService = new BackEndAvgService.BackEndAvgService(order.back_end_table);
        const backEndService = new BackEndService.BackEndService(backEndAvgService, order);
        const dcfService = new DcfService.DcfService(backEndService, order);
        const relValService = new RelativeValuationService.RelativeValuationService(dcfService, backEndService, updatedCheckBoxesValues);

        // Prepare all data to save
        if (relValService.PE_1) {
            console.log('Saving PE_1:', relValService.PE_1);
            order.PE_1 = relValService.PE_1;
        }

        if (relValService.PS_1) {
            console.log('Saving PS_1:', relValService.PS_1);
            order.PS_1 = relValService.PS_1;
        }

        if (relValService.EV_SALES_1) {
            console.log('Saving EV_SALES_1:', relValService.EV_SALES_1);
            order.EV_SALES_1 = relValService.EV_SALES_1;
        }

        if (relValService.EV_EBITDA_1) {
            console.log('Saving EV_EBITDA_1:', relValService.EV_EBITDA_1);
            order.EV_EBITDA_1 = relValService.EV_EBITDA_1;
        }

        // 3. Save summary values (new fields)
        order.netDebt = relValService.netDebt || 0;
        order.weightAvgEquityValue = relValService.weightAvgEquityValue || 0;
        order.weightMinEquityValue = relValService.weightMinEquityValue || 0;
        order.weightMaxEquityValue = relValService.weightMaxEquityValue || 0;
        order.EnterpriseAvgValue = relValService.EnterpriseAvgValue || 0;
        order.EnterpriseMinValue = relValService.EnterpriseMinValue || 0;
        order.EnterpriseMaxValue = relValService.EnterpriseMaxValue || 0;

        // Also save original multiples if needed
        if (relValService.PE) {
            order.PE = relValService.PE;
        }
        if (relValService.PS) {
            order.PS = relValService.PS;
        }
        if (relValService.EV_SALES) {
            order.EV_SALES = relValService.EV_SALES;
        }
        if (relValService.EV_EBITDA) {
            order.EV_EBITDA = relValService.EV_EBITDA;
        }

        // Save workBackEndInputs if available
        if (relValService.workBackEndInputs) {
            order.workBackEndInputs = relValService.workBackEndInputs;
        }

        // 4. Save all data to database using findByIdAndUpdate with $set
        // This ensures all fields including checkbox values are saved correctly
        console.log('Saving all data to database...');

        // CRITICAL FIX: Get current values from database FIRST to preserve unchanged fields
        // The frontend might not send all fields, so we need to merge with existing values
        const currentOrder = await Orders.findById(orderId).lean();
        const currentCheckBoxes = currentOrder?.checkBoxesValues || {};

        console.log('Current checkbox values from DB:', JSON.stringify(currentCheckBoxes));
        console.log('Incoming checkbox values from frontend:', JSON.stringify(checkBoxValues));

        // Merge: Use incoming value if provided, otherwise use current value, otherwise default to false
        // This ensures we never lose existing true values when only one checkbox is changed
        const completeCheckBoxesValues = {
            checkBoxPE: checkBoxValues.checkBoxPE !== undefined ? Boolean(checkBoxValues.checkBoxPE) : Boolean(currentCheckBoxes.checkBoxPE || false),
            checkBoxPE_1: checkBoxValues.checkBoxPE_1 !== undefined ? Boolean(checkBoxValues.checkBoxPE_1) : Boolean(currentCheckBoxes.checkBoxPE_1 || false),
            checkBoxPS: checkBoxValues.checkBoxPS !== undefined ? Boolean(checkBoxValues.checkBoxPS) : Boolean(currentCheckBoxes.checkBoxPS || false),
            checkBoxPS_1: checkBoxValues.checkBoxPS_1 !== undefined ? Boolean(checkBoxValues.checkBoxPS_1) : Boolean(currentCheckBoxes.checkBoxPS_1 || false),
            checkBoxEV_SALES: checkBoxValues.checkBoxEV_SALES !== undefined ? Boolean(checkBoxValues.checkBoxEV_SALES) : Boolean(currentCheckBoxes.checkBoxEV_SALES || false),
            checkBoxEV_SALES_1: checkBoxValues.checkBoxEV_SALES_1 !== undefined ? Boolean(checkBoxValues.checkBoxEV_SALES_1) : Boolean(currentCheckBoxes.checkBoxEV_SALES_1 || false),
            checkBoxEV_EBITDA: checkBoxValues.checkBoxEV_EBITDA !== undefined ? Boolean(checkBoxValues.checkBoxEV_EBITDA) : Boolean(currentCheckBoxes.checkBoxEV_EBITDA || false),
            checkBoxEV_EBITDA_1: checkBoxValues.checkBoxEV_EBITDA_1 !== undefined ? Boolean(checkBoxValues.checkBoxEV_EBITDA_1) : Boolean(currentCheckBoxes.checkBoxEV_EBITDA_1 || false),
            includeCheckBoxPE: checkBoxValues.includeCheckBoxPE !== undefined ? Boolean(checkBoxValues.includeCheckBoxPE) : Boolean(currentCheckBoxes.includeCheckBoxPE || false),
            includeCheckBoxPE_1: checkBoxValues.includeCheckBoxPE_1 !== undefined ? Boolean(checkBoxValues.includeCheckBoxPE_1) : Boolean(currentCheckBoxes.includeCheckBoxPE_1 || false),
            includeCheckBoxPS: checkBoxValues.includeCheckBoxPS !== undefined ? Boolean(checkBoxValues.includeCheckBoxPS) : Boolean(currentCheckBoxes.includeCheckBoxPS || false),
            includeCheckBoxPS_1: checkBoxValues.includeCheckBoxPS_1 !== undefined ? Boolean(checkBoxValues.includeCheckBoxPS_1) : Boolean(currentCheckBoxes.includeCheckBoxPS_1 || false),
            includeCheckBoxEV_SALES: checkBoxValues.includeCheckBoxEV_SALES !== undefined ? Boolean(checkBoxValues.includeCheckBoxEV_SALES) : Boolean(currentCheckBoxes.includeCheckBoxEV_SALES || false),
            includeCheckBoxEV_SALES_1: checkBoxValues.includeCheckBoxEV_SALES_1 !== undefined ? Boolean(checkBoxValues.includeCheckBoxEV_SALES_1) : Boolean(currentCheckBoxes.includeCheckBoxEV_SALES_1 || false),
            includeCheckBoxEV_EBITDA: checkBoxValues.includeCheckBoxEV_EBITDA !== undefined ? Boolean(checkBoxValues.includeCheckBoxEV_EBITDA) : Boolean(currentCheckBoxes.includeCheckBoxEV_EBITDA || false),
            includeCheckBoxEV_EBITDA_1: checkBoxValues.includeCheckBoxEV_EBITDA_1 !== undefined ? Boolean(checkBoxValues.includeCheckBoxEV_EBITDA_1) : Boolean(currentCheckBoxes.includeCheckBoxEV_EBITDA_1 || false),
        };

        console.log('✅ Merged complete checkbox values to save:', JSON.stringify(completeCheckBoxesValues));

        // Prepare update object - replace the ENTIRE nested object (not using dot notation)
        // This is more reliable than dot notation for nested objects
        const updateData = {
            checkBoxesValues: completeCheckBoxesValues, // Replace entire nested object
            netDebt: relValService.netDebt || 0,
            weightAvgEquityValue: relValService.weightAvgEquityValue || 0,
            weightMinEquityValue: relValService.weightMinEquityValue || 0,
            weightMaxEquityValue: relValService.weightMaxEquityValue || 0,
            EnterpriseAvgValue: relValService.EnterpriseAvgValue || 0,
            EnterpriseMinValue: relValService.EnterpriseMinValue || 0,
            EnterpriseMaxValue: relValService.EnterpriseMaxValue || 0,
        };

        // Add multiples data if they exist
        if (relValService.PE) updateData.PE = relValService.PE;
        if (relValService.PE_1) updateData.PE_1 = relValService.PE_1;
        if (relValService.PS) updateData.PS = relValService.PS;
        if (relValService.PS_1) updateData.PS_1 = relValService.PS_1;
        if (relValService.EV_SALES) updateData.EV_SALES = relValService.EV_SALES;
        if (relValService.EV_SALES_1) updateData.EV_SALES_1 = relValService.EV_SALES_1;
        if (relValService.EV_EBITDA) updateData.EV_EBITDA = relValService.EV_EBITDA;
        if (relValService.EV_EBITDA_1) updateData.EV_EBITDA_1 = relValService.EV_EBITDA_1;
        if (relValService.workBackEndInputs) updateData.workBackEndInputs = relValService.workBackEndInputs;

        console.log('Update data:', JSON.stringify(updateData, null, 2));
        console.log('Order ID type:', typeof orderId, 'Value:', orderId);

        // Convert orderId to ObjectId if it's a string
        const mongoose = require('mongoose');
        let orderObjectId;
        try {
            orderObjectId = mongoose.Types.ObjectId.isValid(orderId) ? new mongoose.Types.ObjectId(orderId) : orderId;
        } catch (e) {
            orderObjectId = orderId;
        }

        // METHOD 1: Try using updateOne with $set for direct MongoDB update
        // This directly updates MongoDB, bypassing all Mongoose middleware and change detection
        const updateResult = await Orders.updateOne(
            { _id: orderObjectId },
            { $set: updateData },
            { upsert: false }
        );

        console.log('Update result:', {
            matchedCount: updateResult.matchedCount,
            modifiedCount: updateResult.modifiedCount,
            acknowledged: updateResult.acknowledged
        });

        if (updateResult.matchedCount === 0) {
            return res.status(404).json({
                message: 'Order not found',
                orderId: orderId,
                orderObjectId: orderObjectId.toString()
            });
        }

        if (updateResult.modifiedCount === 0) {
            console.warn('⚠️ WARNING: No documents were modified. This might mean:');
            console.warn('  1. The values are exactly the same as what\'s in the database');
            console.warn('  2. There was an issue with the update');
            console.warn('  3. MongoDB validation failed silently');

            // Still proceed to verify what's in the database
        } else {
            console.log('✅ Document was modified successfully');
        }

        // Wait a moment for MongoDB to commit the write
        await new Promise(resolve => setTimeout(resolve, 200));

        // Reload the order from database to verify the save - use lean(false) to get Mongoose document
        const savedOrder = await Orders.findById(orderObjectId).lean(false);

        if (!savedOrder) {
            return res.status(404).json({ message: 'Order not found after update' });
        }

        console.log('✅ Saved successfully!');
        console.log('CheckBoxesValues after save (from DB):', JSON.stringify(savedOrder.checkBoxesValues));

        // Verify the checkbox values were actually saved
        const savedCheckBoxes = savedOrder.checkBoxesValues || {};
        const valuesMatch = JSON.stringify(savedCheckBoxes) === JSON.stringify(completeCheckBoxesValues);

        if (!valuesMatch) {
            console.error('❌ MISMATCH: Saved values do not match what we tried to save!');
            console.error('Expected:', JSON.stringify(completeCheckBoxesValues));
            console.error('Got:', JSON.stringify(savedCheckBoxes));
            console.error('This indicates the database update may have failed or been partially applied.');
        } else {
            console.log('✅ Verified: Checkbox values match what was saved');
        }

        // Use the saved order's values (from the database) - this is the source of truth
        const savedCheckBoxesValues = savedOrder.checkBoxesValues || completeCheckBoxesValues;

        console.log('Returning checkBoxesValues in response:', JSON.stringify(savedCheckBoxesValues));

        // Return the saved data - using values from savedOrder (fresh from DB)
        return res.status(200).json({
            message: 'Data saved successfully',
            query: {
                _id: savedOrder._id,
                checkBoxesValues: savedCheckBoxesValues
            },
            PE: savedOrder.PE,
            PE_1: savedOrder.PE_1,
            PS: savedOrder.PS,
            PS_1: savedOrder.PS_1,
            EV_SALES: savedOrder.EV_SALES,
            EV_SALES_1: savedOrder.EV_SALES_1,
            EV_EBITDA: savedOrder.EV_EBITDA,
            EV_EBITDA_1: savedOrder.EV_EBITDA_1,
            workBackEndInputs: savedOrder.workBackEndInputs,
            netDebt: savedOrder.netDebt,
            weightAvgEquityValue: savedOrder.weightAvgEquityValue,
            weightMinEquityValue: savedOrder.weightMinEquityValue,
            weightMaxEquityValue: savedOrder.weightMaxEquityValue,
            EnterpriseAvgValue: savedOrder.EnterpriseAvgValue,
            EnterpriseMinValue: savedOrder.EnterpriseMinValue,
            EnterpriseMaxValue: savedOrder.EnterpriseMaxValue
        });

    } catch (error) {
        console.error('Error saving data:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message,
            stack: error.stack
        });
    }
});
// Assignee the Admin User
router.put('/:id/assign', async (req, res) => {
    try {
        const { id } = req.params;
        const { assigned_to } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(assigned_to)) {
            return res.status(400).json({ message: "Invalid order or user ID" });
        }

        const updatedOrder = await Orders.findByIdAndUpdate(
            id,
            { assigned_to: new mongoose.Types.ObjectId(assigned_to) }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Change the Order Custody
router.put('/:id/custody', async (req, res) => {
    try {
        const { id } = req.params;
        const { custody } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid order or user ID" });
        }

        const updatedOrder = await Orders.findByIdAndUpdate(
            id,
            { custody: custody }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Change the Order Custody
router.post('/complete-order', async (req, res) => {
    try {
        const order = await Orders.findById(req.body.orderId);
        if (!order) {
            return res.status(400).json({ status: false, message: "Invalid Order.", data: [] });
        }

        const customer = await Customers.findById(order.matadata.customerId);
        if (!customer) {
            return res.status(400).json({ status: false, message: "Customer Not Found.", data: [] });
        }

        const orderId = req.body.orderId;
        const userUploadDir = path.join(__dirname, '../../../../uploads/orders/', orderId);

        // Check if the directory exists; if not, create it
        if (!fs.existsSync(userUploadDir)) {
            fs.mkdirSync(userUploadDir, { recursive: true });
        }

        if (req.files && req.files.pdf) {
            let document = req.files.pdf;
            let fileName = (order.matadata.status === "Re-Submitted") ? 'revised_report.pdf' : document.name;
            const uploadPath = path.join(userUploadDir, fileName);
            await new Promise((resolve, reject) => {
                document.mv(uploadPath, function (error) {
                    if (error) {
                        return reject(error);
                    }
                    resolve(true);
                });
            });

            //Send initital order submit report
            let html = (order.matadata.status === "Re-Submitted") ? await EmailTemplate.revisedReportSent(customer.first_name, order.business.companyName) : await EmailTemplate.inititalReportSubmit(customer.first_name, order.business.companyName);
            let result = await EmailTemplate.sendMail({
                email: customer.email,
                subject: (order.matadata.status === "Re-Submitted") ? await EmailTemplate.fetchSubjectTemplate(12) : await EmailTemplate.fetchSubjectTemplate(11),
                application_name: "FinVal",
                text: "",
                html: html,
                attachments: [
                    {
                        filename: fileName,
                        path: uploadPath, // Path to the uploaded file
                    },
                ],
            });

            if (result) {
                // Update the order to set it as completed
                await Orders.updateOne({ _id: orderId }, {
                    $set: {
                        completedOn: moment().format(),
                        revisedCompletedOn: (order.matadata.status === "Re-Submitted") ? moment().format() : null,
                        reportDocName: fileName,
                        "matadata.status": (order.matadata.status === "Re-Submitted") ? "Completed (Revised)" : "Completed"
                    }
                });
                return res.status(200).json({ 'status': true, 'message': "Report Sent Sucessfully.", 'data': [] });
            }

            return res.status(500).json({ status: false, message: "Something went wrong. Please try again" });
        }
        else {
            return res.status(400).json({ status: false, message: "No documents found, please try again later", data: [] });
        }
    } catch (err) {
        console.error('Error in /complete-order:', err.message); // Log the error
        res.status(500).json({ message: err.message });
    }
});
async function buildDocumentUrls(order) {
    if (order.documents && order.documents.length > 0) {
        return order.documents.map(doc => {
            const documentUrl = `${APIURL}uploads/customer/${order.orderId}/${doc.name}`;
            return {
                name: doc.name, // Assuming the document object contains a name
                url: documentUrl,
            };
        });
    }
    return [];
};

module.exports = router;    