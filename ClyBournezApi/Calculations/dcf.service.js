// "use strict";
// var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
//     if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
//     return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
// };

// Object.defineProperty(exports, "__esModule", { value: true });
// exports.DcfService = void 0;

// var dcf_model_1 = require("./dcf.model");
// var DcfService = exports.DcfService = function () {
//     var _classThis;
//     var DcfService = _classThis = /** @class */ (function () {
//         function DcfService_1(backEndService, dbQuery) {
//             this.backEndService = backEndService;
//             this.workDcfFCFF = [];
//             this.companyEquityAvgValue = null;
//             this.companyEquityMinValue = null;
//             this.companyEquityMaxValue = null;
//             this.terminalFCFF = null;
//             this.terminalPresentFCFF = null;
//             this.terminalDiscountFactor = null;
//             this.enterpriseValue = null;
//             this.wacc = null;
//             this.adjustedBeta = null;
//             this.calculateCompanyEquityValue(dbQuery);
//         }

//         DcfService_1.prototype.getDaysRemaining = function (lastFinYrEnd) {
//             var currentDate = new Date();
//             var fiscalEndDate = new Date(lastFinYrEnd);
//             fiscalEndDate.setFullYear(fiscalEndDate.getFullYear() + 1);

//             // var dayRem = Math.floor((Date.UTC(fiscalEndDate.getFullYear() + 1, fiscalEndDate.getMonth(), fiscalEndDate.getDate()) - Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())) / (1000 * 60 * 60 * 24));
//             var dayRem = Math.round((fiscalEndDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
//             return dayRem / 365;
//         };

//         DcfService_1.prototype.computeFCFF = function (dbQuery, wacc, perpetualGrowthRate) {
//             var workDcfFCFF = [];
//             var cumulativePV  = 0;
//             // var dayRem = this.getDaysRemaining(+dbQuery.business.lastFinYrEnd);
//             var dayRem = this.getDaysRemaining(dbQuery.business.FinYrEndMonth + " " + dbQuery.business.FinYrEndDate + " " + dbQuery.business.FinYrEnd);

//             var waccPlusOne = Math.pow((1 + wacc), dayRem);

//             for (var index = 0; index < 5; index++) {
//                 var dcfFcff = new dcf_model_1.WorkDcfFCFF(this.backEndService.workIncStmt[index + 1].year, this.backEndService.workIncStmt[index + 1].ebitda, -1 * (this.backEndService.workIncStmt[index + 1].intExp * this.backEndService.workBackEndInputs.corpTaxRate / 100), -1 * (this.backEndService.workBalSheet[index + 1].workingCapital - this.backEndService.workBalSheet[index].workingCapital), +dbQuery.forcast_bal_sheet[index].fixedAssets, waccPlusOne);

//                 workDcfFCFF.push(dcfFcff);
//                 waccPlusOne = (1 + wacc) * waccPlusOne;
//                 console.log("waccPlusOnewaccPlusOne", waccPlusOne)
//                 cumulativePV = cumulativePV  + workDcfFCFF[index].presentFreeCashFlow;

//             }
//             console.log("workDcfFCFFworkDcfFCFF", workDcfFCFF)
//             console.log(" wacc, perpetualGrowthRate")
//             var fcffTerminalValue = ((workDcfFCFF[4].freeCashFlow * (1 + perpetualGrowthRate)) / (wacc - perpetualGrowthRate));
//             console.log("fcffTerminalValue", fcffTerminalValue)
//             var fcffPresentValue = workDcfFCFF[4].discountFactor * fcffTerminalValue;
//             console.log("fcffPresentValue", fcffPresentValue)
//             console.log("cumulativePV", cumulativePV)

//           const  enterpriseValue = cumulativePV + fcffPresentValue;
//             console.log("enterpriseValue22", enterpriseValue)
//             // console.log(enterpriseValue);
//             console.log("11", this.backEndService.workBalSheet[0].debtLoan);
//             console.log("22", this.backEndService.workBalSheet[0].cashBalance);
//             console.log("33", enterpriseValue - (this.backEndService.workBalSheet[0].debtLoan - this.backEndService.workBalSheet[0].cashBalance));

