import { useEffect, useState } from "react";
import {
  HashRouter,
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import {
  ArrowUpRight,
  Menu,
  MapPin,
  Gamepad2,
  Pause,
  Play,
  ExternalLink,
} from "lucide-react";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "./components/ui/dialog";
import { asset, games, site } from "./data/site";
import "./App.css";
import { Eyebrow, SectionHeading, CallToAction } from "./components/site";
import "./pages/pages.css";
import "./brand.css";
import Admin from "./pages/Admin";
import {
  Games,
  GameDetail,
  About,
  Services,
  ServiceDetail,
  Blog,
  BlogDetail,
  Contact,
  Legal,
  NotFound,
  BlogHighlights,
} from "./pages/PublicPages";

export function Brand() {
  return (
    <Link to="/" className="brand" aria-label="ooOo Games home">
      <img className="brand-logo" src={asset("/brand/oooo-eye.png")} alt="" />
      <span className="brand-wordmark">
        ooOo<span>GAMES</span>
      </span>
    </Link>
  );
}
function Navigation() {
  const [open, setOpen] = useState(false);
  const links = [
    ["/", "Home"],
    ["/games", "Our games"],
    ["/about", "About us"],
    ["/services", "Our services"],
    ["/blog", "Blog & news"],
  ];
  return (
    <header className="site-header">
      <div className="shell nav-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([url, title]) => (
            <NavLink key={url} to={url} end={url === "/"}>
              {title}
            </NavLink>
          ))}
        </nav>
        <Button asChild className="contact-nav">
          <Link to="/contact">
            Let’s talk <ArrowUpRight />
          </Link>
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="mobile-menu"
              aria-label="Open navigation"
            >
              <Menu />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Explore ooOo Games</DialogTitle>
            <DialogDescription>
              Games, stories, and the people behind them.
            </DialogDescription>
            <nav className="mobile-nav" aria-label="Mobile navigation">
              {[...links, ["/contact", "Let’s talk"]].map(([url, title]) => (
                <DialogClose asChild key={url}>
                  <Link to={url}>
                    {title}
                    <ArrowUpRight size={20} />
                  </Link>
                </DialogClose>
              ))}
            </nav>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}

