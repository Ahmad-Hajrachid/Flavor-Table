const jwt = require('jsonwebtoken');
require("dotenv").config();

function routeGuard(req, res, next){
    const authHeader = req.headers["authorization"];

    const tokenFromHeader = authHeader && authHeader.split(" ")[1]; // seperate the token from the object in the response
    const tokenFromQuery = req.query.token;

    const token = tokenFromHeader || tokenFromQuery;

    if(!token){
        return res.status(401).send("No token provided, Access denied.")
    } 

    try{
        const decode = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decode;
        req.token = token;
        next();
    } catch(error){
        return res.status(403).send("Invalid or Exipred Token",error);
    }

}


module.exports = routeGuard;