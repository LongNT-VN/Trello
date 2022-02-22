const jwt = require('jsonwebtoken');
const logger = require('../helper/logger');
const loggerInfo=logger('Info');
const loggerError=logger('Error');

const verifyToken = (req,res,next) => {
    loggerInfo("Verifying token...");
    const authHeder = req.headers.token;
    if(authHeder){
        const token = authHeder.split(' ')[1];
        jwt.verify(token,process.env.secretKey,(err,member) => {
            if(err) {
                loggerError(err);
                res.status(403).json("Not valid!")
            }
            else
            {
                req.member = member;
                loggerInfo(member)
                next();
            }
        })
    }
    else
    {
        loggerError("Not authenticated");
        return res.status(401).json("Not authenticated!");
    }
}

module.exports = verifyToken;