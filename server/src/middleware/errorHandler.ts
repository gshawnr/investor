import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("ERROR ", err);

  const statusCode = (err as AppError).statusCode || 500;
  const status = (err as AppError).status || "error";

  if (process.env.NODE_ENV === "dev") {
    res.status(statusCode).json({
      status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else if (process.env.NODE_ENV === "prod") {
    if ((err as AppError).isOperational) {
      res.status(statusCode).json({
        status,
        message: err.message,
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  } else {
    res.status(statusCode).json({
      status,
      message: err.message || "Unknown error",
    });
  }
};
