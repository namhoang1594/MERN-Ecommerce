import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { UserRole } from "../../types/user.types";

const JWT_SECRET: Secret = process.env.JWT_SECRET || "default_secret";
const JWT_REFRESH_SECRET: Secret = process.env.JWT_REFRESH_SECRET || "default_refresh_secret";


/**
 * Generate Access Token
 * @param userId - ID user
 * @param role - role của user (admin/customer)
 * @returns JWT string
 */
export const generateAccessToken = (userId: string, role: UserRole): string => {
  return jwt.sign(
    { userId, role }, // payload
    JWT_SECRET,
    { expiresIn: "15m" } // access token ngắn hạn
  );
};

/**
 * Generate Refresh Token
 * @param userId - ID user
 * @returns JWT string
 */
export const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { userId }, // payload chỉ cần userId
    JWT_REFRESH_SECRET,
    { expiresIn: "7d" } // refresh token dài hạn
  );
};

/**
 * Verify Access Token
 * @param token - access token từ client
 */
export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};

/**
 * Verify Refresh Token
 * @param token - refresh token từ client
 */
export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload;
};

