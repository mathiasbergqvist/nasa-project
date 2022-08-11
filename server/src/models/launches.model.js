const launches = new Map();

let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 7, 2030"),
  destination: "Kepler-442 b",
  customers: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

launches.set(launch.flightNumber, launch);

const getAllLaunches = () => {
  return Array.from(launches.values());
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

module.exports = {
  getAllLaunches,
  addNewLaunch,
};
