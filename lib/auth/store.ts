import { promises as fs } from "fs";
import path from "path";

export type UserRecord = {
  id: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  emailVerifiedAt: string | null;
  verification?: {
    otpHash: string;
    otpSalt: string;
    expiresAt: string;
  };
  createdAt: string;
  updatedAt: string;
};

type DbShape = {
  users: UserRecord[];
};

const DB_RELATIVE_PATH = path.join("data", "auth-db.json");

function dbFilePath() {
  return path.join(process.cwd(), DB_RELATIVE_PATH);
}

async function ensureDbFile() {
  const filePath = dbFilePath();
  await fs.mkdir(path.dirname(filePath), { recursive: true });

  try {
    await fs.access(filePath);
  } catch {
    const empty: DbShape = { users: [] };
    await fs.writeFile(filePath, JSON.stringify(empty, null, 2), "utf8");
  }
}

async function readDb(): Promise<DbShape> {
  await ensureDbFile();
  const raw = await fs.readFile(dbFilePath(), "utf8");
  try {
    const parsed = JSON.parse(raw) as DbShape;
    return { users: Array.isArray(parsed.users) ? parsed.users : [] };
  } catch {
    return { users: [] };
  }
}

async function writeDb(next: DbShape) {
  await ensureDbFile();
  const filePath = dbFilePath();
  const tmpPath = `${filePath}.tmp`;
  await fs.writeFile(tmpPath, JSON.stringify(next, null, 2), "utf8");
  await fs.rename(tmpPath, filePath);
}

export async function findUserByEmail(email: string): Promise<UserRecord | undefined> {
  const db = await readDb();
  const normalized = email.trim().toLowerCase();
  return db.users.find((u) => u.email === normalized);
}

export async function upsertUser(user: UserRecord) {
  const db = await readDb();
  const idx = db.users.findIndex((u) => u.id === user.id);

  const next: DbShape = {
    users: idx >= 0 ? db.users.map((u, i) => (i === idx ? user : u)) : [...db.users, user],
  };

  await writeDb(next);
}

export async function listUsers() {
  const db = await readDb();
  return db.users;
}
