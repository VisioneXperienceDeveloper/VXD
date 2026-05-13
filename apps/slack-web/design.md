# Slack Web Design System: Fluent Flux

## Core Vision
A high-productivity workspace that feels fast, intuitive, and modern. "Fluent Flux" combines the familiarity of Slack with a sleeker, more refined "Pro" aesthetic.

## 1. Color Palette (Workspace Pro)
- **Sidebar**: `#1e1b4b` (Indigo 950) or Glassmorphic dark.
- **Background**: `#ffffff` (Light) / `#0f172a` (Dark).
- **Primary Action**: `#6366f1` (Indigo 500).
- **Presence Indicators**: 
  - Online: `#22c55e` (Green 500).
  - Busy: `#ef4444` (Red 500).
- **Subtle**: `#f8fafc` (Slate 50) for message backgrounds.

## 2. Typography
- **UI Font**: `Inter`, Medium (500) for labels, Regular (400) for messages.
- **Condensed**: For channel names, slightly tighter tracking.

## 3. UI Components
- **Sidebar Items**:
  - Rounded pill shapes for active states.
  - Subtle hover background transition.
- **Message Bubbles**:
  - Soft borders (`12px`). 
  - Clear distinction between "Self" and "Other".
- **Floating Inputs**:
  - Rich text editor with a "floating" shadow effect.

## 4. Visual Effects & Animations
- **Spring Physics**: Use for drawer openings and message pop-ins.
- **Micro-interactions**: Reaction emojis should "bounce" on selection.
- **Layout Transitions**: Smooth resizing of sidebars and panels.

## 5. Implementation Rules
- Compact density for data-rich views, comfortable density for chat.
- Sidebar width: `260px` fixed, with collapse option.
- Iconic usage: Use `Lucide React` or similar high-quality line icons.
