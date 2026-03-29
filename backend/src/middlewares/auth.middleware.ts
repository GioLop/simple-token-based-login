import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../infrastructure/jwt/jwt.service';
import { AppError } from '../errors/appError';
import { validateBlackListedToken } from '../infrastructure/auth/access-token.service';

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = (req as any).accessToken;
    const isTokenBlackListed = await validateBlackListedToken(token);

    if (isTokenBlackListed) return next(new AppError('Token revoked', 401));

    try {
        const payload = verifyAccessToken(token);
        
        (req as any).user = payload;
        
        next();
    } catch (error) {
        return res.sendStatus(403);
    }
};