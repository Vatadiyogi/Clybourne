"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelativeValuation = void 0;
var RelativeValuation = /** @class */ (function () {
    function RelativeValuation(netValue, cmpnyDiscFactor, multipleFactor, netDebt) {
        this.netValue = netValue;
        this.cmpnyDiscFactor = cmpnyDiscFactor;
        this.multipleFactor = multipleFactor;
        this.netDebt = netDebt;
        this.adjMultipleFactor = multipleFactor * (1 - (cmpnyDiscFactor / 100));
        this.minEntValue = netValue * this.adjMultipleFactor * 0.9;
        this.maxEntValue = netValue * this.adjMultipleFactor * 1.1;
        this.enterpriseValue = netValue * this.adjMultipleFactor;
        if (this.enterpriseValue < 0) {
            this.enterpriseValue = 0;
        }
        this.minEqValue = this.minEntValue;
        this.maxEqValue = this.maxEntValue;
        if (!!netDebt) {
            this.minEqValue = this.minEqValue - netDebt;
            this.maxEqValue = this.maxEqValue - netDebt;
        }
        if (this.enterpriseValue > 0) {
            if (!netDebt) {
                this.equityValue = this.enterpriseValue;
            }
            else {
                this.equityValue = this.enterpriseValue - netDebt;
            }
        }
        else {
            this.equityValue = 0;
        }
    }
    return RelativeValuation;
}());
exports.RelativeValuation = RelativeValuation;
