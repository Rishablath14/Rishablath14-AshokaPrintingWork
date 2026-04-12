const textEncoder = new TextEncoder();

const decodeBase64UrlToString = (value) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return atob(padded);
};

const decodeBase64UrlToBytes = (value) => {
  const decoded = decodeBase64UrlToString(value);
  return Uint8Array.from(decoded, (char) => char.charCodeAt(0));
};

const parseJsonSegment = (segment) => {
  try {
    return JSON.parse(decodeBase64UrlToString(segment));
  } catch {
    return null;
  }
};

export const verifyAuthTokenInEdge = async (token, secret) => {
  if (!token || !secret) {
    return null;
  }

  const segments = token.split(".");
  if (segments.length !== 3) {
    return null;
  }

  const [headerSegment, payloadSegment, signatureSegment] = segments;
  const header = parseJsonSegment(headerSegment);
  const payload = parseJsonSegment(payloadSegment);

  if (!header || !payload || header.alg !== "HS256") {
    return null;
  }

  try {
    const key = await crypto.subtle.importKey(
      "raw",
      textEncoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );

    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      decodeBase64UrlToBytes(signatureSegment),
      textEncoder.encode(`${headerSegment}.${payloadSegment}`),
    );

    if (!valid) {
      return null;
    }

    if (typeof payload.exp === "number" && payload.exp * 1000 <= Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
};
