import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/appError";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
        success: false,
        message: err.message,
        ...(err.details && { details: err.details }),
    });
  }

  // Prisma errors (optional improvement)
  if (err.code === "P2002") {
    return res.status(409).json({
        success: false,
        message: "Resource already exists",
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};