"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackEndTableAvg = exports.BackEndInputs = exports.ValuationQueryInfo = exports.ForcastRIPDays = exports.ForcastBalanceSheet = exports.ForcastIncomeStatmentInfo = exports.FinanceInfo = exports.BusinessInfo = exports.ContactInfo = void 0;
var ContactInfo = /** @class */ (function () {
    function ContactInfo(name, email, phone) {
        this.name = name;
        this.email = email;
        this.phone = phone;
    }
    return ContactInfo;
}());
exports.ContactInfo = ContactInfo;
var BusinessInfo = /** @class */ (function () {
    function BusinessInfo(companyType, industryType, companyAge, developmentStage, country, currency, lastFinYrEnd, earningTrend, scalable, description) {
        this.companyType = companyType;
        this.industryType = industryType;
        this.companyAge = companyAge;
        this.developmentStage = developmentStage;
        this.country = country;
        this.currency = currency;
        this.lastFinYrEnd = lastFinYrEnd;
        this.earningTrend = earningTrend;
        this.scalable = scalable;
        this.description = description;
    }
    return BusinessInfo;
}());
exports.BusinessInfo = BusinessInfo;
var FinanceInfo = /** @class */ (function () {
    function FinanceInfo(dataYear, unitOfNumber, sales, costOfSales, ebitda, depreciation, interestExpense, netProfit, cashBalance, debtLoan, equity, receivables, inventories, payables, netFixedAssets) {
        this.dataYear = dataYear;
        this.unitOfNumber = unitOfNumber;
        this.sales = sales;
        this.costOfSales = costOfSales;
        this.ebitda = ebitda;
        this.depreciation = depreciation;
        this.interestExpense = interestExpense;
        this.netProfit = netProfit;
        this.cashBalance = cashBalance;
        this.debtLoan = debtLoan;
        this.equity = equity;
        this.receivables = receivables;
        this.inventories = inventories;
        this.payables = payables;
        this.netFixedAssets = netFixedAssets;
    }
    return FinanceInfo;
}());
exports.FinanceInfo = FinanceInfo;
var ForcastIncomeStatmentInfo = /** @class */ (function () {
    function ForcastIncomeStatmentInfo(salesGrowthRate, cogs, ebitdaMargin, interestRate, depreciationRate, netProfitMargin) {
        this.salesGrowthRate = salesGrowthRate;
        this.cogs = cogs;
        this.ebitdaMargin = ebitdaMargin;
        this.interestRate = interestRate;
        this.depreciationRate = depreciationRate;
        this.netProfitMargin = netProfitMargin;
    }
    return ForcastIncomeStatmentInfo;
}());
exports.ForcastIncomeStatmentInfo = ForcastIncomeStatmentInfo;
var ForcastBalanceSheet = /** @class */ (function () {
    function ForcastBalanceSheet(fixedAssets, debtLoan) {
        this.fixedAssets = fixedAssets;
        this.debtLoan = debtLoan;
    }
    return ForcastBalanceSheet;
}());
exports.ForcastBalanceSheet = ForcastBalanceSheet;
var ForcastRIPDays = /** @class */ (function () {
    function ForcastRIPDays(receivableDays, inventoryDays, payableDays) {
        this.receivableDays = receivableDays;
        this.inventoryDays = inventoryDays;
        this.payableDays = payableDays;
    }
    return ForcastRIPDays;
}());
exports.ForcastRIPDays = ForcastRIPDays;
var ValuationQueryInfo = /** @class */ (function () {
    function ValuationQueryInfo(id, state, timestamp, postRef) {
        this.id = id;
        this.state = state;
        this.timestamp = timestamp;
        this.postRef = postRef;
    }
    return ValuationQueryInfo;
}());
exports.ValuationQueryInfo = ValuationQueryInfo;
var BackEndInputs = /** @class */ (function () {
    function BackEndInputs(cmpnyDiscFactorAge, cmpnyDiscFactorProfiability, cmpnyDiscFactorTurnover, weightOfAdjBeta, alpha, perpetualGrowthRate, pptlDelta, waccDelta, treasuryondRate, equityRiskPremium, cntryRiskPremium, corpTaxRate, dcfWeightPercentage) {
        this.cmpnyDiscFactorAge = cmpnyDiscFactorAge;
        this.cmpnyDiscFactorProfiability = cmpnyDiscFactorProfiability;
        this.cmpnyDiscFactorTurnover = cmpnyDiscFactorTurnover;
        this.weightOfAdjBeta = weightOfAdjBeta;
        this.alpha = alpha;
        this.perpetualGrowthRate = perpetualGrowthRate;
        this.pptlDelta = pptlDelta;
        this.waccDelta = waccDelta;
        this.treasuryondRate = treasuryondRate;
        this.equityRiskPremium = equityRiskPremium;
        this.cntryRiskPremium = cntryRiskPremium;
        this.corpTaxRate = corpTaxRate;
        this.dcfWeightPercentage = dcfWeightPercentage;
        this.cmpnyDiscFactor = (cmpnyDiscFactorAge + cmpnyDiscFactorProfiability + cmpnyDiscFactorTurnover) / 3;
        this.weightOfMktBeta = 100 - weightOfAdjBeta;
    }
    return BackEndInputs;
}());
exports.BackEndInputs = BackEndInputs;
var BackEndTableAvg = /** @class */ (function () {
    function BackEndTableAvg(pe, pe_1, ps, ps_1, evs, evs_1, ev_ebitda, ev_ebitda_1, un_lev_beta) {
        this.pe = pe;
        this.pe_1 = pe_1;
        this.ps = ps;
        this.ps_1 = ps_1;
        this.evs = evs;
        this.evs_1 = evs_1;
        this.ev_ebitda = ev_ebitda;
        this.ev_ebitda_1 = ev_ebitda_1;
        this.un_lev_beta = un_lev_beta;
    }
    return BackEndTableAvg;
}());
exports.BackEndTableAvg = BackEndTableAvg;
