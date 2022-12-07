const jwt=require("jsonwebtoken")
require("dotenv").config()

function jwtGenerator(userphone){
    const payload={
        userphone:userphone
    }

    return jwt.sign(payload, process.env.jwtsecret,{expiresIn:"1hr"})

}
module.exports= jwtGenerator