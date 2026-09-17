import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  Check,
  Code2,
  Layers3,
  Lightbulb,
  MapPin,
  Mail,
  Search,
  CheckCircle2,
  Copy,
  ExternalLink,
  MessageSquare,
  UserRound,
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
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";
import { Eyebrow, SectionHeading, GameCard, CallToAction } from "../components/site";
import { asset, games, services, site, team } from "../data/site";
import seedPosts from "../data/posts.json";
import { api, safeImage, videoEmbed } from "../lib/api";

export function PageHeader({ eyebrow, title, accent, children }) {
  return (
    <header className="shell page-header">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1>
        {title}
        {accent && (
          <>
            <br />
            <span>{accent}</span>
          </>
        )}
      </h1>
      {children && <p>{children}</p>}
    </header>
  );
}
export function Games() {
  return (
    <>
      <PageHeader
        eyebrow="OUR GAMES"
        title="Different worlds."
        accent="Same restless imagination."
      >
        A little action. A little adventure. A lot of “one more go.” Explore the
        games we’re bringing to life.
      </PageHeader>
      <div className="shell game-grid">
        {games.map((g, i) => (
          <GameCard key={g.slug} game={g} index={i} />
        ))}
      </div>
      <CallToAction />
    </>
  );
}
export function GameDetail() {
  const { slug } = useParams();
  const game = games.find((g) => g.slug === slug);
  if (!game) return <NotFound />;
  return (
    <>
      <div className="shell breadcrumb">
        <Link to="/games">
          <ArrowLeft size={15} /> All games
        </Link>
        <span>{game.title}</span>
      </div>
      <section className="shell game-detail-top">
        <div>
          <div className="badge-row">
            <Badge variant="default">{game.platform}</Badge>
            <Badge>{game.status}</Badge>
          </div>
          <h1>{game.title}</h1>
          <p>{game.description}</p>
          {game.link ? (
            <Button asChild size="lg">
              <a href={game.link} target="_blank" rel="noreferrer">
                {game.linkLabel}
                <ExternalLink />
              </a>
            </Button>
          ) : (
            <Badge className="release-note">Play link coming soon</Badge>
          )}
        </div>
        <div className="detail-keyart">
          <img
            src={asset(game.image)}
            alt={
              game.temporary
                ? "Temporary mood artwork"
                : game.title + " key art"
            }
          />
          {game.temporary && (
            <span className="temporary-label">Temporary artwork</span>
          )}
        </div>
      </section>
      <div className="shell detail-body">
        <section className="prose">
          <span className="section-label">ABOUT THE GAME</span>
          <h2>Step into {game.title}.</h2>
          <p>{game.body}</p>
          {game.origin && (
            <>
              <h3>Where it started</h3>
              <p>{game.origin}</p>
              <a
                className="text-link"
                href={game.originLink}
                target="_blank"
                rel="noreferrer"
              >
                Explore the event <ArrowUpRight size={16} />
              </a>
            </>
          )}
        </section>
        <aside className="feature-list">
          <span className="section-label">THE EXPERIENCE</span>
          {game.features.map((f) => (
            <div key={f}>
              <Check size={17} />
              <span>{f}</span>
            </div>
          ))}
        </aside>
      </div>
      {game.screenshots.length > 0 && (
        <section className="shell section">
          <SectionHeading number="01" label="IN-GAME" title="A closer look." />
          <div className="screenshot-grid">
            {game.screenshots.map((img, i) => (
              <Dialog key={img}>
                <DialogTrigger asChild>
                  <button aria-label={`View screenshot ${i + 1}`}>
                    <img
                      src={asset(img)}
                      alt={`${game.title} gameplay screenshot ${i + 1}`}
                      loading="lazy"
                    />
                    <span>
                      <ExternalLink size={18} />
                    </span>
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl p-3">
                  <DialogTitle className="sr-only">
                    {game.title} — screenshot {i + 1}
                  </DialogTitle>
                  <DialogDescription className="sr-only">
                    An in-game screenshot from {game.title}.
                  </DialogDescription>
                  <img
                    className="w-full rounded-md"
                    src={asset(img)}
                    alt={`${game.title} gameplay screenshot ${i + 1}`}
                  />
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </section>
      )}
      {videoEmbed(game.trailer) && (
        <section className="shell section">
          <h2 className="mb-6 text-3xl">Watch the trailer</h2>
          <iframe
            className="video-frame"
            src={videoEmbed(game.trailer)}
            title={game.title + " trailer"}
            allowFullScreen
          />
        </section>
      )}
      <section className="shell section">
        <SectionHeading
          number="02"
          label="KEEP EXPLORING"
          title="More from our imagination."
        />
        <div className="game-grid">
          {games
            .filter((g) => g.slug !== slug)
            .slice(0, 2)
            .map((g) => (
              <GameCard key={g.slug} game={g} />
            ))}
        </div>
      </section>
    </>
  );
}
export function About() {
  return (
    <>
      <PageHeader
        eyebrow="THE STUDIO"
        title="Curious minds."
        accent="Playful by nature."
      >
        We’re ooOo Games. An independent game studio rooted in Gyumri, Armenia,
        and driven by the possibilities of play.
      </PageHeader>
      <section className="shell about-story">
        <div className="about-photo">
          <img
            src={asset("/images/placeholder-investigation.jpg")}
            alt="Temporary studio workspace"
          />
          <span className="temporary-label">Temporary studio image</span>
        </div>
        <div className="prose">
          <span className="section-label">OUR STORY</span>
          <h2>
            Small studio.
            <br />
            Room for big ideas.
          </h2>
          <p>{site.about}</p>
          <p>
            We believe in pushing creative boundaries and bringing fresh ideas
            to life. Whether you’re here to explore our projects or join us on
            this journey, we’re excited to have you with us.
          </p>
          <div className="location-note">
            <MapPin size={17} /> Made in Gyumri, Armenia
          </div>
        </div>
      </section>
      <section className="shell section">
        <SectionHeading
          number="01"
          label="WHAT DRIVES US"
          title="Built around play."
        />
        <div className="values-grid">
          {[
            [
              "Stay curious",
              "Ask “what if?” Explore an unfamiliar mechanic. Give a fresh idea a chance.",
            ],
            [
              "Make it matter",
              "Bring intention to the details, from the first interaction to the final moment.",
            ],
            [
              "Create together",
              "Bring different perspectives into the same room. Make something none of us could make alone.",
            ],
          ].map(([title, body], i) => (
            <article key={title}>
              <span>0{i + 1}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="shell section">
        <SectionHeading
          number="02"
          label="THE PEOPLE BEHIND THE PLAY"
          title="Meet the team."
        />
        <p className="section-description">
          Different skills, shared curiosity. Here’s where you’ll meet the
          people making our worlds possible.
        </p>
        <div className="team-grid">
          {team.map((person, i) => (
            <article className="team-card" key={i}>
              <div className="team-photo">
                {person.photo ? (
                  <img src={asset(person.photo)} alt={person.name} />
                ) : (
                  <>
                    <UserRound size={60} strokeWidth={1} />
                    <span>YOUR PHOTO HERE</span>
                  </>
                )}
              </div>
              <h3>{person.name}</h3>
              <span className="team-role">{person.role}</span>
              <p>{person.bio}</p>
            </article>
          ))}
        </div>
      </section>
      <CallToAction />
    </>
  );
}
const serviceIcons = [Code2, Layers3, Lightbulb];
export function Services() {
  return (
    <>
      <PageHeader
        eyebrow="OUR SERVICES"
        title="Your idea."
        accent="Our next great collaboration."
      >
        From a spark of an idea to something people can play. We bring creative
        thinking and practical game development to your project.
      </PageHeader>
      <section className="shell service-list">
        {services.map((s, i) => {
          const Icon = serviceIcons[i];
          return (
            <Link
              to={"/services/" + s.slug}
              key={s.slug}
              className="service-row"
            >
              <div className="service-icon">
                <Icon size={29} strokeWidth={1.5} />
              </div>
              <div>
                <span className="section-label">0{i + 1}</span>
                <h2>{s.title}</h2>
                <p>{s.description}</p>
                <div className="badge-row">
                  {s.tags.map((t) => (
                    <Badge key={t}>{t}</Badge>
                  ))}
                </div>
              </div>
              <ArrowUpRight className="service-arrow" size={30} />
            </Link>
          );
        })}
      </section>
      <CallToAction />
    </>
  );
}
export function ServiceDetail() {
  const { slug } = useParams();
  const s = services.find((s) => s.slug === slug);
  if (!s) return <NotFound />;
  return (
    <>
      <div className="shell breadcrumb">
        <Link to="/services">
          <ArrowLeft size={15} /> All services
        </Link>
      </div>
      <PageHeader
        eyebrow={s.title}
        title={s.short}
        accent="Let’s build it together."
      >
        {s.description}
      </PageHeader>
      <div className="shell detail-body">
        <div className="prose">
          <h2>From possibility to play.</h2>
          <p>
            Every project has its own needs. We start by understanding your
            idea, audience, and goals, then shape a practical plan for bringing
            it to life.
          </p>
          <p>
            Tell us where you are in the process and what you want to achieve.
            We’ll find the right place to start.
          </p>
          <Button asChild size="lg">
            <Link to={"/contact?service=" + s.slug}>
              Discuss your project <ArrowUpRight />
            </Link>
          </Button>
        </div>
        <aside className="feature-list">
          <span className="section-label">HOW WE CAN HELP</span>
          {s.deliverables.map((f) => (
            <div key={f}>
              <Check size={17} />
              <span>{f}</span>
            </div>
          ))}
        </aside>
      </div>
      <section className="shell section">
        <SectionHeading
          number="01"
          label="MADE BY ooOo"
          title="See our thinking in action."
          to="/games"
          link="Explore our games"
        />
        <div className="game-grid">
          {games.slice(0, 2).map((g) => (
            <GameCard key={g.slug} game={g} />
          ))}
        </div>
      </section>
    </>
  );
}
export function usePosts() {
  const [posts, setPosts] = useState(seedPosts),
    [loading, setLoading] = useState(true),
    [offline, setOffline] = useState(false);
  useEffect(() => {
    let alive = true;
    api("/posts")
      .then((data) => {
        if (alive) setPosts(data.posts);
      })
      .catch(() => {
        if (alive) setOffline(true);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);
  return { posts, loading, offline };
}
export function PostCard({ post }) {
  const image = safeImage(post.image);
  return (
    <Link className="post-card" to={"/blog/" + post.slug}>
      <div className="post-image">
        {image ? (
          <img
            src={image.startsWith("/images/") ? asset(image) : image}
            alt=""
            loading="lazy"
          />
        ) : (
          <div className="post-no-image">
            <MessageSquare size={44} />
          </div>
        )}
        <Badge className="image-badge">{post.category}</Badge>
        {post.placeholder && (
          <span className="temporary-label">Sample post</span>
        )}
      </div>
      <div className="card-meta">
        <span>
          {post.date
            ? new Date(post.date + "T12:00:00").toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "From the studio"}
        </span>
        <ArrowUpRight size={16} />
      </div>
      <h3>{post.title}</h3>
      <p>{post.excerpt}</p>
    </Link>
  );
}
export function BlogHighlights() {
  const { posts } = usePosts();
  return posts.length ? (
    <div className="post-grid">
      {posts.slice(0, 3).map((p) => (
        <PostCard key={p.id} post={p} />
      ))}
    </div>
  ) : (
    <div className="empty-state">
      <MessageSquare />
      <h3>Our next chapter is on its way.</h3>
      <p>Studio stories and updates will appear here.</p>
    </div>
  );
}
export function Blog() {
  const { posts, loading } = usePosts();
  const [search, setSearch] = useState("");
  return (
    <>
      <PageHeader
        eyebrow="BLOG & NEWS"
        title="Stories from"
        accent="behind the screen."
      >
        Work in progress. Things we’ve learned. Moments worth sharing. Pull up a
        chair.
      </PageHeader>
      <section className="shell blog-section">
        <Tabs defaultValue="All">
          <div className="blog-toolbar">
            <TabsList aria-label="Post categories">
              {["All", "Blog", "News", "Events"].map((c) => (
                <TabsTrigger key={c} value={c}>
                  {c}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="search-field">
              <Search size={17} />
              <Input
                aria-label="Search posts"
                placeholder="Search the journal..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          {["All", "Blog", "News", "Events"].map((c) => {
            const filtered = posts.filter(
              (p) =>
                (c === "All" || p.category === c) &&
                (p.title + " " + p.excerpt)
                  .toLowerCase()
                  .includes(search.toLowerCase()),
            );
            return (
              <TabsContent key={c} value={c}>
                <div aria-live="polite" className="result-count">
                  {filtered.length}{" "}
                  {filtered.length === 1 ? "story" : "stories"}
                  {loading ? " · Checking for updates…" : ""}
                </div>
                {filtered.length ? (
                  <div className="post-grid">
                    {filtered.map((p) => (
                      <PostCard key={p.id} post={p} />
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <Search />
                    <h3>No stories found.</h3>
                    <p>Try a different search or category.</p>
                    {search && (
                      <Button variant="outline" onClick={() => setSearch("")}>
                        Clear search
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </section>
      <CallToAction />
    </>
  );
}
function Paragraphs({ text }) {
  return text
    .split(/\n\s*\n/)
    .filter(Boolean)
    .map((p, i) => (
      <p key={i} style={{ whiteSpace: "pre-line" }}>
        {p}
      </p>
    ));
}
export function BlogDetail() {
  const { slug } = useParams();
  const { posts, loading } = usePosts();
  const post = posts.find((p) => p.slug === slug);
  const [copied, setCopied] = useState(false);
  if (!post)
    return loading ? (
      <div className="shell empty-state" role="status">
        Loading story…
      </div>
    ) : (
      <NotFound />
    );
  const embed = videoEmbed(post.videoUrl),
    image = safeImage(post.image);
  return (
    <>
      <div className="shell breadcrumb">
        <Link to="/blog">
          <ArrowLeft size={15} /> Back to the journal
        </Link>
      </div>
      <article className="article-shell">
        <div className="badge-row">
          <Badge variant="default">{post.category}</Badge>
          {post.placeholder && (
            <Badge>Sample post · replace with your story</Badge>
          )}
        </div>
        <h1>{post.title}</h1>
        <div className="article-meta">
          <span>{post.author || site.name}</span>
          {post.date && (
            <time dateTime={post.date}>
              {new Date(post.date + "T12:00:00").toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
          )}
        </div>
        {image && (
          <img
            className="article-cover"
            src={image.startsWith("/images/") ? asset(image) : image}
            alt={post.title}
          />
        )}
        <div className="prose">
          <p className="article-lead">{post.excerpt}</p>
          <Paragraphs text={post.body} />
        </div>
        {embed && (
          <iframe
            className="video-frame"
            title={post.title + " video"}
            src={embed}
            allowFullScreen
          />
        )}
        <div className="article-share">
          <span>Share this story</span>
          <Button
            variant="outline"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(window.location.href);
                setCopied(true);
              } catch {
                setCopied(false);
              }
            }}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}{" "}
            {copied ? "Link copied" : "Copy link"}
          </Button>
          <a
            href={
              "https://www.facebook.com/sharer/sharer.php?u=" +
              encodeURIComponent(window.location.href)
            }
            target="_blank"
            rel="noreferrer"
            className="text-link"
          >
            Facebook <ExternalLink size={14} />
          </a>
        </div>
        <Comments post={post} />
      </article>
      <section className="shell section">
        <SectionHeading
          number="01"
          label="KEEP READING"
          title="A little more from the studio."
        />
        <div className="post-grid">
          {posts
            .filter((p) => p.id !== post.id)
            .slice(0, 3)
            .map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
        </div>
      </section>
    </>
  );
}
function Comments({ post }) {
  const [comments, setComments] = useState([]),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    setComments([]);
    setMessage("");
    api("/posts/" + post.slug + "/comments")
      .then((d) => setComments(d.comments))
      .catch(() => {});
  }, [post.slug]);
  async function submit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    setBusy(true);
    setMessage("");
    try {
      const data = Object.fromEntries(new FormData(form));
      await api("/posts/" + post.slug + "/comments", {
        method: "POST",
        body: JSON.stringify(data),
      });
      form.reset();
      setMessage(
        "Thank you! Your comment will appear after the studio reviews it.",
      );
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="comments">
      <h2>Join the conversation.</h2>
      {comments.map((c) => (
        <article key={c.id}>
          <strong>{c.name}</strong>
          <p>{c.message}</p>
        </article>
      ))}
      {comments.length === 0 && (
        <p className="muted-text">Be the first to share a thought.</p>
      )}
      <form onSubmit={submit}>
        <label>
          Your name
          <Input name="name" required maxLength={80} autoComplete="name" />
        </label>
        <label>
          Your comment
          <Textarea name="message" required minLength={3} maxLength={2000} />
        </label>
        <Button type="submit" disabled={busy}>
          {busy ? "Submitting…" : "Submit for review"}
          <ArrowRight />
        </Button>
        <p className="form-status" role="status">
          {message}
        </p>
      </form>
    </section>
  );
}
export function Contact() {
  const [params] = useSearchParams(),
    [busy, setBusy] = useState(false),
    [status, setStatus] = useState(""),
    [success, setSuccess] = useState(false);
  async function submit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    setBusy(true);
    setStatus("");
    try {
      await api("/contact", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      setSuccess(true);
      form.reset();
    } catch (err) {
      setStatus(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <PageHeader eyebrow="LET’S TALK" title="Something on" accent="your mind?">
        A game idea, a collaboration, or just a hello. We’d love to hear from
        you.
      </PageHeader>
      <section className="shell contact-layout">
        <aside>
          <h2>
            Good things start
            <br />
            with a conversation.
          </h2>
          <p>
            Tell us a little about your idea and where you’d like to take it.
          </p>
          <div className="contact-detail">
            <MapPin />
            <div>
              <span>FIND US</span>
              <p>{site.location}</p>
            </div>
          </div>
          {site.email && (
            <div className="contact-detail">
              <Mail />
              <div>
                <span>WRITE TO US</span>
                <a href={"mailto:" + site.email}>{site.email}</a>
              </div>
            </div>
          )}
          {site.socials.length > 0 && (
            <div className="contact-socials">
              {site.socials.map((s) => (
                <a href={s.url} key={s.name} target="_blank" rel="noreferrer">
                  {s.name}
                  <ArrowUpRight size={15} />
                </a>
              ))}
            </div>
          )}
          <span className="contact-signoff">4 O. Making games 4 all.</span>
        </aside>
        <div className="contact-form-card">
          {success ? (
            <div className="success-state" role="status">
              <CheckCircle2 size={48} />
              <h2>Your message is with us.</h2>
              <p>
                Thanks for reaching out. Your inquiry has been saved for the
                studio to review.
              </p>
              <Button variant="outline" onClick={() => setSuccess(false)}>
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={submit}>
              <div className="form-row">
                <label>
                  Your name <span>*</span>
                  <Input
                    name="name"
                    placeholder="Alex"
                    autoComplete="name"
                    required
                    maxLength={100}
                  />
                </label>
                <label>
                  Email address <span>*</span>
                  <Input
                    name="email"
                    type="email"
                    placeholder="alex@example.com"
                    autoComplete="email"
                    required
                    maxLength={254}
                  />
                </label>
              </div>
              <label>
                What’s on your mind?
                <select
                  name="service"
                  defaultValue={params.get("service") || "general"}
                >
                  <option value="general">A little bit of everything</option>
                  <option value="game-development">
                    Full game development
                  </option>
                  <option value="prototyping">Game prototyping</option>
                  <option value="game-design">Game design</option>
                  <option value="press">Press & collaboration</option>
                </select>
              </label>
              <label>
                Your message <span>*</span>
                <Textarea
                  name="message"
                  placeholder="Tell us about your idea..."
                  rows={6}
                  required
                  minLength={10}
                  maxLength={10000}
                />
              </label>
              <div className="honeypot" aria-hidden="true">
                <label>
                  Website
                  <Input name="website" tabIndex={-1} autoComplete="off" />
                </label>
              </div>
              <p className="form-note">
                We’ll use these details to respond to your inquiry. Read our{" "}
                <Link to="/privacy">privacy policy</Link>.
              </p>
              <Button type="submit" size="lg" disabled={busy}>
                {busy ? "Sending…" : "Send your message"}
                <ArrowUpRight />
              </Button>
              {status && (
                <p className="form-status error-text" role="alert">
                  {status}
                </p>
              )}
            </form>
          )}
        </div>
      </section>
    </>
  );
}
export function Legal({ type }) {
  const privacy = type === "privacy";
  return (
    <>
      <PageHeader
        eyebrow="THE FINE PRINT"
        title={privacy ? "Privacy policy" : "Terms of use"}
      />
      <div className="article-shell legal-placeholder">
        <Badge>Draft — replace before public launch</Badge>
        <div className="prose">
          <h2>{privacy ? "Your privacy matters." : "A few things to know."}</h2>
          <p>
            {privacy
              ? "This page is reserved for the studio’s final privacy policy. Add your business contact, data controller details, retention periods, and applicable visitor rights before launching."
              : "This page is reserved for the studio’s final terms of use. Add the studio’s legal details, applicable terms, and contact information before launching."}
          </p>
          {privacy && (
            <>
              <h3>How this website works</h3>
              <p>
                The contact form stores your name, email, selected topic, and
                message for the studio to review. Comments store a display name
                and message and are published only after moderation.
                Administrative sign-in uses an essential session cookie. This
                implementation does not add advertising or analytics trackers.
              </p>
              <p>
                External links, images, and embedded videos may be provided by
                other services with their own privacy practices.
              </p>
            </>
          )}
          <Button asChild variant="outline">
            <Link to="/contact">
              Contact the studio <ArrowUpRight />
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
export function NotFound() {
  return (
    <div className="shell page-header not-found">
      <Eyebrow>404 / OFF THE MAP</Eyebrow>
      <h1>
        This world is
        <br />
        <span>still undiscovered.</span>
      </h1>
      <p>
        The page you’re looking for doesn’t exist. Let’s get you back to
        familiar ground.
      </p>
      <Button asChild size="lg">
        <Link to="/">
          Back to home <ArrowLeft />
        </Link>
      </Button>
    </div>
  );
}