//             return [(enterpriseValue - (this.backEndService.workBalSheet[0].debtLoan - this.backEndService.workBalSheet[0].cashBalance)), workDcfFCFF];
//         };

//         DcfService_1.prototype.calculateCompanyEquityValue = function (dbQuery) {
//             // console.log(" dbQuerydbQuery", dbQuery)
//             // if (!dbQuery) {
//             //     return;
//             // }
//             // if ((this.backEndService.workBalSheet.length == 0)
//             //     || (this.backEndService.workCashFlowStmt.length == 0)
//             //     || (this.backEndService.workIncStmt.length == 0)) {
//             //     this.backEndService.populateBackEndData(dbQuery);
//             // }
//             var perpetualGrowthRate = this.backEndService.workBackEndInputs.perpetualGrowthRate / 100;
//             // console.log(" this.backEndService.workBackEndInputs.perpetualGrowthRate", this.backEndService)
//             var debtCapital = this.backEndService.workBalSheet[0].debtLoan / (this.backEndService.workBalSheet[0].debtLoan + this.backEndService.workBalSheet[0].equity);
//             var aftrTaxCostOfDebt = +dbQuery.forcast_inc_stmt[0].interestRate * (1 - (this.backEndService.workBackEndInputs.corpTaxRate / 100)) / 100;
//             var levBetaCmpny = this.backEndService.workBackEndTableAvg.un_lev_beta * (1 + ((1 - (this.backEndService.workBackEndInputs.corpTaxRate / 100)) * (debtCapital))); //=IFERROR(D58*(1+((1-D59)*(D61))),0)
//             var adjBeta = ((this.backEndService.workBackEndInputs.weightOfAdjBeta / 100) * (levBetaCmpny + (this.backEndService.workBackEndInputs.cmpnyDiscFactor / 100))) + (this.backEndService.workBackEndInputs.weightOfMktBeta / 100); //'Back End'!C77*DCF!D63+'Back End'!C78*'Back End'!C79
//             var costOfEquity = (this.backEndService.workBackEndInputs.treasuryondRate + (adjBeta * this.backEndService.workBackEndInputs.equityRiskPremium) + this.backEndService.workBackEndInputs.cntryRiskPremium + this.backEndService.workBackEndInputs.alpha) / 100; //=('Back End'!C61)+(D64)*('Back End'!C62)+('Back End'!C63)+('Back End'!C82)
//             // console.log("  debtCapitaldebtCapital ", debtCapital);
//             // console.log("aftrTaxCostOfDebtaftrTaxCostOfDebt   ", aftrTaxCostOfDebt);
//             // console.log(" costOfEquitycostOfEquity  ", costOfEquity);
//             // console.log(" perpetualGrowthRateperpetualGrowthRate  ", perpetualGrowthRate);
//             // console.log(" levBetaCmpnylevBetaCmpny  ", levBetaCmpny);
//             // console.log(" adjBetaadjBeta  ", adjBeta);

//             var wacc = (debtCapital * aftrTaxCostOfDebt) + ((1 - debtCapital) * costOfEquity);
//             console.log("  waccwacc ", wacc);
//             {
//                 // Average Valuation 	 15,178 (WACC 10% and perp = 2.5%)
//                 var _a = this.computeFCFF(dbQuery, wacc, perpetualGrowthRate), eqVal = _a[0], fcffArray = _a[1];
//                 this.companyEquityAvgValue = eqVal;
//                 this.workDcfFCFF = fcffArray;
//                 this.wacc = wacc * 100;
//                 this.adjustedBeta = adjBeta;
//                 this.terminalFCFF = fcffArray[4].freeCashFlow * (1 + perpetualGrowthRate) / (wacc - perpetualGrowthRate);
//                 this.terminalPresentFCFF = this.terminalFCFF * fcffArray[4].discountFactor;

