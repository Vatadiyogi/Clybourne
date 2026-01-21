// load model
const jwt = require("jsonwebtoken");
const CustomersModel = require("../models/customers.model");
const PlanModel = require("../models/plan.model");
const PlanRecoredModel = require("../models/plan-record.model");

exports.planvalidate = async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization;
    const secretKey = process.env.ENCRYPTION_KEY;
    const payload = jwt.verify(token, secretKey, async (error, decoded) => {
      if (error) {
        return res.json({'status': false, 'message': error, 'data': []});
      }
      
      if (decoded && decoded.userId) {
        let user = await CustomersModel.findOne({ _id: decoded.userId });
        if (!user) {
          return res.json({'status': false, 'message': 'USER_NOT_FOUND', 'data': []});
        }

        if(user.activePlanId === null){
          return res.status(500).json({'status': false, 'message': "User has no plan.", 'data': []});
        }

        let plan = await PlanModel.findOne({ _id: user.activePlanId });
        if (!plan) {
          return res.json({'status': false, 'message': 'PLAN_NOT_FOUND', 'data': []});
        }
        
        let planrecord = await PlanRecoredModel.find({ planId: user.activePlanId, userId: decoded.userId });
        if (!planrecord) {
          return res.json({'status': false, 'message': 'ACTIVE_PLAN_NOT_FOUND', 'data': []});
        }

        if(!planrecord.isActive){
          return res.json({'status': false, 'message': 'PLAN_EXPIRED', 'data': []});
        }
          
        res.locals.planId = user.activePlanId;
        next();
      } else {
        return res.json({'status': false, 'message': 'INVALID_ACCESS_TOKEN', 'data': []});
      }
    });
  } else {
    return res.json({'status': false, 'message': 'ACCESS_TOKEN_MISSING', 'data': []});
  }
};