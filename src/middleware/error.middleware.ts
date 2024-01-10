import { ErrorRequestHandler } from "express";

export class HttpError extends Error {
  message: string;
  status: number;
  body?: unknown;

  constructor(message: string, status = 400, body?: unknown) {
    super(message);
    this.message = message;
    this.status = status;
    this.body = body;
  }
}

export const errorMiddleware: ErrorRequestHandler = (err: HttpError, req, res, next) => {
  console.log("huh");
  console.log(err);

  const statusCode = err.status || 500;
  res.status(statusCode)
  res.send("Something went wrong");
};
