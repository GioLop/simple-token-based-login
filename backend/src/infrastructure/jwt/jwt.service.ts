import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not defined');
}

export const signAccessToken = (userId: string) => {
    return jwt.sign({ userId }, JWT_SECRET, {
        expiresIn: '15min'
    });
};

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
};