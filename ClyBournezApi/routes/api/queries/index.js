var router = require("express").Router();

var QueryModel = require("../../../models/query.model");
var BackEndService = require("../../../Calculations/back-end.service");
var DcfService = require("../../../Calculations/dcf.service");
var RelativeValuationService = require("../../../Calculations/relative-valuation.service");
var BackEndAvgService = require("../../../Calculations/back-end-avg-service");
var { verifyAccessToken } = require("../../../middleware/auth");
const UserSchema = require("../../../models/user.model");

// INDEX Show all Queries.
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const user = await UserSchema.findById(userId);
  var whereClause = {};
  if (!!user) {
    if (user.isAdmin) {
      whereClause = {}
    } else {
      whereClause = { 'matadata.userId': user._id }
    }
  } else {
    return res.status(500).json({ message: 'Internally server error' });
  }
  // console.log(whereClause);
  const queries = await QueryModel.find(whereClause);
  if (queries) {
    // console.log(queries);
    return res.status(200).json({ message: 'List of all Queries', queries });
  }
  else {
    return res.status(500).json({ message: 'Internal server error' });
  }
});


// CREATE new query to be created and updated in DB:
router.post("/", async (req, res) => {
  const query = new QueryModel(req.body);
  query.matadata = { userId: req.body.userId };
  try {
    const savedQuery = await query.save();
    res.json(savedQuery);
  } catch (err) {
    res.json({ message: err });
  }
});

