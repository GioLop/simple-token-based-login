import { Response } from "express";

export const sendSuccess = (
  res: Response,
  data: any,
  statusCode = 200,
  meta?: any
) => {
  return res.status(statusCode).json({
    success: true,
    data,
    ...(meta && { meta }),
  });
};