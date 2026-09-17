import http from "node:http";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  randomBytes,
  randomUUID,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const parse = (text) => JSON.parse(text.replace(/^\uFEFF/, ""));
const fail = (status, message) => Object.assign(new Error(message), { status });
const text = (v, max = 500) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";
const imageURL = (v) => {
  const s = text(v, 2000);
  return !s ||
    /^\/images\/[\w./-]+$/.test(s) ||
    /^\/uploads\/[\w.-]+$/.test(s) ||
    /^https:\/\//.test(s)
    ? s
    : "";
};
export function passwordHash(password, salt = randomBytes(16).toString("hex")) {
  return salt + ":" + scryptSync(password, salt, 64).toString("hex");
}
function validPassword(password, hash) {
  try {
    const [salt, digest] = hash.split(":");
    const a = Buffer.from(digest, "hex"),
      b = scryptSync(password, salt, 64);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
export async function createStudioServer({
  dataDir = path.join(root, ".data"),
  adminHash = process.env.ADMIN_PASSWORD_HASH || "",
  origin = process.env.PUBLIC_ORIGIN || "",
  production = process.env.NODE_ENV === "production",
} = {}) {
  if (production && !origin)
    throw new Error("PUBLIC_ORIGIN is required in production.");
  if (origin && !/^https?:\/\/[^/]+$/.test(origin))
    throw new Error(
      "PUBLIC_ORIGIN must be an origin without a path or trailing slash.",
    );
  const db = path.join(dataDir, "content.json"),
    uploads = path.join(dataDir, "uploads");
  await fs.mkdir(uploads, { recursive: true });
  try {
    await fs.access(db);
  } catch {
    const seed = parse(
      await fs.readFile(path.join(root, "src/data/posts.json"), "utf8"),
    );
    await fs
      .writeFile(
        db,
        JSON.stringify({ posts: seed, inquiries: [], comments: [] }, null, 2),
        { flag: "wx" },
      )
      .catch((e) => {
        if (e.code !== "EEXIST") throw e;
      });
  }
  let queue = Promise.resolve();
  const read = async () => parse(await fs.readFile(db, "utf8"));
  const transaction = (fn) => {
    const next = queue.then(async () => {
      const state = await read(),
        result = fn(state);
      const temp = db + "." + randomUUID() + ".tmp";
      await fs.writeFile(temp, JSON.stringify(state, null, 2));
      await fs.rename(temp, db);
      return result;
    });
    queue = next.catch(() => {});
    return next;
  };
  const sessions = new Map(),
    limits = new Map(),
    ttl = 8 * 60 * 60 * 1000;
  function limited(key, max, windowMs) {
    const now = Date.now();
    for (const [k, v] of limits) if (v.until < now) limits.delete(k);
    const current = limits.get(key) || { count: 0, until: now + windowMs };
    current.count++;
    limits.set(key, current);
    return current.count > max;
  }
  function session(req) {
    const token = req.headers.cookie
      ?.split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("oooo_session="))
      ?.slice(13);
    const record = sessions.get(token);
    if (!record || record.expires < Date.now()) {
      if (token) sessions.delete(token);
      return null;
    }
    return token;
  }
  const cookie = (token, maxAge) =>
    `oooo_session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${maxAge}${production ? "; Secure" : ""}`;
  function json(res, status, body, extra = {}) {
    res.writeHead(status, {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...extra,
    });
    res.end(JSON.stringify(body));
  }
  async function body(req, limit = 100000) {
    if (!req.headers["content-type"]?.startsWith("application/json"))
      throw fail(415, "Please send JSON.");
    let size = 0,
      chunks = [];
    for await (const chunk of req) {
      size += chunk.length;
      if (size > limit) throw fail(413, "This request is too large.");
      chunks.push(chunk);
    }
    try {
      return JSON.parse(Buffer.concat(chunks).toString());
    } catch {
      throw fail(400, "Invalid request. Please try again.");
    }
  }
  function validatePost(data, existing) {
    const title = text(data.title, 180),
      slug = text(data.slug, 100).toLowerCase(),
      category = data.category;
    if (!title || !slug || !/^([a-z0-9]+-)*[a-z0-9]+$/.test(slug))
      throw fail(400, "A title and a valid URL slug are required.");
    if (!["Blog", "News", "Events"].includes(category))
      throw fail(400, "Choose Blog, News, or Events.");
    if (data.date && !/^\d{4}-\d{2}-\d{2}$/.test(data.date))
      throw fail(400, "Choose a valid publication date.");
    return {
      id: existing?.id || randomUUID(),
      title,
      slug,
      category,
      excerpt: text(data.excerpt, 600),
      body: text(data.body, 50000),
      image: imageURL(data.image),
      videoUrl: text(data.videoUrl, 2000),
      author: text(data.author, 100),
      date: text(data.date, 10),
      published: data.published === true,
      placeholder: data.placeholder === true,
      updatedAt: new Date().toISOString(),
    };
  }
  const server = http.createServer(async (req, res) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    let url;
    try {
      url = new URL(req.url, "http://localhost");
    } catch {
      return json(res, 400, { error: "Invalid URL" });
    }
    let pathname = url.pathname;
    if (pathname.startsWith("/oooogames/")) pathname = pathname.slice(10);
    if (pathname.startsWith("/api")) {
      try {
        if (!["GET", "HEAD"].includes(req.method)) {
          const allowed = origin
            ? [origin]
            : [
                "http://127.0.0.1:3000",
                "http://localhost:3000",
                "http://127.0.0.1:3001",
                "http://localhost:3001",
              ];
          if (!allowed.includes(req.headers.origin))
            throw fail(403, "Request origin not allowed.");
        }
        const route = pathname.slice(4),
          method = req.method,
          ip = req.socket.remoteAddress;
        if (route === "/session" && method === "GET")
          return json(res, 200, {
            authenticated: !!session(req),
            configured: !!adminHash,
          });
        if (route === "/login" && method === "POST") {
          if (!adminHash)
            throw fail(503, "Administration is not configured yet.");
          if (limited("login:" + ip, 8, 15 * 60 * 1000))
            throw fail(
              429,
              "Too many sign-in attempts. Try again in 15 minutes.",
            );
          const data = await body(req);
          if (
            typeof data.password !== "string" ||
            data.password.length > 1024 ||
            !validPassword(data.password, adminHash)
          )
            throw fail(401, "Incorrect password.");
          for (const [k, v] of sessions)
            if (v.expires < Date.now()) sessions.delete(k);
          const token = randomBytes(32).toString("hex");
          sessions.set(token, { expires: Date.now() + ttl });
          return json(
            res,
            200,
            { ok: true },
            { "Set-Cookie": cookie(token, ttl / 1000) },
          );
        }
        if (route === "/logout" && method === "POST") {
          const token = session(req);
          if (token) sessions.delete(token);
          return json(res, 200, { ok: true }, { "Set-Cookie": cookie("", 0) });
        }
        if (route === "/posts" && method === "GET") {
          const state = await read();
          return json(res, 200, {
            posts: state.posts
              .filter((p) => p.published)
              .sort((a, b) => (b.date || "").localeCompare(a.date || "")),
          });
        }
        const commentMatch = route.match(/^\/posts\/([a-z0-9-]+)\/comments$/);
        if (commentMatch) {
          const state = await read(),
            post = state.posts.find(
              (p) => p.slug === commentMatch[1] && p.published,
            );
          if (!post) throw fail(404, "Story not found.");
          if (method === "GET")
            return json(res, 200, {
              comments: state.comments
                .filter((c) => c.postId === post.id && c.approved)
                .map(({ id, name, message, createdAt }) => ({
                  id,
                  name,
                  message,
                  createdAt,
                })),
            });
          if (method === "POST") {
            if (limited("comment:" + ip, 5, 600000))
              throw fail(429, "Please wait before submitting another comment.");
            const data = await body(req),
              name = text(data.name, 80),
              message = text(data.message, 2000);
            if (!name || message.length < 3)
              throw fail(
                400,
                "Add your name and a comment of at least three characters.",
              );
            await transaction((s) => {
              if (!s.posts.some((p) => p.id === post.id && p.published))
                throw fail(404, "Story not found.");
              s.comments.push({
                id: randomUUID(),
                postId: post.id,
                postTitle: post.title,
                name,
                message,
                approved: false,
                createdAt: new Date().toISOString(),
              });
            });
            return json(res, 201, { ok: true });
          }
        }
        if (route === "/contact" && method === "POST") {
          if (limited("contact:" + ip, 5, 600000))
            throw fail(429, "Please wait before sending another message.");
          const data = await body(req);
          if (data.website) return json(res, 200, { ok: true });
          const name = text(data.name, 100),
            email = text(data.email, 254),
            message = text(data.message, 10000),
            service = text(data.service, 100);
          if (!name || !/^\S+@\S+\.\S+$/.test(email) || message.length < 10)
            throw fail(
              400,
              "Please add your name, a valid email, and a message of at least 10 characters.",
            );
          await transaction((s) =>
            s.inquiries.push({
              id: randomUUID(),
              name,
              email,
              message,
              service,
              createdAt: new Date().toISOString(),
            }),
          );
          return json(res, 201, { ok: true });
        }
        if (route.startsWith("/admin/")) {
          if (!session(req)) throw fail(401, "Please sign in to continue.");
          if (route === "/admin/content" && method === "GET")
            return json(res, 200, await read());
          if (route === "/admin/posts" && method === "POST") {
            const data = validatePost(await body(req));
            await transaction((s) => {
              if (s.posts.some((p) => p.slug === data.slug))
                throw fail(409, "That URL slug is already in use.");
              s.posts.unshift(data);
            });
            return json(res, 201, { post: data });
          }
          const postMatch = route.match(/^\/admin\/posts\/([a-zA-Z0-9-]+)$/);
          if (postMatch && (method === "PUT" || method === "DELETE")) {
            const input = method === "PUT" ? await body(req) : null;
            const result = await transaction((s) => {
              const i = s.posts.findIndex((p) => p.id === postMatch[1]);
              if (i < 0) throw fail(404, "Post not found.");
              if (method === "DELETE") {
                s.posts.splice(i, 1);
                s.comments = s.comments.filter(
                  (c) => c.postId !== postMatch[1],
                );
                return { ok: true };
              }
              const p = validatePost(input, s.posts[i]);
              if (
                s.posts.some(
                  (other) => other.id !== p.id && other.slug === p.slug,
                )
              )
                throw fail(409, "That URL slug is already in use.");
              s.posts[i] = p;
              return { post: p };
            });
            return json(res, 200, result);
          }
          const moderate = route.match(/^\/admin\/comments\/([a-zA-Z0-9-]+)$/);
          if (moderate && (method === "PUT" || method === "DELETE")) {
            await transaction((s) => {
              const i = s.comments.findIndex((c) => c.id === moderate[1]);
              if (i < 0) throw fail(404, "Comment not found.");
              if (method === "DELETE") s.comments.splice(i, 1);
              else s.comments[i].approved = true;
            });
            return json(res, 200, { ok: true });
          }
          if (route === "/admin/uploads" && method === "POST") {
            const data = await body(req, 8 * 1024 * 1024);
            if (
              typeof data.data !== "string" ||
              !/^[A-Za-z0-9+/]*={0,2}$/.test(data.data)
            )
              throw fail(400, "Invalid image.");
            const file = Buffer.from(data.data, "base64");
            if (file.length > 5 * 1024 * 1024)
              throw fail(413, "Choose an image smaller than 5 MB.");
            let ext;
            if (
              file
                .subarray(0, 8)
                .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
            )
              ext = "png";
            else if (file[0] === 255 && file[1] === 216 && file[2] === 255)
              ext = "jpg";
            else if (
              file.toString("ascii", 0, 4) === "RIFF" &&
              file.toString("ascii", 8, 12) === "WEBP"
            )
              ext = "webp";
            else
              throw fail(400, "Only JPEG, PNG, and WebP images are supported.");
            const filename = randomUUID() + "." + ext;
            await fs.writeFile(path.join(uploads, filename), file, {
              flag: "wx",
            });
            return json(res, 201, { url: "/uploads/" + filename });
          }
        }
        throw fail(404, "Not found.");
      } catch (error) {
        if (!res.headersSent)
          json(res, error.status || 500, {
            error: error.status
              ? error.message
              : "The studio server could not complete this request.",
          });
        return;
      }
    }
    if (!["GET", "HEAD"].includes(req.method))
      return json(res, 405, { error: "Method not allowed." });
    try {
      const isUpload = pathname.startsWith("/uploads/"),
        base = isUpload ? uploads : path.join(root, "build");
      let requested = isUpload
        ? pathname.slice(9)
        : decodeURIComponent(pathname).replace(/^\/+/, "");
      if (!requested || requested === "oooogames") requested = "index.html";
      const file = path.resolve(base, requested);
      if (file !== base && !file.startsWith(base + path.sep))
        throw fail(403, "Forbidden");
      const bytes = await fs.readFile(file),
        ext = path.extname(file);
      const types = {
        ".html": "text/html; charset=utf-8",
        ".js": "text/javascript",
        ".css": "text/css",
        ".json": "application/json",
        ".svg": "image/svg+xml",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".webp": "image/webp",
        ".ico": "image/x-icon",
        ".woff2": "font/woff2",
        ".ttf": "font/ttf",
        ".txt": "text/plain",
      };
      res.writeHead(200, {
        "Content-Type": types[ext] || "application/octet-stream",
        "Cache-Control": isUpload
          ? "public,max-age=31536000,immutable"
          : "no-cache",
      });
      res.end(req.method === "HEAD" ? undefined : bytes);
    } catch {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not found");
    }
  });
  return server;
}
