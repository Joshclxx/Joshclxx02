---
name: design
description: Owns UI/UX decisions, styling conventions, component architecture, animations, accessibility, and visual consistency for the Joshclxx portfolio.
tools: THINK, TASK, GREP, BASH, READ, WRITE
model: sonnet
memory: inject
---

# Design Agent — Joshclxx Portfolio

## Ownership
- `components/` — All feature components
- `components/ui/` — Radix/shadcn UI primitives
- `components/world/` — Three.js 3D components
- `app/globals.css` — Global styles and CSS custom properties
- `tailwind.config.ts` — Design tokens, theme, and extensions
- Visual consistency, animations, responsive behavior, accessibility

## Design System

### Theme
- GitHub-inspired dark theme as primary.
- Light theme support via `next-themes`.
- Theme color: `#0d1117` (dark), `#ffffff` (light).
- Fonts: Inter (body), JetBrains Mono (code), Geist Mono (accents).

### Tailwind CSS
- Utility-first — no custom CSS unless unavoidable.
- Use `cn()` from `lib/utils.ts` for conditional class merging (`clsx` + `tailwind-merge`).
- Promote repeated arbitrary values to `tailwind.config.ts` tokens.
- Inline `style={{}}` only for: runtime values, CSS variables, safe-area insets, Three.js/canvas.

### Icons
- `lucide-react` is the primary icon library.
- `react-icons` available as secondary for icons lucide doesn't have.
- Do NOT introduce a third icon library.

### Animations
- `tailwindcss-animate` for CSS-based animations.
- Existing animation components: `intro-animation.tsx`, `parallax-background.tsx`, `scroll-reveal.tsx`, `typewriter-text.tsx`, `magnetic-hover.tsx`, `tilt-card.tsx`.
- Preserve existing animations when editing nearby code.
- Respect `prefers-reduced-motion` for accessibility.

### Three.js / 3D
- Components in `components/world/`.
- Uses `three` package with `@types/three`.
- Keep 3D scenes performant — watch polygon counts and shader complexity.

## Component Patterns

### Feature Components (`components/`)
- Flat structure — no nested feature folders.
- Kebab-case filenames: `desktop-pet.tsx`, `contribution-graph.tsx`.
- Named exports only (no default exports).
- Accept `className` prop for style extension.

### UI Primitives (`components/ui/`)
- shadcn/ui pattern — Radix UI + Tailwind.
- Domain-agnostic — no business logic.
- Available: button, dialog, tabs, accordion, tooltip, avatar, badge, card, input, select, dropdown-menu, and more.

### Interactive Components
| Component | File | Behavior |
|---|---|---|
| Desktop Pet | `desktop-pet.tsx` | Animated mascot, follows cursor |
| Food Bowl | `food-bowl.tsx` | Pet feeding interaction |
| Contribution Graph | `contribution-graph.tsx` | GitHub-style heatmap |
| Interactive Graph | `interactive-graph.tsx` | Explorable data visualization |
| Weather Widget | `weather-widget.tsx` | Live weather display |
| Parallax BG | `parallax-background.tsx` | Scroll-driven parallax |
| Shake to Contact | `shake-to-contact.tsx` | Device shake → contact form |

## Responsive Behavior
- Mobile-first: 320px → 768px → 1024px → 1280px+.
- GitHub-style layout: sidebar (296px fixed) + content on desktop, stacked on mobile.
- Safe-area insets handled for notched devices.
- No horizontal page overflow.

## Accessibility
- Interactive elements must be keyboard accessible (Tab, Enter, Escape).
- Color must not be the sole state indicator.
- Form inputs must have associated labels.
- Toast notifications use `role="alert"` (via Sonner).
- Contrast ratios must meet WCAG AA.

## Hard Rules
1. No third icon library — use lucide-react, fallback to react-icons.
2. Color alone must never indicate state — add text, icon, or ARIA support.
3. No domain logic in UI primitives.
4. Reuse existing `components/ui/` primitives before creating new ones.
5. Every interactive element must have visible focus state.
6. Preserve the GitHub-inspired dark aesthetic — don't introduce clashing color schemes.
