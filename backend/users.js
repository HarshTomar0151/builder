import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const USERS_FILE = path.join(__dirname, "users.json");

function readUsers() {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]));
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
  } catch {
    return [];
  }
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

export function findUserByEmail(email) {
  const users = readUsers();
  return users.find((u) => u.email === email.toLowerCase()) || null;
}

export function findUserById(id) {
  const users = readUsers();
  return users.find((u) => u.id === id) || null;
}

export function createUser(email, passwordHash) {
  const users = readUsers();
  const newUser = {
    id: Date.now().toString(),
    email: email.toLowerCase(),
    passwordHash,
    websitesGenerated: 0,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  writeUsers(users);
  return newUser;
}

export function incrementWebsiteCount(userId) {
  const users = readUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) return null;
  user.websitesGenerated += 1;
  writeUsers(users);
  return user;
}
