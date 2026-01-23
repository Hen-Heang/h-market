import crypto from "crypto";

export function randomId() {
  return crypto.randomUUID();
}

export function hashWithSalt(secret: string, salt: string) {
  const derived = crypto.scryptSync(secret, salt, 64);
  return derived.toString("hex");
}

export function newSalt(bytes = 16) {
  return crypto.randomBytes(bytes).toString("hex");
}

export function verifyHash(secret: string, salt: string, expectedHex: string) {
  const actual = Buffer.from(hashWithSalt(secret, salt), "hex");
  const expected = Buffer.from(expectedHex, "hex");
  if (actual.length !== expected.length) return false;
  return crypto.timingSafeEqual(actual, expected);
}

export function generateOtp(length = 4) {
  const max = 10 ** length;
  const n = crypto.randomInt(0, max);
  return String(n).padStart(length, "0");
}
