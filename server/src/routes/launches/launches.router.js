const express = require("express");
const { httpGetAllLaunches } = require("./launches.controller");

const launchesRouter = new express.Router();

launchesRouter.get("/launches", httpGetAllLaunches);

module.exports = launchesRouter;