function Home() {
  const [slide, setSlide] = useState(0),
    [paused, setPaused] = useState(
      () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  useEffect(() => {
    if (
      paused ||
      site.promoVideo ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const timer = setInterval(() => setSlide((s) => (s + 1) % 3), 6500);
    return () => clearInterval(timer);
  }, [paused]);
  return (
    <>
      <section className="hero brand-hero">
        <div className="shell hero-card">
          <div className="hero-content">
            <Eyebrow>Independent studio. Endless possibilities.</Eyebrow>
            <h1>
              Small team.
              <br />
              Big <span>imagination.</span>
              <br />
              Games for all.
            </h1>
            <p>
              We turn unexpected ideas into unforgettable play.
              <br className="desktop-break" /> Made with curiosity. Crafted in
              Armenia.
            </p>
            <div className="hero-actions">
              <Button asChild size="lg">
                <Link to="/games">
                  Explore our games <ArrowUpRight />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/about">Meet the studio</Link>
              </Button>
            </div>
          </div>
          <div className="hero-brand-art" aria-hidden="true">
            <img
              className="hero-eye"
              src={asset("/brand/oooo-eye.png")}
              alt=""
              fetchPriority="high"
            />
            <span className="ring-grid" />
            <span className="tiny-ring-grid" />
            <svg className="orbit-grid" viewBox="0 0 240 240" fill="none">
              <defs>
                <clipPath id="orbit-boundary">
                  <circle cx="120" cy="120" r="112" />
                </clipPath>
              </defs>
              <g
                transform="rotate(-24 120 120)"
                stroke="currentColor"
                strokeWidth="1.2"
              >
                <circle cx="120" cy="120" r="112" />
                <g clipPath="url(#orbit-boundary)">
                  <ellipse cx="120" cy="120" rx="43" ry="112" />
                  <ellipse cx="120" cy="120" rx="82" ry="112" />
                  <ellipse cx="120" cy="120" rx="112" ry="38" />
                  <ellipse cx="120" cy="120" rx="112" ry="80" />
                  <path d="M8 120H232M120 8V232" />
                  <path d="M12 70H228M12 170H228" strokeDasharray="2 4" />
                </g>
              </g>
            </svg>
            <span className="art-registration">oooo / 01</span>
          </div>
        </div>
        <div className="shell brand-hero-bottom">
          <div className="motto-ticket">4 O: MAKING GAMES 4 ALL</div>
          <span className="hero-location">
            <MapPin size={14} /> GYUMRI, ARMENIA
          </span>
          <span className="stripe-mark" aria-hidden="true" />
        </div>
      </section>
      <section className="showcase-band" aria-label="Game showcase">
        <div className="hero-media" aria-hidden="true">
          {site.promoVideo ? (
            <video
              src={site.promoVideo}
              autoPlay={!paused}
              muted
              loop
              playsInline
              poster={asset(games[0].hero)}
              ref={(node) => {
                if (node) paused ? node.pause() : node.play().catch(() => {});
              }}
            />
          ) : (
            [3, 1, 4].map((id, i) => (
              <img
                key={id}
                className={slide === i ? "is-active" : ""}
                src={asset(`/images/timesplit-${id}.jpg`)}
                alt=""
              />
            ))
          )}
        </div>
        <div className="showcase-overlay" />
        <div className="shell showcase-caption">
          <div>
            <span className="section-label">A LOOK INSIDE OUR WORLDS</span>
            <Link to="/games/timesplit">
              TimeSplit <ArrowUpRight size={24} />
            </Link>
          </div>
          <div className="showcase-controls">
            <span>IN DEVELOPMENT / PC</span>
            <button
              className="playback"
              onClick={() => setPaused(!paused)}
              aria-label={paused ? "Resume showcase" : "Pause showcase"}
            >
              {paused ? <Play size={16} /> : <Pause size={16} />}
            </button>
          </div>
        </div>
      </section>
      <div className="studio-strip">
        <div className="shell">
          <span>
            4 O. <strong>Making games 4 all.</strong>
          </span>
          <div>
            PC <span>✳</span> MOBILE <span>✳</span> VIRTUAL REALITY{" "}
            <span>✳</span> INDEPENDENT SPIRIT
          </div>
        </div>
      </div>
      <div className="inverted-panel">
        <section className="shell intro-section">
          <div>
            <span className="section-label">01 / HELLO, WE’RE ooOo</span>
            <p className="intro-statement">
              Good games start with
              <br />a little <span>“what if?”</span>
            </p>
          </div>
          <div className="intro-copy">
            <p>{site.intro}</p>
            <p>
              We believe the best ideas are worth playing. So we make them real.
            </p>
            <Link className="text-link" to="/about">
              A little more about us <ArrowUpRight size={18} />
            </Link>
          </div>
        </section>
      </div>
      <section className="shell section">
        <SectionHeading
          number="02"
          label="IN THE SPOTLIGHT"
          title="Meet your next obsession."
          to="/games"
          link="All our games"
        />
        <div className="featured-game">
          <Link to="/games/timesplit" className="featured-image">
            <img
              src={asset("/images/timesplit-cover.jpg")}
              alt="TimeSplit official key art"
              loading="lazy"
            />
            <span className="featured-image-label">ooOo ORIGINAL</span>
          </Link>
          <div className="featured-copy">
            <div className="badge-row">
              <Badge variant="default">Featured game</Badge>
              <Badge>Coming soon</Badge>
            </div>
            <h3>TimeSplit</h3>
            <p>{games[0].description}</p>
            <div className="platform-label">
              <Gamepad2 size={18} /> PC <span>•</span> ACTION FPS
            </div>
            <div className="featured-actions">
              <Button asChild>
                <Link to="/games/timesplit">
                  Discover TimeSplit <ArrowUpRight />
                </Link>
              </Button>
              <a
                className="text-link muted-link"
                href={games[0].link}
                target="_blank"
                rel="noreferrer"
              >
                Steam <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className="shell section">
        <SectionHeading
          number="03"
          label="FROM THE STUDIO"
          title="Behind the play."
          to="/blog"
          link="All updates"
        />
        <BlogHighlights />
      </section>
      <CallToAction />
    </>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-top">
        <div>
          <Brand />
          <p>
            4 O. Making games 4 all.
            <br />
            Independent games from Gyumri, Armenia.
          </p>
        </div>
        <div className="footer-links">
          <div>
            <span>EXPLORE</span>
            <Link to="/games">Our games</Link>
            <Link to="/about">About us</Link>
            <Link to="/services">Our services</Link>
          </div>
          <div>
            <span>STAY IN THE LOOP</span>
            <Link to="/blog">Blog & news</Link>
            <Link to="/contact">Get in touch</Link>
            {site.socials.map((s) => (
              <a key={s.name} href={s.url} target="_blank" rel="noreferrer">
                {s.name}
                <ArrowUpRight size={12} />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>
          © {new Date().getFullYear()} ooOo Games. All rights reserved.
        </span>
        <div>
          <Link to="/privacy">Privacy policy</Link>
          <Link to="/terms">Terms of use</Link>
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
function ScrollManager() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    const part = pathname.split("/").filter(Boolean).pop();
    document.title = `${part ? part.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) + " — " : ""}ooOo Games`;
  }, [pathname]);
  return null;
}
export default function App() {
  return (
    <HashRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <ScrollManager />
      <a
        href="#main-content"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main-content").focus();
        }}
      >
        Skip to content
      </a>
      <Navigation />
      <main id="main-content" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<Games />} />
          <Route path="/games/:slug" element={<GameDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Legal type="privacy" />} />
          <Route path="/terms" element={<Legal type="terms" />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </HashRouter>
  );
}
