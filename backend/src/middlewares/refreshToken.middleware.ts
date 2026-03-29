import { Request, Response, NextFunction } from "express";
import { validate as isUUID } from "uuid";
import { validateRefreshToken } from "../infrastructure/auth/refresh-token.service";
import { AppError } from "../errors/appError";

export const requireRefreshToken = async (
    req:Request,
    _res:Response,
    next:NextFunction
) => {
    const token = req.cookies?.refreshToken;

        if (!token) {
            return next(new AppError('There is no token', 401));
        }

        if (!isUUID(token)) {
            return next(new AppError('Invalid token', 400));
        }

        const userId = await validateRefreshToken(token);

        if (!userId) {
            return next(new AppError('Invalid credentials', 400));
        }

        (req as any).refreshToken = token;
        (req as any).userId = userId;
        
        next();
};