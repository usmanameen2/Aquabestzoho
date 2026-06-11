import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const cookieName = "ab_session";
const sessionLifetimeMs = 1000 * 60 * 60 * 12;
const roles = ["Admin", "Sales", "Purchases", "Accountant", "Staff"];
const permissionsByRole = {
  Admin: ["all"],
  Sales: ["dashboard", "contacts", "sales", "documents", "reports"],
  Purchases: ["dashboard", "vendors", "purchases", "documents", "reports"],
  Accountant: ["dashboard", "accountant", "taxes", "reports", "documents"],
  Staff: ["dashboard", "documents"],
};

const normalizeEmail = (value = "") => String(value).trim().toLowerCase();
const nowIso = () => new Date().toISOString();
const createId = () => crypto.randomBytes(12).toString("hex");

const readJson = (file, fallback) => {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
};

const writeJson = (file, value) => {
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(value, null, 2));
  fs.renameSync(tmp, file);
};

const safeEqual = (left, right) => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
};

const passwordHash = (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${hash}`;
};

const verifyPassword = (password, stored = "") => {
  const [method, salt, hash] = stored.split(":");
  if (method !== "scrypt" || !salt || !hash) return false;
  const testHash = crypto.scryptSync(password, salt, 64).toString("hex");
  return safeEqual(testHash, hash);
};

const parseCookies = (header = "") =>
  Object.fromEntries(
    header
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf("=");
        return [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
      }),
  );

const serializeCookie = (name, value, options = {}) => {
  const pieces = [`${name}=${encodeURIComponent(value)}`];
  if (options.maxAge !== undefined) pieces.push(`Max-Age=${options.maxAge}`);
  if (options.expires) pieces.push(`Expires=${options.expires.toUTCString()}`);
  if (options.httpOnly) pieces.push("HttpOnly");
  if (options.secure) pieces.push("Secure");
  if (options.sameSite) pieces.push(`SameSite=${options.sameSite}`);
  pieces.push(`Path=${options.path || "/"}`);
  return pieces.join("; ");
};

const publicUser = (user) =>
  user
    ? {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        permissions: user.permissions || permissionsByRole[user.role] || [],
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt || "",
      }
    : null;

const validatePassword = (password = "") => {
  if (String(password).length < 8) return "Password must be at least 8 characters";
  return "";
};

const validateUserInput = ({ name, email, password }, requirePassword) => {
  if (!String(name || "").trim()) return "Name is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email))) return "Valid email is required";
  if (requirePassword) return validatePassword(password);
  return "";
};

export function createAuth({ root, isProduction }) {
  const dataDir = path.join(root, "server", "data");
  const usersFile = path.join(dataDir, "users.json");
  const sessionsFile = path.join(dataDir, "sessions.json");
  const secretFile = path.join(dataDir, "auth-secret.key");
  fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(usersFile)) writeJson(usersFile, []);
  if (!fs.existsSync(sessionsFile)) writeJson(sessionsFile, {});
  if (!fs.existsSync(secretFile)) fs.writeFileSync(secretFile, crypto.randomBytes(48).toString("hex"));

  const secret = fs.readFileSync(secretFile, "utf8").trim();
  const loginAttempts = new Map();

  const loadUsers = () => readJson(usersFile, []);
  const saveUsers = (users) => writeJson(usersFile, users);
  const loadSessions = () => readJson(sessionsFile, {});
  const saveSessions = (sessions) => writeJson(sessionsFile, sessions);
  const sign = (value) => crypto.createHmac("sha256", secret).update(value).digest("hex");

  const cookieOptions = (maxAge) => ({
    maxAge,
    httpOnly: true,
    secure: Boolean(isProduction),
    sameSite: "Strict",
    path: "/",
  });

  const setSessionCookie = (res, sessionId) => {
    res.setHeader("Set-Cookie", serializeCookie(cookieName, `${sessionId}.${sign(sessionId)}`, cookieOptions(Math.floor(sessionLifetimeMs / 1000))));
  };

  const clearSessionCookie = (res) => {
    res.setHeader("Set-Cookie", serializeCookie(cookieName, "", { ...cookieOptions(0), expires: new Date(0) }));
  };

  const createSession = (res, user) => {
    const sessions = loadSessions();
    const sessionId = createId();
    sessions[sessionId] = {
      userId: user.id,
      createdAt: nowIso(),
      expiresAt: Date.now() + sessionLifetimeMs,
    };
    saveSessions(sessions);
    setSessionCookie(res, sessionId);
  };

  const sessionFromRequest = (req) => {
    const cookie = parseCookies(req.headers.cookie || "")[cookieName];
    if (!cookie) return null;
    const [sessionId, signature] = cookie.split(".");
    if (!sessionId || !signature || !safeEqual(sign(sessionId), signature)) return null;
    const sessions = loadSessions();
    const session = sessions[sessionId];
    if (!session || session.expiresAt < Date.now()) {
      if (session) {
        delete sessions[sessionId];
        saveSessions(sessions);
      }
      return null;
    }
    const user = loadUsers().find((entry) => entry.id === session.userId && entry.status === "Active");
    return user ? { sessionId, session, user } : null;
  };

  const requireAuth = (req, res, next) => {
    const current = sessionFromRequest(req);
    if (!current) {
      res.status(401).json({ error: "Authentication required", setupRequired: loadUsers().length === 0 });
      return;
    }
    req.user = current.user;
    req.sessionId = current.sessionId;
    next();
  };

  const requireAdmin = (req, res, next) => {
    if (req.user?.role !== "Admin") {
      res.status(403).json({ error: "Admin access required" });
      return;
    }
    next();
  };

  const sameOrigin = (req, res, next) => {
    if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
      next();
      return;
    }
    const origin = req.headers.origin;
    if (origin) {
      try {
        if (new URL(origin).host !== req.headers.host) {
          res.status(403).json({ error: "Cross-site request blocked" });
          return;
        }
      } catch {
        res.status(403).json({ error: "Invalid request origin" });
        return;
      }
    }
    next();
  };

  const securityHeaders = (_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "same-origin");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    next();
  };

  const sessionHandler = (req, res) => {
    const users = loadUsers();
    const current = sessionFromRequest(req);
    res.setHeader("Cache-Control", "no-store");
    res.json({
      setupRequired: users.length === 0,
      user: publicUser(current?.user),
    });
  };

  const setupHandler = (req, res) => {
    const users = loadUsers();
    if (users.length > 0) {
      res.status(409).json({ error: "Admin setup is already complete" });
      return;
    }
    const error = validateUserInput(req.body || {}, true);
    if (error) {
      res.status(400).json({ error });
      return;
    }
    const user = {
      id: createId(),
      name: String(req.body.name).trim(),
      email: normalizeEmail(req.body.email),
      role: "Admin",
      status: "Active",
      permissions: permissionsByRole.Admin,
      passwordHash: passwordHash(String(req.body.password)),
      createdAt: nowIso(),
      updatedAt: nowIso(),
      lastLoginAt: nowIso(),
    };
    saveUsers([user]);
    createSession(res, user);
    res.status(201).json({ user: publicUser(user) });
  };

  const loginHandler = (req, res) => {
    const users = loadUsers();
    if (users.length === 0) {
      res.status(409).json({ error: "Create the first admin account", setupRequired: true });
      return;
    }
    const email = normalizeEmail(req.body?.email);
    const key = `${req.ip}:${email}`;
    const attempt = loginAttempts.get(key);
    if (attempt?.blockedUntil > Date.now()) {
      res.status(429).json({ error: "Too many login attempts. Try again later." });
      return;
    }
    const user = users.find((entry) => entry.email === email && entry.status === "Active");
    if (!user || !verifyPassword(String(req.body?.password || ""), user.passwordHash)) {
      const nextAttempt = {
        count: (attempt?.count || 0) + 1,
        blockedUntil: 0,
      };
      if (nextAttempt.count >= 8) {
        nextAttempt.count = 0;
        nextAttempt.blockedUntil = Date.now() + 15 * 60 * 1000;
      }
      loginAttempts.set(key, nextAttempt);
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }
    loginAttempts.delete(key);
    user.lastLoginAt = nowIso();
    user.updatedAt = nowIso();
    saveUsers(users);
    createSession(res, user);
    res.json({ user: publicUser(user) });
  };

  const logoutHandler = (req, res) => {
    const current = sessionFromRequest(req);
    if (current) {
      const sessions = loadSessions();
      delete sessions[current.sessionId];
      saveSessions(sessions);
    }
    clearSessionCookie(res);
    res.json({ ok: true });
  };

  const listUsersHandler = (_req, res) => {
    res.json({ users: loadUsers().map(publicUser) });
  };

  const createUserHandler = (req, res) => {
    const users = loadUsers();
    const error = validateUserInput(req.body || {}, true);
    if (error) {
      res.status(400).json({ error });
      return;
    }
    const email = normalizeEmail(req.body.email);
    if (users.some((entry) => entry.email === email)) {
      res.status(409).json({ error: "A user with this email already exists" });
      return;
    }
    const role = roles.includes(req.body.role) ? req.body.role : "Staff";
    const user = {
      id: createId(),
      name: String(req.body.name).trim(),
      email,
      role,
      status: req.body.status === "Inactive" ? "Inactive" : "Active",
      permissions: permissionsByRole[role],
      passwordHash: passwordHash(String(req.body.password)),
      createdAt: nowIso(),
      updatedAt: nowIso(),
      lastLoginAt: "",
    };
    users.push(user);
    saveUsers(users);
    res.status(201).json({ user: publicUser(user) });
  };

  const activeAdminCount = (users, exceptId = "") =>
    users.filter((entry) => entry.id !== exceptId && entry.role === "Admin" && entry.status === "Active").length;

  const updateUserHandler = (req, res) => {
    const users = loadUsers();
    const index = users.findIndex((entry) => entry.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    const existing = users[index];
    const nextRole = roles.includes(req.body.role) ? req.body.role : existing.role;
    const nextStatus = req.body.status === "Inactive" ? "Inactive" : "Active";
    if (existing.role === "Admin" && existing.status === "Active" && (nextRole !== "Admin" || nextStatus !== "Active") && activeAdminCount(users, existing.id) === 0) {
      res.status(400).json({ error: "At least one active admin is required" });
      return;
    }
    const nextEmail = req.body.email ? normalizeEmail(req.body.email) : existing.email;
    if (users.some((entry) => entry.id !== existing.id && entry.email === nextEmail)) {
      res.status(409).json({ error: "A user with this email already exists" });
      return;
    }
    const passwordError = req.body.password ? validatePassword(req.body.password) : "";
    if (passwordError) {
      res.status(400).json({ error: passwordError });
      return;
    }
    users[index] = {
      ...existing,
      name: String(req.body.name || existing.name).trim(),
      email: nextEmail,
      role: nextRole,
      status: nextStatus,
      permissions: permissionsByRole[nextRole],
      passwordHash: req.body.password ? passwordHash(String(req.body.password)) : existing.passwordHash,
      updatedAt: nowIso(),
    };
    saveUsers(users);
    res.json({ user: publicUser(users[index]) });
  };

  const deactivateUserHandler = (req, res) => {
    req.body = { status: "Inactive" };
    updateUserHandler(req, res);
  };

  return {
    requireAuth,
    requireAdmin,
    sameOrigin,
    securityHeaders,
    sessionHandler,
    setupHandler,
    loginHandler,
    logoutHandler,
    listUsersHandler,
    createUserHandler,
    updateUserHandler,
    deactivateUserHandler,
    publicUser,
  };
}
