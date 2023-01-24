const request = require("supertest");
const app = require("../../app");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");

describe("Launches API", () => {
  beforeAll(async () => {
    await mongoConnect();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  describe("GET /launches", () => {
    it("should respond with 200 success", async () => {
      await request(app)
        .get("/v1/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe("POST /launches", () => {
    const completeLaunchData = {
      mission: "USS Enterprice",
      rocket: "NCC 1701-D",
      target: "Kepler-62 f",
      launchDate: "Januari 4, 2023",
      success: true,
      upcoming: true,
      flightNumber: 105,
    };

    const launchDataWithoutDate = {
      mission: "USS Enterprice",
      rocket: "NCC 1701-D",
      target: "Kepler-62 f",
    };

    const launchDataInvalidDate = {
      ...completeLaunchData,
      launchDate: "invalid",
    };

    it("should respond with 201 created", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(completeLaunchData)
        .expect("Content-Type", /json/)
        .expect(201);

      expect(response.ok).toBeTruthy();
    });

    it("should catch missing required properties", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Missing required launch property",
      });
    });

    it("should catch invalid dates", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataInvalidDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Invalid launch date",
      });
    });
  });
});
