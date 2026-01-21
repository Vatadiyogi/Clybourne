"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkDcfFCFF = void 0;
var WorkDcfFCFF = /** @class */ (function () {
    function WorkDcfFCFF(year, ebitda, interestTaxImpactAdj, workCapChange, capex, waccPlusOne) {
        this.year = year;
        this.ebitda = ebitda;
        this.interestTaxImpactAdj = interestTaxImpactAdj;
        this.workCapChange = workCapChange;
        this.capex = capex;
        this.waccPlusOne = waccPlusOne;
        this.discountFactor = 1 / waccPlusOne;
        this.freeCashFlow = ebitda + interestTaxImpactAdj + workCapChange + capex;
        this.presentFreeCashFlow = this.freeCashFlow * this.discountFactor;
    }
    return WorkDcfFCFF;
}());
exports.WorkDcfFCFF = WorkDcfFCFF;
