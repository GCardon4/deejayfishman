---
name: Luxurious DJ Dark Theme
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#20201f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353535'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c4c7c7'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c9c6c5'
  primary: '#c9c6c5'
  on-primary: '#313030'
  primary-container: '#0a0a0a'
  on-primary-container: '#7b7979'
  inverse-primary: '#5f5e5e'
  secondary: '#e9c349'
  on-secondary: '#3c2f00'
  secondary-container: '#af8d11'
  on-secondary-container: '#342800'
  tertiary: '#c6c6c6'
  on-tertiary: '#2f3131'
  tertiary-container: '#090a0b'
  on-tertiary-container: '#79797a'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c9c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474646'
  secondary-fixed: '#ffe088'
  secondary-fixed-dim: '#e9c349'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#e3e2e2'
  tertiary-fixed-dim: '#c6c6c6'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#464747'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353535'
typography:
  headline-xl:
    fontFamily: DM Sans
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: DM Sans
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: DM Sans
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.15em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 8px
  sm: 16px
  md: 32px
  lg: 64px
  xl: 128px
  gutter: 24px
  margin: 40px
---

## Brand & Style

This design system is built for the elite tiers of the music and nightlife industry. It targets a high-net-worth audience, promoters of luxury venues, and global festival organizers. The brand personality is authoritative, mysterious, and impeccably refined. 

The aesthetic direction merges **Minimalism** with subtle **Glassmorphism**. By utilizing deep, light-absorbing blacks against sharp metallic accents, the UI evokes the atmosphere of a high-end private club. The use of "subtle glows" mimics stage lighting and premium hardware interfaces, creating a sense of depth and energy without compromising professional clarity. The emotional response is one of exclusivity, prestige, and rhythmic precision.

## Colors

The palette is anchored in **Obsidian Black (#0A0A0A)** for primary backgrounds to ensure absolute depth. **Deep Charcoal (#1A1A1A)** is utilized for container surfaces to provide structural definition.

The accent strategy uses a dual-metal approach:
- **Elegant Gold (#D4AF37)**: Reserved for primary calls to action, active states, and premium highlights.
- **Metallic Silver (#C0C0C0)**: Used for secondary actions, borders, and supportive iconography. 

High-contrast variants (Bright Gold and Bright Silver) should be applied sparingly as hover states or "glow" light sources. All colors are optimized for a dark environment to prevent eye strain while maintaining a high-fashion editorial feel.

## Typography

Typography in this design system creates a dialogue between modern precision and effortless luxury. 

**DM Sans** is the voice of the headlines, providing a crisp, geometric, and high-tech feel. It should be used with tight tracking in larger sizes to emphasize its clean, circular forms and professional punch.

**Manrope** serves as the functional counterpart for body and interface elements. Its geometric but refined structure ensures legibility at small sizes. For navigational elements and metadata (like set durations or dates), use the `label-caps` style to create a structured, technical aesthetic reminiscent of vinyl record sleeves or equipment labels.

## Layout & Spacing

This design system employs a **Fixed Grid** model to maintain a controlled, gallery-like presentation. A 12-column grid is standard, with generous margins and gutters to facilitate "breathability" amidst the dark color palette.

The spacing rhythm follows a base-4 power scale. Large `xl` spacers should be used between major sections to emphasize the premium nature of the content—empty space is treated as a luxury. Content blocks should prioritize verticality, mimicking the scroll of a tracklist or a high-end fashion lookbook.

## Elevation & Depth

Depth is achieved through **Atmospheric Layering** rather than traditional drop shadows. 

1.  **Surface Tiers:** Background is Obsidian (#0A0A0A). Cards and containers use Deep Charcoal (#1A1A1A).
2.  **Glassmorphism:** Overlays (like navigation bars or music player docks) use a 60% opacity Deep Charcoal with a 20px background blur.
3.  **Metallic Outlines:** Use 1px borders in Metallic Silver (#C0C0C0) at 20% opacity for container definition.
4.  **Subtle Glows:** Instead of black shadows, use "Light Leaks." For example, a primary Gold button may have a soft, 15px blur outer shadow in Gold (#D4AF37) at 30% opacity to suggest it is illuminated from within.

## Shapes

The shape language is primarily **Soft (Level 1)**. This approach maintains the sharp, masculine edges associated with professional audio gear while providing just enough rounding (4px-12px) to feel modern and accessible.

Corners should be consistent across all elements. Interactive components like input fields and buttons utilize the 0.25rem (4px) radius, while larger hero cards can scale up to 0.75rem (12px) to create a clear container hierarchy.

## Components

### Buttons
Primary buttons use a subtle vertical gradient from Gold (#D4AF37) to a slightly darker shade, with high-contrast black text. Secondary buttons are "Ghost" style: 1px Silver borders with a subtle hover glow.

### Cards
Cards for "Upcoming Events" or "Latest Sets" use the Deep Charcoal background with a 1px Silver border. Images within cards should have a slight desaturation filter, returning to full color on hover.

### Music Player
The persistent audio player uses a glassmorphic background. Seek bars and volume sliders use Gold for the active track and Silver for the remaining duration.

### Chips & Tags
Used for music genres or venue types. Small, capitalized Manrope text with a Deep Charcoal fill and a Silver border.

### Input Fields
Minimalist design. No background fill—only a bottom border in Silver. When focused, the border transitions to Gold with a faint 4px Gold outer glow.

### Playback Controls
Iconography should be custom-drawn with thin strokes (1.5pt) to match the geometric precision of DM Sans. Use Gold for the "Play/Pause" trigger and Silver for "Skip/Repeat" functions.