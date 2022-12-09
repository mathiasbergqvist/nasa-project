const launchesDb = require("./launches.mongo");
const planets = require("./planets.mongo");
const launches = new Map();

let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 7, 2030"),
  target: "Kepler-442 b",
  customers: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

const existsLaunchWithId = (launchId) => launches.has(launchId);

const getAllLaunches = async () => {
  return await launchesDb.find(
    {},
    {
      _id: 0,
      __v: 0,
    }
  );
};

const saveLaunch = async (launch) => {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error("No matching planet was found");
  }

  await launchesDb.updateOne(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
};

const addNewLaunch = (launch) => {
  latestFlightNumber++;

  launches.set(latestFlightNumber, {
    ...launch,
    flightNumber: latestFlightNumber,
    success: true,
    upcoming: true,
    customers: ["ZTM", "NASA"],
  });
};

const abortLaunchById = (launchId) => {
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.success = false;
};

saveLaunch(launch);

module.exports = {
  getAllLaunches,
  addNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
};
