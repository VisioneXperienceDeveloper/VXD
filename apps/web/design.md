# Web App Design System: Crystal Logic

## Core Vision
A premium, high-performance interface that balances professional precision with futuristic aesthetics. "Crystal Logic" emphasizes clarity, depth, and fluid interactions.

## 1. Color Palette (Premium Indigo & Glass)
- **Primary**: `#6366f1` (Indigo 500) - Actionable elements.
- **Background**: `#020617` (Slate 950) - Deep, dark abyss for contrast.
- **Surface**: `rgba(15, 23, 42, 0.7)` - Glassmorphic layers with `backdrop-filter: blur(12px)`.
- **Accent**: `#f472b6` (Pink 400) - Highlighting key achievements/tags.
- **Border**: `rgba(255, 255, 255, 0.1)` - Subtle edge definition.

## 2. Typography
- **Headings**: `Outfit` or `Inter`, Bold (700). Letter spacing: `-0.02em`.
- **Body**: `Inter`, Regular (400) / Medium (500). Line height: `1.6`.
- **Monospace**: `JetBrains Mono` for code snippets.

## 3. UI Components
- **Buttons**:
  - Gradient fills: `linear-gradient(135deg, #6366f1 0%, #a855f7 100%)`.
  - Hover: Subtle scale-up (`1.02`) and increased shadow.
- **Cards**:
  - Glassmorphic style with subtle white inner glow.
  - Border radius: `16px`.
- **Inputs**:
  - Dark background, focus ring in Indigo with glow effect.

## 4. Visual Effects & Animations
- **Blur**: Use heavily for depth.
- **Transitions**: `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`.
- **Hover Effects**: Elements should feel "magnetic" and reactive.

## 5. Implementation Rules
- No pure blacks or pure whites for large surfaces.
- Use `gap: 24px` for main sections, `16px` for inner components.
- Consistency in border-radius: `12px` for small, `16px` for large containers.
