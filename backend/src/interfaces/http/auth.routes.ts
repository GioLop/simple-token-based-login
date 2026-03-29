import { Router } from 'express';
import {
    register,
    login,
    refresh,
    logout,
} from './auth.controller';
import { validate } from '../../middlewares/validate.middleware';
import { UserSchema } from './auth.schemas';
import { requireRefreshToken } from '../../middlewares/refreshToken.middleware';
import { requireAccessToken } from '../../middlewares/accessToken.middelware';
import { authMiddleware } from '../../middlewares/auth.middleware';

export const authRouter = Router();

authRouter.post('/register', validate(UserSchema) ,register);
authRouter.post('/login', validate(UserSchema), login);
authRouter.post('/refresh', requireAccessToken, authMiddleware, requireRefreshToken, refresh);
authRouter.post('/logout', requireAccessToken, authMiddleware, requireRefreshToken, logout);