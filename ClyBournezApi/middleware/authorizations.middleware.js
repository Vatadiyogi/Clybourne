// load model
const jwt = require("jsonwebtoken");
const CustomersModel = require("../models/customers.model");

exports.validate = async (req, res, next) => {
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
        
        // in case of inactive user
        if (user.status == 0) {
            return res.json({'status': false, 'message': 'INACTIVE_USER', 'data': []});
        }
          
        res.locals._id = decoded.userId;
        next();
      } else {
        return res.json({'status': false, 'message': 'INVALID_ACCESS_TOKEN', 'data': []});
      }
    });
  } else {
    return res.json({'status': false, 'message': 'ACCESS_TOKEN_MISSING', 'data': []});
  }
};

exports.verifyToken = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        status: false,
        message: 'ACCESS_TOKEN_MISSING'
      });
    }

    // Extract token (remove 'Bearer ' if present)
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    
    if (!token) {
      return res.status(401).json({
        status: false,
        message: 'ACCESS_TOKEN_MISSING'
      });
    }

    // Verify token
    const secretKey = process.env.ENCRYPTION_KEY || process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secretKey);
    
    // Check if decoded has userId
    if (!decoded.userId) {
      return res.status(401).json({
        status: false,
        message: 'INVALID_TOKEN_FORMAT'
      });
    }
    
    // Add user info to request
    req.user = {
      id: decoded.userId,
      userId: decoded.userId,
      // Add other fields from decoded token if available
      ...decoded
    };
    
    console.log('Token verified for user:', req.user.userId);
    next();
    
  } catch (error) {
    console.error('Token verification error:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: false,
        message: 'TOKEN_EXPIRED'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: false,
        message: 'INVALID_TOKEN'
      });
    }
    
    return res.status(401).json({
      status: false,
      message: 'AUTHENTICATION_FAILED'
    });
  }
};