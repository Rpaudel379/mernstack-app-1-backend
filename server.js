const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();
const app = express();
const { checkUser } = require("./middleware/authMiddleware");
// middleware
app.use(
  cors({ origin: "https://mernstack-app1.netlify.app", credentials: true })
);
app.use(express.json());
app.use(cookieParser());
//connection to mongodb
mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => {
    app.listen(process.env.PORT || 5000, () => {
      console.log("server started at port 5000");
    });
  })
  .catch((err) => console.log(err));

//routes
//app.get("*", checkUser);
app.get("/", (req, res) => {
  res.send({ user: res.locals.user });
});

// routes
app.use(authRoutes);
