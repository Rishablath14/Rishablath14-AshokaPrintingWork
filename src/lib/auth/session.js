import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "./constants";
import { verifyAuthToken } from "./jwt";

export const requireAdminSession = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const session = verifyAuthToken(token);

  if (!session?.id) {
    throw new Error("Unauthorized");
  }

  return session;
};
