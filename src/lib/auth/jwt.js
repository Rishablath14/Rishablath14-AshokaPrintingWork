import jwt from "jsonwebtoken";
import { AUTH_TOKEN_TTL } from "./constants";

const getJwtSecret = () => {
  if (!process.env.TOKEN_SECRET) {
    throw new Error("TOKEN_SECRET is not configured");
  }

  return process.env.TOKEN_SECRET;
};

export const createAuthToken = (adminId) =>
  jwt.sign({ id: adminId }, getJwtSecret(), {
    expiresIn: AUTH_TOKEN_TTL,
  });

export const verifyAuthToken = (token) =>
  jwt.verify(token, getJwtSecret());
