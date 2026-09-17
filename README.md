# ooOo Games website

A responsive React website using shadcn/ui components based on Radix, Tailwind CSS, and Lucide icons. Built in the existing Create React App project, with the structure from the three supplied documents. The current visual identity follows the supplied black-and-white ooOo business cards: geometric uppercase type, outlined dot grids, diagonal stripes, angular borders, and an inverted white studio section.

## Run locally

Requires Node.js 22.9+ (Node 24 recommended).

```sh
npm install
npm run server
```

In a second terminal:

```sh
npm start
```

Open http://127.0.0.1:3000/oooogames. Navigation uses hash routes to remain compatible with the existing GitHub Pages setup. The development server proxies /api and /uploads to the studio server on port 3001.

## Administrator setup

```sh
npm run admin:setup
```

This generates a strong random administrator password, displays it once, and writes only its scrypt hash to the ignored .env file. Save the password, restart `npm run server`, and open http://127.0.0.1:3000/oooogames/#/admin. Existing .env files are never overwritten by setup.

If .env already exists, generate a hash using the exported `passwordHash` helper in `server/app.mjs` and set ADMIN_PASSWORD_HASH. Never put credentials in REACT_APP_ variables. To rotate a password, replace the hash and restart the server; sessions are invalidated on restart.

Administration has no default password and is not linked in public navigation. Authorization is enforced on the server. Sessions use HttpOnly, SameSite=Strict cookies; production additionally uses Secure. Mutating requests require an allowed Origin, and login/contact/comment routes have basic IP rate limits.

The editor supports draft/published posts, Blog/News/Events categories, image uploads, YouTube/Vimeo videos, comment moderation, and contact inquiries. Unapproved comments and draft posts are never returned by public APIs. A contact success means the inquiry was saved in the admin inbox; there is no email-delivery service configured.

## Replace placeholder content

- `src/data/site.js`: studio text, contact details, social links, team profiles, game descriptions, store links, screenshots, and service descriptions.
- Set `site.promoVideo` to the final MP4/WebM URL to replace the home slideshow with a muted looping video.
- Each game’s `trailer` accepts a YouTube or Vimeo link.
- `public/images/`: replace the three temporary stock images and add team photos.
- `src/data/posts.json`: seed posts for a fresh content store and fallback preview. All supplied posts are explicitly labeled samples.
- After first server start, edit posts through the admin panel; changing the seed does not overwrite saved content.
- Privacy and terms pages are labeled draft placeholders for the studio’s final text.
- The supplied eye logo is stored unchanged at `public/brand/oooo-eye.png` and used in the header, hero, footer, and favicon.
- `src/brand.css` contains the business-card-inspired monochrome design. Game images use a reversible CSS grayscale filter; original assets retain their colors.
- The local Chakra Petch and Space Grotesk fonts and their OFL licenses live in `public/fonts/`.

## Storage and deployment

The Node server persists posts, inquiries, comments, and uploaded images in the ignored `.data/` directory. Back it up and keep it on persistent storage. This is a small, single-process studio backend; do not run multiple writers against the JSON store.

```sh
npm run build
npm run server
```

The server serves the production build at http://127.0.0.1:3001/oooogames/. For a real deployment, place it behind HTTPS, set NODE_ENV=production and PUBLIC_ORIGIN to the exact external origin (no trailing slash), configure the host/port through environment variables, and preserve .data. HTTP Origin forwarding must remain intact through the reverse proxy.

The existing `npm run deploy` still deploys the frontend to GitHub Pages. GitHub Pages cannot run the Node API: deploy the backend separately and configure an appropriate same-origin reverse proxy, or host both on the Node server. Without a backend, the frontend shows sample posts and contact/admin actions report that the server is unavailable rather than claiming success.

## Checks

```sh
npm run build
npm run test:server
npm test -- --watchAll=false
```

API tests use isolated temporary directories and cover authorization, CSRF origin checks, draft visibility, publishing, duplicate slugs, persistent storage, comment moderation, contact validation, and upload validation.

## Sources and assets

Content and structure:

- https://docs.google.com/document/d/1TbMjrrJjPY0LnA24H7_znvu7jQcwR7kVGGqgd0f15Jo/
- https://docs.google.com/document/d/16SfImJm8JuioJRdstvMrA3PMsQFREW3fwio_hSDtZ5Y/
- https://docs.google.com/document/d/1pNULDAeuS2UdCPPpANs2TR9FYRcr-Q9rF-q9xmsMhQY/

Initial layout reference: https://mindlabz.studio/

Current branding references: the four Google Drive business cards and the supplied ooOo_Logo_2.0.png.

- https://drive.google.com/file/d/1ixx2RbMsIjmUcBuv4ztpZu_hPDQQFdeG/view
- https://drive.google.com/file/d/1xb-gLhKIqZmko5DI2bDkKWzUl0Gtci37/view
- https://drive.google.com/file/d/17_XWOoZuq9mX1iMLrQtXKZcqXvXjmVHp/view
- https://drive.google.com/file/d/1KMIbdbpTGhEHORvt2Lfkh0vGq9H2Hlmw/view

TimeSplit key art and screenshots: the studio’s official Steam listing at https://store.steampowered.com/app/3781610/TimeSplit/. TimeSplit’s current listing supplies the gameplay description and coming-soon status.

Temporary stock imagery (Unsplash license):

- Workspace: Kevin Canlas, https://unsplash.com/photos/ia7-T2bjDb4
- Coral reef: NEOM, https://unsplash.com/photos/HYHYGLs-Rp8
- VR: https://unsplash.com/s/photos/oculus — source image photo-1588590560438-5e27fe3f6b71

UI primitives follow the shadcn/ui composition patterns (MIT) using Radix, class-variance-authority, and Tailwind. Theme and page layouts are custom.
