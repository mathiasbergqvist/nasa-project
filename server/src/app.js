const express = require("express");
const planetsRouter = require("./routes/planets/planets.router");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(planetsRouter);

module.exports = app;
