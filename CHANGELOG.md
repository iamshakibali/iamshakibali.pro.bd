# Changelog

All notable changes to [iamshakibali.pro.bd](https://iamshakibali.pro.bd/) — Shakib Ali's personal portfolio.

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