// SHOW route: This will show the details of the query.
router.get("/:_id", async (req, res) => {
  const query = await QueryModel.findById(req.params._id);
  if (query) {
    // console.log(queries);
    const backEndService = new BackEndService.BackEndService(undefined, query);
    return res.status(200).json({
      message: 'Query Detail',
      query,
      workIncStmt: backEndService.workIncStmt,
      workBalSheet: backEndService.workBalSheet,
      workCashFlowStmt: backEndService.workCashFlowStmt
    });
  }
  else {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// UPDATE route: this will update the details 
router.put("/:_id", async (req, res) => {
  const { back_end_inputs, back_end_table } = req.body;
  const query = await QueryModel.findById(req.params._id);
  // const query = await QueryModel.findByIdAndUpdate(req.params._id, req.body);
  if (query) {
    query.back_end_inputs = back_end_inputs;
    query.back_end_table = back_end_table;
    const updatedQuery = await query.save();

    // console.log(back_end_table);
    const backEndAvgService = new BackEndAvgService.BackEndAvgService(back_end_table);
    // console.log(backEndAvgService);
    // console.log(queries);
    const backEndService = new BackEndService.BackEndService(backEndAvgService, query);
    const dcfService = new DcfService.DcfService(backEndService, query);
    
    // 🔧 FIX: Preserve existing checkbox values when updating back_end_table
    // Don't overwrite user's saved preferences with auto-checked values
    const existingCheckBoxes = query.checkBoxesValues || {};
    const relValService = new RelativeValuationService.RelativeValuationService(dcfService, backEndService, existingCheckBoxes);
    return res.status(200).json({
      message: 'Query Detail',
      query,
      workIncStmt: backEndService.workIncStmt,
      workBalSheet: backEndService.workBalSheet,
      workCashFlowStmt: backEndService.workCashFlowStmt,
      workBackEndInputs: backEndService.workBackEndInputs,
      workBackEndTableAvg: backEndService.workBackEndTableAvg,
      workDcfFCFF: dcfService.workDcfFCFF,
      companyEquityAvgValue: dcfService.companyEquityAvgValue,
      companyEquityMinValue: dcfService.companyEquityMinValue,
      companyEquityMaxValue: dcfService.companyEquityMaxValue,
      terminalFCFF: dcfService.terminalFCFF,
      terminalPresentFCFF: dcfService.terminalPresentFCFF,
      wacc: dcfService.wacc,
      PE: relValService.PE,
      PE_1: relValService.PE_1,
      PS: relValService.PS,
      PS_1: relValService.PS_1,
      EV_SALES: relValService.EV_SALES,
      EV_SALES_1: relValService.EV_SALES_1,
      EV_EBITDA: relValService.EV_EBITDA,
      EV_EBITDA_1: relValService.EV_EBITDA_1,
      EnterpriseAvgValue: relValService.EnterpriseAvgValue,
      EnterpriseMinValue: relValService.EnterpriseMinValue,
      EnterpriseMaxValue: relValService.EnterpriseMaxValue,
      ValuationCheckBox: relValService.ValuationCheckBox,
      RelativeWeightPercent: relValService.RelativeWeightPercent,
      netDebt: relValService.netDebt
    });
  }
  else {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// DESTROY route : this will destroy the route.
router.delete("/:_id", async (req, res) => {
  console.log("DELETE REQUEST");
  const query = await QueryModel.findByIdAndDelete(req.params._id);
  if (query) {
    // console.log(queries);
    return res.status(200).json({ message: 'Query Detail', query });
  }
  else {
    return res.status(500).json({ message: 'Internal server error' });
  }
});


// TriggerWork route: This will Trigger the calculation.
// This request will have query id in the path and checkBoxValues in the body.
router.get("/:_id/work", async (req, res) => {
  console.log("WORK TRIGGERED");
  const query = await QueryModel.findById(req.params._id);
  if (query) {
    const backEndAvgService = new BackEndAvgService.BackEndAvgService(query.back_end_table);
    const backEndService = new BackEndService.BackEndService(backEndAvgService, query);
    const dcfService = new DcfService.DcfService(backEndService, query);
    const checkBoxValues = req.body.checkBoxValues;
    // console.log(checkBoxValues);


    const relValService = new RelativeValuationService.RelativeValuationService(dcfService, backEndService, checkBoxValues);
    return res.status(200).json({
      message: 'Complete Details of qork on Query',
      workIncStmt: backEndService.workIncStmt,
      workBalSheet: backEndService.workBalSheet,
      workCashFlowStmt: backEndService.workCashFlowStmt,
      workBackEndInputs: backEndService.workBackEndInputs,
      workBackEndTableAvg: backEndService.workBackEndTableAvg,
      workDcfFCFF: dcfService.workDcfFCFF,
      companyEquityAvgValue: dcfService.companyEquityAvgValue,
      companyEquityMinValue: dcfService.companyEquityMinValue,
      companyEquityMaxValue: dcfService.companyEquityMaxValue,
      terminalFCFF: dcfService.terminalFCFF,
      terminalPresentFCFF: dcfService.terminalPresentFCFF,
      wacc: dcfService.wacc,
      PE: relValService.PE,
      PE_1: relValService.PE_1,
      PS: relValService.PS,
      PS_1: relValService.PS_1,
      EV_SALES: relValService.EV_SALES,
      EV_SALES_1: relValService.EV_SALES_1,
      EV_EBITDA: relValService.EV_EBITDA,
      EV_EBITDA_1: relValService.EV_EBITDA_1,
      EnterpriseAvgValue: relValService.EnterpriseAvgValue,
      EnterpriseMinValue: relValService.EnterpriseMinValue,
      EnterpriseMaxValue: relValService.EnterpriseMaxValue,
      ValuationCheckBox: relValService.ValuationCheckBox,
      RelativeWeightPercent: relValService.RelativeWeightPercent,
      netDebt: relValService.netDebt
    });
  }
  else {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// API To update the state of the query.
// This request will have query Id in the path and state String in the body.
router.put("/:_id/state", async (req, res) => {
  console.log("Changing state of query with id:" + req.params._id + " to " + req.body.state);
  try {
    const query = await QueryModel.findByIdAndUpdate(req.params._id, { matadata: { state: req.body.state } });
    if (query) {
      return res.json({ message: 'Query not found' });
    }
    else {
      return res.status(500).json({ message: 'Query not found' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ Success: false, message: 'Some error occured', error: err });
  }
});

module.exports = router;
