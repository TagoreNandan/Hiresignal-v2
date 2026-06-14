---
name: Signal Intelligence
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1b1c1c'
  surface-container: '#1f2020'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353535'
  on-surface: '#e4e2e1'
  on-surface-variant: '#ccc3d8'
  inverse-surface: '#e4e2e1'
  inverse-on-surface: '#303030'
  outline: '#958da1'
  outline-variant: '#4a4455'
  surface-tint: '#d2bbff'
  primary: '#d2bbff'
  on-primary: '#3f008e'
  primary-container: '#7c3aed'
  on-primary-container: '#ede0ff'
  inverse-primary: '#732ee4'
  secondary: '#c8c6c5'
  on-secondary: '#313030'
  secondary-container: '#4a4949'
  on-secondary-container: '#bab8b7'
  tertiary: '#c6c6c7'
  on-tertiary: '#2f3131'
  tertiary-container: '#656767'
  on-tertiary-container: '#e6e6e6'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#eaddff'
  primary-fixed-dim: '#d2bbff'
  on-primary-fixed: '#25005a'
  on-primary-fixed-variant: '#5a00c6'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474646'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#131313'
  on-background: '#e4e2e1'
  surface-variant: '#353535'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  data-mono:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.02em
spacing:
  unit: 4px
  gutter: 24px
  margin: 40px
  container-max: 1440px
---

## Brand & Style
The design system is built on the philosophy of "Signal Intelligence"—stripping away the aesthetic noise of modern software to reveal high-density information through a premium, editorial lens. It rejects the "AI-generated" tropes of neon glows and blurred transparencies in favor of architectural precision and high-contrast clarity.

The brand personality is confident, authoritative, and clinical. It evokes the feeling of a high-end design journal crossed with a precision financial terminal. The visual language utilizes a "Sophisticated Minimalist" style, relying on rigorous grid alignment, razor-sharp borders, and deliberate whitespace to signify importance rather than relying on decorative effects.

## Colors
This design system operates on a high-contrast foundation. The palette is anchored by "Signal Violet," used sparingly as a functional highlight to draw the eye to primary actions or critical data points. 

The primary surface is a deep charcoal (#121212), providing a non-distracting void that allows the off-white (#FAFAFA) content to stand out with maximum legibility. Secondary neutrals are pulled from a cool-toned scale to maintain a clinical, technical feel. Avoid all gradients; colors must be applied as solid, unyielding fills to maintain the "printed" editorial quality.

## Typography
The typography strategy creates a tension between the classic and the technical. **Playfair Display** is used for headlines and editorial callouts, providing an authoritative, humanistic touch that breaks the rigidity of the UI. 

**Inter** serves as the workhorse for all functional data, body copy, and navigation. It is chosen for its exceptional legibility and neutral character. For data-heavy views, use the `data-mono` style (Inter with tabular lining figures if available) to ensure vertical alignment of digits. Labels should consistently use uppercase with slight tracking to reinforce the "terminal" aesthetic.

## Layout & Spacing
The layout follows a **Fixed Grid** model on desktop and a **Fluid Grid** on mobile. It is based on a strict 12-column system with substantial gutters (24px) to ensure no information feels crowded.

- **Desktop:** 12 columns, 40px outer margins. Use "Internal Dividers" (1px solid borders) instead of padding to separate content blocks where possible.
- **Tablet:** 8 columns, 24px margins.
- **Mobile:** 4 columns, 16px margins. 

Spacing units follow a 4px base increment. Use large blocks of whitespace (64px+) to separate major sections, treating the screen like a printed page.

## Elevation & Depth
In this design system, depth is achieved through **Tonal Layers** and **Sharp Outlines** rather than shadows. 

Avoid drop shadows entirely. To indicate hierarchy or "lift," use a slightly lighter background fill (e.g., #1E1E1E against #121212) combined with a 1px solid border. This creates a "stacked plate" effect that feels mechanical and intentional. Interactive states (hover/active) should be represented by color inversions or border-color shifts rather than depth changes.

## Shapes
The shape language is strictly **Sharp**. All buttons, input fields, cards, and containers must have 0px border-radius. This reinforces the technical, terminal-inspired precision of the system and differentiates it from the rounded, "friendly" look of consumer tech. The only exception to the 0px rule is for specific iconography that requires organic forms for legibility.

## Components
- **Buttons:** Primary buttons use a solid #7C3AED fill with #FAFAFA text. Secondary buttons are transparent with a 1px #FAFAFA border. All buttons are rectangular with 0px radius and use the `label-md` type style.
- **Input Fields:** Use a 1px border on the bottom only for a minimalist look, or a full 1px box for data-heavy forms. Use the #3F3F46 border color, shifting to #7C3AED on focus.
- **Cards:** Cards should not have shadows. Use a 1px #262626 border and a solid background. Headers within cards should be separated by a 1px horizontal rule.
- **Lists:** Use 1px horizontal dividers between items. Ensure generous vertical padding (16px+) to maintain the editorial feel.
- **Chips/Tags:** Small, rectangular boxes with 1px borders. Use `data-mono` typography for tag content.
- **Data Tables:** High-density, no vertical lines, only horizontal dividers. Header row should be in `label-md` with a subtle background tint.