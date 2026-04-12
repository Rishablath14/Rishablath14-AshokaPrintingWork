const DEFAULT_WINDOW_MS = 15 * 60 * 1000;
const DEFAULT_MAX_ATTEMPTS = 5;

const globalStore = globalThis.__authRateLimitStore ?? new Map();
globalThis.__authRateLimitStore = globalStore;

const getRecord = (key) => {
  const now = Date.now();
  const current = globalStore.get(key);

  if (!current || current.expiresAt <= now) {
    const nextRecord = {
      count: 0,
      expiresAt: now + DEFAULT_WINDOW_MS,
    };
    globalStore.set(key, nextRecord);
    return nextRecord;
  }

  return current;
};

export const getRateLimitKey = (request, username = "") => {
  const forwardedFor = request.headers.get("x-forwarded-for") || "";
  const ip = forwardedFor.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";

  return `${ip}:${username.trim().toLowerCase() || "anonymous"}`;
};

export const consumeAuthAttempt = (key) => {
  const record = getRecord(key);
  record.count += 1;
  globalStore.set(key, record);

  const remaining = Math.max(DEFAULT_MAX_ATTEMPTS - record.count, 0);
  const retryAfterSeconds = Math.max(
    Math.ceil((record.expiresAt - Date.now()) / 1000),
    1,
  );

  return {
    allowed: record.count <= DEFAULT_MAX_ATTEMPTS,
    remaining,
    retryAfterSeconds,
  };
};

export const resetAuthAttempts = (key) => {
  globalStore.delete(key);
};
