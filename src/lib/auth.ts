import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { env } from './env';

const getJwtSecretKey = () => {
  const secret = env?.JWT_SECRET;
  if (!secret || secret.length === 0) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET is not set in environment variables');
    }
    return new TextEncoder().encode('fallback-dev-secret-key-do-not-use-in-prod');
  }
  return new TextEncoder().encode(secret);
};

export interface AdminJwtPayload extends JWTPayload {
  userId: string;
  email: string;
  role: 'OWNER' | 'EDITOR';
}

export const signJwt = async (payload: AdminJwtPayload, expiresIn = '12h') => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getJwtSecretKey());
};

export const verifyJwt = async (token: string): Promise<AdminJwtPayload | null> => {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey());
    return payload as AdminJwtPayload;
  } catch (error) {
    return null; // Invalid token or expired
  }
};
