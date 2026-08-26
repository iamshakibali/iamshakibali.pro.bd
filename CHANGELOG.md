# Changelog

All notable changes to [iamshakibali.pro.bd](https://iamshakibali.pro.bd/) — Shakib Ali's personal portfolio.

## 2026-08-26

### Site chrome & navigation
- Header and dock are now permanent chrome on every page — only the page content changes; the header also sticks to the top while scrolling
- Dock renamed: Playground → **Craft**, Skills → **Stack** (routes unchanged); stub pages added for Work, Craft, and Stack

### Work page
- New **Experience** section: vertical timeline with logo tile, rail with bottom curl, and a pulsing dot on the current role
- Four entries — Vivetica AG (current), Orbix Studio, ScreensDesigns, Hashtagfox OÜ — each with logo, role, duration, location, clickable highlights, and skill tags
- Heading scrambles in; entries fade up in a stagger

### Hero
- GitHub activity graph now shows **real contribution data** (live from GitHub): hover any cell for that day's count, weeks aligned Sunday–Saturday, month labels, clip-and-swipe on mobile
- Graph cells enlarged to 10px — the latest 41 weeks fill the content margin
- Bio rewritten: "Previously," removed, new line rhythm

### Pill hover cards (X / GitHub / LinkedIn)
- GitHub card grid rebuilt at hero scale: tiny monochrome cells using the exact same level colors as the hero graph (theme-aware)
- All three cards now share **one morphing frame** that glides between buttons and smoothly tweens its height (GitHub's card is shorter) instead of jumping

### Site-wide
- **Dark mode is now the default** for all visitors
- Themed favicon: dark icon in dark mode, light icon in light mode
- Browser tab title set to "Iamshakibali | Design Engineer"

## 2026-08-25

### Badge video popups
- Re-enabled the badge popup cards; **Vivetica**, **Orbix Studio**, and **ScreensDesign** now play screen recordings of each site (cropped to remove the black bars baked into the source recordings); Pintop's popup is disabled
- Per-badge card sizing: Vivetica/Orbix/Screens at 290px wide with height following the video aspect ratio; default stays 200×118
- Hydration fix: popups render through a portal to `document.body` (a `<div>` may not nest inside the bio `<p>`), with scroll/resize re-anchoring

### Pill hover cards
- The X, GitHub, and LinkedIn hover cards merged into **one shared card that morphs** — it glides between buttons (160ms ease-out) while content crossfades, instead of jumping
- Rolling number tickers on all counts (X 220/72, LinkedIn 844/500+, GitHub 250+ contributions); all three cards equalized to 175px

### Signature
- Welcome handoff eased with the shared ease-out curve: fast launch, brake, smooth settle
- Magnetic ink: the resting signature leans toward a nearby cursor (≤3px drift + ≤1.2° tilt, soft spring) and settles back on leave

## 2026-08-24

### Description logo badges
- Added interactive inline badges to the hero bio for **Vivetica**, **Orbix Studio**, **ScreensDesign**, and **Pintop**
- Each badge opens a cursor-following popup card (290×118, clamped to the viewport) with the logo and label
- Each badge is an outbound link: [viveticacapital.ch](https://viveticacapital.ch), [orbix.studio](https://www.orbix.studio/), [screensdesign.com](https://screensdesign.com), [Pintop on GitHub](https://github.com/iamshakibali/pin-top)
- Vivetica wordmark (hardcoded black SVG) now inverts in dark mode so it stays visible

### Cursor-follow physics
- Fixed the popup cards flying past their position on fast mouse sweeps — replaced the underdamped spring with a 160ms ease-out tween (cannot overshoot) on **all** hover cards: description badges, X, LinkedIn, GitHub, and the header GIF card
- Edge clamping now uses the real visible width (scrollbar excluded)

### Visual & UX polish
- Unified hover-card shadows across X, LinkedIn, GitHub, and GIF cards (`0 53px 79px rgba(0,0,0,.1)`); description badge card keeps its spec shadow
- Dimmed the bio description text (logo names stay full-strength)
- Disabled native image dragging site-wide
- Pointer cursor on all description badges
- Mobile responsiveness: the "Previously, I worked…" line stays on one line on desktop and wraps on mobile

## 2026-08-22

- Rewrote README as a personal portfolio intro
- Removed unused assets and untracked local dev files

## 2026-08-21

### Welcome loader
- Added a multilingual greeting loader (Hello → Bonjour → স্বাগতম → 你好 → こんにちは) that plays on every page load and hands off to the hero signature

### Hover cards & hero polish
- X and LinkedIn hover cards with zoomed avatars, follower stats, and Follow pills
- Bottom tooltips for the theme toggle and reactions
- Hero first-load choreography (staggered fade-ups), pill button copy/glide refinements, header reveal
- TextScramble fixes: animates on first mount in production, wraps properly on mobile

## 2026-08-20

### Hero buildout
- Hero section with signature logo, Overused Grotesk greeting, and magnetic motion buttons
- Figma-based pill buttons (email, X, GitHub, LinkedIn) with copy-to-clipboard
- GitHub contributions hover card (290×146 grid, theme-aware icon)
- GIF hover card on the top-left logo that follows the cursor, plus a live session timer
- X/Y coordinate tracker in the header
- Theme toggle with View Transition animations (light default)
- Switched to the Geist font family

### Infrastructure
- Configured static export and GitHub Pages deployment with custom domain (`CNAME`)

## 2026-08-19

- Project kickoff: design spec and implementation plan
- Scaffolded the Next.js app (initially with a three.js scene, later replaced by the current hero)
- Dark root layout with content-driven metadata
- Placeholder resume asset
