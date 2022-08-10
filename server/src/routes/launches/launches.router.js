const express = require("express");
const { getAllLaunches } = require("./launches.controller");

const launchesRouter = new express.Router();

launchesRouter.get("/launches", getAllLaunches);

module.exports = launchesRouter;
