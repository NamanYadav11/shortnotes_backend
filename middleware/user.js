const jwt = require('jsonwebtoken');

function userMiddleware(req, res, next) {  
    const token = req.headers.authorization;
    const words = token.split(" ");
    const jwtToken = words[1];
    const jwtSecret = process.env.REACT_APP_JWT_SECRET
    const decordedVal = jwt.verify(jwtToken, jwtSecret);
    
    if(decordedVal.username){
        req.username=decordedVal.username;
        next();
    }
    else{
        res.json({
            msg:"You are not authorized"
        })
    }
};

module.exports = userMiddleware;