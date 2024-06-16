import app from "../src/app";
import request from "supertest";

describe("App test", () => {
  it("Should return status 200", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
  });
});