//                 this.terminalDiscountFactor = fcffArray[4].discountFactor;
//                 this.enterpriseValue = (fcffArray.reduce((total, item) => item.presentFreeCashFlow + total, 0)) + this.terminalPresentFCFF;
//             }
//             {
//                 // Minimum 	 8,363 (WACC = 15% and perp = 1.5%)
//                 // console.log("dbqery",dbQuery, "perpetualGrowthRate", perpetualGrowthRate)
//                 var _b = this.computeFCFF(dbQuery, wacc +    0.05, perpetualGrowthRate - 0.01), eqVal = _b[0], fcffArray = _b[1];
//                 this.companyEquityMinValue = eqVal;
//                 // var _b = this.computeFCFF(dbQuery, 0.094 + 0.05, 0.01 - 0.01), eqVal = _b[0], fcffArray = _b[1];
//                 // this.companyEquityMinValue = eqVal;
//             }
//             {
//                 // Maximum 	 76,756 (WACC = 5% and Perp = 3.5%)
//                 var _c = this.computeFCFF(dbQuery, wacc - 0.05, perpetualGrowthRate + 0.01), eqVal = _c[0], fcffArray = _c[1];
//                 this.companyEquityMaxValue = eqVal;
//                 // var _c = this.computeFCFF(dbQuery, 0.094 - 0.05, 0.01 + 0.01), eqVal = _c[0], fcffArray = _c[1];
//                 // this.companyEquityMaxValue = eqVal;
//             }
//         };

//         return DcfService_1;
//     }());
//     __setFunctionName(_classThis, "DcfService");
//     return DcfService = _classThis;
// }();




"use strict";
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};

Object.defineProperty(exports, "__esModule", { value: true });
exports.DcfService = void 0;

