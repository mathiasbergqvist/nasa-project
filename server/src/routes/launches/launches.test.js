const request = require("supertest");
const app = require("../../app");

describe("GET /launches", () => {
  it("should respond with 200 success", async () => {
    await request(app)
      .get("/launches")
      .expect("Content-Type", /json/)
      .expect(200);
  });
});

describe("POST /launch", () => {
  const completeLaunchData = {
    mission: "USS Enterprice",
    rocket: "NCC 1701-D",
    target: "Kepler 186-f",
    launchDate: "Januari 4, 2023",
  };

  const launchDataWithoutDate = {
    mission: "USS Enterprice",
    rocket: "NCC 1701-D",
    target: "Kepler 186-f",
  };

  it("should respond with 201 created", async () => {
    const response = await request(app)
      .post("/launches")
      .send(completeLaunchData)
      .expect("Content-Type", /json/)
      .expect(201);

    const requestDate = new Date(completeLaunchData.launchDate).valueOf();
    const responseDate = new Date(response.body.launchDate).valueOf();
    expect(responseDate).toBe(requestDate);

    expect(response.body).toMatchObject(launchDataWithoutDate);
  });
  it("should catch missing required properties", () => {});
  it("should catch invalid dates", () => {});
});
