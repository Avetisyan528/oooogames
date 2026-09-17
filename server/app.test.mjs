import test from "node:test";
import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { createStudioServer, passwordHash } from "./app.mjs";

test("studio API protects drafts, persists content, moderates comments, and validates submissions", async () => {
  const dataDir = await fs.mkdtemp(path.join(os.tmpdir(), "oooo-test-")),
    password = randomBytes(24).toString("hex");
  let server;
  let base;
  let cookie = "";
  const origin = "http://127.0.0.1:3000";
  const start = async () => {
    server = await createStudioServer({
      dataDir,
      adminHash: passwordHash(password),
      origin,
    });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    base = "http://127.0.0.1:" + server.address().port;
  };
  const request = (
    url,
    method = "GET",
    data,
    auth = true,
    requestOrigin = origin,
  ) =>
    fetch(base + "/api" + url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Origin: requestOrigin,
        ...(auth && cookie ? { Cookie: cookie } : {}),
      },
      body: data === undefined ? undefined : JSON.stringify(data),
    });
  try {
    await start();
    assert.equal((await request("/admin/content")).status, 401);
    assert.equal(
      (await request("/login", "POST", { password: "wrong" })).status,
      401,
    );
    assert.equal(
      (
        await request(
          "/login",
          "POST",
          { password },
          false,
          "https://untrusted.example",
        )
      ).status,
      403,
    );
    const login = await request("/login", "POST", { password });
    assert.equal(login.status, 200);
    const setCookie = login.headers.get("set-cookie");
    assert.match(setCookie, /HttpOnly/);
    assert.match(setCookie, /SameSite=Strict/);
    cookie = setCookie.split(";")[0];
    assert.equal(
      (await (await request("/session")).json()).authenticated,
      true,
    );
    const post = {
      title: "QA draft",
      slug: "qa-draft",
      category: "Blog",
      date: "2026-09-17",
      author: "Test",
      excerpt: "Test excerpt",
      body: "Test body",
      image: "",
      videoUrl: "",
      published: false,
      placeholder: false,
    };
    let response = await request("/admin/posts", "POST", post);
    assert.equal(response.status, 201);
    const id = (await response.json()).post.id;
    assert.ok(
      !(await (await request("/posts")).json()).posts.some((p) => p.id === id),
      "draft must be private",
    );
    assert.equal(
      (await request("/admin/posts", "POST", post)).status,
      409,
      "duplicate slug rejected",
    );
    assert.equal(
      (await request("/admin/posts/" + id, "PUT", { ...post, published: true }))
        .status,
      200,
    );
    assert.ok(
      (await (await request("/posts")).json()).posts.some((p) => p.id === id),
    );
    response = await request(
      "/posts/qa-draft/comments",
      "POST",
      { name: "Test reader", message: "A sample comment." },
      false,
    );
    assert.equal(response.status, 201);
    assert.equal(
      (await (await request("/posts/qa-draft/comments")).json()).comments
        .length,
      0,
    );
    let state = await (await request("/admin/content")).json();
    const comment = state.comments.find((c) => c.postId === id);
    assert.equal(
      (await request("/admin/comments/" + comment.id, "PUT")).status,
      200,
    );
    assert.equal(
      (await (await request("/posts/qa-draft/comments")).json()).comments
        .length,
      1,
    );
    assert.equal(
      (
        await request("/contact", "POST", {
          name: "Test",
          email: "bad",
          message: "Hello",
        })
      ).status,
      400,
    );
    assert.equal(
      (
        await request("/contact", "POST", {
          name: "QA",
          email: "qa@example.invalid",
          message: "This is a test inquiry only.",
          service: "prototyping",
        })
      ).status,
      201,
    );
    assert.equal(
      (
        await request("/admin/uploads", "POST", {
          data: Buffer.from('<svg onload="alert(1)"></svg>').toString("base64"),
        })
      ).status,
      400,
    );
    const png = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aTpcAAAAASUVORK5CYII=",
      "base64",
    );
    response = await request("/admin/uploads", "POST", {
      data: png.toString("base64"),
    });
    assert.equal(response.status, 201);
    const upload = (await response.json()).url;
    assert.equal((await fetch(base + upload)).status, 200);
    assert.equal((await request("/logout", "POST")).status, 200);
    assert.equal((await request("/admin/content")).status, 401);
    await new Promise((resolve) => server.close(resolve));
    await start();
    cookie = "";
    await request("/login", "POST", { password }).then((r) => {
      cookie = r.headers.get("set-cookie").split(";")[0];
    });
    state = await (await request("/admin/content")).json();
    assert.equal(state.inquiries.length, 1, "inquiries persist after restart");
    assert.ok(
      state.posts.some((p) => p.id === id),
      "posts persist after restart",
    );
    assert.equal((await request("/admin/posts/" + id, "DELETE")).status, 200);
    state = await (await request("/admin/content")).json();
    assert.ok(!state.posts.some((p) => p.id === id));
    assert.ok(!state.comments.some((c) => c.postId === id));
  } finally {
    if (server?.listening)
      await new Promise((resolve) => server.close(resolve));
    const checked = path.resolve(dataDir);
    assert.ok(checked.startsWith(path.join(os.tmpdir(), "oooo-test-")));
    await fs.rm(checked, { recursive: true, force: true });
  }
});
test("administrator access stays closed until configured", async () => {
  const dataDir = await fs.mkdtemp(path.join(os.tmpdir(), "oooo-test-"));
  const server = await createStudioServer({ dataDir, adminHash: "" });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  try {
    const base = "http://127.0.0.1:" + server.address().port;
    const session = await fetch(base + "/api/session").then((r) => r.json());
    assert.equal(session.configured, false);
    const r = await fetch(base + "/api/login", {
      method: "POST",
      headers: {
        Origin: "http://127.0.0.1:3000",
        "Content-Type": "application/json",
      },
      body: '{"password":"anything"}',
    });
    assert.equal(r.status, 503);
  } finally {
    await new Promise((r) => server.close(r));
    assert.ok(
      path.resolve(dataDir).startsWith(path.join(os.tmpdir(), "oooo-test-")),
    );
    await fs.rm(dataDir, { recursive: true, force: true });
  }
});
