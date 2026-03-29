import bcrypt from "bcrypt";
import { prisma } from "../infrastructure/prisma/client";
import { signAccessToken } from "../infrastructure/jwt/jwt.service";
import { 
    createRefreshToken,
    validateRefreshToken,
    deleteRefreshToken
} from "../infrastructure/auth/refresh-token.service";
import { AppError } from "../errors/appError";
import { blacklistAccessToken } from "../infrastructure/auth/access-token.service";

export class AuthService {
    async register(email:string, password:string) {
        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) throw new AppError('User already exists', 401);

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword
            }
        });
        
        return {
            id: user.id,
            email: user.email
        };
    }

    async login(email: string, password: string) {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) throw new AppError('Invalid credentials', 401);

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) throw new AppError('Invalid credentials', 401);

        const accessToken = signAccessToken(user.id);
        const refreshToken = await createRefreshToken(user.id);

        return { accessToken, refreshToken };
    }

    async refresh(oldRefreshToken: string, oldAccessToken: string) {
        const userId = await validateRefreshToken(oldRefreshToken);

        if (!userId) throw new AppError('Invalid refresh token', 401);

        await deleteRefreshToken(oldRefreshToken);
        await blacklistAccessToken(oldAccessToken, 'refresh');
        
        const newRefreshToken = await createRefreshToken(userId);
        const newAccessToken = signAccessToken(userId); 

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
         };

    }

    async logout(refreshToken: string, accessToken:string) {
        await deleteRefreshToken(refreshToken);
        await blacklistAccessToken(accessToken, 'logout');
    }
};