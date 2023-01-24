const express = require("express");
const path = require("path");
const api = require("./routes/api");
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
// Versioned api
app.use("/v1", api);

// Route to index.html
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
