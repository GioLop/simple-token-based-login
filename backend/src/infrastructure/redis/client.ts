import Redis from 'ioredis';
import { REDIS_HOST, REDIS_PORT } from '../../env/variables';

const redisPort = REDIS_PORT ? parseInt(String(REDIS_PORT), 10) : 6379;

export const redis = new Redis({
    host: REDIS_HOST,
    port: redisPort
});