const jwt = require("jsonwebtoken")
const secretKey = require("../config/auth.config");

exports.verifyToken = (req, res, next) => {
    const token = req.header("Authorization");

    if(!token) {
        return res.status(401).json({
            msg: "No cuentas con autorización"
        })
    }

    try {
        jwt.verify(token, secretKey);
        next();
    } catch(error) {
        return res.status(401).json({
            msg: "No cuentas con autorización"
        })
    }  
}