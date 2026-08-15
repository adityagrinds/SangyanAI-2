# Project Redesign Spec — SangyanAI (v2)
### A 3D, animation-first frontend for a crisis-response AI platform. UI ONLY. No backend. Mock data.
### Name stays: SangyanAI. Everything else — visuals, motion, color — gets rebuilt to premium-studio standard.

---

## 0. The pitch you're keeping

Original SangyanAI = multi-agent crisis response: live earthquake data (USGS) + weather (Open-Meteo) → 3-stage AI pipeline (Monitor → Analyzer → Responder) → real-time incident map + feed.

**What you're changing:**
- New visual identity, new color system, heavy 3D/motion
- No live backend for now — everything driven by mock JSON + `setInterval` fake "live" updates
- AI provider swapped later (not Llama 70B/Groq) — for now, the pipeline UI just needs to *look* like it's reasoning (streaming text, animated agent states)
- Goal: looks like a funded startup's product page, not a hackathon CRUD app

Rename it if you want — something short, ownable, not generic. Options: **Aegis**, **Sentinel**, **Vigil**, **Pulse**, **Meridian**, **Wayfinder**. I'll use "Aegis" below — swap freely.

---

## 1. Tech stack (UI-only, zero backend)

```
Framework:        React + Vite (or Next.js if you want easy Vercel deploy + routing)
Styling:          Tailwind CSS
Animation (2D):   Framer Motion (component/page transitions, hover states)
Animation (scroll):  GSAP + ScrollTrigger (pinned sections, scrub animations)
Smooth scroll:    Lenis
3D:               React Three Fiber (@react-three/fiber) + @react-three/drei
Globe/Map:        Globe.gl OR a custom R3F globe with instanced points (no backend needed — static/mock geojson)
Icons:            lucide-react
Fonts:            Space Grotesk / Clash Display (headers) + Inter (body) — via fontshare.com or Google Fonts
Charts (fake data): Recharts or visx, fed by local mock JSON
Deploy:           Vercel
```

Everything runs client-side. "Live" incidents = a mock array you loop through with random severity/location, updated every few seconds with `setInterval` so it visually behaves like Socket.IO without needing a server.

---

## 2. Color system — go look at real premium sites first

The "generic AI startup" look (violet-to-blue gradient on black, Inter font, glowing blob) is what every ChatGPT-wrapper site looks like now. Judges have seen it 50 times this year. Avoid it on purpose.

**Before building, actually open these and screenshot what you like:**
- **stripe.com** — restrained color, huge whitespace, one accent used sparingly
- **linear.app** — near-black with a single precise accent, no gradients everywhere
- **lusion.co** (Awwwards Site of the Month, 3D-heavy studio site) — moody, cinematic, desaturated with one hot accent
- **jeton.com** (Awwwards SOTD, fintech) — proves 3D + motion + premium color can coexist with usability
- **Awwwards "Color Exploration" collection** (awwwards.com/awwwards/collections/color-exploration) — browse for 10 mins, note which 2 palettes you keep coming back to

The pattern in almost all award-winning dark sites: **one true accent color, not three.** A near-black/charcoal base, off-white (not pure white) text, and ONE saturated hero color used deliberately — plus a second muted/desaturated tone for secondary states. That restraint is what reads as expensive; three neon accents fighting each other reads as a hackathon template.

### Recommended direction — "Deep Signal" (crisis-ops meets premium studio)
```
--bg-base:      #08090C   (near-black charcoal, slightly warm — not pure #000)
--bg-elevated:  #101216
--surface:      rgba(255,255,255,0.035)   (glass cards, blur-xl over this)
--border:       rgba(255,255,255,0.07)
--text-primary: #ECEDEF   (off-white, never pure #FFF — pure white looks cheap on dark)
--text-muted:   #83868F

--accent-hero:  #FF4D2E   (a hot signal-orange/red — alert, urgency, "crisis" without being generic AI-purple)
--accent-support: #C9CDD3  (cool desaturated grey-blue, for secondary highlights, NOT another saturated color)
--accent-success: #3ECF8E  (single sparing use — Responder agent "resolved" states only)

--gradient:     used ONLY on the globe glow and one hero underline, not everywhere
                radial-gradient(circle, rgba(255,77,46,0.35), transparent 70%)
```

**Why this works for your subject matter:** orange/red as the single hero accent literally means "alert/signal" — it's on-theme for a crisis platform instead of arbitrary. Everything else stays near-monochrome so that accent actually pops when something happens (an incident pings on the globe, an agent activates). Color becomes *information*, not decoration — that's the premium-site trick.

