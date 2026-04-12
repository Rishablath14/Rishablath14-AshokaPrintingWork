import { connect } from '@/app/actions/dbconnect.action';
import { NextResponse } from "next/server";
import Admin from '@/app/utils/adminSchema';
import { AUTH_COOKIE_NAME } from "@/lib/auth/constants";
import {
    getAuthCookieOptions,
    getExpiredAuthCookieOptions,
} from "@/lib/auth/cookies";
import { createAuthToken } from "@/lib/auth/jwt";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import {
    consumeAuthAttempt,
    getRateLimitKey,
    resetAuthAttempts,
} from "@/lib/auth/rate-limit";

export const runtime = "nodejs";

const createNoStoreResponse = (body, init) => {
    const response = NextResponse.json(body, init);
    response.headers.set("Cache-Control", "no-store");
    return response;
};

const clearSession = () => {
    const response = createNoStoreResponse({
        message: "Logout successful",
        success: true,
    });
    response.cookies.set(
        AUTH_COOKIE_NAME,
        "",
        getExpiredAuthCookieOptions(),
    );
    return response;
};

const createInvalidCredentialsResponse = () =>
    createNoStoreResponse(
        { message: "Invalid username or password" },
        { status: 401 },
    );

const createRateLimitResponse = (retryAfterSeconds) => {
    const response = createNoStoreResponse(
        {
            message: "Too many login attempts. Please try again later.",
        },
        { status: 429 },
    );
    response.headers.set("Retry-After", String(retryAfterSeconds));
    return response;
};

export async function GET() {
    return clearSession();
}

export async function DELETE() {
    return clearSession();
}

export async function POST(request){
    try {
        await connect();
        const reqBody = await request.json();
        const username = typeof reqBody?.username === "string" ? reqBody.username.trim() : "";
        const password = typeof reqBody?.password === "string" ? reqBody.password : "";
        const rateLimitKey = getRateLimitKey(request, username);

        if (!username || !password) {
            return createNoStoreResponse(
                { message: "Username and password are required" },
                { status: 400 },
            );
        }

        const admin = await Admin.findOne({ username })
            .select("+password +passwordHash")
            .exec();

        if (!admin) {
            const limit = consumeAuthAttempt(rateLimitKey);
            if (!limit.allowed) {
                return createRateLimitResponse(limit.retryAfterSeconds);
            }
            return createInvalidCredentialsResponse();
        }

        const storedSecret = admin.passwordHash || admin.password;
        const isValidPassword = verifyPassword(password, storedSecret);

        if (!isValidPassword) {
            const limit = consumeAuthAttempt(rateLimitKey);
            if (!limit.allowed) {
                return createRateLimitResponse(limit.retryAfterSeconds);
            }
            return createInvalidCredentialsResponse();
        }

        if (!admin.passwordHash) {
            admin.passwordHash = hashPassword(password);
            admin.password = undefined;
            await admin.save();
        }

        resetAuthAttempts(rateLimitKey);

        const token = createAuthToken(admin._id.toString());
        const response = createNoStoreResponse({
            message: "Login successful",
            success: true,
        });

        response.cookies.set(
            AUTH_COOKIE_NAME,
            token,
            getAuthCookieOptions(),
        );

        return response;
    } catch (error) {
        return createNoStoreResponse(
            { error: "Authentication request failed" },
            { status: 500 },
        );
    }
}
