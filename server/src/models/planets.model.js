const { httpGetAllPlanets } = require("../routes/planets/planets.controller");
const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");

const planets = require("./planets.mongo");

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
          try {
            savePlanet(data);
          } catch (error) {
            console.error(`Could not save planet ${error}`);
          }
        }
      })
      .on("error", (err) => {
        reject(err);
      })
      .on("end", async () => {
        const countPlanetsFound = (await getAllPlanets()).length;
        console.log(`${countPlanetsFound} habitable planets found!`);
        resolve();
      });
  });
};

const savePlanet = async (planet) => {
  // Only update if it does not already exist
  await planets.updateOne(
    {
      keplerName: planet.kepler_name,
    },
    {
      keplerName: planet.kepler_name,
    },
    {
      upsert: true,
    }
  );
};

const getAllPlanets = async () => await planets.find({});

module.exports = {
  getAllPlanets,
  loadPlanetsData,
};