If orange doesn't feel right, the same restraint rule works with any single hero hue — e.g. deep amber (#FFB020), cold cyan-white (#7DD3FC), or acid lime (#C6FF3D) each read premium if you commit to ONE and keep the rest of the palette near-monochrome. Don't pick three.

### Typography (this matters as much as color)
```
Display/Headlines: "General Sans" or "Clash Display" (fontshare.com, free) — geometric, confident, not another Space Grotesk everyone uses
Body:               "Inter" or "Satoshi" (fontshare.com)
Monospace accents:  "JetBrains Mono" — for stats, coordinates, timestamps, agent status logs (reinforces the "technical/ops" feel)
```
Set generous letter-spacing on all-caps labels (e.g. section eyebrows like "HOW IT WORKS"), tight tracking on big display headlines, and use a fluid type scale (`clamp()`) so the hero headline is genuinely huge on desktop.

---

## 3. Page structure & the exact 3D/motion moment for each section

### A. Navbar
- Fixed, transparent → blurs/solidifies on scroll (Framer Motion `useScroll`)
- Logo with subtle animated glow/pulse (CSS or R3F shader plane)
- Nav links underline-on-hover with a sliding gradient indicator

### B. Hero — the opening globe (this IS the website in judges' memory)

This should be the very first thing that renders, before any headline finishes fading in.

