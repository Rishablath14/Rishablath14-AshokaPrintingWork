import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const SALT_BYTES = 16;
const KEY_LENGTH = 64;
const HASH_SEPARATOR = ":";

const isString = (value) => typeof value === "string" && value.length > 0;

const safeComparePlaintext = (candidate, stored) => {
  const candidateBuffer = Buffer.from(candidate);
  const storedBuffer = Buffer.from(stored);

  if (candidateBuffer.length !== storedBuffer.length) {
    return false;
  }

  return timingSafeEqual(candidateBuffer, storedBuffer);
};

export const hashPassword = (password) => {
  const salt = randomBytes(SALT_BYTES).toString("hex");
  const derivedKey = scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return `${salt}${HASH_SEPARATOR}${derivedKey}`;
};

export const isPasswordHash = (value) =>
  typeof value === "string" &&
  /^[a-f0-9]{32}:[a-f0-9]{128}$/i.test(value);

export const verifyPassword = (candidate, storedHash) => {
  if (!isString(candidate) || !isString(storedHash)) {
    return false;
  }

  if (!isPasswordHash(storedHash)) {
    return safeComparePlaintext(candidate, storedHash);
  }

  const [salt, storedKey] = storedHash.split(HASH_SEPARATOR);
  const derivedKey = scryptSync(candidate, salt, KEY_LENGTH);
  const storedKeyBuffer = Buffer.from(storedKey, "hex");

  if (derivedKey.length !== storedKeyBuffer.length) {
    return false;
  }

  return timingSafeEqual(derivedKey, storedKeyBuffer);
};
