# Contextual Minimalism Style Guide

**"Powered by Apple Vibrancy + Catppuccin Palette + SvelteKit/Tailwind CSS"**

## 1. Foundations

### Design Philosophy: Contextual Minimalism
- **Map is king:** panels hidden by default, slide-out or iconified
- **Progressive disclosure:** reveal filters/settings only on demand
- **Sparse, purposeful animations** (<250 ms, panel slides, button states)

## 2. Color Palette (Catppuccin Mocha / Macchiato)

### Backgrounds & Glass:
- **glass-light:** `rgba(246, 240, 236, 0.6)` + `backdrop-filter: blur(16px)`
- **glass-dark:** `rgba(30, 30, 30, 0.6)` + `backdrop-filter: blur(16px)`

### Primary Accent:
- **mauve:** `#DDB6F2`
- **peach:** `#F5C2E7`
- **latte:** `#F4DBD6`

### Secondary Accent:
- **green:** `#ABE9B3`
- **sky:** `#89DCEB`
- **sapphire:** `#74C7EC`

### Text & UI Neutrals:
- **text-high:** `#ECE3E1` (light) / `#E6E1CF` (dark)
- **text-low:** `#7A6E6E` (light) / `#6E6A86` (dark)
- **border:** `#6E6A86` (light) / `#4D4B55` (dark)

## 3. Spacing & Layout

### 8-point grid: use Tailwind multiples of 0.5 rem (4px) → 1 rem = 16 px
- **Padding/margin:** `p-2`, `p-4`, `p-6`, `p-8`…
- **Gap:** `gap-2`, `gap-4`, `gap-6`…

### Breakpoints:
- **md** (≥768px), **lg** (≥1024px) for side-panel layouts
- **<lg:** slide-in/off-canvas or bottom-sheet

## 4. Typography

### Font: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`

### Headings:
- **H1:** `text-2xl font-semibold leading-tight`
- **H2:** `text-xl font-semibold leading-snug`
- **H3:** `text-lg font-medium leading-snug`

### Body: `text-base font-normal leading-relaxed`
### Small: `text-sm font-normal leading-snug`

### Line-height: 1.4–1.6 for body; 1.25 for headings

## 5. Components & Variants

### A. Button (src/lib/components/Button.svelte)
**Props:** `variant = primary | secondary | icon | ghost`

**Classes:**
- **primary:** `bg-mauve text-text-high hover:bg-peach`
- **secondary:** `border border-border text-text-high hover:bg-glass-light`
- **icon:** `p-2 rounded-full text-neutral hover:bg-glass-light`
- **ghost:** `text-sky hover:text-peach`

### B. ToggleSwitch (src/lib/components/ToggleSwitch.svelte)
- Hidden `<input type="checkbox">`, stylable `<span>` track + thumb
- **Track bg:** `glass-light` (off) → `primary-accent` (on)
- **Thumb:** `bg-white/100`, `shadow-sm`

### C. Panel (InfoPanel, FiltersPanel)
- **Wrapper:** `fixed inset-y-0 w-80 lg:translate-x-0 transform`
- **Glass:** `backdrop-blur-lg glass-light dark:glass-dark`
- **Padding:** `p-6` (1.5 rem) and `space-y-6`

### D. Details/Collapsible (`<details>` for Favorites)
- **Summary:** `cursor-pointer font-semibold text-base`
- **Content:** `mt-2 space-y-4`

## 6. Z-Index Layers (tailwind.config.cjs)

```javascript
extend: { 
  zIndex: { 800: '800', 900: '900', 1000: '1000' } 
}
```

- **1000:** Top Bar
- **900:** Side Panels
- **850:** Help Popup (use z-900 + child z-50)
- **800:** Map Markers & Controls

## 7. Accessibility

- **Focus-visible:** `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky`
- **Contrast:** WCAG AA (4.5:1); bump font-weight or add `bg-white/70` behind light text
- **Keyboard Nav:** side panels removed from tab order when hidden (`inert` or `aria-hidden`)

## 8. Performance & Fallbacks

### CSS Feature Query:
```css
@supports not (backdrop-filter: blur(4px)) { 
  .glass-light, .glass-dark { 
    background-color: rgba(246,240,236,0.75); 
    backdrop-filter: none; 
  } 
}
```

- **Limit to two active blur surfaces; lazy-mount panels on first use**

## 9. Animations

- **Duration:** 150–200 ms ease-out for transforms or opacity
- **No blur-radius transitions** (expensive)
- **Use `transition-transform` on panel toggles and `transition-colors` on buttons**

---

*This covers the color tokens, spacing, typography, components, z-index, accessibility, and performance guidelines for implementing "Contextual Minimalism" with Catppuccin + Vibrancy.*
