// Centralized editable studio content. Empty fields intentionally await final materials.
export const site = {
  name: "ooOo Games",
  location: "Gyumri, Armenia",
  email: "",
  phone: "",
  promoVideo: "",
  socials: [],
  intro:
    "We’re an indie game studio from Gyumri, Armenia. A small team of curious minds, bringing fresh ideas to life through games that challenge the ordinary.",
  about:
    "Our games blend dynamic mechanics, engaging storytelling, and bold creativity. From fast-paced action to unexpected adventures, we create worlds you can get lost in — and experiences that stay with you.",
};
export const asset = (path) => `${process.env.PUBLIC_URL || ""}${path}`;
export const games = [
  {
    slug: "timesplit",
    title: "TimeSplit",
    category: "Action · First-person shooter",
    platform: "PC",
    status: "Coming soon",
    image: "/images/timesplit-cover.jpg",
    hero: "/images/timesplit-3.jpg",
    description:
      "Bend the rules. Rewind the fight. A fast-paced cartoon FPS where time is your most powerful weapon.",
    body: "Step into a world where machines have taken over the hard work — and something has gone terribly wrong. Master a mechanical body and a powerful watch, take on rogue machines, and turn every battle into a playground of timing and strategy.",
    features: [
      "Bend, pause, and rewind time",
      "Fast-paced first-person combat",
      "Creative weapons and abilities",
      "A stylized world of machines and mystery",
    ],
    screenshots: [0, 1, 2, 3, 4].map((i) => `/images/timesplit-${i}.jpg`),
    link: "https://store.steampowered.com/app/3781610/TimeSplit/",
    linkLabel: "Wishlist on Steam",
    trailer: "",
    temporary: false,
  },
  {
    slug: "truth-dealer",
    title: "Truth Dealer",
    category: "Simulation · Puzzle",
    platform: "Android / iOS",
    status: "Studio project",
    image: "/images/placeholder-investigation.jpg",
    temporary: true,
    description:
      "Look closer. Question everything. Put your fact-checking instincts to the test as a digital investigator.",
    body: "Verify news articles, suspicious links, and social media accounts under pressure. Inspired by Papers, Please, Truth Dealer turns media literacy into a simulation puzzle game, challenging you to separate the genuine from the misleading.",
    origin: "Developed for the HackToCheck Hackathon.",
    originLink: "https://hack2check.pjc.am/en/",
    features: [
      "Investigate news and social accounts",
      "Spot misleading links and fake information",
      "Make decisions against the clock",
    ],
    screenshots: [],
    link: "",
    trailer: "",
  },
  {
    slug: "gtc-sandbox-vr",
    title: "GTC Sandbox VR",
    category: "Virtual reality · Sandbox",
    platform: "VR",
    status: "Studio project",
    image: "/images/placeholder-vr.jpg",
    temporary: true,
    description:
      "A familiar place. A whole new reality. Explore, play, and experiment inside a virtual GTC.",
    body: "Explore the Coca-Cola Laboratory at the Gyumri Technology Center, reimagined as a virtual playground. Discover an interactive mix of minigames, classic challenges, and shooting experiences.",
    origin: "Created for the Gyumri Game Conference.",
    originLink:
      "https://www.facebook.com/p/Gyumri-Game-Conference-61550260263635/",
    features: [
      "Explore the GTC laboratory in VR",
      "Play a collection of interactive minigames",
      "Discover shooting and skill challenges",
    ],
    screenshots: [],
    link: "",
    trailer: "",
  },
  {
    slug: "puffs-adventure",
    title: "Puff’s Adventure",
    category: "Adventure · 3D platformer",
    platform: "PC",
    status: "Game jam project",
    image: "/images/placeholder-ocean.jpg",
    temporary: true,
    description:
      "One little pufferfish. One big adventure. Save your reef with the ancient art of bubbles.",
    body: "Step into the fins of Puff, a brave little pufferfish determined to save their home from a greedy reef king. Navigate an underwater world, solve puzzles, and stand up to oppression in a 3D platformer full of charm, humor, and a little rebellion.",
    origin: "Created during Global Game Jam 2025.",
    originLink: "https://globalgamejam.org/",
    features: [
      "Explore a playful underwater world",
      "Solve puzzles with bubble powers",
      "Stand up to a greedy reef king",
    ],
    screenshots: [],
    link: "",
    trailer: "",
  },
];
export const services = [
  {
    slug: "game-development",
    title: "Full game development",
    short: "From the first idea to the final build.",
    description:
      "We bring games to life for PC, mobile, and VR. A complete creative and technical partnership, shaped around your project.",
    tags: ["PC", "Mobile", "VR"],
    deliverables: [
      "Concept and production planning",
      "Gameplay systems and development",
      "Art and interface integration",
      "Testing, optimization, and launch support",
    ],
  },
  {
    slug: "prototyping",
    title: "Game prototyping",
    short: "Find the fun. Then build on it.",
    description:
      "Turn your idea into something playable. Test the mechanics, explore the possibilities, and make your next decision with a controller in hand.",
    tags: ["Playable prototypes", "Mechanics"],
    deliverables: [
      "Core gameplay experiments",
      "Rapid playable prototypes",
      "Mechanics testing and iteration",
      "Interactive demos for events and showcases",
    ],
  },
  {
    slug: "game-design",
    title: "Game design",
    short: "Make every interaction matter.",
    description:
      "Compelling systems, thoughtful progression, and experiences built around the player. We help your game find its own voice.",
    tags: ["Systems", "Player experience"],
    deliverables: [
      "Gameplay concepts and documentation",
      "Core loops and progression",
      "Level and interaction design",
      "Playtesting and design iteration",
    ],
  },
];
export const team = [
  {
    name: "Your name here",
    role: "Game developer",
    bio: "Add a short introduction, specialties, and a favorite part of making games.",
    photo: "",
    initials: "01",
  },
  {
    name: "Your name here",
    role: "Game designer",
    bio: "Introduce the person behind the mechanics, worlds, and player experiences.",
    photo: "",
    initials: "02",
  },
  {
    name: "Your name here",
    role: "Artist",
    bio: "Share a little about the creative mind shaping the studio’s visual worlds.",
    photo: "",
    initials: "03",
  },
];
