const express = require("express");
const path = require("path");
const planetsRouter = require("./routes/planets/planets.router");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

// CORS policy
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    optionsSuccessStatus: 200,
  })
);
// Setup logging with Morgan
app.use(morgan("combined"));

app.use(express.json());
// Serve client
app.use(express.static(path.join(__dirname, "..", "public")));

// Internal routes
app.use(planetsRouter);

// Route to index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
