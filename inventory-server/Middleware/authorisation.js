const jwt=require("jsonwebtoken")
require("dotenv").config()
module.exports = async (req, res, next) => {
  try {
    console.log("yeah our middleware");
    const jwttoken = req.header("token");
    console.log(jwttoken);
    if (!jwttoken) return res.status(403).json("You are not authorised");
    const payload = jwt.verify(jwttoken,process.env.jwtsecret);
    console.log(payload);
    req.user=payload.userphone

    next()
  } catch (error) {
    return res.status(403).json("You are not authorised");
  }
};
