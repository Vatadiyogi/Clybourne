"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBQuery = exports.MataData = void 0;
var MataData = /** @class */ (function () {
    function MataData(creationTime, lastUpdateTime, state, userId) {
        this.creationTime = creationTime;
        this.lastUpdateTime = lastUpdateTime;
        this.state = state;
        this.userId = userId;
    }
    return MataData;
}());
exports.MataData = MataData;
var DBQuery = /** @class */ (function () {
    function DBQuery(key, matadata, business, contact, finance, forcast_inc_stmt, forcast_bal_sheet, forcast_rip_days, back_end_inputs, back_end_table_avg) {
        this.key = key;
        this.matadata = matadata;
        this.business = business;
        this.contact = contact;
        this.finance = finance;
        this.forcast_inc_stmt = forcast_inc_stmt;
        this.forcast_bal_sheet = forcast_bal_sheet;
        this.forcast_rip_days = forcast_rip_days;
        this.back_end_inputs = back_end_inputs;
        this.back_end_table_avg = back_end_table_avg;
    }
    return DBQuery;
}());
exports.DBQuery = DBQuery;
