const jwt = require('jsonwebtoken');
verifyAccessToken = (req, res, next) => {
    try {
        var header = req.headers.authorization || '';       // get the auth header
        const token = header.split(/\s+/).pop() || '';        // and the encoded auth token
        if(!token){
            return res.json({ success: false, message: 'Invalid Token' });
        }

        const { _id, mode } = jwt.verify(token, process.env.JWT_SECRET);
        if (mode != 'ACCESS') {
            return res.json({ success: false, message: 'Wrong token passed' });
        }

        req.body.userId = _id;
        return next();
    } catch (err) {
        console.log(err);
        return res.json({ success: false, message: err });
    }
}

verifyRefreshToken = (req, res, next) => {
    try {
        var header = req.headers.authorization || '';       // get the auth header
        const token = header.split(/\s+/).pop() || '';        // and the encoded auth token
        if(!token){
            return res.json({ success: false, message: 'Invalid Token' });
        }

        const { _id, mode } = jwt.verify(token, process.env.JWT_SECRET)
        if (mode != 'REFRESH') {
            return res.json({ success: false, message: 'Wrong token passed' });
        }

        req.body.userId = _id;
        return next();
    } catch (err) {
        console.log(err);
        return res.json({ success: false, message: err });
    }
}

module.exports = { verifyAccessToken, verifyRefreshToken }