Hook, Line, & Sinker: Design System v3.0

"The Midnight Standard" – Universal Dark Glass Architecture

1. Core Philosophy (Revised)

A. The "Universal UI" Strategy

One Interface, Any Condition: The UI panels, buttons, and text do not change color. They use a permanent "Midnight Glass" aesthetic.

The HUD Effect: Think of the UI as a "Heads Up Display" inside a cockpit. It floats over the map, distinct and legible, regardless of whether the map below is bright (Day) or dark (Night).

B. The "Map is King" Mandate

Map Independence: The Map Tiles are the only thing that changes.

Sunlight: User toggles "Day Map" (High brightness, white water) to fight glare.

Night: User toggles "Night Map" (Dark, neon) to save eyes.

The UI stays Dark in both cases, acting as a consistent frame.

C. Thumb-Driven & Safe

Reachability: Controls anchored to the bottom (Mobile) or sides (Desktop).

Target Size: 44px minimum.

2. The Universal Palette (Catppuccin Mocha)

No more "Light/Dark" pairs. These are the permanent app colors.

The "Midnight Glass" Surface

Base: bg-[#1e1e2e]/90 (Catppuccin Base + 90% Opacity)

Blur: backdrop-blur-xl (Heavy blur to separate text from map details)

Border: border border-white/10 (Subtle 1px rim for definition)

Shadow: shadow-xl shadow-black/50 (Deep shadow for lift)

Typography (High Contrast)

Primary Text: #cdd6f4 (Text Base - Off White)

Secondary Text: #a6adc8 (Subtext - Soft Grey)

Accent Text: #f5c2e7 (Pink) or #89dceb (Sky)

Functional Colors (Permanent)

Token

Color

Use Case

Primary Action

#cba6f7 (Mauve)

Main Buttons, Active Tabs (Text: Dark)

Selection

#f5c2e7 (Pink)

Selected Chips, Toggles

Water/Location

#89dceb (Sky)

GPS Dot, Water Depth

Warning/Alert

#fab387 (Peach)

Low Battery, Weather Alert

3. Structural Patterns (Responsive)

A. Mobile: The Bottom Dock (HUD Style)

Position: Fixed Bottom.

Appearance: A dark, rounded glass pane rising from the bottom edge.

Contents:

Search Bar: Dark gray background (bg-[#313244]), White text.

Filter Chips: Horizontal scroll.

Interaction: Pull up to reveal full "Spot Details" sheet.

B. Desktop: The Floating Command Card

Position: Floating Top-Left.

Appearance: A dark glass card with rounded corners.

Contents: Search + Spot Details + Filters.

Contrast: On a bright day map, this looks like a high-end GPS instrument panel.

4. Map Integration (The Only Variable)

The UI stays "Midnight", but the Map adapts to nature.

Map Style A: "Glare Cut" (Day Use)

Use Case: Bright sunlight on open water.

Visuals: High contrast light map. White/Blue water.

Interaction: The Dark UI panels sit on top, creating a clear "Cut out" effect (Picture-in-Picture feel).

Map Style B: "Stealth" (Night Use)

Use Case: Night fishing, low light.

Visuals: Dark Navy/Black water. Neon contour lines.

Interaction: The Dark UI blends seamlessly, looking like a native extension of the map.

5. Components (Tailwind Implementation)

A. The Universal Panel (Card/Sheet)

<div class="bg-[#1e1e2e]/90 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-4 text-[#cdd6f4]">
  <!-- Content -->
</div>


B. The Primary Button (Mauve)

<button class="bg-[#cba6f7] text-[#1e1e2e] font-bold py-3 px-6 rounded-xl hover:bg-[#dcaeff] transition-colors shadow-lg shadow-purple-900/20">
  Log Catch
</button>


C. The Secondary/Ghost Button

<button class="bg-[#313244]/80 text-[#cdd6f4] py-3 px-6 rounded-xl hover:bg-[#45475a] border border-white/5">
  Cancel
</button>


D. The Active Filter Chip

<!-- Selected -->
<button class="bg-[#f5c2e7] text-[#1e1e2e] font-bold rounded-full px-4 py-2 text-sm shadow-md">
  Bass
</button>

<!-- Unselected -->
<button class="bg-[#313244]/50 text-[#a6adc8] border border-white/10 rounded-full px-4 py-2 text-sm">
  Walleye
</button>


6. Iconography

Stroke Color: Always #cdd6f4 (Off-white) or #cba6f7 (Mauve).

Fill: Minimal fill to keep the interface airy.