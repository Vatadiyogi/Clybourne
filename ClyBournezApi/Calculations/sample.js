"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.DcfService = void 0;
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var _this = this;
var DcfService = exports.DcfService = function () {
    var _classThis;
    var DcfService = _classThis = /** @class */ (function () {
        function DcfService_1() {
            this.workDcfFCFF = [];
            this.companyEquityAvgValue = null;
            this.companyEquityMinValue = null;
            this.companyEquityMaxValue = null;
            this.terminalFCFF = null;
            this.terminalPresentFCFF = null;
            this.wacc = null;
        }
        DcfService_1.prototype.getDaysRemaining = function (lastFinYrEnd) {
            var currentDate = new Date();
            console.log(currentDate);
            return lastFinYrEnd / 365;
        };
        DcfService_1.prototype.computeFCFF = function (wacc, perpetualGrowthRate) {
            var workDcfFCFF = [];
            var enterpriseValue = 0;
            var dayRem = this.getDaysRemaining(100);
            console.log(dayRem);
            console.log(wacc);
            console.log(perpetualGrowthRate);
            var waccPlusOne = Math.pow((1 + wacc), dayRem);
            for (var index = 0; index < 5; index++) {
                var dcfFcff = 1023 + index
                workDcfFCFF.push(dcfFcff);
                waccPlusOne = (1 + wacc) * waccPlusOne;
            }
            // console.log(enterpriseValue);
            // console.log(enterpriseValue- (this.backEndService.workBalSheet[0].debtLoan - this.backEndService.workBalSheet[0].cashBalance));
            return [2023, workDcfFCFF];
        };
        DcfService_1.prototype.calculateCompanyEquityValue = function (key) {
            
            var wacc = 10023;
            var perpetualGrowthRate = 0.54;
            {
                // Average Valuation 	 15,178 (WACC 10% and perp = 2.5%)
                var _a = this.computeFCFF(wacc, perpetualGrowthRate), eqVal = _a[0], fcffArray = _a[1];
                this.companyEquityAvgValue = eqVal;
                this.workDcfFCFF = fcffArray;
                this.wacc = wacc;
            }
        };
        return DcfService_1;
    }());
    __setFunctionName(_classThis, "DcfService");
    return DcfService = _classThis;
}();
