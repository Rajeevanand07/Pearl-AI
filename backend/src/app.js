const express = require("express");
const app = express();
const authRoute = require("./routes/auth.route");
const googleRoute = require("./routes/google.route");
const cors = require("cors");   
const cookieParser = require("cookie-parser");

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Hello World!");
})

app.use("/api/auth", authRoute);
app.use("/api/google", googleRoute);

module.exports = app;