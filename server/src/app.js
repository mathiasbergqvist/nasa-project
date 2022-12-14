const express = require("express");
const path = require("path");
const planetsRouter = require("./routes/planets/planets.router");
const launchesRouter = require("./routes/launches/launches.router");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

// CORS policy
app.use(
  cors({
    origin: "http://localhost:3001",
    optionsSuccessStatus: 200,
  })
);
// Setup logging with Morgan
app.use(morgan("combined")); //Use "dev" for dev output

app.use(express.json());
// Serve client
app.use(express.static(path.join(__dirname, "..", "public")));

// Internal routes
app.use("/planets", planetsRouter);
app.use("/launches", launchesRouter);

// Route to index.html
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
