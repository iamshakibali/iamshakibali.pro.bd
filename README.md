# Shakib Ali

**Product Design Engineer**: I design and build digital products end to end.

🌐 **[iamshakibali.pro.bd](https://iamshakibali.pro.bd)**

---

## About

I'm Shakib, based in Bangladesh and working globally. I started with design, but my curiosity about how things work pulled me toward code.

I'm currently a **Product Designer at [Pathao](https://pathao.com)**, building design frameworks and systems. Before that I worked with [Vivetica](https://viveticacapital.ch), [Orbix Studio](https://www.orbix.studio/) and [ScreensDesign](https://screensdesign.com).

Outside of work I build and open-source apps like [Pintop](https://github.com/iamshakibali/pin-top), which pins any macOS window always-on-top, and [Spanorama](https://github.com/iamshakibali/Spanorama). I also make [YouTube videos](https://www.youtube.com/@Iamshakibali) to help and inspire fellow creatives.

## This Site

My personal portfolio, designed and built from scratch as one continuous experience.

**Home**
- **Multilingual welcome loader**: greetings crossfade through English, French, Bengali, Chinese and Japanese, then the signature animates out of the loader and lands in the hero
- **Scroll-filled path**: a dashed line down the page fills as you read, with station dots that blink as you reach each section
- **3D contribution graph**: live GitHub contributions; click the graph and it flies toward you, the page fades away, and it tilts into an isometric view with each day rising as a column
- **Craft strip**: autoplaying video cards of recent builds, draggable with the mouse, with momentum and snapping
- **Cursor-follow hover cards** for GitHub, LinkedIn and X, and logo badges that preview past work on hover

**Work**
- Experience timeline with expandable roles

**Details**
- **Pull-cord theme toggle**: a light bulb with a rope you drag down to switch theme. The rope is a small physics simulation (gravity, a stretchy cord, a weighted knob), and the switch uses the View Transition API (circle-blur reveal)
- **Custom motion system**: spring buttons, tooltips, emoji reactions, text scramble, number tickers, a floating dock
- **Respects reduced motion** throughout

## Tech Stack

| Layer      | Tools                                                     |
| ---------- | --------------------------------------------------------- |
| Framework  | Next.js 16 (App Router, static export), React 19, TypeScript |
| Styling    | Tailwind CSS v4, CSS View Transitions, next-themes        |
| Motion     | Motion (motion/react) + custom components, CSS 3D transforms |
| Typography | Geist Sans & Mono, Overused Grotesk                       |
| Hosting    | GitHub Pages with a custom domain, deployed via GitHub Actions |

## Run Locally

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static export to ./out
```

Site content (experience, projects, links) lives in `lib/content.ts`, and craft videos are listed in `lib/craft.ts`.

---

© 2026 Shakib Ali
