import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  LogOut,
  LockKeyhole,
  Pencil,
  Trash2,
  Check,
  Upload,
  ArrowUpRight,
  FileText,
  Mail,
  MessageSquare,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "../components/ui/alert-dialog";
import { api, safeImage, videoEmbed } from "../lib/api";
import { asset } from "../data/site";
const blank = () => ({
  title: "",
  slug: "",
  category: "Blog",
  date: new Date().toISOString().slice(0, 10),
  author: "ooOo Games",
  excerpt: "",
  body: "",
  image: "",
  videoUrl: "",
  published: false,
  placeholder: false,
});
function DeleteConfirmation({ name, onDelete, disabled }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={"Delete " + name}
          disabled={disabled}
        >
          <Trash2 size={17} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle className="text-xl font-semibold">
          Delete this item?
        </AlertDialogTitle>
        <AlertDialogDescription className="muted-text">
          “{name}” will be permanently removed. This cannot be undone.
        </AlertDialogDescription>
        <div className="flex justify-end gap-3">
          <AlertDialogCancel>Keep it</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
export default function Admin() {
  const [session, setSession] = useState(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [content, setContent] = useState({
      posts: [],
      inquiries: [],
      comments: [],
    }),
    [editing, setEditing] = useState(null),
    [notice, setNotice] = useState("");
  async function refresh() {
    setContent(await api("/admin/content"));
  }
  useEffect(() => {
    api("/session")
      .then(setSession)
      .catch((e) => {
        setError(e.message);
        setSession({
          authenticated: false,
          configured: false,
          unavailable: true,
        });
      });
  }, []);
  useEffect(() => {
    if (session?.authenticated) refresh().catch((e) => setError(e.message));
  }, [session]);
  async function login(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const password = new FormData(e.currentTarget).get("password");
      await api("/login", {
        method: "POST",
        body: JSON.stringify({ password }),
      });
      setSession({ authenticated: true, configured: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  async function mutate(path, method) {
    setBusy(true);
    setError("");
    try {
      await api(path, { method });
      await refresh();
      setNotice("Updated successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  async function logout() {
    try {
      await api("/logout", { method: "POST" });
      setSession({ authenticated: false, configured: true });
      setContent({ posts: [], inquiries: [], comments: [] });
    } catch (e) {
      setError(e.message);
    }
  }
  if (!session)
    return (
      <div className="shell empty-state" role="status">
        Checking your session…
      </div>
    );
  if (!session.authenticated)
    return (
      <section className="admin-login shell">
        <div className="login-card">
          <LockKeyhole className="login-icon" size={30} />
          <span className="section-label">FOR THE STUDIO</span>
          <h1>Behind the scenes.</h1>
          <p>
            Sign in to manage stories, review comments, and read project
            inquiries.
          </p>
          {session.configured ? (
            <form onSubmit={login}>
              <label>
                Administrator password
                <Input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </label>
              <Button type="submit" disabled={busy}>
                {busy ? "Signing in…" : "Sign in"}
              </Button>
            </form>
          ) : (
            <div className="admin-setup">
              <h2>
                {session.unavailable
                  ? "Studio server unavailable"
                  : "Set up your studio password"}
              </h2>
              <p>
                {session.unavailable
                  ? "Start the studio server with npm run server, then refresh this page."
                  : "Run npm run admin:setup in the project folder, save the generated password, then restart the studio server. No default password is enabled."}
              </p>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Check again
              </Button>
            </div>
          )}
          {error && (
            <p className="error-text" role="alert">
              {error}
            </p>
          )}
          <Link to="/" className="text-link">
            Back to the website <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
    );
  return (
    <section className="shell admin-shell">
      <header className="admin-header">
        <div>
          <span className="section-label">oooo / STUDIO ADMIN</span>
          <h1>A little behind the scenes.</h1>
        </div>
        <Button variant="outline" onClick={logout}>
          <LogOut /> Sign out
        </Button>
      </header>
      <div className="admin-stats">
        {[
          [
            FileText,
            content.posts.filter((p) => p.published).length,
            "Published stories",
          ],
          [Mail, content.inquiries.length, "Project inquiries"],
          [
            MessageSquare,
            content.comments.filter((c) => !c.approved).length,
            "Comments to review",
          ],
        ].map(([Icon, n, label]) => (
          <div key={label}>
            <Icon size={22} />
            <strong>{n}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
      {error && (
        <p className="error-text" role="alert">
          {error}
        </p>
      )}
      <p className="form-status" role="status">
        {notice}
      </p>
      <Tabs defaultValue="posts">
        <div className="admin-toolbar">
          <TabsList>
            <TabsTrigger value="posts">Stories</TabsTrigger>
            <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
          </TabsList>
          <Button onClick={() => setEditing(blank())}>
            <Plus /> New story
          </Button>
        </div>
        <TabsContent value="posts">
          <div className="admin-posts">
            {content.posts.map((p) => (
              <article className="admin-post-row" key={p.id}>
                <div>
                  <div className="badge-row">
                    <Badge variant={p.published ? "default" : "outline"}>
                      {p.published ? "Published" : "Draft"}
                    </Badge>
                    <Badge>{p.category}</Badge>
                    {p.placeholder && <Badge>Sample</Badge>}
                  </div>
                  <h2>{p.title}</h2>
                  <span className="muted-text">
                    {p.date || "No date"} · /blog/{p.slug}
                  </span>
                </div>
                <div className="row-actions">
                  {p.published && (
                    <Button asChild variant="ghost" size="icon">
                      <Link
                        to={"/blog/" + p.slug}
                        aria-label={"View " + p.title}
                      >
                        <ArrowUpRight />
                      </Link>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => setEditing({ ...p })}
                  >
                    <Pencil /> Edit
                  </Button>
                  <DeleteConfirmation
                    name={p.title}
                    disabled={busy}
                    onDelete={() => mutate("/admin/posts/" + p.id, "DELETE")}
                  />
                </div>
              </article>
            ))}
          </div>
          {!content.posts.length && (
            <div className="empty-state">
              <FileText />
              <h2>Your first story starts here.</h2>
              <p>Create a draft, then publish it when you’re ready.</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="inquiries">
          {content.inquiries.length ? (
            <div className="inquiry-list">
              {[...content.inquiries].reverse().map((i) => (
                <article key={i.id}>
                  <div className="inquiry-heading">
                    <h2>{i.name}</h2>
                    <time>{new Date(i.createdAt).toLocaleDateString()}</time>
                  </div>
                  <a href={"mailto:" + i.email} className="text-link">
                    {i.email}
                    <ArrowUpRight size={14} />
                  </a>
                  <Badge>{i.service}</Badge>
                  <p>{i.message}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Mail />
              <h2>No inquiries yet.</h2>
              <p>Messages from the contact form will appear here.</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="comments">
          {content.comments.length ? (
            <div className="inquiry-list">
              {[...content.comments].reverse().map((c) => (
                <article key={c.id}>
                  <div className="inquiry-heading">
                    <h2>{c.name}</h2>
                    <Badge variant={c.approved ? "default" : "outline"}>
                      {c.approved ? "Approved" : "Awaiting review"}
                    </Badge>
                  </div>
                  <span className="muted-text">On {c.postTitle}</span>
                  <p>{c.message}</p>
                  <div className="row-actions">
                    {!c.approved && (
                      <Button
                        size="sm"
                        disabled={busy}
                        onClick={() => mutate("/admin/comments/" + c.id, "PUT")}
                      >
                        <Check /> Approve
                      </Button>
                    )}
                    <DeleteConfirmation
                      name={c.name + "’s comment"}
                      disabled={busy}
                      onDelete={() =>
                        mutate("/admin/comments/" + c.id, "DELETE")
                      }
                    />
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <MessageSquare />
              <h2>Nothing to moderate.</h2>
              <p>Comments wait here for your approval before going public.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      <Dialog
        open={!!editing}
        onOpenChange={(open) => {
          if (!open) setEditing(null);
        }}
      >
        <DialogContent className="max-w-3xl">
          <DialogTitle>
            {editing?.id ? "Edit story" : "A new story"}
          </DialogTitle>
          <DialogDescription>
            Save as a draft or publish to the website.
          </DialogDescription>
          {editing && (
            <PostEditor
              key={editing.id || "new"}
              initial={editing}
              onSaved={async () => {
                await refresh();
                setEditing(null);
                setNotice("Story saved.");
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
function PostEditor({ initial, onSaved }) {
  const [post, setPost] = useState(initial),
    [saving, setSaving] = useState(false),
    [error, setError] = useState(""),
    [uploading, setUploading] = useState(false);
  const update = (key, value) => setPost((p) => ({ ...p, [key]: value }));
  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (post.videoUrl && !videoEmbed(post.videoUrl))
        throw new Error("Add a valid YouTube or Vimeo video URL.");
      if (post.image && !safeImage(post.image))
        throw new Error("Use an HTTPS image URL or upload an image.");
      await api("/admin/posts" + (post.id ? "/" + post.id : ""), {
        method: post.id ? "PUT" : "POST",
        body: JSON.stringify(post),
      });
      await onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }
  async function upload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Choose an image smaller than 5 MB.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const result = await api("/admin/uploads", {
        method: "POST",
        body: JSON.stringify({ data }),
      });
      update("image", result.url);
    } catch (err) {
      setError(err.message || "Image upload failed.");
    } finally {
      setUploading(false);
    }
  }
  return (
    <form className="editor-form" onSubmit={submit}>
      <label>
        Title
        <Input
          value={post.title}
          required
          maxLength={180}
          onChange={(e) => {
            const title = e.target.value;
            setPost((p) => ({
              ...p,
              title,
              slug: p.id
                ? p.slug
                : title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-|-$/g, ""),
            }));
          }}
        />
      </label>
      <div className="form-row">
        <label>
          URL slug
          <Input
            value={post.slug}
            required
            pattern="([a-z0-9]+-)*[a-z0-9]+"
            onChange={(e) => update("slug", e.target.value)}
          />
        </label>
        <label>
          Category
          <select
            value={post.category}
            onChange={(e) => update("category", e.target.value)}
          >
            <option>Blog</option>
            <option>News</option>
            <option>Events</option>
          </select>
        </label>
      </div>
      <div className="form-row">
        <label>
          Publication date
          <Input
            type="date"
            value={post.date}
            onChange={(e) => update("date", e.target.value)}
          />
        </label>
        <label>
          Author
          <Input
            value={post.author}
            maxLength={100}
            onChange={(e) => update("author", e.target.value)}
          />
        </label>
      </div>
      <label>
        Short excerpt
        <Textarea
          rows={2}
          value={post.excerpt}
          maxLength={600}
          onChange={(e) => update("excerpt", e.target.value)}
        />
      </label>
      <label>
        Story
        <Textarea
          rows={10}
          required
          value={post.body}
          maxLength={50000}
          onChange={(e) => update("body", e.target.value)}
        />
      </label>
      <span className="form-note">
        Use blank lines between paragraphs. Text is displayed safely without raw
        HTML.
      </span>
      <label>
        Cover image
        <Input
          value={post.image}
          placeholder="https://..."
          onChange={(e) => update("image", e.target.value)}
        />
      </label>
      <label className="upload-label">
        <Upload size={17} />
        {uploading ? "Uploading…" : "Upload PNG, JPG, or WebP · up to 5 MB"}
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={upload}
          disabled={uploading}
        />
      </label>
      {safeImage(post.image) && (
        <img
          className="editor-preview"
          src={
            post.image.startsWith("/images/") ? asset(post.image) : post.image
          }
          alt="Cover preview"
        />
      )}
      <label>
        Video link (optional)
        <Input
          type="url"
          value={post.videoUrl}
          placeholder="YouTube or Vimeo URL"
          onChange={(e) => update("videoUrl", e.target.value)}
        />
      </label>
      <div className="form-row">
        <label>
          Visibility
          <select
            value={post.published ? "published" : "draft"}
            onChange={(e) =>
              update("published", e.target.value === "published")
            }
          >
            <option value="draft">Draft — private</option>
            <option value="published">Published — public</option>
          </select>
        </label>
        <label>
          Content type
          <select
            value={post.placeholder ? "sample" : "real"}
            onChange={(e) => update("placeholder", e.target.value === "sample")}
          >
            <option value="real">Studio content</option>
            <option value="sample">Sample / placeholder</option>
          </select>
        </label>
      </div>
      {error && (
        <p className="error-text" role="alert">
          {error}
        </p>
      )}
      <Button type="submit" disabled={saving || uploading}>
        {saving
          ? "Saving…"
          : post.published
            ? "Save and publish"
            : "Save draft"}
        <Check />
      </Button>
    </form>
  );
}
