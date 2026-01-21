"use strict";

var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryService = void 0;

var QueryService = exports.QueryService = function () {
    
    var _classThis;
    var QueryService = _classThis = /** @class */ (function () {
        function QueryService_1() {
            this.queries = [];
            this.businessInfo = null;
            this.contactInfo = null;
            this.financeInfo = null;
            this.forcastBalanceSheet = [];
            this.forcastIncomeStatmentInfo = [];
            this.forcastRIPDays = null;
            this.queryInfo = null;
        }
        QueryService_1.prototype.setQueriesList = function (queries) {
            this.queries = queries;
        };
        QueryService_1.prototype.getQueriesList = function () {
            return this.queries.slice();
        };
        QueryService_1.prototype.getQueryFromList = function (key) {
            for (var _i = 0, _a = this.queries; _i < _a.length; _i++) {
                var query = _a[_i];
                if ((query.key !== null) && (query.key === key)) {
                    return query;
                }
            }
            return null;
        };
        QueryService_1.prototype.setForcastBalanceSheet = function (info) {
            this.forcastBalanceSheet = info;
        };
        QueryService_1.prototype.addForcastBalanceSheet = function (info) {
            this.forcastBalanceSheet.push(info);
        };
        QueryService_1.prototype.getForcastBalanceSheet = function () {
            return this.forcastBalanceSheet.slice();
        };
        QueryService_1.prototype.setForcastIncomeStatmentInfo = function (info) {
            this.forcastIncomeStatmentInfo = info;
        };
        QueryService_1.prototype.addForcastIncomeStatmentInfo = function (info) {
            this.forcastIncomeStatmentInfo.push(info);
        };
        QueryService_1.prototype.getForcastIncomeStatmentInfo = function () {
            return this.forcastIncomeStatmentInfo.slice();
        };
        QueryService_1.prototype.setForcastRIPDays = function (info) {
            this.forcastRIPDays = info;
        };
        QueryService_1.prototype.getForcastRIPDays = function () {
            return this.forcastRIPDays;
        };
        QueryService_1.prototype.setQueryInfo = function (info) {
            this.queryInfo = info;
        };
        QueryService_1.prototype.getQueryInfo = function () {
            return this.queryInfo;
        };
        QueryService_1.prototype.setCompanyContactInfo = function (info) {
            this.contactInfo = info;
        };
        QueryService_1.prototype.getCompanyContactInfo = function () {
            return this.contactInfo;
        };
        QueryService_1.prototype.setCompanyBusinessInfo = function (info) {
            this.businessInfo = info;
        };
        QueryService_1.prototype.getCompanyBusinessInfo = function () {
            return this.businessInfo;
        };
        QueryService_1.prototype.setCompanyFinanceInfo = function (info) {
            this.financeInfo = info;
        };
        QueryService_1.prototype.getCompanyFinanceInfo = function () {
            return this.financeInfo;
        };
        return QueryService_1;
    }());
    __setFunctionName(_classThis, "QueryService");
    
    return QueryService = _classThis;
}();
