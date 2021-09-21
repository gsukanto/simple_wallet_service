import request from "supertest";
import app from "../src/app";

const authorization = "Token cb04f9f26632ad602f14acef21c58f58f6fe5fb55a";

describe("POST /api/v1/init", () => {
  it("should return 201 Created", () => {
    return request(app)
        .post("/api/v1/init")
        .field("customer_xid", "ea0212d3-abd6-406f-8c67-868e814a2436")
        .expect(201);
  });

  it("should return 400 on no customer_xid payload", () => {
    return request(app)
        .post("/api/v1/init")
        .expect(400);
    });
});

describe("GET /api/v1/wallet", () => {
  it("should return 201 Created", () => {
    return request(app)
        .get("/api/v1/wallet")
        .set({ Authorization: authorization })
        .expect(200);
  });

  it("should return 401 on no auth header payload", () => {
    return request(app)
        .get("/api/v1/wallet")
        .expect(401);
    });
});

describe("PATCH /api/v1/wallet", () => {
  it("should return 201 Created", () => {
    return request(app)
        .patch("/api/v1/wallet")
        .set({ Authorization: authorization })
        .field("is_disabled", "true")
        .expect(201);
  });

  it("should return 400 bad request on no is_disabled", () => {
    return request(app)
      .patch("/api/v1/wallet")
      .set({ Authorization: authorization })
      .expect(400);
  });

  it("should return 400 bad request on is_disabled is not true", () => {
    return request(app)
        .patch("/api/v1/wallet")
        .set({ Authorization: authorization })
        .field("is_disabled", "false")
        .expect(400);
  });

  it("should return 400 enabled on wallet already disabled", () => {
    return request(app)
        .patch("/api/v1/wallet")
        .set({ Authorization: authorization })
        .field("is_disabled", "true")
        .expect(400);
  });

  it("should return 401 on no auth header payload", () => {
    return request(app)
        .patch("/api/v1/wallet")
        .field("is_disabled", "true")
        .expect(401);
  });

  it("should make GET /api/v1/wallet return 404 Disabled", () => {
    return request(app)
        .get("/api/v1/wallet")
        .set({ Authorization: authorization })
        .expect(404);
  });
});

describe("POST /api/v1/wallet", () => {
  it("should return 201 Created", () => {
    return request(app)
        .post("/api/v1/wallet")
        .set({ Authorization: authorization })
        .expect(201);
  });

  it("should return 400 enabled on wallet already enabled", () => {
    return request(app)
        .post("/api/v1/wallet")
        .set({ Authorization: authorization })
        .expect(400);
  });

  it("should return 401 on no auth header payload", () => {
    return request(app)
        .post("/api/v1/wallet")
        .expect(401);
  });
});