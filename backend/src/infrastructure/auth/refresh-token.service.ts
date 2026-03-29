import { redis } from "../redis/client";
import { v4 as uuid } from "uuid";

const REFRESH_PREFIX = 'refresh:';
const SEVEN_DAYS = 60 * 60 * 24 * 7;

export const createRefreshToken = async (userId: string) => {
    const token = uuid();
    const prefixedToken = `${REFRESH_PREFIX}${token}`;

    await redis.set(
        prefixedToken,
        userId,
        "EX",
        SEVEN_DAYS
    );

    return token;
};

export const validateRefreshToken = async (token:string) => {
    const prefixedToken = `${REFRESH_PREFIX}${token}`;
    const userId = await redis.get(prefixedToken);
    
    return userId;
};

export const deleteRefreshToken = async (token:string) => {
    const prefixedToken = `${REFRESH_PREFIX}${token}`;
    await redis.del(prefixedToken);
};