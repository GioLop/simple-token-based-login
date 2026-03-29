import { Request, Response } from "express";
import { AuthService } from "../../application/auth.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/response";

const authService = new AuthService();

const cookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: 'strict' as const,
    path: '/auth'
};

export const register = asyncHandler(async (req: Request, res:Response) => {
    const { email, password } = req.body;

        const normalizedEmail = email.toLowerCase().trim();

        const user = await authService.register(normalizedEmail, password);

        return sendSuccess(res, user, 201);
});

export const login = asyncHandler(async (req: Request, res:Response) => {
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await authService.login(email, password);

    res.cookie('refreshToken', refreshToken, cookieOptions);
    return sendSuccess(res, { accessToken });
});

export const refresh = async (req: Request, res:Response) => {
    const oldRefreshToken = (req as any).refreshToken;
    const oldAccessToken = (req as any).accessToken;

    const { accessToken, refreshToken } = await authService.refresh(oldRefreshToken, oldAccessToken);

    res.cookie("refreshToken", refreshToken, cookieOptions);
    return sendSuccess(res, { accessToken });
};

export const logout = async (req: Request, res:Response) => {
    const refreshToken = (req as any).refreshToken;
    const accessToken = (req as any).accessToken;

    await authService.logout(refreshToken, accessToken);

    res.clearCookie("refreshToken", { path: "/auth" });
    return sendSuccess(res, null, 204);
};