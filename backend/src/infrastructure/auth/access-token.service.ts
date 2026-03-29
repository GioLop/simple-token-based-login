import { HASH_ALGO, HASH_DIGEST } from "../../env/variables";
import { redis } from "../redis/client";
import crypto from 'crypto';

const BLACKLIST_PREFIX = 'bl:';
const FIFTEEN_MINUTES = 60 * 15;

const hashAlgorithm = HASH_ALGO || 'sha256';
const hashDigest = (HASH_DIGEST || 'hex') as crypto.BinaryToTextEncoding;

const hashToken = (token:string) => {
    return crypto
        .createHash(hashAlgorithm)
        .update(token)
        .digest(hashDigest);
};

export const blacklistAccessToken = async (token:string, reason:string) => {
    const hashedToken = hashToken(token);
    await redis.set(
        `${BLACKLIST_PREFIX}${hashedToken}`, 
        JSON.stringify({
            reason,
            at: Date.now()
        }),
        'EX',
        FIFTEEN_MINUTES);
};

export const validateBlackListedToken = async (token:string) => {
    const hashedToken = hashToken(token);
    const blackListed = await redis.get(`${BLACKLIST_PREFIX}${hashedToken}`);
    
    return !!blackListed;
};