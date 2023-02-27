const axios = require("axios");

const launchesDb = require("./launches.mongo");
const planets = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
  flightNumber: 100, //flight_number
  mission: "Kepler Exploration X", //name
  rocket: "Explorer IS1", //rocket.name
  launchDate: new Date("December 7, 2030"), //date_local
  target: "Kepler-442 b", //not applicable
  customers: ["ZTM", "NASA"], //payload.customers for each payload
  upcoming: true, //upcoming
  success: true, //success
};

const populateLaunches = async () => {
  console.log("Downloading launches data...");

  try {
    const response = await axios.post(process.env.SPACEX_API_URL, {
      query: {},
      options: {
        pagination: false,
        populate: [
          {
            path: "rocket",
            select: {
              name: 1,
            },
          },
          {
            path: "payloads",
            select: {
              customers: 1,
            },
          },
        ],
      },
    });

    if (response.status !== 200) {
      console.error("Problem downloading launches");
      throw new Error("Launch download failed");
    }

    const launchDocs = response.data.docs;

    for (const launchDoc of launchDocs) {
      const payloads = launchDoc["payloads"];
      const customers = payloads.flatMap((payload) => payload["customers"]);

      const launch = {
        flightNumber: launchDoc["flight_number"],
        mission: launchDoc["name"],
        rocket: launchDoc["rocket"]["name"],
        launchDate: launchDoc["date_local"],
        upcoming: launchDoc["upcoming"],
        success: launchDoc["success"],
        customers,
      };

      console.log(`${launch.flightNumber} - ${launch.mission}`);

      await saveLaunch(launch);
    }
  } catch (error) {
    console.error(`Error from populateLaunches: ${error}`);
  }
};

const loadLaunchData = async () => {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FlaconSat",
  });

  if (firstLaunch) {
    console.info("Launch data already loaded...");
    return;
  }

  await populateLaunches();
};

const findLaunch = async (filter) => await launchesDb.findOne(filter);

const existsLaunchWithId = async (launchId) =>
  await findLaunch({
    flightNumber: launchId,
  });

const getLatestFlightNumber = async () => {
  const latestLaunch = await launchesDb.findOne().sort("-flightNumber");

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
};

const getAllLaunches = async () =>
  await launchesDb.find(
    {},
    {
      _id: 0,
      __v: 0,
    }
  );

const saveLaunch = async (launch) => {
  await launchesDb.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true, // Create if there is no one present
    }
  );
};

const scheduleNewLaunch = async (launch) => {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error("No matching planet was found");
  }

  const newFlightNumber = (await getLatestFlightNumber()) + 1;

  const newLaunch = {
    ...launch,
    success: true,
    upcoming: true,
    customers: ["ZTM", "NASA"],
    flightNumber: newFlightNumber,
  };

  await saveLaunch(newLaunch);
};

const abortLaunchById = async (launchId) => {
  const aborted = await launchesDb.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );

  return aborted.modifiedCount === 1;
};

saveLaunch(launch);

module.exports = {
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
  loadLaunchData,
};
