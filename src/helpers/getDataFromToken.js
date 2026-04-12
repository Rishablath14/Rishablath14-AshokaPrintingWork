import { AUTH_COOKIE_NAME } from "@/lib/auth/constants";
import { verifyAuthToken } from "@/lib/auth/jwt";

export const getDataFromToken = (request) => {
    try {
        const token = request.cookies.get(AUTH_COOKIE_NAME)?.value || '';
        const decodedToken = verifyAuthToken(token);
        return decodedToken.id;
    } catch (error) {
        throw new Error("Invalid or expired session");
    }

}