**Sequence on page load:**
1. Black screen, ~300ms
2. A thin loading indicator (a single animated line or the SangyanAI wordmark tracing itself in, SVG stroke-dashoffset animation) — 400-600ms, feels intentional not like a delay
3. The **3D globe** materializes: starts small/scaled-down and slightly rotated, then scales up and spins into its resting position with an eased motion (GSAP or Framer Motion `useAnimation`, ease `power3.out`, ~1.2s) — this "arrival" motion is what makes it feel expensive vs. a globe that's just static on load
4. As the globe settles, glowing points ignite one-by-one across different countries/continents (stagger each point's fade+scale-in by 60-100ms) — these represent live incidents (earthquake in Japan, flood in Bangladesh, storm in Philippines, etc. — spread mock points across every continent so the globe reads as *global*, not clustered)
5. Headline and subheadline fade/slide in AFTER the globe has mostly settled (~800ms in), not simultaneously — sequencing beats simultaneity for a premium feel
6. Globe then continues a slow, continuous idle rotation forever, with points pulsing outward in radar-ring style at staggered random intervals, and occasional glowing arcs animating between two points (data "traveling" between incidents)

**Interaction:**
- Mouse-driven parallax: globe rotation subtly leads/lags the cursor (drag-to-rotate optional, but even passive parallax sells "real 3D")
- Hover a glow point → a small tooltip/label appears with the mock location + incident type, point scales up
- On scroll, the globe doesn't just disappear — it shrinks/moves into a fixed corner position or fades with a slight zoom, so it feels connected to the next section rather than cutting away

**Build notes:**
- Use `@react-three/drei`'s `<Sphere>` with a starfield/wireframe texture, or Globe.gl for country outlines pre-baked — Globe.gl is faster to get "countries visibly rendered" correct without hand-building geometry
- Points = instanced meshes or simple `<Points>`, not 20 separate mesh objects (perf)
- Wrap in `<Suspense fallback={<MinimalLoader />}>` so slower devices don't see a blank frame

Headline: big, bold, off-white text with the single accent color used only on one word or an underline stroke (not the whole headline gradient-filled — restraint, see color section). e.g. "AI that sees the crisis before you do" with just "crisis" in `--accent-hero`.
Subheadline + two CTAs ("Try Live Demo" / "View on GitHub").
Scroll-down indicator: a subtle animated line, not a cartoonish bouncing chevron.

### C. Stats strip
- 3–4 animated counters (e.g., "2,400+ incidents simulated", "3 AI agents", "<400ms response") that count up on scroll-into-view (`framer-motion` `useInView` + a counter hook)

### D. "How it works" — the 3-agent pipeline (this is your core differentiator, make it the second hero moment)
- Horizontal (desktop) / vertical (mobile) pipeline: **Monitor → Analyzer → Responder**
- Each stage = a floating glass card with a distinct accent color from your palette
- Animated connector lines between cards: a glowing dot travels along an SVG path (GSAP MotionPath or Framer Motion `offsetPath`) from card to card, looping
- On scroll (GSAP ScrollTrigger, pinned section): as user scrolls, each agent card "activates" in sequence — glow intensifies, a mock JSON/text stream types out inside it (like the AI "thinking"), then hands off to the next
- This single section, done well, is what wins hackathon UI awards — it visually explains your architecture without a slide

### E. Live dashboard preview
- A framed "product screenshot" mockup (browser chrome or device frame) showing:
  - Incident feed (glass cards, severity color-coded, fake timestamps ticking up "2s ago")
  - A 2D or embedded mini version of the 3D globe/map
  - Cards use 3D tilt-on-hover (react-parallax-tilt or a simple mousemove transform)
- Fake "live" badge with a pulsing dot + incrementing counter to sell realism

### F. Tech/architecture showcase
- Floating 3D icons/logos (React, your AI provider, MongoDB-style icon, etc.) arranged in a loose orbit, slow auto-rotate, tilt on hover
- Or a simple animated node-graph diagram (SVG + Framer Motion) mirroring your actual architecture

### G. "Why it matters" / impact section
- Split layout: text left, animated illustration right (e.g., a stylized 3D "shield" or "radar dish" model — can source a free low-poly .glb from Sketchfab/Poly Haven, or build primitives in R3F: cone + torus + emissive sphere)

### H. CTA section
- Full-bleed gradient or animated shader background (a simple R3F fullscreen shader plane with noise, or CSS animated gradient mesh — cheaper option: use `https://www.shadergradient.co/` export)
- Big button, subtle particle drift

### I. Footer
- Minimal, dark, links + socials + GitHub repo link + your name/team for hackathon credit

---

## 4. Global click-reaction system ("every click animates the page")

This is a site-wide behavior, not a per-section thing — build it once, apply everywhere.

**The mechanism:** a single top-level `<ClickRipple />` component mounted once in your root layout, listening for all clicks on interactive elements (buttons, cards, nav links).

- On any click: spawn a radial ripple/shockwave from the click coordinates (CSS `@keyframes` scale+fade, or a Framer Motion `AnimatePresence`-managed div) — this is cheap, works everywhere, and ties every click to the same visual language as your globe's "radar ping" points (reuse the same easing/shape — this repetition is what makes the whole site feel like one coherent system instead of a pile of random effects)
- Depending on what was clicked, layer on a *secondary* reaction so it doesn't feel like the same gimmick everywhere:
  - **Nav link click →** page content does a quick directional wipe/slide transition (Framer Motion `AnimatePresence` on route change, ~300-400ms)
  - **CTA button click →** button itself does a scale-punch + the ripple, and (if it triggers a section scroll) the destination section does its entrance animation slightly early/eager so it feels responsive
  - **Incident/agent card click →** card flips or expands in place (Framer Motion `layout` animations handle this well — wrap cards in `<motion.div layout>` and toggle expanded state; Framer auto-animates the size/position change)
  - **Globe point click →** camera/view subtly pushes in toward that point, a detail panel slides in from the side
- Keep ripple duration short (400-600ms) and easing snappy (`ease-out`) — a slow ripple reads as laggy, not premium
- Respect `prefers-reduced-motion`: disable ripple + large transitions, keep only opacity fades

This single system, applied consistently, is what makes reviewers say "wow, everything reacts" without you hand-building a unique animation for every single element.

## 5. Micro-interactions that separate "hackathon project" from "$100k product"

- Custom cursor (a soft glowing dot that scales up over interactive elements)
- Page transition on route change (fade + slight scale, Framer Motion `AnimatePresence`)
- Every button: scale + glow on hover, subtle press-down on click
- Skeleton/shimmer loading states instead of blank flashes (even with mock data, fake a 400ms load)
- Scroll progress bar at top
- Section reveal-on-scroll: fade + translateY, staggered for grouped elements (never animate everything identically — stagger by 60–100ms)
- Respect `prefers-reduced-motion` (turns off heavy 3D/parallax) — judges notice accessibility care
- 60fps discipline: lazy-load the R3F canvas below the fold with `<Suspense>` + `React.lazy`, keep polygon counts low, avoid re-rendering the whole scene on scroll (drive via refs/uniforms, not React state)

---

## 6. Mock data layer (this replaces your backend for now)

Create `src/data/mockIncidents.js`:
```js
export const mockIncidents = [
  { id: 1, type: "earthquake", severity: "high", lat: 35.6, lng: 139.6, location: "Tokyo, JP", magnitude: 6.1, time: Date.now() - 120000 },
  { id: 2, type: "flood", severity: "medium", lat: 23.8, lng: 90.4, location: "Dhaka, BD", time: Date.now() - 300000 },
  // ...15-20 entries across continents for a good globe spread
];

export const mockAgentPipeline = {
  monitor: { status: "active", lastScan: "3s ago", sourcesChecked: 4 },
  analyzer: { status: "processing", severityScore: 7.8, confidence: 0.91 },
  responder: { status: "complete", actionPlan: ["Deploy regional alert", "Notify local authorities", "Activate shelter network"] },
};
```
A `useFakeLiveFeed()` hook that shuffles/appends to this every few seconds gives you the "real-time" feel with zero server.

---

## 7. Exact prompts to feed an AI code generator

Don't paste this whole doc as one giant prompt — AI code tools do much better with **one section at a time**, then stitch together. Suggested order:

**Prompt 1 — scaffold + design system**
> "Set up a React + Vite + Tailwind project. Create a dark theme design system using these CSS variables: [paste Section 2 colors]. Fonts: Space Grotesk for headings, Inter for body, loaded via Google Fonts. Set up Framer Motion and a base layout with a fixed navbar that blurs on scroll."

**Prompt 2 — hero + 3D globe intro**
> "Build a full-viewport hero section for 'SangyanAI' using React Three Fiber and drei (or Globe.gl). On page load, sequence: brief black screen (~300ms) → globe scales up and spins into resting position with an eased entrance (~1.2s, ease power3.out) → 15-20 glowing pulse points ignite one by one, staggered, at these mock coordinates spread across every continent: [paste mock lat/lngs] → headline and subheadline fade/slide in after the globe settles. Points should pulse outward like radar pings on a loop, staggered randomly, with occasional glowing arcs animating between two points. Add subtle mouse-parallax rotation and a hover tooltip showing location name on each point. Headline is off-white with only one word in the accent color [--accent-hero], not a full gradient fill. Wrap the canvas in Suspense with a minimal loading fallback, and on scroll-past, shrink/fade the globe rather than cutting it away instantly."

**Prompt 3 — agent pipeline section**
> "Build a scroll-driven 3-stage pipeline section titled 'How it works' with stages Monitor, Analyzer, Responder, using GSAP ScrollTrigger to pin the section while scrolling. Each stage is a glass-morphism card (backdrop-blur, subtle border) with a distinct accent color [Accent 1/3/2]. As the user scrolls, activate each card in sequence: increase glow/opacity, and type out a short mock status line inside it character-by-character. Animate a glowing dot traveling along a connecting SVG path between cards, looping continuously."

**Prompt 4 — live dashboard mockup**
> "Build a 'live dashboard preview' section: a browser-chrome-framed mockup containing a scrollable incident feed of glass cards (each with severity color, location, relative timestamp), and a small embedded 2D map/globe. Feed data comes from a mock array via a useFakeLiveFeed hook that adds/updates entries every 4-6 seconds with a fade-in animation. Cards should have a subtle 3D tilt-on-hover effect."

**Prompt 5 — CTA, footer, polish**
> "Build a CTA section with an animated gradient/noise shader background (React Three Fiber fullscreen plane with a simple noise shader, or CSS animated gradient mesh as fallback) and a large glowing CTA button. Add a minimal dark footer with GitHub link and socials. Add a global custom cursor component (glowing dot, scales on hover over interactive elements) and respect prefers-reduced-motion by disabling heavy animations."

**Prompt 6 — global click-reaction system**
> "Create a single top-level ClickRipple component mounted once in the root layout that listens for clicks on all interactive elements (buttons, nav links, cards) and spawns a radial ripple/shockwave animation from the click coordinates, reusing the same visual style as the hero globe's radar-ping points for consistency. Keep ripple duration to 400-600ms with ease-out. Then wire up: nav link clicks trigger a directional page-content wipe transition via Framer Motion AnimatePresence; CTA buttons get a scale-punch on click in addition to the ripple; incident/agent cards use Framer Motion layout animations to expand in place on click. Disable all of this under prefers-reduced-motion, falling back to simple opacity fades."

Feed each prompt to your tool, review, then ask it to fix specific things ("the globe points aren't visible", "make the pipeline cards stagger their glow") rather than regenerating everything.

---

## 8. Hackathon judging checklist (fast self-audit before you present)

- [ ] First 3 seconds show motion, not a static screen
- [ ] Site explains what it does without reading text (visual pipeline > paragraph)
- [ ] Works and looks good on mobile (test the 3D — disable/simplify it under 768px if it tanks FPS)
- [ ] No console errors, no layout shift, no broken images
- [ ] Loads in under ~3s (compress any 3D assets, lazy-load below-fold canvases)
- [ ] Has a clear, memorable one-line pitch visible in the hero
- [ ] README has a GIF/video of the animations (judges skim repos fast)
- [ ] Deployed live link (Vercel), not just localhost

---

## 9. When you're ready to add the real AI + backend later
Keep the mock data hook (`useFakeLiveFeed`) as the seam — swap its internals to call your real API (whichever provider you pick instead of Groq/Llama) and a real backend without touching any UI component. That's the whole point of building UI-first this way.
