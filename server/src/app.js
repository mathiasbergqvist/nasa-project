const express = require("express");
const path = require("path");
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
// Serve client
app.use(express.static(path.join(__dirname, "..", "public")));

app.use(planetsRouter);

// Route to index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
