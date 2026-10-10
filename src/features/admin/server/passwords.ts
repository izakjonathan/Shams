import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
const options = { N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 };
function derive(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => scrypt(password, salt, 64, options, (error, key) => error ? reject(error) : resolve(key)));
}
export function normalizeAdminEmail(input: string) {
  const email = input.trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid email address.");
  return email;
}
export async function hashPassword(password: string) {
  if (password.length < 15 || password.length > 256) throw new Error("Use a password between 15 and 256 characters.");
  const salt = randomBytes(16);
  return `scrypt-v1$${salt.toString("hex")}$${(await derive(password, salt)).toString("hex")}`;
}
export async function verifyPassword(password: string, hash: string | undefined) {
  if (password.length > 256) return false;
  const parts = hash?.split("$");
  const valid = parts?.length === 3 && parts[0] === "scrypt-v1" && /^[a-f0-9]{32}$/.test(parts[1]) && /^[a-f0-9]{128}$/.test(parts[2]);
  const salt = valid ? Buffer.from(parts![1], "hex") : Buffer.alloc(16);
  const key = await derive(password, salt);
  return Boolean(valid && timingSafeEqual(key, Buffer.from(parts![2], "hex")));
}
