import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { asset } from "../data/site";

export function Eyebrow({ children }) {
  return (
    <div className="eyebrow">
      <span />
      {children}
    </div>
  );
}

export function SectionHeading({
  number,
  label,
  title,
  to,
  link = "Explore more",
}) {
  return (
    <div className="section-heading">
      <div>
        <span className="section-label">
          {number} / {label}
        </span>
        <h2>{title}</h2>
      </div>
      {to && (
        <Link className="text-link" to={to}>
          {link}
          <ArrowUpRight size={18} />
        </Link>
      )}
    </div>
  );
}

export function GameCard({ game, index }) {
  return (
    <Link to={`/games/${game.slug}`} className="game-card">
      <div className="card-image">
        <img
          src={asset(game.image)}
          alt={
            game.temporary
              ? `Temporary mood image for ${game.title}`
              : `${game.title} artwork`
          }
          loading="lazy"
        />
        <Badge className="image-badge">{game.platform}</Badge>
        {game.temporary && (
          <span className="temporary-label">Temporary artwork</span>
        )}
        <span className="card-arrow">
          <ArrowUpRight />
        </span>
      </div>
      <div className="card-meta">
        <span>{game.category}</span>
        {index !== undefined && <span>0{index + 1}</span>}
      </div>
      <h3>{game.title}</h3>
      <p>{game.description}</p>
    </Link>
  );
}

export function CallToAction() {
  return (
    <section className="shell cta-section">
      <div>
        <span className="section-label">HAVE SOMETHING IN MIND?</span>
        <h2>
          Let’s make it <span>playable.</span>
        </h2>
      </div>
      <Button asChild size="lg">
        <Link to="/contact">
          Start a conversation <ArrowUpRight />
        </Link>
      </Button>
    </section>
  );
}
