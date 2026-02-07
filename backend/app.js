const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const authRoutes = require("./routes/auth");
const fragRoutes = require("./routes/frag");
const researchRoutes = require("./routes/research");

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/frag", fragRoutes);
app.use("/api/research", researchRoutes);

module.exports = app;
