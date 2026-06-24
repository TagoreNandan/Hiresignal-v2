---
name: Sense Interior
colors:
  surface: '#faf9f5'
  surface-dim: '#dbdad6'
  surface-bright: '#faf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f4f0'
  surface-container: '#efeeea'
  surface-container-high: '#e9e8e4'
  surface-container-highest: '#e3e2df'
  on-surface: '#1b1c1a'
  on-surface-variant: '#424842'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f1ed'
  outline: '#737972'
  outline-variant: '#c2c8c0'
  surface-tint: '#4a654e'
  primary: '#4a654e'
  on-primary: '#ffffff'
  primary-container: '#8ba88e'
  on-primary-container: '#233d29'
  inverse-primary: '#b0ceb2'
  secondary: '#7b5455'
  on-secondary: '#ffffff'
  secondary-container: '#fdcbcb'
  on-secondary-container: '#795354'
  tertiary: '#446370'
  on-tertiary: '#ffffff'
  tertiary-container: '#86a5b4'
  on-tertiary-container: '#1b3b47'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cceace'
  primary-fixed-dim: '#b0ceb2'
  on-primary-fixed: '#07200f'
  on-primary-fixed-variant: '#334d38'
  secondary-fixed: '#ffdad9'
  secondary-fixed-dim: '#ecbbba'
  on-secondary-fixed: '#2f1314'
  on-secondary-fixed-variant: '#603d3e'
  tertiary-fixed: '#c7e8f7'
  tertiary-fixed-dim: '#abcbdb'
  on-tertiary-fixed: '#001f29'
  on-tertiary-fixed-variant: '#2c4b57'
  background: '#faf9f5'
  on-background: '#1b1c1a'
  surface-variant: '#e3e2df'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0.01em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  caption:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
    letterSpacing: 0.02em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  unit: 8px
  container-margin: 40px
  gutter: 24px
  card-padding: 32px
  sidebar-width: 280px
---

## Brand & Style

This design system is defined by a sense of "digital sanctuary." It targets an audience seeking mindfulness and clarity within complex workflows, blending the structural efficiency of a data-driven SaaS platform with the soft, ethereal aesthetic of a wellness application.

The visual style is a refined evolution of **Glassmorphism**. It utilizes translucent layers, high-diffusion background blurs, and organic shapes to reduce cognitive load. The emotional response should be one of tranquility and premium quality—where every interaction feels soft, deliberate, and expensive. This is achieved through a "layered light" approach: surfaces aren't just colored; they hold depth, light, and atmosphere.

## Colors

The palette is anchored in a warm, off-white foundation that feels more human than pure digital white. 

- **Primary (Sage):** Used for primary actions and success states, grounding the UI in nature.
- **Secondary (Rose):** Used for highlighting personal or emotional touchpoints.
- **Tertiary (Sky):** Used for informational elements and secondary highlights.
- **Neutral:** A range of warm grays and off-whites that prevent the "coldness" of standard UI.

Color is applied through gradients and low-opacity fills to maintain the translucent glass effect. Backgrounds should utilize subtle radial gradients of these pastels to create a sense of environmental lighting.

## Typography

The design system uses **Plus Jakarta Sans** exclusively to maintain a modern, friendly, yet highly legible presence. 

The typographic hierarchy relies on generous line heights and increased letter spacing for labels to evoke a sense of "breathable" design. Headlines should be tight and confident, while body text is spaced for maximum comfort during long reading sessions. Use a slightly lighter weight (400) for body text on glass surfaces to ensure the background "glow" doesn't bleed into the letterforms.

## Layout & Spacing

This design system employs a **Fluid Grid** with fixed-width sidebars, mirroring the high-efficiency dashboard layout of HireSignal. 

- **Grid:** A 12-column grid system is used for the main content area.
- **Margins:** Generous 40px external margins ensure the content never feels cramped against the screen edges.
- **Rhythm:** An 8px linear scale governs all spacing. However, internal card padding is intentionally large (32px) to support the "mindful" aesthetic.
- **Mobile:** On mobile, the 12-column grid collapses to a single column, and margins reduce to 20px. Sidebars transform into bottom-sheet overlays or full-screen glass menus.

## Elevation & Depth

Depth is communicated through **translucency and blur** rather than traditional black shadows. 

1.  **Base Layer:** The warm neutral background.
2.  **Mid Layer (Glass):** Navigation bars and sidebars use a heavy backdrop-filter (blur: 20px) with a semi-transparent white fill (40-60%).
3.  **Top Layer (Floating Cards):** Content cards feature a very soft, multi-layered shadow tinted with the primary or secondary brand colors (e.g., a sage-tinted shadow for a sage-themed card).
4.  **Interaction:** Upon hover, elements should slightly increase in scale and shadow spread, creating a "lifting" effect from the frosted surface.

## Shapes

The shape language is organic and soft. Following a **Pill-shaped (3)** logic, all primary containers and buttons utilize a high corner radius.

- **Main Cards:** 32px (rounded-lg: 2rem).
- **Secondary Elements / Small Cards:** 24px.
- **Buttons / Inputs:** Fully pill-shaped (rounded-full).
- **Icons:** Set within circular or soft-square enclosures with consistent line weights (1.5px to 2px).

## Components

### Buttons
Buttons are pill-shaped with a subtle inner glow. Primary buttons use a soft gradient of the Primary Sage; secondary buttons are frosted glass with a 1px white border.

### Cards
The "Sense Card" is the core component. It must have a 32px corner radius and a subtle 1px white border (0.3 opacity) to define the edge against the background. Content inside should be padded by at least 32px.

### Navigation & Sidebars
Sidebars are treated as "floating glass panes." They should not touch the edges of the browser window but instead sit 16px-24px away, appearing to float above the background gradient.

### Input Fields
Inputs are pill-shaped with a light-gray background (low opacity). The focus state is indicated by a soft color glow that matches the specific module's theme (Sage, Rose, or Sky) rather than a hard border.

### Chips / Tags
Chips are small, fully rounded elements with high-contrast text and low-saturation backgrounds, used for categorization without cluttering the visual field.