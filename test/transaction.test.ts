import request from "supertest";
import app from "../src/app";

const authorization = "Token cb04f9f26632ad602f14acef21c58f58f6fe5fb55a";

describe("POST /api/v1/wallet/deposits", () => {
  it("should return 201 Created", () => {
    const randomString = (Math.random() + 1).toString(36).substring(7).toString();

    return request(app)
        .post("/api/v1/wallet/deposits")
        .set({ Authorization: authorization })
        .field("amount", 123456)
        .field("reference_id", randomString)
        .expect(201);
  });

  it("should return 400 bad request on no amount", () => {
    const randomString = (Math.random() + 1).toString(36).substring(7).toString();

    return request(app)
        .post("/api/v1/wallet/deposits")
        .set({ Authorization: authorization })
        .field("reference_id", randomString)
        .expect(400);
  });

  it("should return 400 bad request on no amount less than 10000", () => {
    const randomString = (Math.random() + 1).toString(36).substring(7).toString();

    return request(app)
        .post("/api/v1/wallet/deposits")
        .set({ Authorization: authorization })
        .field("amount", 1234)
        .field("reference_id", randomString)
        .expect(400);
  });

  it("should return 400 bad request on no reference_id", () => {
    return request(app)
        .post("/api/v1/wallet/deposits")
        .set({ Authorization: authorization })
        .field("amount", 123456)
        .expect(400);
  });

  it("should return 401 on no auth header payload", () => {
    const randomString = (Math.random() + 1).toString(36).substring(7).toString();

    return request(app)
        .post("/api/v1/wallet/deposits")
        .field("amount", 123456)
        .field("reference_id", randomString)
        .expect(401);
  });
});


describe("POST /api/v1/wallet/withdrawals", () => {
  it("should return 201 Created", () => {
    const randomString = (Math.random() + 1).toString(36).substring(7).toString();
    
    return request(app)
        .post("/api/v1/wallet/withdrawals")
        .set({ Authorization: authorization })
        .field("amount", 10001)
        .field("reference_id", randomString)
        .expect(201);
  });

  it("should return 400 bad request on no amount", () => {
    const randomString = (Math.random() + 1).toString(36).substring(7).toString();

    return request(app)
        .post("/api/v1/wallet/withdrawals")
        .set({ Authorization: authorization })
        .field("reference_id", randomString)
        .expect(400);
  });

  it("should return 400 bad request on no amount less than 10000", () => {
    const randomString = (Math.random() + 1).toString(36).substring(7).toString();

    return request(app)
        .post("/api/v1/wallet/withdrawals")
        .set({ Authorization: authorization })
        .field("amount", 1234)
        .field("reference_id", randomString)
        .expect(400);
  });

  it("should return 400 bad request on no reference_id", () => {
    return request(app)
        .post("/api/v1/wallet/withdrawals")
        .set({ Authorization: authorization })
        .field("amount", 123456)
        .expect(400);
  });

  it("should return 422 on insufficient balance", () => {
    const randomString = (Math.random() + 1).toString(36).substring(7).toString();
    
    return request(app)
        .post("/api/v1/wallet/withdrawals")
        .set({ Authorization: authorization })
        .field("amount", 199999999)
        .field("reference_id", randomString)
        .expect(422);
  });

  it("should return 401 on no auth header payload", () => {
    const randomString = (Math.random() + 1).toString(36).substring(7).toString();

    return request(app)
        .post("/api/v1/wallet/withdrawals")
        .field("amount", 123456)
        .field("reference_id", randomString)
        .expect(401);
  });
});
