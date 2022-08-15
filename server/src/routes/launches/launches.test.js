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
  it("should respond with 200 success", () => {});
  it("should catch missing required properties", () => {});
  it("should catch invalid dates", () => {});
});
