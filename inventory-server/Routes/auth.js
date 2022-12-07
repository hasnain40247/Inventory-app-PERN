const router = require("express").Router();
const jwtGenerator = require("../Utils/jwtGenerator");
const authorisation = require("../Middleware/authorisation");
const twilioNum = process.env.twilionum;
const asid = process.env.asid;
const atoken = process.env.atoken;
const smskey = process.env.smskey;
const twilio = require("twilio")(asid, atoken);
const crypto = require("crypto");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
router.post("/send", async (req, res) => {
  try {
    const { phone } = req.body;
    const user = await prisma.users.findFirst({
      where: {
        userphone: phone,
      },
    });
    //create user if phone number doesnt exist
    if (!user) {
      const newuser = await prisma.users.create({
        data: {
          userphone: phone,
        },
      });
      console.log(newuser);
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const expires = Date.now() + 2 * 60 * 1000;
    const data = `${phone}.${otp}.${expires}`;
    const hash = crypto.createHmac("sha256", smskey).update(data).digest("hex");
    const fullHash = `${hash}.${expires}`;

    twilio.messages
      .create({
        body: `Your OTP is ${otp}`,
        from: twilioNum,
        to: phone,
      })
      .then((messages) => console.log(messages))
      .catch((err) => console.error(err));

    res.status(200).send({ phone, hash: fullHash });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

router.post("/verify", async (req, res) => {
  try {
    const { phone, hash, otp } = req.body;
    let [hashValue, expires] = hash.split(".");
    if (Date.now() > parseInt(expires)) {
      return res.status(504).send({ msg: "OTP has expired" });
    }
    let data = `${phone}.${otp}.${expires}`;
    let newCalculatedHash = crypto
      .createHmac("sha256", smskey)
      .update(data)
      .digest("hex");
    if (newCalculatedHash === hashValue) {
      const token = jwtGenerator(phone);
      res.json({ msg: "Verified", token });
    } else {
      return res
        .status(400)
        .send({ verification: false, msg: "Incorrect OTP" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

router.get("/authorisation", authorisation, async (req, res) => {
  try {
    res.json(true)
  } catch (error) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});
module.exports = router;
