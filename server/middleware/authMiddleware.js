const jwt = require('jsonwebtoken')
const {secret_access, secret_refresh} = require('../config')

module.exports = function(req,res, next){
    try{
        if(req.method === "OPTIONS") next();
        // For normal front vvv
        /*const token = req.headers.authorization;
        if(token) {
            const {iat, exp, ...pawn} = jwt.verify(token, secret_access);
            req.user = pawn;
        }*/
        // For postman vvv
        const { refreshToken } = req.cookies;
        if (refreshToken) {
            const {iat, exp, ...pawn} = jwt.verify(refreshToken, 
                secret_refresh, { ignoreExpiration: true });
            req.user = pawn;
        }

        console.log(req.user);
        next();
    }catch(e){
        console.log(e)
        return res.status(401).json({message:"User is not authorized" })
    }
}