var dcf_model_1 = require("./dcf.model");
var DcfService = exports.DcfService = function () {
    var _classThis;
    var DcfService = _classThis = /** @class */ (function () {
        function DcfService_1(backEndService, dbQuery) {
            this.backEndService = backEndService;
            this.workDcfFCFF = [];
            this.companyEquityAvgValue = null;
            this.companyEquityMinValue = null;
            this.companyEquityMaxValue = null;
            this.terminalFCFF = null;
            this.terminalPresentFCFF = null;
            this.terminalDiscountFactor = null;
            this.enterpriseValue = null;
            this.wacc = null;
            this.adjustedBeta = null;
            this.calculateCompanyEquityValue(dbQuery);
        }

        DcfService_1.prototype.getDaysRemaining = function (lastFinYrEnd) {
            var currentDate = new Date();
            var fiscalEndDate = new Date(lastFinYrEnd);
            fiscalEndDate.setFullYear(fiscalEndDate.getFullYear() + 1);
            var dayRem = Math.round((fiscalEndDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
            return dayRem / 365;
        };

        DcfService_1.prototype.computeFCFF = function (dbQuery, wacc, perpetualGrowthRate) {
            console.log("🔍 === DEBUG computeFCFF STARTED ===");
            console.log("📊 Parameters:", {
                WACC: wacc,
                WACC_Percent: (wacc * 100).toFixed(2) + "%",
                GrowthRate: perpetualGrowthRate,
                GrowthRate_Percent: (perpetualGrowthRate * 100).toFixed(2) + "%"
            });

            // CRITICAL VALIDATION
            if (perpetualGrowthRate >= wacc) {
                console.log("❌ ERROR: Growth rate >= WACC!");
                console.log("   Growth:", perpetualGrowthRate, "WACC:", wacc);
                console.log("   Terminal value will be infinite!");
                return [0, []];
            }

            var workDcfFCFF = [];
            var cumulativePV = 0;

            var dayRem = this.getDaysRemaining(dbQuery.business.FinYrEndMonth + " " +
                dbQuery.business.FinYrEndDate + " " +
                dbQuery.business.FinYrEnd);

            console.log("📅 Time calculation:", {
                FiscalEnd: dbQuery.business.FinYrEndMonth + " " + dbQuery.business.FinYrEndDate + " " + dbQuery.business.FinYrEnd,
                DaysRemaining: Math.round(dayRem * 365),
                YearsFraction: dayRem
            });

            var waccPlusOne = Math.pow((1 + wacc), dayRem);
            console.log("📉 Initial discount factor (1+WACC)^(dayRem):", waccPlusOne);

            // Calculate 5-year FCFF
            for (var index = 0; index < 5; index++) {
                console.log(`\n📊 Year ${index + 1} (${2026 + index}) Calculation:`);

                // Get input values
                var ebitda = this.backEndService.workIncStmt[index + 1].ebitda;
                var intExp = this.backEndService.workIncStmt[index + 1].intExp;
                var taxRate = this.backEndService.workBackEndInputs.corpTaxRate / 100;
                var currentWC = this.backEndService.workBalSheet[index + 1].workingCapital;
                var previousWC = this.backEndService.workBalSheet[index].workingCapital;
                var workCapChange = -1 * (currentWC - previousWC);
                var capex = +dbQuery.forcast_bal_sheet[index].fixedAssets;

                console.log("   Inputs:", {
                    EBITDA: ebitda,
                    InterestExpense: intExp,
                    TaxShield: -1 * (intExp * taxRate),
                    CurrentWC: currentWC,
                    PreviousWC: previousWC,
                    WorkCapChange: workCapChange,
                    CAPEX: capex,
                    DiscountFactor: waccPlusOne
                });

                var dcfFcff = new dcf_model_1.WorkDcfFCFF(
                    this.backEndService.workIncStmt[index + 1].year,
                    ebitda,
                    -1 * (intExp * taxRate),
                    workCapChange,
                    capex,
                    waccPlusOne
                );

                console.log("   Results:", {
                    FreeCashFlow: dcfFcff.freeCashFlow,
                    PresentValue: dcfFcff.presentFreeCashFlow
                });

                workDcfFCFF.push(dcfFcff);
                cumulativePV += dcfFcff.presentFreeCashFlow;

                waccPlusOne = (1 + wacc) * waccPlusOne;
                console.log("   Cumulative PV so far:", cumulativePV);
                console.log("   Next discount factor:", waccPlusOne);
            }

            console.log("\n🏁 === TERMINAL VALUE CALCULATION ===");
            console.log("   Year 5 FCFF:", workDcfFCFF[4].freeCashFlow);
            console.log("   Discount Factor (Year 5):", workDcfFCFF[4].discountFactor);
            console.log("   WACC:", wacc);
            console.log("   Perpetual Growth Rate:", perpetualGrowthRate);

            // Calculate terminal value
            var fcffTerminalValue = ((workDcfFCFF[4].freeCashFlow * (1 + perpetualGrowthRate)) /
                (wacc - perpetualGrowthRate));
            console.log("   Terminal Value Formula: (FCFF × (1+g)) ÷ (WACC - g)");
            console.log("   Terminal Value: (", workDcfFCFF[4].freeCashFlow, "×", (1 + perpetualGrowthRate), ") ÷ (", wacc, "-", perpetualGrowthRate, ")");
            console.log("   Terminal Value Result:", fcffTerminalValue);

            var fcffPresentValue = workDcfFCFF[4].discountFactor * fcffTerminalValue;
            console.log("   Present Value of Terminal:", fcffPresentValue,
                " (", workDcfFCFF[4].discountFactor, "×", fcffTerminalValue, ")");

            var enterpriseValue = cumulativePV + fcffPresentValue;
            console.log("\n💰 === ENTERPRISE VALUE ===");
            console.log("   Cumulative 5-year PV:", cumulativePV);
            console.log("   + Terminal Value PV:", fcffPresentValue);
            console.log("   = Total Enterprise Value:", enterpriseValue);

            // Calculate net debt
            var netDebt = this.backEndService.workBalSheet[0].debtLoan -
                this.backEndService.workBalSheet[0].cashBalance;
            console.log("\n💳 === NET DEBT CALCULATION ===");
            console.log("   Total Debt:", this.backEndService.workBalSheet[0].debtLoan);
            console.log("   Cash Balance:", this.backEndService.workBalSheet[0].cashBalance);
            console.log("   Net Debt (Debt - Cash):", netDebt);

            // Calculate equity value
            var equityValue = enterpriseValue - netDebt;
            console.log("\n🎯 === EQUITY VALUE ===");
            console.log("   Formula: Equity = Enterprise Value - Net Debt");
            console.log("   Calculation:", enterpriseValue, "-", netDebt, "=", equityValue);
            console.log("   Note: If Net Debt is negative (cash > debt), equity is HIGHER than enterprise!");

            console.log("✅ === DEBUG computeFCFF COMPLETED ===");

            return [equityValue, workDcfFCFF];
        };
        DcfService_1.prototype.calculateCompanyEquityValue = function (dbQuery) {
            console.log("\n🎯 === DEBUG calculateCompanyEquityValue STARTED ===");

            // ======================== GET ALL USER INPUTS ========================
            console.log("📊 USER INPUTS (already in percentage):");
            console.log("   perpetualGrowthRate:", this.backEndService.workBackEndInputs.perpetualGrowthRate + "%");
            console.log("   pptlDelta:", this.backEndService.workBackEndInputs.pptlDelta + "%");
            console.log("   waccDelta:", this.backEndService.workBackEndInputs.waccDelta + "%");

            // Parameters are already in percentage, divide by 100 to get decimal
            var baseGrowthRate = this.backEndService.workBackEndInputs.perpetualGrowthRate / 100;
            var growthDelta = this.backEndService.workBackEndInputs.pptlDelta / 100;
            var waccDelta = this.backEndService.workBackEndInputs.waccDelta / 100;

            console.log("\n📊 CONVERTED TO DECIMAL:");
            console.log("   Base Growth Rate:", baseGrowthRate, "(", (baseGrowthRate * 100).toFixed(2) + "%)");
            console.log("   Growth Delta:", growthDelta, "(", (growthDelta * 100).toFixed(2) + "%)");
            console.log("   WACC Delta:", waccDelta, "(", (waccDelta * 100).toFixed(2) + "%)");

            // ======================== WACC CALCULATION START ========================
            // Calculate WACC components
            var totalCapital = this.backEndService.workBalSheet[0].debtLoan +
                this.backEndService.workBalSheet[0].equity;
            var debtCapital = totalCapital > 0 ?
                this.backEndService.workBalSheet[0].debtLoan / totalCapital : 0;

            var taxRate = this.backEndService.workBackEndInputs.corpTaxRate / 100;
            var interestRate = dbQuery.forcast_inc_stmt[0].interestRate / 100;
            var aftrTaxCostOfDebt = interestRate * (1 - taxRate);

            // Beta calculations
            var unleveredBeta = this.backEndService.workBackEndTableAvg.un_lev_beta;
            var leveredBeta = unleveredBeta * (1 + ((1 - taxRate) * debtCapital));

            var adjBeta = ((this.backEndService.workBackEndInputs.weightOfAdjBeta / 100) *
                (leveredBeta + (this.backEndService.workBackEndInputs.cmpnyDiscFactor / 100))) +
                (this.backEndService.workBackEndInputs.weightOfMktBeta / 100);

            // Cost of equity
            var riskFreeRate = this.backEndService.workBackEndInputs.treasuryondRate / 100;
            var equityRiskPremium = this.backEndService.workBackEndInputs.equityRiskPremium / 100;
            var countryRiskPremium = this.backEndService.workBackEndInputs.cntryRiskPremium / 100;
            var alpha = this.backEndService.workBackEndInputs.alpha / 100;

            var costOfEquity = riskFreeRate + (adjBeta * equityRiskPremium) +
                countryRiskPremium + alpha;
console.log("DECENcostOfEquitycostOfEquitycostOfEquitycostOfEquity",costOfEquity)
            // Calculate base WACC
            var baseWACC = (debtCapital * aftrTaxCostOfDebt) + ((1 - debtCapital) * costOfEquity);

            console.log("\n⚖️ BASE WACC CALCULATION:");
            console.log("   Calculated WACC:", (baseWACC * 100).toFixed(2) + "%");

            // Store for later use
            this.wacc = baseWACC * 100;
            this.adjustedBeta = adjBeta;

            // ======================== DYNAMIC ARRAY GENERATION ========================
            console.log("\n🎯 DYNAMIC ARRAY GENERATION USING USER DELTAS");

            // DYNAMIC WACC ARRAY - 5 values centered around base WACC
            var waccValues = [];

            // Generate: [base - 2δ, base - 1δ, base, base + 1δ, base + 2δ]
            for (var i = -2; i <= 2; i++) {
                var currentWacc = baseWACC + (i * waccDelta);
                waccValues.push(Math.max(Number(currentWacc.toFixed(4)), 0.01)); // Min 1%
            }

            console.log("   WACC Values using waccDelta =", (waccDelta * 100).toFixed(2) + "%:");
            console.log("     [" + waccValues.map(v => (v * 100).toFixed(2) + "%").join(", ") + "]");

            // DYNAMIC GROWTH ARRAY - 5 values centered around base growth rate
            var growthValues = [];

            // Generate: [base - 2δ, base - 1δ, base, base + 1δ, base + 2δ]
            for (var i = -2; i <= 2; i++) {                                                 
                var currentGrowth = baseGrowthRate + (i * growthDelta);
                growthValues.push(Math.max(Number(currentGrowth.toFixed(4)), 0)); // Min 0%
            }

            console.log("   Growth Values using pptlDelta =", (growthDelta * 100).toFixed(2) + "%:");
            console.log("     [" + growthValues.map(v => (v * 100).toFixed(2) + "%").join(", ") + "]");

            // ======================== AVERAGE CASE ========================
            console.log("\n📊 AVERAGE/BASE CASE:");
            console.log("   Using calculated WACC and user growth rate");
            console.log("   WACC:", (baseWACC * 100).toFixed(2) + "%");
            console.log("   Growth:", (baseGrowthRate * 100).toFixed(2) + "%");

            var _a = this.computeFCFF(dbQuery, baseWACC, baseGrowthRate),
                avgEqVal = _a[0],
                avgFcffArray = _a[1];

            this.companyEquityAvgValue = avgEqVal;
            this.workDcfFCFF = avgFcffArray;

            // Calculate terminal value details
            if (avgFcffArray && avgFcffArray.length > 4) {
                this.terminalFCFF = avgFcffArray[4].freeCashFlow * (1 + baseGrowthRate) /
                    (baseWACC - baseGrowthRate);
                this.terminalPresentFCFF = this.terminalFCFF * avgFcffArray[4].discountFactor;
                this.terminalDiscountFactor = avgFcffArray[4].discountFactor;

                var sumPresentFCFF = avgFcffArray.reduce((total, item) => total + item.presentFreeCashFlow, 0);
                this.enterpriseValue = sumPresentFCFF + this.terminalPresentFCFF;
            }

            // ======================== MIN/MAX CALCULATION ========================
            console.log("\n🎯 MIN/MAX CALCULATION ACROSS ALL COMBINATIONS");

            var minEquityValue = Number.MAX_VALUE;
            var maxEquityValue = Number.MIN_VALUE;
            var minWaccUsed = 0;
            var minGrowthUsed = 0;
            var maxWaccUsed = 0;
            var maxGrowthUsed = 0;
            var dataTableResults = [];

            var totalCombinations = waccValues.length * growthValues.length;
            console.log("   Testing", totalCombinations, "combinations");

            for (var i = 0; i < waccValues.length; i++) {
                for (var j = 0; j < growthValues.length; j++) {
                    var testWacc = waccValues[i];
                    var testGrowth = growthValues[j];

                    // Skip invalid combinations
                    if (testGrowth >= testWacc) {
                        console.log("   Skipping: Growth", (testGrowth * 100).toFixed(2) + "% >= WACC", (testWacc * 100).toFixed(2) + "%");
                        continue;
                    }

                    var _b = this.computeFCFF(dbQuery, testWacc, testGrowth), testEqVal = _b[0];

                    // Store for data table
                    dataTableResults.push({
                        wacc: testWacc,
                        waccPercent: (testWacc * 100).toFixed(2) + "%",
                        growth: testGrowth,
                        growthPercent: (testGrowth * 100).toFixed(2) + "%",
                        equityValue: testEqVal
                    });

                    // Update min/max
                    if (testEqVal < minEquityValue) {
                        minEquityValue = testEqVal;
                        minWaccUsed = testWacc;
                        minGrowthUsed = testGrowth;
                    }

                    if (testEqVal > maxEquityValue) {
                        maxEquityValue = testEqVal;
                        maxWaccUsed = testWacc;
                        maxGrowthUsed = testGrowth;
                    }
                }
            }

            // Store results
            this.companyEquityMinValue = minEquityValue;
            this.companyEquityMaxValue = maxEquityValue;
            this.dataTableResults = dataTableResults;
            this.dataTableWaccValues = waccValues;
            this.dataTableGrowthValues = growthValues;

            // ======================== RESULTS SUMMARY ========================
            console.log("\n📊 FINAL RESULTS:");
            console.log("   Average Equity Value:", this.companyEquityAvgValue?.toFixed(2) || "N/A");
            console.log("   Minimum Equity Value:", minEquityValue.toFixed(2),
                "at WACC=", (minWaccUsed * 100).toFixed(2) + "%",
                "Growth=", (minGrowthUsed * 100).toFixed(2) + "%");
            console.log("   Maximum Equity Value:", maxEquityValue.toFixed(2),
                "at WACC=", (maxWaccUsed * 100).toFixed(2) + "%",
                "Growth=", (maxGrowthUsed * 100).toFixed(2) + "%");

            // ======================== COMPARE WITH EXCEL EXPECTATIONS ========================
            console.log("\n📊 COMPARISON WITH EXCEL DATA TABLE:");

            // Excel shows these specific values:
            var excelWaccArray = [7.31, 8.31, 9.31, 10.00, 11.00];
            var excelGrowthArray = [0.00, 0.50, 1.00, 1.50, 2.00];

            console.log("   Excel uses:");
            console.log("     WACC: [" + excelWaccArray.map(v => v.toFixed(2) + "%").join(", ") + "]");
            console.log("     Growth: [" + excelGrowthArray.map(v => v.toFixed(2) + "%").join(", ") + "]");

            console.log("   Your generated:");
            console.log("     WACC: [" + waccValues.map(v => (v * 100).toFixed(2) + "%").join(", ") + "]");
            console.log("     Growth: [" + growthValues.map(v => (v * 100).toFixed(2) + "%").join(", ") + "]");

            // Check what values would match Excel
            console.log("\n📊 TO MATCH EXCEL EXACTLY:");

            // Calculate required deltas to match Excel
            if (baseWACC * 100 === 9.31) {
                // If base WACC is 9.31%, what delta gives Excel's array?
                var excelWaccStep1 = 8.31 - 7.31; // 1.0%
                var excelWaccStep2 = 9.31 - 8.31; // 1.0%
                var excelWaccStep3 = 10.00 - 9.31; // 0.69%
                var excelWaccStep4 = 11.00 - 10.00; // 1.0%

                console.log("   For WACC to match Excel exactly:");
                console.log("     Your waccDelta should be ~1.0%");
                console.log("     Note: Excel has uneven steps (0.69% between 9.31% and 10%)");
            }

            if (baseGrowthRate * 100 === 1.00) {
                // If base growth is 1.00%, what delta gives Excel's array?
                var excelGrowthStep = 0.5; // All steps are 0.5%

                console.log("   For Growth to match Excel exactly:");
                console.log("     Your pptlDelta should be 0.5%");
            }

            // ======================== DEBUG INFO ========================
            console.log("\n📊 DEBUG INFORMATION:");
            console.log("   User Input Summary:");
            console.log("     - perpetualGrowthRate:", this.backEndService.workBackEndInputs.perpetualGrowthRate + "%");
            console.log("     - pptlDelta:", this.backEndService.workBackEndInputs.pptlDelta + "%");
            console.log("     - waccDelta:", this.backEndService.workBackEndInputs.waccDelta + "%");
            console.log("     - Calculated Base WACC:", (baseWACC * 100).toFixed(2) + "%");

            console.log("\n   To get Excel-like results:");
            console.log("     Set perpetualGrowthRate = 1%");
            console.log("     Set pptlDelta = 0.5%");
            console.log("     Ensure calculated WACC ≈ 9.31%");
            console.log("     Set waccDelta = 1.0%");

            // Show sample of data table
            console.log("\n   Data Table Sample (first 5):");
            if (dataTableResults.length > 0) {
                for (var k = 0; k < Math.min(5, dataTableResults.length); k++) {
                    var result = dataTableResults[k];
                    console.log(`     ${k + 1}. WACC ${result.waccPercent}, Growth ${result.growthPercent}: ` +
                        `Equity ${result.equityValue.toFixed(2)}`);
                }
            }
        };
        return DcfService_1;
    }());
    __setFunctionName(_classThis, "DcfService");
    return DcfService = _classThis;
}();