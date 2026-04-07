# Design Brief

## Direction

Ludwigsburg UV Index — Real-time UV health utility with authoritative, scientific presentation for sun safety decisions.

## Tone

Minimalist clinical design that treats UV exposure as serious data requiring immediate action without sensationalism.

## Differentiation

Color-coded UV scale from green (safe) through red (extreme) creates instant risk recognition; every interface element maps to health risk level.

## Color Palette

| Token      | OKLCH           | Role                        |
| ---------- | --------------- | --------------------------- |
| background | 0.98 0 0        | Light surface, primary page |
| foreground | 0.15 0 0        | Dark text, primary contrast |
| card       | 1.0 0 0         | Elevated container, white   |
| primary    | 0.55 0.19 251   | Teal accent, interactive    |
| accent     | 0.63 0.21 262   | Call-to-action, refresh     |
| muted      | 0.92 0 0        | Secondary surfaces          |
| chart-1    | 0.62 0.22 142   | Green (safe, 0–2 UV)        |
| chart-2    | 0.57 0.22 56    | Yellow (low, 3–5 UV)        |
| chart-3    | 0.65 0.22 40    | Orange (moderate, 6–7 UV)  |
| chart-4    | 0.45 0.22 25    | Red (high, 8–10 UV)         |
| chart-5    | 0.35 0.22 25    | Deep red (extreme, 11+ UV)  |

## Typography

- Display: DM Sans — headers, current UV index value, section titles
- Body: DM Sans — descriptions, recommendations, labels
- Mono: JetBrains Mono — time values, data (hourly forecast times)
- Scale: Hero 3xl bold (current UV), h2 lg medium (sections), label sm regular (time/forecast), body base regular (descriptions)

## Elevation & Depth

Cards elevated with subtle shadow (`shadow-sm`), clear visual separation between current data (prominent card) and forecast (grid of compact cards).

## Structural Zones

| Zone    | Background      | Border           | Notes                              |
| ------- | --------------- | ---------------- | ---------------------------------- |
| Header  | bg-card border-b | border-border    | Location, timestamp, refresh btn   |
| Current | bg-card         | border-border    | Prominent UV display, risk label   |
| Forecast| bg-background   | —                | Grid of hourly items, alternating  |
| Recs    | bg-muted/10     | border-t/b       | Protection tips, safe time ranges  |

## Spacing & Rhythm

24px gap between major sections, 16px padding in cards, 8px micro-spacing within components; grid-based 4px increments throughout.

## Component Patterns

- Buttons: 8px radius, teal accent bg, hover darkens 10% in lightness, 12px padding vertical
- Cards: 8px radius, white bg with 1px subtle border, `shadow-xs`
- Badges: 24px radius, category-specific fill color (green/yellow/orange/red/purple), bold label text

## Motion

- Entrance: fade-in 300ms on load, staggered 100ms per forecast item
- Hover: buttons brighten slightly, cards lift 2px shadow
- Decorative: smooth color transition on UV scale updates (0.3s ease)

## Constraints

- No decorative gradients or blur effects; priority is data clarity
- UV scale colors non-negotiable; must map directly to WHO/skin-type risk levels
- Mono font only for data (time, UV values); body text uses DM Sans
- Dark mode inverts lightness but maintains color semantic mapping

## Signature Detail

UV scale mapped to semantic chart colors creates instant pattern recognition — users learn the risk gradient through color alone, not labels.
