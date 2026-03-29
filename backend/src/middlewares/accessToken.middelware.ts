import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/appError";

export const requireAccessToken = async (
    req:Request,
    _res:Response,
    next:NextFunction
) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) return next(new AppError('There is no authorization token', 401));

    const token = authHeader.split(' ')[1];
   
    (req as any).accessToken = token;
    
    next();
};