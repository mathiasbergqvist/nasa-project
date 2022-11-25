const { httpGetAllPlanets } = require("../routes/planets/planets.controller");
const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");

const planets = require("./planets.mongo");

const habitablePlanets = [];

const isHabitablePlanet = (planet) =>
  planet["koi_disposition"] === "CONFIRMED" &&
  planet["koi_insol"] > 0.36 &&
  planet["koi_insol"] < 1.11 &&
  planet["koi_prad"] < 1.6;

const loadPlanetsData = () => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data/kepler_data.csv")
    )
      .pipe(
        parse({
          comment: "#", // Treat as symbol
          columns: true,
        })
      )
      .on("data", async (data) => {
        if (isHabitablePlanet(data)) {
          await planets.create({
            keplerName: data.kepler_name,
          });
        }
      })
      .on("error", (err) => {
        reject(err);
      })
      .on("end", () => {
        resolve();
      });
  });
};

const getAllPlanets = async () => await planets.find({});

module.exports = {
  getAllPlanets,
  loadPlanetsData,
};
