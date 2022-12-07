require("dotenv").config();
const express = require("express");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cookieParser());

//Auth Route
app.use("/auth", require("./Routes/auth"));
//API Route
app.use("/api", require("./Routes/api"));

app.listen(port, () => {
  console.log(`Listening to requests on port ${port}`);
});
