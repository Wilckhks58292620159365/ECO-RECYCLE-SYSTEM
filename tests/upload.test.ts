import request from "supertest";
import app from "../src/index";

describe("Upload Middleware", () => {
  it("should reject non-image files", async () => {
    const res = await request(app)
      .post("/api/waste")
      .attach("image", "__tests__/files/test.pdf");
    expect(res.status).toBe(500);
  });
});
