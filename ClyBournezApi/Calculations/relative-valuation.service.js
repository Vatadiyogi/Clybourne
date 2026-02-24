"use strict";
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};

Object.defineProperty(exports, "__esModule", { value: true });
exports.RelativeValuationService = void 0;

var relative_valuation_model_1 = require("./relative-valuation.model");
var RelativeValuationService = exports.RelativeValuationService = function () {
    var _classThis;
    var RelativeValuationService = _classThis = /** @class */ (function () {
        function RelativeValuationService_1(dcfService, backEndService, checkBoxValues) {
            this.dcfService = dcfService;
            this.backEndService = backEndService;
            this.PE = null;
            this.PE_1 = null;
            this.PS = null;
            this.PS_1 = null;
            this.EV_SALES = null;
            this.EV_SALES_1 = null;
            this.EV_EBITDA = null;
            this.EV_EBITDA_1 = null;
            this.EnterpriseAvgValue = null;
            this.EnterpriseMinValue = null;
            this.EnterpriseMaxValue = null;
            this.ValuationCheckBox = null;
            this.RelativeWeightPercent = null;
            this.netDebt = null;

            this.weightAvgEquityValue = null;
            this.weightMinEquityValue = null;
            this.weightMaxEquityValue = null;

            this.populateRelativeValuation();
            this.calculateSummaryValuation(checkBoxValues);
        }

        RelativeValuationService_1.prototype.populateRelativeValuation = function () {
            if ((this.backEndService.workBalSheet.length == 0)
                || (this.backEndService.workCashFlowStmt.length == 0)
                || (this.backEndService.workIncStmt.length == 0)) {
                return;
            }

            var netDebt = this.backEndService.workBalSheet[0].debtLoan - this.backEndService.workBalSheet[0].cashBalance;
            this.PE = new relative_valuation_model_1.RelativeValuation(this.backEndService.workIncStmt[0].netProfit, this.backEndService.workBackEndInputs.cmpnyDiscFactor, this.backEndService.workBackEndTableAvg.pe);
            this.PE_1 = new relative_valuation_model_1.RelativeValuation(this.backEndService.workIncStmt[1].netProfit, this.backEndService.workBackEndInputs.cmpnyDiscFactor, this.backEndService.workBackEndTableAvg.pe_1);
            this.PS = new relative_valuation_model_1.RelativeValuation(this.backEndService.workIncStmt[0].sales, this.backEndService.workBackEndInputs.cmpnyDiscFactor, this.backEndService.workBackEndTableAvg.ps);
            this.PS_1 = new relative_valuation_model_1.RelativeValuation(this.backEndService.workIncStmt[1].sales, this.backEndService.workBackEndInputs.cmpnyDiscFactor, this.backEndService.workBackEndTableAvg.ps_1);
            this.EV_SALES = new relative_valuation_model_1.RelativeValuation(this.backEndService.workIncStmt[0].sales, this.backEndService.workBackEndInputs.cmpnyDiscFactor, this.backEndService.workBackEndTableAvg.evs, netDebt);
            this.EV_SALES_1 = new relative_valuation_model_1.RelativeValuation(this.backEndService.workIncStmt[1].sales, this.backEndService.workBackEndInputs.cmpnyDiscFactor, this.backEndService.workBackEndTableAvg.evs_1, netDebt);
            this.EV_EBITDA = new relative_valuation_model_1.RelativeValuation(this.backEndService.workIncStmt[0].ebitda, this.backEndService.workBackEndInputs.cmpnyDiscFactor, this.backEndService.workBackEndTableAvg.ev_ebitda, netDebt);
            this.EV_EBITDA_1 = new relative_valuation_model_1.RelativeValuation(this.backEndService.workIncStmt[1].ebitda, this.backEndService.workBackEndInputs.cmpnyDiscFactor, this.backEndService.workBackEndTableAvg.ev_ebitda_1, netDebt);
            this.netDebt = netDebt;
        };
        // older
        // RelativeValuationService_1.prototype.calculateSummaryValuation = function (checkBoxValues) {
        //     if (!this.netDebt) {
        //         return;
        //     }
        //     // FIrst check and populate checkbox
        //     var checkBoxValuesLocal = checkBoxValues;
        //     if (!checkBoxValuesLocal) {
        //         checkBoxValuesLocal = {
        //             "checkBoxPE": (this.PE.equityValue > 0),
        //             "includeCheckBoxPE": false,
        //             "checkBoxPE_1": (this.PE_1.equityValue > 0),
        //             "includeCheckBoxPE_1": false,
        //             "checkBoxPS": (this.PS.equityValue > 0),
        //             "includeCheckBoxPS": false,
        //             "checkBoxPS_1": (this.PS_1.equityValue > 0),
        //             "includeCheckBoxPS_1": false,
        //             "checkBoxEV_SALES": (this.EV_SALES.equityValue > 0),
        //             "includeCheckBoxEV_SALES": false,
        //             "checkBoxEV_SALES_1": (this.EV_SALES_1.equityValue > 0),
        //             "includeCheckBoxEV_SALES_1": false,
        //             "checkBoxEV_EBITDA": (this.EV_EBITDA.equityValue > 0),
        //             "includeCheckBoxEV_EBITDA": false,
        //             "checkBoxEV_EBITDA_1": (this.EV_EBITDA_1.equityValue > 0),
        //             "includeCheckBoxEV_EBITDA_1": false,
        //         };
        //     }else {                
        //         if (!checkBoxValuesLocal.checkBoxPE) {
        //             checkBoxValuesLocal.includeCheckBoxPE = false;
        //         }
        //         if (!checkBoxValuesLocal.checkBoxPE_1) {
        //             checkBoxValuesLocal.includeCheckBoxPE_1 = false;
        //         }
        //         if (!checkBoxValuesLocal.checkBoxPS) {
        //             checkBoxValuesLocal.includeCheckBoxPS = false;
        //         }
        //         if (!checkBoxValuesLocal.checkBoxPS_1) {
        //             checkBoxValuesLocal.includeCheckBoxPS_1 = false;
        //         }
        //         if (!checkBoxValuesLocal.checkBoxEV_SALES) {
        //             checkBoxValuesLocal.includeCheckBoxEV_SALES = false;
        //         }
        //         if (!checkBoxValuesLocal.checkBoxEV_SALES_1) {
        //             checkBoxValuesLocal.includeCheckBoxEV_SALES_1 = false;
        //         }
        //         if (!checkBoxValuesLocal.checkBoxEV_EBITDA) {
        //             checkBoxValuesLocal.includeCheckBoxEV_EBITDA = false;
        //         }
        //         if (!checkBoxValuesLocal.checkBoxEV_EBITDA_1) {
        //             checkBoxValuesLocal.includeCheckBoxEV_EBITDA_1 = false;
        //         }
        //     }

        //     var count = 0;
        //     if ((this.PE.equityValue > 0) && (checkBoxValuesLocal.checkBoxPE)) {
        //         count++;
        //     }

        //     if ((this.PE_1.equityValue > 0) && (checkBoxValuesLocal.checkBoxPE_1)) {
        //         count++;
        //     }

        //     if ((this.PS.equityValue > 0) && (checkBoxValuesLocal.checkBoxPS)) {
        //         count++;
        //     }

        //     if ((this.PS_1.equityValue > 0) && (checkBoxValuesLocal.checkBoxPS_1)) {
        //         count++;
        //     }

        //     if ((this.EV_SALES.equityValue > 0) && (checkBoxValuesLocal.checkBoxEV_SALES)) {
        //         count++;
        //     }

        //     if ((this.EV_SALES_1.equityValue > 0) && (checkBoxValuesLocal.checkBoxEV_SALES_1)) {
        //         count++;
        //     }

        //     if ((this.EV_EBITDA.equityValue > 0) && (checkBoxValuesLocal.checkBoxEV_EBITDA)) {
        //         count++;
        //     }

        //     if ((this.EV_EBITDA_1.equityValue > 0) && (checkBoxValuesLocal.checkBoxEV_EBITDA_1)) {
        //         count++;
        //     }

        //     // console.log("Equity Value:");
        //     // console.log(this.PE.equityValue);
        //     // console.log(this.PE_1.equityValue);
        //     // console.log(this.PS.equityValue);
        //     // console.log(this.PS_1.equityValue);
        //     // console.log(this.EV_SALES.equityValue);
        //     // console.log(this.EV_SALES_1.equityValue);
        //     // console.log(this.EV_EBITDA.equityValue);
        //     // console.log(this.EV_EBITDA_1.equityValue);

        //     // console.log("Include Checkboxes:");
        //     // console.log(checkBoxValuesLocal.includeCheckBoxPE);
        //     // console.log(checkBoxValuesLocal.includeCheckBoxPE_1);
        //     // console.log(checkBoxValuesLocal.includeCheckBoxPS);
        //     // console.log(checkBoxValuesLocal.includeCheckBoxPS_1);
        //     // console.log(checkBoxValuesLocal.includeCheckBoxEV_SALES);
        //     // console.log(checkBoxValuesLocal.includeCheckBoxEV_SALES_1);
        //     // console.log(checkBoxValuesLocal.includeCheckBoxEV_EBITDA);
        //     // console.log(checkBoxValuesLocal.includeCheckBoxEV_EBITDA_1);

        //     // console.log("Local Checkboxes:");
        //     // console.log(checkBoxValuesLocal.checkBoxPE);
        //     // console.log(checkBoxValuesLocal.checkBoxPE_1);
        //     // console.log(checkBoxValuesLocal.checkBoxPS);
        //     // console.log(checkBoxValuesLocal.checkBoxPS_1);
        //     // console.log(checkBoxValuesLocal.checkBoxEV_SALES);
        //     // console.log(checkBoxValuesLocal.checkBoxEV_SALES_1);
        //     // console.log(checkBoxValuesLocal.checkBoxEV_EBITDA);
        //     // console.log(checkBoxValuesLocal.checkBoxEV_EBITDA_1);

        //     // console.log("Count:" + count);

        //     this.RelativeWeightPercent = (1 - (this.backEndService.workBackEndInputs.dcfWeightPercentage / 100)) / count;
        //     this.ValuationCheckBox = checkBoxValuesLocal;
        //     var weightAvgEquityValue = 0;
        //     var weightMinEquityValue = 0;
        //     var weightMaxEquityValue = 0;

        //     weightAvgEquityValue += this.dcfService.companyEquityAvgValue * (this.backEndService.workBackEndInputs.dcfWeightPercentage / 100);
        //     weightMinEquityValue += this.dcfService.companyEquityMinValue * (this.backEndService.workBackEndInputs.dcfWeightPercentage / 100);
        //     weightMaxEquityValue += this.dcfService.companyEquityMaxValue * (this.backEndService.workBackEndInputs.dcfWeightPercentage / 100);

        //     if ((this.PE.equityValue > 0) && (checkBoxValuesLocal.checkBoxPE)) {
        //         weightAvgEquityValue += this.PE.equityValue * this.RelativeWeightPercent;
        //         weightMinEquityValue += this.PE.minEqValue * this.RelativeWeightPercent;
        //         weightMaxEquityValue += this.PE.maxEqValue * this.RelativeWeightPercent;
        //         this.PE.RelativeWeightPercent = this.RelativeWeightPercent * 100;
        //     }else{
        //         this.PE.RelativeWeightPercent = 0;
        //     }

        //     if ((this.PE_1.equityValue > 0) && (checkBoxValuesLocal.checkBoxPE_1)) {
        //         weightAvgEquityValue += this.PE_1.equityValue * this.RelativeWeightPercent;
        //         weightMinEquityValue += this.PE_1.minEqValue * this.RelativeWeightPercent;
        //         weightMaxEquityValue += this.PE_1.maxEqValue * this.RelativeWeightPercent;
        //         this.PE_1.RelativeWeightPercent = this.RelativeWeightPercent * 100;
        //     }else{
        //         this.PE_1.RelativeWeightPercent = 0;
        //     }

        //     if ((this.PS.equityValue > 0) && (checkBoxValuesLocal.checkBoxPS)) {
        //         weightAvgEquityValue += this.PS.equityValue * this.RelativeWeightPercent;
        //         weightMinEquityValue += this.PS.minEqValue * this.RelativeWeightPercent;
        //         weightMaxEquityValue += this.PS.maxEqValue * this.RelativeWeightPercent;
        //         this.PS.RelativeWeightPercent = this.RelativeWeightPercent * 100;
        //     }else{
        //         this.PS.RelativeWeightPercent = 0;
        //     }

        //     if ((this.PS_1.equityValue > 0) && (checkBoxValuesLocal.checkBoxPS_1)) {
        //         weightAvgEquityValue += this.PS_1.equityValue * this.RelativeWeightPercent;
        //         weightMinEquityValue += this.PS_1.minEqValue * this.RelativeWeightPercent;
        //         weightMaxEquityValue += this.PS_1.maxEqValue * this.RelativeWeightPercent;
        //         this.PS_1.RelativeWeightPercent = this.RelativeWeightPercent * 100;
        //     }else{
        //         this.PS_1.RelativeWeightPercent = 0;
        //     }

        //     if ((this.EV_SALES.equityValue > 0) && (checkBoxValuesLocal.checkBoxEV_SALES)) {
        //         weightAvgEquityValue += this.EV_SALES.equityValue * this.RelativeWeightPercent;
        //         weightMinEquityValue += this.EV_SALES.minEqValue * this.RelativeWeightPercent;
        //         weightMaxEquityValue += this.EV_SALES.maxEqValue * this.RelativeWeightPercent;
        //         this.EV_SALES.RelativeWeightPercent = this.RelativeWeightPercent * 100;
        //     }else{
        //         this.EV_SALES.RelativeWeightPercent = 0;
        //     }

        //     if ((this.EV_SALES_1.equityValue > 0) && (checkBoxValuesLocal.checkBoxEV_SALES_1)) {
        //         weightAvgEquityValue += this.EV_SALES_1.equityValue * this.RelativeWeightPercent;
        //         weightMinEquityValue += this.EV_SALES_1.minEqValue * this.RelativeWeightPercent;
        //         weightMaxEquityValue += this.EV_SALES_1.maxEqValue * this.RelativeWeightPercent;
        //         this.EV_SALES_1.RelativeWeightPercent = this.RelativeWeightPercent * 100;
        //     }else{
        //         this.EV_SALES_1.RelativeWeightPercent = 0;
        //     }

        //     if ((this.EV_EBITDA.equityValue > 0) && (checkBoxValuesLocal.checkBoxEV_EBITDA)) {
        //         weightAvgEquityValue += this.EV_EBITDA.equityValue * this.RelativeWeightPercent;
        //         weightMinEquityValue += this.EV_EBITDA.minEqValue * this.RelativeWeightPercent;
        //         weightMaxEquityValue += this.EV_EBITDA.maxEqValue * this.RelativeWeightPercent;
        //         this.EV_EBITDA.RelativeWeightPercent = this.RelativeWeightPercent * 100;
        //     }else{
        //         this.EV_EBITDA.RelativeWeightPercent = 0;
        //     }

        //     if ((this.EV_EBITDA_1.equityValue > 0) && (checkBoxValuesLocal.checkBoxEV_EBITDA_1)) {
        //         weightAvgEquityValue += this.EV_EBITDA_1.equityValue * this.RelativeWeightPercent;
        //         weightMinEquityValue += this.EV_EBITDA_1.minEqValue * this.RelativeWeightPercent;
        //         weightMaxEquityValue += this.EV_EBITDA_1.maxEqValue * this.RelativeWeightPercent;
        //         this.EV_EBITDA_1.RelativeWeightPercent = this.RelativeWeightPercent * 100;
        //     }else{
        //         this.EV_EBITDA_1.RelativeWeightPercent = 0;
        //     }

        //     this.weightAvgEquityValue = weightAvgEquityValue;
        //     this.weightMinEquityValue = weightMinEquityValue;
        //     this.weightMaxEquityValue = weightMaxEquityValue;

        //     this.EnterpriseAvgValue = weightAvgEquityValue + this.netDebt;
        //     this.EnterpriseMinValue = weightMinEquityValue + this.netDebt;
        //     this.EnterpriseMaxValue = weightMaxEquityValue + this.netDebt;
        // };
        // newer with -ver values
        // RelativeValuationService_1.prototype.calculateSummaryValuation = function (checkBoxValues) {
        //     console.log("=== DEBUG: Starting calculateSummaryValuation ===");

        //     // Check if we have netDebt
        //     if (!this.netDebt && this.netDebt !== 0) {
        //         console.log("❌ Skipping: netDebt is undefined or null");
        //         return;
        //     }

        //     // Initialize or use provided checkbox values
        //     var checkBoxValuesLocal = checkBoxValues || {};

        //     // 🔧 FIX: Auto-check base multiples that have values
        //     if (this.PE && this.PE.equityValue > 0) {
        //         checkBoxValuesLocal.checkBoxPE = true;
        //         console.log("✅ Auto-checked PE (has value:", this.PE.equityValue, ")");
        //     }
        //     if (this.PS && this.PS.equityValue > 0) {
        //         checkBoxValuesLocal.checkBoxPS = true;
        //         console.log("✅ Auto-checked PS (has value:", this.PS.equityValue, ")");
        //     }
        //     if (this.EV_SALES && this.EV_SALES.equityValue > 0) {
        //         checkBoxValuesLocal.checkBoxEV_SALES = true;
        //         console.log("✅ Auto-checked EV_SALES (has value:", this.EV_SALES.equityValue, ")");
        //     }
        //     if (this.EV_EBITDA && this.EV_EBITDA.equityValue > 0) {
        //         checkBoxValuesLocal.checkBoxEV_EBITDA = true;
        //         console.log("✅ Auto-checked EV_EBITDA (has value:", this.EV_EBITDA.equityValue, ")");
        //     }

        //     // Count selected methods
        //     var count = 0;
        //     var methods = [];

        //     if (this.PE && this.PE.equityValue > 0 && checkBoxValuesLocal.checkBoxPE) {
        //         count++; methods.push("PE");
        //     }
        //     if (this.PE_1 && this.PE_1.equityValue > 0 && checkBoxValuesLocal.checkBoxPE_1) {
        //         count++; methods.push("PE_1");
        //     }
        //     if (this.PS && this.PS.equityValue > 0 && checkBoxValuesLocal.checkBoxPS) {
        //         count++; methods.push("PS");
        //     }
        //     if (this.PS_1 && this.PS_1.equityValue > 0 && checkBoxValuesLocal.checkBoxPS_1) {
        //         count++; methods.push("PS_1");
        //     }
        //     if (this.EV_SALES && this.EV_SALES.equityValue > 0 && checkBoxValuesLocal.checkBoxEV_SALES) {
        //         count++; methods.push("EV_SALES");
        //     }
        //     if (this.EV_SALES_1 && this.EV_SALES_1.equityValue > 0 && checkBoxValuesLocal.checkBoxEV_SALES_1) {
        //         count++; methods.push("EV_SALES_1");
        //     }
        //     if (this.EV_EBITDA && this.EV_EBITDA.equityValue > 0 && checkBoxValuesLocal.checkBoxEV_EBITDA) {
        //         count++; methods.push("EV_EBITDA");
        //     }
        //     if (this.EV_EBITDA_1 && this.EV_EBITDA_1.equityValue > 0 && checkBoxValuesLocal.checkBoxEV_EBITDA_1) {
        //         count++; methods.push("EV_EBITDA_1");
        //     }

        //     console.log("Selected methods:", methods);
        //     console.log("Count:", count);

        //     // 🔧 FIX: Handle division by zero
        //     if (count === 0) {
        //         console.log("⚠️ No methods selected. Using DCF weight only.");
        //         this.RelativeWeightPercent = 0;
        //         this.ValuationCheckBox = checkBoxValuesLocal;

        //         // Use only DCF weight
        //         var dcfWeight = this.backEndService.workBackEndInputs.dcfWeightPercentage / 100;
        //         this.weightAvgEquityValue = this.dcfService.companyEquityAvgValue * dcfWeight;
        //         this.weightMinEquityValue = this.dcfService.companyEquityMinValue * dcfWeight;
        //         this.weightMaxEquityValue = this.dcfService.companyEquityMaxValue * dcfWeight;
        //     } else {
        //         // Normal calculation
        //         this.RelativeWeightPercent = (1 - (this.backEndService.workBackEndInputs.dcfWeightPercentage / 100)) / count;
        //         this.ValuationCheckBox = checkBoxValuesLocal;

        //         console.log("RelativeWeightPercent:", this.RelativeWeightPercent);
        //         console.log("DCF Weight:", this.backEndService.workBackEndInputs.dcfWeightPercentage);

        //         // Initialize weighted values with DCF portion
        //         var weightAvgEquityValue = this.dcfService.companyEquityAvgValue * (this.backEndService.workBackEndInputs.dcfWeightPercentage / 100);
        //         var weightMinEquityValue = this.dcfService.companyEquityMinValue * (this.backEndService.workBackEndInputs.dcfWeightPercentage / 100);
        //         var weightMaxEquityValue = this.dcfService.companyEquityMaxValue * (this.backEndService.workBackEndInputs.dcfWeightPercentage / 100);

        //         // Add relative valuation portions
        //         if (this.PE && this.PE.equityValue > 0 && checkBoxValuesLocal.checkBoxPE) {
        //             weightAvgEquityValue += this.PE.equityValue * this.RelativeWeightPercent;
        //             weightMinEquityValue += this.PE.minEqValue * this.RelativeWeightPercent;
        //             weightMaxEquityValue += this.PE.maxEqValue * this.RelativeWeightPercent;
        //             this.PE.RelativeWeightPercent = this.RelativeWeightPercent * 100;
        //         }
        //         // ... repeat for other methods ...

        //         this.weightAvgEquityValue = weightAvgEquityValue;
        //         this.weightMinEquityValue = weightMinEquityValue;
        //         this.weightMaxEquityValue = weightMaxEquityValue;
        //     }

        //     // Calculate enterprise values
        //     this.EnterpriseAvgValue = this.weightAvgEquityValue + this.netDebt;
        //     this.EnterpriseMinValue = this.weightMinEquityValue + this.netDebt;
        //     this.EnterpriseMaxValue = this.weightMaxEquityValue + this.netDebt;

        //     console.log("Final Results:");
        //     console.log("- weightAvgEquityValue:", this.weightAvgEquityValue);
        //     console.log("- weightMinEquityValue:", this.weightMinEquityValue);
        //     console.log("- weightMaxEquityValue:", this.weightMaxEquityValue);
        //     console.log("- netDebt:", this.netDebt);
        //     console.log("- EnterpriseAvgValue:", this.EnterpriseAvgValue);
        //     console.log("=== DEBUG: Ending calculateSummaryValuation ===");
        // };
        // latest
        RelativeValuationService_1.prototype.calculateSummaryValuation = function (checkBoxValues) {
            // console.log("=== DEBUG: Starting calculateSummaryValuation ===");

            // 1. Check if we have netDebt (allow 0 as valid)
            if (this.netDebt === undefined || this.netDebt === null) {
                // console.log("❌ Skipping: netDebt is undefined or null");
                return;
            }

            // console.log("netDebt:", this.netDebt);
            // console.log("DCF companyEquityAvgValue:", this.dcfService?.companyEquityAvgValue);
            // console.log("DCF weight:", this.backEndService.workBackEndInputs.dcfWeightPercentage);

            // 2. Initialize or use provided checkbox values
            var checkBoxValuesLocal = checkBoxValues || {};

            // 3. 🔧 FIX: Ensure all checkbox fields exist
            var checkboxFields = ['PE', 'PE_1', 'PS', 'PS_1', 'EV_SALES', 'EV_SALES_1', 'EV_EBITDA', 'EV_EBITDA_1'];
            checkboxFields.forEach(function (field) {
                var checkKey = 'checkBox' + (field.includes('_') ? field : field);
                var includeKey = 'includeCheckBox' + (field.includes('_') ? field : field);

                if (!checkBoxValuesLocal.hasOwnProperty(checkKey)) {
                    checkBoxValuesLocal[checkKey] = false;
                }
                if (!checkBoxValuesLocal.hasOwnProperty(includeKey)) {
                    checkBoxValuesLocal[includeKey] = checkBoxValuesLocal[checkKey];
                }
            });

            // console.log("Checkbox values after initialization:", checkBoxValuesLocal);

            // 4. ❌ REMOVED: Auto-check methods that have values
            // This was overriding user's saved checkbox preferences from the database!
            // The user explicitly saves checkbox values, so we must respect them.
            // Only initialize missing fields (done above), but don't force-check based on values.
            
            // Track which methods have valid values (for logging/debugging only)
            var methodsWithValues = [];
            if (this.PE && this.PE.equityValue > 0) methodsWithValues.push("PE");
            if (this.PS && this.PS.equityValue > 0) methodsWithValues.push("PS");
            if (this.EV_SALES && this.EV_SALES.equityValue > 0) methodsWithValues.push("EV_SALES");
            if (this.EV_EBITDA && this.EV_EBITDA.equityValue > 0) methodsWithValues.push("EV_EBITDA");
            
            // console.log("Methods with valid values (for reference only):", methodsWithValues);
            // console.log("Using checkbox values from database/user preferences:", checkBoxValuesLocal);

            // 5. Count selected methods
            var count = 0;
            var selectedMethods = [];

            var methodsToCheck = [
                { obj: this.PE, key: 'checkBoxPE', name: 'PE' },
                { obj: this.PE_1, key: 'checkBoxPE_1', name: 'PE_1' },
                { obj: this.PS, key: 'checkBoxPS', name: 'PS' },
                { obj: this.PS_1, key: 'checkBoxPS_1', name: 'PS_1' },
                { obj: this.EV_SALES, key: 'checkBoxEV_SALES', name: 'EV_SALES' },
                { obj: this.EV_SALES_1, key: 'checkBoxEV_SALES_1', name: 'EV_SALES_1' },
                { obj: this.EV_EBITDA, key: 'checkBoxEV_EBITDA', name: 'EV_EBITDA' },
                { obj: this.EV_EBITDA_1, key: 'checkBoxEV_EBITDA_1', name: 'EV_EBITDA_1' }
            ];

            methodsToCheck.forEach(function (method) {
                if (method.obj && method.obj.equityValue > 0 && checkBoxValuesLocal[method.key]) {
                    count++;
                    selectedMethods.push(method.name);
                }
            });

            // console.log("Selected methods:", selectedMethods);
            // console.log("Count:", count);

            // 6. Calculate weights
            var dcfWeightPercentage = this.backEndService.workBackEndInputs.dcfWeightPercentage || 0;
            var dcfWeight = dcfWeightPercentage / 100;

            // 🔧 FIX: Handle case when no methods selected
            if (count === 0) {
                this.RelativeWeightPercent = 0;
            } else {
                this.RelativeWeightPercent = (1 - dcfWeight) / count;
            }

            // console.log("DCF Weight:", dcfWeight);
            // console.log("RelativeWeightPercent:", this.RelativeWeightPercent);

            // 7. Initialize weighted values
            var weightAvgEquityValue = 0;
            var weightMinEquityValue = 0;
            var weightMaxEquityValue = 0;

            // 🔧 FIX: Handle negative DCF value
            var dcfValue = this.dcfService.companyEquityAvgValue || 0;
            if (dcfValue < 0) {
                // console.log("⚠️ Warning: DCF value is negative:", dcfValue);
                // Option: Use 0 if DCF is negative, or reduce its weight
                dcfValue = 0; // Or use Math.abs(dcfValue) if business logic allows
            }

            weightAvgEquityValue += dcfValue * dcfWeight;
            weightMinEquityValue += (this.dcfService.companyEquityMinValue || 0) * dcfWeight;
            weightMaxEquityValue += (this.dcfService.companyEquityMaxValue || 0) * dcfWeight;

            // console.log("DCF contribution:", dcfValue * dcfWeight);

            // 8. Add relative valuation portions
            methodsToCheck.forEach(function (method) {
                if (method.obj && method.obj.equityValue > 0 && checkBoxValuesLocal[method.key]) {
                    var relativeWeight = this.RelativeWeightPercent;

                    weightAvgEquityValue += (method.obj.equityValue || 0) * relativeWeight;
                    weightMinEquityValue += (method.obj.minEqValue || 0) * relativeWeight;
                    weightMaxEquityValue += (method.obj.maxEqValue || 0) * relativeWeight;

                    // 🔧 FIX: Always set RelativeWeightPercent
                    method.obj.RelativeWeightPercent = relativeWeight * 100;

                    // console.log("Added " + method.name + ":", method.obj.equityValue, "*", relativeWeight);
                } else {
                    // 🔧 FIX: Set to 0 even if not selected
                    if (method.obj) {
                        method.obj.RelativeWeightPercent = 0;
                    }
                }
            }.bind(this));

            // 9. Set final weighted values
            this.weightAvgEquityValue = weightAvgEquityValue;
            this.weightMinEquityValue = weightMinEquityValue;
            this.weightMaxEquityValue = weightMaxEquityValue;

            // console.log("Weighted values before netDebt:", {
            //     avg: this.weightAvgEquityValue,
            //     min: this.weightMinEquityValue,
            //     max: this.weightMaxEquityValue
            // });

            // 10. Calculate enterprise values
            this.EnterpriseAvgValue = (this.weightAvgEquityValue || 0) + (this.netDebt || 0);
            this.EnterpriseMinValue = (this.weightMinEquityValue || 0) + (this.netDebt || 0);
            this.EnterpriseMaxValue = (this.weightMaxEquityValue || 0) + (this.netDebt || 0);

            // 11. Set ValuationCheckBox with all fields
            this.ValuationCheckBox = checkBoxValuesLocal;

            // console.log("=== DEBUG: Final Results ===");
            // console.log("- weightAvgEquityValue:", this.weightAvgEquityValue);
            // console.log("- weightMinEquityValue:", this.weightMinEquityValue);
            // console.log("- weightMaxEquityValue:", this.weightMaxEquityValue);
            // console.log("- netDebt:", this.netDebt);
            // console.log("- EnterpriseAvgValue:", this.EnterpriseAvgValue);
            // console.log("- EnterpriseMinValue:", this.EnterpriseMinValue);
            // console.log("- EnterpriseMaxValue:", this.EnterpriseMaxValue);
            // console.log("- ValuationCheckBox:", this.ValuationCheckBox);
            // console.log("- RelativeWeightPercent:", this.RelativeWeightPercent);
            // console.log("=== END DEBUG ===");
        };
        return RelativeValuationService_1;
    }());
    __setFunctionName(_classThis, "RelativeValuationService");
    return RelativeValuationService = _classThis;
}();
