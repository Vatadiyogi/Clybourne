"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkCashFlowStmt = exports.WorkBalSheet = exports.WorkIncStmt = void 0;
var WorkIncStmt = /** @class */ (function () {
    function WorkIncStmt(year, sales, cogs, ebitda, depreciation, intExp, netProfit) {
        this.year = year;
        this.sales = sales;
        this.cogs = cogs;
        this.ebitda = ebitda;
        this.depreciation = depreciation;
        this.intExp = intExp;
        this.netProfit = netProfit;
        this.ebit = ebitda - depreciation;
        this.ebt = this.ebit - intExp;
    }
    return WorkIncStmt;
}());
exports.WorkIncStmt = WorkIncStmt;
var WorkBalSheet = /** @class */ (function () {
    function WorkBalSheet(receivable, inventory, payable, netFixedAsset, debtLoan, equity, cashBalance, fixedAsset) {
        this.receivable = receivable;
        this.inventory = inventory;
        this.payable = payable;
        this.netFixedAsset = netFixedAsset;
        this.debtLoan = debtLoan;
        this.equity = equity;
        this.cashBalance = cashBalance;
        this.fixedAsset = fixedAsset;
        this.workingCapital = (receivable + inventory) - payable;
    }
    return WorkBalSheet;
}());
exports.WorkBalSheet = WorkBalSheet;
var WorkCashFlowStmt = /** @class */ (function () {
    function WorkCashFlowStmt(netProfit, depreciation, receivable, inventory, payable, capExp, debtChange, equityFund, yearBegnCash) {
        this.netProfit = netProfit;
        this.depreciation = depreciation;
        this.receivable = receivable;
        this.inventory = inventory;
        this.payable = payable;
        this.capExp = capExp;
        this.debtChange = debtChange;
        this.equityFund = equityFund;
        this.yearBegnCash = yearBegnCash;
        this.cashMovement = netProfit + depreciation + receivable + inventory + payable + capExp + debtChange;
        this.netCashMovement = this.cashMovement + equityFund;
        this.yearEndCash = this.netCashMovement + yearBegnCash;
    }
    return WorkCashFlowStmt;
}());
exports.WorkCashFlowStmt = WorkCashFlowStmt;
