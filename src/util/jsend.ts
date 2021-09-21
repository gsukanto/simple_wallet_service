import express from "express";

export function JsendSuccess(res: express.Response, responsePayload: any, statusCode: number): void {
  const payload: string = JSON.stringify({
    status: "success",
    data: responsePayload
  }, null, 2);

  res.writeHead(statusCode, {"Content-Type": "application/json"});
  res.end(payload);
}

export function JsendFail(res: express.Response, responsePayload: any, statusCode: number): void {
  const payload: string = JSON.stringify({
    status: "fail",
    data: {
      error: responsePayload
    }
  }, null, 2);

  res.writeHead(statusCode, {"Content-Type": "application/json"});
  res.end(payload);
}
