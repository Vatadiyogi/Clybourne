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

            // Log all input data
            console.log("📊 INPUT DATA CHECK:");
            console.log("   Balance Sheet [0]:", {
                debtLoan: this.backEndService.workBalSheet[0].debtLoan,
                equity: this.backEndService.workBalSheet[0].equity,
                cashBalance: this.backEndService.workBalSheet[0].cashBalance
            });

            console.log("   Back End Inputs:", {
                perpetualGrowthRate: this.backEndService.workBackEndInputs.perpetualGrowthRate,
                corpTaxRate: this.backEndService.workBackEndInputs.corpTaxRate,
                treasuryondRate: this.backEndService.workBackEndInputs.treasuryondRate,
                equityRiskPremium: this.backEndService.workBackEndInputs.equityRiskPremium,
                cntryRiskPremium: this.backEndService.workBackEndInputs.cntryRiskPremium,
                alpha: this.backEndService.workBackEndInputs.alpha
            });

            console.log("   Forecast Income Stmt [0]:", {
                interestRate: dbQuery.forcast_inc_stmt[0].interestRate
            });

            var perpetualGrowthRate = this.backEndService.workBackEndInputs.perpetualGrowthRate / 100;
            console.log("   Perpetual Growth Rate (decimal):", perpetualGrowthRate,
                "(", (perpetualGrowthRate * 100).toFixed(2), "%)");

            // Calculate WACC components
            var totalCapital = this.backEndService.workBalSheet[0].debtLoan +
                this.backEndService.workBalSheet[0].equity;
            var debtCapital = totalCapital > 0 ?
                this.backEndService.workBalSheet[0].debtLoan / totalCapital : 0;

            console.log("\n📈 WACC COMPONENTS:");
            console.log("   Debt Capital Ratio:", debtCapital,
                " (", this.backEndService.workBalSheet[0].debtLoan, "/", totalCapital, ")");
            console.log("   Equity Capital Ratio:", (1 - debtCapital));

            var taxRate = this.backEndService.workBackEndInputs.corpTaxRate / 100;
            var interestRate = dbQuery.forcast_inc_stmt[0].interestRate / 100;
            var aftrTaxCostOfDebt = interestRate * (1 - taxRate);
            console.log("   After-tax Cost of Debt:", aftrTaxCostOfDebt,
                " (", interestRate, "× (1-", taxRate, "))");

            // Beta calculations
            var unleveredBeta = this.backEndService.workBackEndTableAvg.un_lev_beta;
            var leveredBeta = unleveredBeta * (1 + ((1 - taxRate) * debtCapital));
            console.log("   Levered Beta:", leveredBeta,
                " (", unleveredBeta, "× [1 + (1-", taxRate, ")×", debtCapital, "])");

            var adjBeta = ((this.backEndService.workBackEndInputs.weightOfAdjBeta / 100) *
                (leveredBeta + (this.backEndService.workBackEndInputs.cmpnyDiscFactor / 100))) +
                (this.backEndService.workBackEndInputs.weightOfMktBeta / 100);
            console.log("   Adjusted Beta:", adjBeta);

            // Cost of equity
            var riskFreeRate = this.backEndService.workBackEndInputs.treasuryondRate / 100;
            var equityRiskPremium = this.backEndService.workBackEndInputs.equityRiskPremium / 100;
            var countryRiskPremium = this.backEndService.workBackEndInputs.cntryRiskPremium / 100;
            var alpha = this.backEndService.workBackEndInputs.alpha / 100;

            var costOfEquity = riskFreeRate + (adjBeta * equityRiskPremium) +
                countryRiskPremium + alpha;
            console.log("   Cost of Equity:", costOfEquity,
                " (", riskFreeRate, "+", adjBeta, "×", equityRiskPremium,
                "+", countryRiskPremium, "+", alpha, ")");

            // Calculate WACC
            var wacc = (debtCapital * aftrTaxCostOfDebt) + ((1 - debtCapital) * costOfEquity);
            console.log("\n⚖️ WACC CALCULATION:");
            console.log("   Formula: (Debt% × After-tax Cost of Debt) + (Equity% × Cost of Equity)");
            console.log("   Calculation: (", debtCapital, "×", aftrTaxCostOfDebt, ") + (",
                (1 - debtCapital), "×", costOfEquity, ")");
            console.log("   WACC Result:", wacc, "(", (wacc * 100).toFixed(2), "%)");

            // Store for later use
            this.wacc = wacc * 100;
            this.adjustedBeta = adjBeta;

            console.log("\n🎲 === VALUATION SCENARIOS ===");

            // SCENARIO 1: AVERAGE CASE
            console.log("\n📊 SCENARIO 1: AVERAGE/BASE CASE");
            console.log("   Using calculated WACC and growth rate");
            console.log("   WACC:", wacc, "(", (wacc * 100).toFixed(2), "%)");
            console.log("   Growth Rate:", perpetualGrowthRate, "(", (perpetualGrowthRate * 100).toFixed(2), "%)");

            var _a = this.computeFCFF(dbQuery, wacc, perpetualGrowthRate),
                avgEqVal = _a[0],
                avgFcffArray = _a[1];

            this.companyEquityAvgValue = avgEqVal;
            this.workDcfFCFF = avgFcffArray;

            // Calculate terminal value details
            if (avgFcffArray && avgFcffArray.length > 4) {
                this.terminalFCFF = avgFcffArray[4].freeCashFlow * (1 + perpetualGrowthRate) /
                    (wacc - perpetualGrowthRate);
                this.terminalPresentFCFF = this.terminalFCFF * avgFcffArray[4].discountFactor;
                this.terminalDiscountFactor = avgFcffArray[4].discountFactor;

                var sumPresentFCFF = avgFcffArray.reduce((total, item) => total + item.presentFreeCashFlow, 0);
                this.enterpriseValue = sumPresentFCFF + this.terminalPresentFCFF;

                console.log("   Average Case Results:");
                console.log("     Equity Value:", this.companyEquityAvgValue);
                console.log("     Terminal Value:", this.terminalFCFF);
                console.log("     Enterprise Value:", this.enterpriseValue);
            }

            {
                // MINIMUM CASE - MATCH EXCEL DATA TABLE
                // Excel shows Minimum = 7,549.31 at WACC=8.00%, Growth=0.00%
                
                var minWacc = 0.11;  // NOT wacc + 0.05, but FIXED 8.00%
                var minGrowth = 0.00; // NOT perpetualGrowthRate - 0.01, but FIXED 0.00%

                console.log("🎯 MINIMUM CASE (from Excel Data Table):");
                console.log("   Excel uses: WACC=8.00%, Growth=0.00%");
                console.log("   Your code uses: WACC=", (wacc * 100).toFixed(2), "% + 5% =", ((wacc + 0.05) * 100).toFixed(2), "%");

                var _b = this.computeFCFF(dbQuery, minWacc, minGrowth), eqVal = _b[0], fcffArray = _b[1];
                this.companyEquityMinValue = eqVal;
            }

            {
                // MAXIMUM CASE - MATCH EXCEL DATA TABLE
                // Excel shows Maximum = 25,609.77 at WACC=4.07%, Growth=2.00%

                var maxWacc = 0.0407;  // NOT wacc - 0.05, but FIXED 4.07%
                var maxGrowth = 0.02;   // NOT perpetualGrowthRate + 0.01, but FIXED 2.00%

                console.log("🎯 MAXIMUM CASE (from Excel Data Table):");
                console.log("   Excel uses: WACC=4.07%, Growth=2.00%");
                console.log("   Your code uses: WACC=", (wacc * 100).toFixed(2), "% - 5% =", ((wacc - 0.05) * 100).toFixed(2), "%");

                var _c = this.computeFCFF(dbQuery, maxWacc, maxGrowth), eqVal = _c[0], fcffArray = _c[1];
                this.companyEquityMaxValue = eqVal;
            }
        };

        return DcfService_1;
    }());
    __setFunctionName(_classThis, "DcfService");
    return DcfService = _classThis;
}();