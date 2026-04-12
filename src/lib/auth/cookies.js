import { AUTH_TOKEN_MAX_AGE_SECONDS } from "./constants";

const isProduction = process.env.NODE_ENV === "production";

export const getAuthCookieOptions = () => ({
  httpOnly: true,
  sameSite: "lax",
  secure: isProduction,
  path: "/",
  maxAge: AUTH_TOKEN_MAX_AGE_SECONDS,
  priority: "high",
});

export const getExpiredAuthCookieOptions = () => ({
  httpOnly: true,
  sameSite: "lax",
  secure: isProduction,
  path: "/",
  expires: new Date(0),
  maxAge: 0,
  priority: "high",
});
