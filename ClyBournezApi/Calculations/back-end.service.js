"use strict";
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};

Object.defineProperty(exports, "__esModule", { value: true });
exports.BackEndService = void 0;

var back_end_model_1 = require("./back-end.model");
var query_model_1 = require("./query.model");
var BackEndService = exports.BackEndService = function () {
    var _classThis;
    var BackEndService = _classThis = /** @class */ (function () {
        function BackEndService_1(backEndAvgService, dbQuery) {
            this.workIncStmt = [];
            this.workBalSheet = [];
            this.workCashFlowStmt = [];
            this.workBackEndInputs = null;
            this.workBackEndTableAvg = (!!backEndAvgService) ? backEndAvgService.workBackEndTableAvg : undefined;
            this.years = [];
            this.setWorkBackEndInputs(dbQuery);
            this.populateBackEndData(dbQuery);
        }
        BackEndService_1.prototype.CheckValidData = function (item) {
            if (isNaN(+item)) {
                return false;
            }
            if (item == "") {
                return false;
            }
            return true;
        };
        BackEndService_1.prototype.setWorkBackEndInputs = function (dbQuery) {
            if (!!dbQuery) {
                if (!!dbQuery.back_end_inputs) {
                    this.workBackEndInputs = new query_model_1.BackEndInputs(dbQuery.back_end_inputs.cmpnyDiscFactorAge, dbQuery.back_end_inputs.cmpnyDiscFactorProfiability, dbQuery.back_end_inputs.cmpnyDiscFactorTurnover, dbQuery.back_end_inputs.weightOfAdjBeta, dbQuery.back_end_inputs.alpha, dbQuery.back_end_inputs.perpetualGrowthRate, dbQuery.back_end_inputs.pptlDelta, dbQuery.back_end_inputs.waccDelta, dbQuery.back_end_inputs.treasuryondRate, dbQuery.back_end_inputs.equityRiskPremium, dbQuery.back_end_inputs.cntryRiskPremium, dbQuery.back_end_inputs.corpTaxRate, dbQuery.back_end_inputs.dcfWeightPercentage);
                }
            }
        };
        BackEndService_1.prototype.populateBackEndData = function (dbQuery) {
            var workIncStmt = new back_end_model_1.WorkIncStmt(+dbQuery.finance.dataYear, +dbQuery.finance.sales, +dbQuery.finance.costOfSales, +dbQuery.finance.ebitda, +dbQuery.finance.depreciation, +dbQuery.finance.interestExpense, +dbQuery.finance.netProfit);
            this.workIncStmt.push(workIncStmt);
            
            this.years.push(+dbQuery.finance.dataYear);
            
            var workBalSheet = new back_end_model_1.WorkBalSheet(+dbQuery.finance.receivables, +dbQuery.finance.inventories, +dbQuery.finance.payables, +dbQuery.finance.netFixedAssets, +dbQuery.finance.debtLoan, +dbQuery.finance.equity, +dbQuery.finance.cashBalance);
            this.workBalSheet.push(workBalSheet);
            for (var index = 0; index < 5; index++) {
                var year = +this.workIncStmt[index].year + 1;
                this.years.push(year);
                var sales = +this.workIncStmt[index].sales * (1 + (+dbQuery.forcast_inc_stmt[index].salesGrowthRate / 100));
                var costOfSales = ((sales * +dbQuery.forcast_inc_stmt[index].cogs) / 100);
                var ebitda = ((sales * +dbQuery.forcast_inc_stmt[index].ebitdaMargin) / 100);
                var depreciation = (((+this.workBalSheet[index].netFixedAsset + +dbQuery.forcast_bal_sheet[index].fixedAssets) * +dbQuery.forcast_inc_stmt[index].depreciationRate) / 100);
                var netFixedAsset = +this.workBalSheet[index].netFixedAsset + +dbQuery.forcast_bal_sheet[index].fixedAssets - depreciation;
                var netProfit = ((sales * +dbQuery.forcast_inc_stmt[index].netProfitMargin) / 100);
                var receivable = ((sales * +dbQuery.forcast_rip_days.receivableDays) / 365);
                var inventories = ((costOfSales * +dbQuery.forcast_rip_days.inventoryDays) / 365);
                var payables = ((costOfSales * +dbQuery.forcast_rip_days.payableDays) / 365);
                var debtLoan = +dbQuery.forcast_bal_sheet[index].debtLoan + +this.workBalSheet[index].debtLoan;
                var interestExpense = ((debtLoan * +dbQuery.forcast_inc_stmt[index].interestRate) / 100);
                var equity = +this.workBalSheet[index].equity;
                var fixedAsset = +dbQuery.forcast_bal_sheet[index].fixedAssets;
                this.workCashFlowStmt.push(new back_end_model_1.WorkCashFlowStmt(netProfit, depreciation, this.workBalSheet[index].receivable - receivable, this.workBalSheet[index].inventory - inventories, payables - this.workBalSheet[index].payable, 0 - dbQuery.forcast_bal_sheet[index].fixedAssets, debtLoan - this.workBalSheet[index].debtLoan, equity - this.workBalSheet[index].equity, +this.workBalSheet[index].cashBalance));
                this.workIncStmt.push(new back_end_model_1.WorkIncStmt(year, sales, costOfSales, ebitda, depreciation, interestExpense, netProfit));
                this.workBalSheet.push(new back_end_model_1.WorkBalSheet(receivable, inventories, payables, netFixedAsset, debtLoan, equity, +this.workCashFlowStmt[index].yearEndCash, fixedAsset));
            }
        };
        return BackEndService_1;
    }());
    __setFunctionName(_classThis, "BackEndService");
    return BackEndService = _classThis;
}();





