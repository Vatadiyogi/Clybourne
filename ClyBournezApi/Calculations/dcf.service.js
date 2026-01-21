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
            
            // var dayRem = Math.floor((Date.UTC(fiscalEndDate.getFullYear() + 1, fiscalEndDate.getMonth(), fiscalEndDate.getDate()) - Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())) / (1000 * 60 * 60 * 24));
            var dayRem = Math.round((fiscalEndDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
            return dayRem / 365;
        };

        DcfService_1.prototype.computeFCFF = function (dbQuery, wacc, perpetualGrowthRate) {
            var workDcfFCFF = [];
            var enterpriseValue = 0;
            // var dayRem = this.getDaysRemaining(+dbQuery.business.lastFinYrEnd);
            var dayRem = this.getDaysRemaining(dbQuery.business.FinYrEndMonth + " " + dbQuery.business.FinYrEndDate + " " + dbQuery.business.FinYrEnd);

            var waccPlusOne = Math.pow((1 + wacc), dayRem);
            for (var index = 0; index < 5; index++) {
                var dcfFcff = new dcf_model_1.WorkDcfFCFF(this.backEndService.workIncStmt[index + 1].year, this.backEndService.workIncStmt[index + 1].ebitda, -1 * (this.backEndService.workIncStmt[index + 1].intExp * this.backEndService.workBackEndInputs.corpTaxRate / 100), -1 * (this.backEndService.workBalSheet[index + 1].workingCapital - this.backEndService.workBalSheet[index].workingCapital), +dbQuery.forcast_bal_sheet[index].fixedAssets, waccPlusOne);
                workDcfFCFF.push(dcfFcff);
                waccPlusOne = (1 + wacc) * waccPlusOne;
                enterpriseValue = enterpriseValue + workDcfFCFF[index].presentFreeCashFlow;
            }

            var fcffTerminalValue = ((workDcfFCFF[4].freeCashFlow * (1 + perpetualGrowthRate)) / (wacc - perpetualGrowthRate));
            var fcffPresentValue = workDcfFCFF[4].discountFactor * fcffTerminalValue;
            enterpriseValue = enterpriseValue + fcffPresentValue;
            
            // console.log(enterpriseValue);
            // console.log(this.backEndService.workBalSheet[0].debtLoan);
            // console.log(this.backEndService.workBalSheet[0].cashBalance);
            // console.log(enterpriseValue- (this.backEndService.workBalSheet[0].debtLoan - this.backEndService.workBalSheet[0].cashBalance));
            
            return [(enterpriseValue - (this.backEndService.workBalSheet[0].debtLoan - this.backEndService.workBalSheet[0].cashBalance)), workDcfFCFF];
        };

        DcfService_1.prototype.calculateCompanyEquityValue = function (dbQuery) {
            // if (!dbQuery) {
            //     return;
            // }
            // if ((this.backEndService.workBalSheet.length == 0)
            //     || (this.backEndService.workCashFlowStmt.length == 0)
            //     || (this.backEndService.workIncStmt.length == 0)) {
            //     this.backEndService.populateBackEndData(dbQuery);
            // }
            var perpetualGrowthRate = this.backEndService.workBackEndInputs.perpetualGrowthRate / 100;
            var debtCapital = this.backEndService.workBalSheet[0].debtLoan / (this.backEndService.workBalSheet[0].debtLoan + this.backEndService.workBalSheet[0].equity);
            var aftrTaxCostOfDebt = +dbQuery.forcast_inc_stmt[0].interestRate * (1 - (this.backEndService.workBackEndInputs.corpTaxRate / 100)) / 100;
            var levBetaCmpny = this.backEndService.workBackEndTableAvg.un_lev_beta * (1 + ((1 - (this.backEndService.workBackEndInputs.corpTaxRate / 100)) * (debtCapital))); //=IFERROR(D58*(1+((1-D59)*(D61))),0)
            var adjBeta = ((this.backEndService.workBackEndInputs.weightOfAdjBeta / 100) * (levBetaCmpny + (this.backEndService.workBackEndInputs.cmpnyDiscFactor / 100))) + (this.backEndService.workBackEndInputs.weightOfMktBeta / 100); //'Back End'!C77*DCF!D63+'Back End'!C78*'Back End'!C79
            var costOfEquity = (this.backEndService.workBackEndInputs.treasuryondRate + (adjBeta * this.backEndService.workBackEndInputs.equityRiskPremium) + this.backEndService.workBackEndInputs.cntryRiskPremium + this.backEndService.workBackEndInputs.alpha) / 100; //=('Back End'!C61)+(D64)*('Back End'!C62)+('Back End'!C63)+('Back End'!C82)
            var wacc = (debtCapital * aftrTaxCostOfDebt) + ((1 - debtCapital) * costOfEquity);
            {
                // Average Valuation 	 15,178 (WACC 10% and perp = 2.5%)
                var _a = this.computeFCFF(dbQuery, wacc, perpetualGrowthRate), eqVal = _a[0], fcffArray = _a[1];
                this.companyEquityAvgValue = eqVal;
                this.workDcfFCFF = fcffArray;
                this.wacc = wacc * 100;
                this.adjustedBeta = adjBeta;
                this.terminalFCFF = fcffArray[4].freeCashFlow * (1 + perpetualGrowthRate) / (wacc - perpetualGrowthRate);
                this.terminalPresentFCFF = this.terminalFCFF * fcffArray[4].discountFactor;
                
                this.terminalDiscountFactor = fcffArray[4].discountFactor;
                this.enterpriseValue = (fcffArray.reduce((total, item) => item.presentFreeCashFlow + total, 0)) + this.terminalPresentFCFF;
            }
            {
                // Minimum 	 8,363 (WACC = 15% and perp = 1.5%)
                var _b = this.computeFCFF(dbQuery, wacc + 0.05, perpetualGrowthRate - 0.01), eqVal = _b[0], fcffArray = _b[1];
                this.companyEquityMinValue = eqVal;
            }
            {
                // Maximum 	 76,756 (WACC = 5% and Perp = 3.5%)
                var _c = this.computeFCFF(dbQuery, wacc - 0.05, perpetualGrowthRate + 0.01), eqVal = _c[0], fcffArray = _c[1];
                this.companyEquityMaxValue = eqVal;
            }
        };

        return DcfService_1;
    }());
    __setFunctionName(_classThis, "DcfService");
    return DcfService = _classThis;
}();
