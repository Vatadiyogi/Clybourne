"use strict";

var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};

Object.defineProperty(exports, "__esModule", { value: true });
exports.BackEndAvgService = void 0;
var query_model_1 = require("./query.model");
var BackEndAvgService = exports.BackEndAvgService = function () {
    var _classThis;
    var BackEndAvgService = _classThis = /** @class */ (function () {
        function BackEndAvgService_1(data) {
            this.workBackEndTableAvg = null;
            this.pe_index = 4;
            this.ps_index = 6;
            this.ev_sales_index = 8;
            this.ev_ebitda_index = 10;
            this.beta_index = 12;
            this.de_index = 13;
            this.tax_rate_index = 14;
            this.un_lev_beta_index = 15;
            this.avgRow = ["Average", "", "", "", 0, 0, 0, 0, 0, 0, 0, 0, "", "", "", 0];
            this.sumRow = ["Sum", "", "", "", 0, 0, 0, 0, 0, 0, 0, 0, "", "", "", 0];
            this.counterRow = ["Count", "", "", "", 0, 0, 0, 0, 0, 0, 0, 0, "", "", "", 0];
            this.setWorkTableAvg(data);
        }
        BackEndAvgService_1.prototype.CheckValidData = function (item) {
            if (isNaN(+item)) {
                return false;
            }
            if (item == "") {
                return false;
            }
            return true;
        };
        BackEndAvgService_1.prototype.setWorkTableAvg = function (value) {
            var _this = this;

            this.sumRow[this.pe_index] = 0;
            this.sumRow[this.pe_index + 1] = 0;
            this.sumRow[this.ps_index] = 0;
            this.sumRow[this.ps_index + 1] = 0;
            this.sumRow[this.ev_sales_index] = 0;
            this.sumRow[this.ev_sales_index + 1] = 0;
            this.sumRow[this.ev_ebitda_index] = 0;
            this.sumRow[this.ev_ebitda_index + 1] = 0;
            this.sumRow[this.un_lev_beta_index] = 0;
            this.counterRow[this.pe_index] = 0;
            this.counterRow[this.pe_index + 1] = 0;
            this.counterRow[this.ps_index] = 0;
            this.counterRow[this.ps_index + 1] = 0;
            this.counterRow[this.ev_sales_index] = 0;
            this.counterRow[this.ev_sales_index + 1] = 0;
            this.counterRow[this.ev_ebitda_index] = 0;
            this.counterRow[this.ev_ebitda_index + 1] = 0;
            this.counterRow[this.un_lev_beta_index] = 0;
            value.forEach(function (row_data) {
                var row = Array.isArray(row_data)
                    ? row_data.map(function (cell) { return typeof cell === "string" ? cell.trim() : (cell != null ? String(cell).trim() : ""); })
                    : row_data;
                if (!Array.isArray(row) || row.length < _this.avgRow.length - 2) {
                    if (row.length > 1) {
                        console.log("Error in row with length : " + row.length);
                        console.log(row);
                    }
                }
                else {
                    // this.displayedColumns.forEach((a, index)=>{row[a]= row_data.split('\t')[index]});
                    if (row.length == _this.un_lev_beta_index) {
                        row.push("");
                    }
                    if (
                        _this.CheckValidData(row[_this.beta_index])
                        && _this.CheckValidData(row[_this.de_index])
                        && _this.CheckValidData(row[_this.tax_rate_index])
                    ) {
                        row[_this.un_lev_beta_index] = +row[_this.beta_index] / (1 + (+row[_this.de_index] * (1 - +row[_this.tax_rate_index])));
                    }
                    else {
                        row[_this.un_lev_beta_index] = "NM";
                    }
                    if (_this.CheckValidData(row[_this.pe_index])) {
                        // console.log(+row[this.pe_index])
                        _this.sumRow[_this.pe_index] += +row[_this.pe_index];
                        _this.counterRow[_this.pe_index]++;
                    }
                    if (_this.CheckValidData(row[_this.pe_index + 1])) {
                        // console.log(+row[this.pe_index + 1])
                        _this.sumRow[_this.pe_index + 1] += +row[_this.pe_index + 1];
                        _this.counterRow[_this.pe_index + 1]++;
                    }
                    if (_this.CheckValidData(row[_this.ps_index])) {
                        // console.log(+row[this.ps_index])
                        _this.sumRow[_this.ps_index] += +row[_this.ps_index];
                        _this.counterRow[_this.ps_index]++;
                    }
                    if (_this.CheckValidData(row[_this.ps_index + 1])) {
                        // console.log(+row[this.ps_index + 1])
                        _this.sumRow[_this.ps_index + 1] += +row[_this.ps_index + 1];
                        _this.counterRow[_this.ps_index + 1]++;
                    }
                    if (_this.CheckValidData(row[_this.ev_sales_index])) {
                        // console.log(+row[this.ev_sales_index])
                        _this.sumRow[_this.ev_sales_index] += +row[_this.ev_sales_index];
                        _this.counterRow[_this.ev_sales_index]++;
                    }
                    if (_this.CheckValidData(row[_this.ev_sales_index + 1])) {
                        // console.log(+row[this.ev_sales_index + 1])
                        _this.sumRow[_this.ev_sales_index + 1] += +row[_this.ev_sales_index + 1];
                        _this.counterRow[_this.ev_sales_index + 1]++;
                    }
                    if (_this.CheckValidData(row[_this.ev_ebitda_index])) {
                        // console.log(+row[this.ev_ebitda_index])
                        _this.sumRow[_this.ev_ebitda_index] += +row[_this.ev_ebitda_index];
                        _this.counterRow[_this.ev_ebitda_index]++;
                    }
                    if (_this.CheckValidData(row[_this.ev_ebitda_index + 1])) {
                        // console.log(+row[this.ev_ebitda_index + 1])
                        _this.sumRow[_this.ev_ebitda_index + 1] += +row[_this.ev_ebitda_index + 1];
                        _this.counterRow[_this.ev_ebitda_index + 1]++;
                    }
                    if (_this.CheckValidData(row[_this.un_lev_beta_index])) {
                        // console.log(+row[this.un_lev_beta_index])
                        _this.sumRow[_this.un_lev_beta_index] += +row[_this.un_lev_beta_index];
                        _this.counterRow[_this.un_lev_beta_index]++;
                    }
                }
            });
            this.avgRow[this.pe_index] = this.counterRow[this.pe_index] > 0 ? this.sumRow[this.pe_index] / this.counterRow[this.pe_index] : NaN;
            this.avgRow[this.pe_index + 1] = this.counterRow[this.pe_index + 1] > 0 ? this.sumRow[this.pe_index + 1] / this.counterRow[this.pe_index + 1] : NaN;
            this.avgRow[this.ps_index] = this.counterRow[this.ps_index] > 0 ? this.sumRow[this.ps_index] / this.counterRow[this.ps_index] : NaN;
            this.avgRow[this.ps_index + 1] = this.counterRow[this.ps_index + 1] > 0 ? this.sumRow[this.ps_index + 1] / this.counterRow[this.ps_index + 1] : NaN;
            this.avgRow[this.ev_sales_index] = this.counterRow[this.ev_sales_index] > 0 ? this.sumRow[this.ev_sales_index] / this.counterRow[this.ev_sales_index] : NaN;
            this.avgRow[this.ev_sales_index + 1] = this.counterRow[this.ev_sales_index + 1] > 0 ? this.sumRow[this.ev_sales_index + 1] / this.counterRow[this.ev_sales_index + 1] : NaN;
            this.avgRow[this.ev_ebitda_index] = this.counterRow[this.ev_ebitda_index] > 0 ? this.sumRow[this.ev_ebitda_index] / this.counterRow[this.ev_ebitda_index] : NaN;
            this.avgRow[this.ev_ebitda_index + 1] = this.counterRow[this.ev_ebitda_index + 1] > 0 ? this.sumRow[this.ev_ebitda_index + 1] / this.counterRow[this.ev_ebitda_index + 1] : NaN;
            this.avgRow[this.un_lev_beta_index] = this.counterRow[this.un_lev_beta_index] > 0 ? this.sumRow[this.un_lev_beta_index] / this.counterRow[this.un_lev_beta_index] : NaN;
            this.workBackEndTableAvg = new query_model_1.BackEndTableAvg(
                this.CheckValidData(this.avgRow[this.pe_index]) ? this.avgRow[this.pe_index] : NaN,
                this.CheckValidData(this.avgRow[this.pe_index + 1]) ? this.avgRow[this.pe_index + 1] : NaN,
                this.CheckValidData(this.avgRow[this.ps_index]) ? this.avgRow[this.ps_index] : NaN,
                this.CheckValidData(this.avgRow[this.ps_index + 1]) ? this.avgRow[this.ps_index + 1] : NaN,
                this.CheckValidData(this.avgRow[this.ev_sales_index]) ? this.avgRow[this.ev_sales_index] : NaN,
                this.CheckValidData(this.avgRow[this.ev_sales_index + 1]) ? this.avgRow[this.ev_sales_index + 1] : NaN,
                this.CheckValidData(this.avgRow[this.ev_ebitda_index]) ? this.avgRow[this.ev_ebitda_index] : NaN,
                this.CheckValidData(this.avgRow[this.ev_ebitda_index + 1]) ? this.avgRow[this.ev_ebitda_index + 1] : NaN,
                this.CheckValidData(this.avgRow[this.un_lev_beta_index]) ? this.avgRow[this.un_lev_beta_index] : NaN
            );
            // console.log(this.avgRow)
        };
        return BackEndAvgService_1;
    }());
    __setFunctionName(_classThis, "BackEndAvgService");
    return BackEndAvgService = _classThis;
}();
