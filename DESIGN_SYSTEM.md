# OneDollarVentures Design System

**Version 1.0** | Last Updated: December 2025

A comprehensive design system documentation for OneDollarVentures - the micro-investment platform where builders pitch and backers invest for just $1.

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Tone of Voice](#tone-of-voice)
5. [Spacing & Layout](#spacing--layout)
6. [Components](#components)
7. [Animations & Micro-interactions](#animations--micro-interactions)
8. [Accessibility](#accessibility)
9. [Implementation Guide](#implementation-guide)

---

## Design Philosophy

### Core Principles

**1. Bold & Direct**
- No corporate fluff, speak like a human
- Headlines grab attention, no passive language
- Examples: "Shark Tank if sharks were $1", "Stop shouting into the void"

**2. Minimal & Focused**
- Dark backgrounds reduce visual clutter
- Matte red accent drives all CTAs and important actions
- Limited color palette (3-5 colors max)

**3. Builder-First Mentality**
- UI celebrates makers and creators
- Emphasizes action: "I built something" over "Submit Project"
- Shows real activity and momentum

**4. Accessible by Default**
- WCAG AA compliant contrast ratios
- Keyboard navigation with visible focus states
- Screen reader optimized

---

## Color System

### Primary Color Palette

#### Matte Red (Primary/Accent)
**Usage:** CTAs, hover states, focus rings, trending badges, progress bars, links

```css
/* OKLCH Values */
--primary: oklch(0.55 0.22 25)
--accent: oklch(0.55 0.22 25)
--ring: oklch(0.55 0.22 25)

/* Approximate HEX (for reference) */
#C94032 (matte red-orange)
```

**Application:**
- Primary buttons: `bg-accent text-accent-foreground`
- Hover states: `hover:bg-accent/90`
- Focus rings: `focus-visible:ring-accent`
- Gradients: `from-accent to-accent/70`

#### Dark Backgrounds
**Usage:** Base backgrounds, cards, overlays

```css
/* OKLCH Values */
--background: oklch(0.08 0 0)        /* Near black */
--card: oklch(0.12 0 0)              /* Slightly lighter cards */
--secondary: oklch(0.15 0 0)         /* Secondary elements */
--muted: oklch(0.15 0 0)             /* Muted backgrounds */

/* Approximate HEX */
#141414 (background)
#1F1F1F (cards)
#262626 (secondary)
```

**Application:**
- Base: `bg-background`
- Cards: `bg-card`
- Secondary sections: `bg-secondary`

#### Light Foregrounds
**Usage:** Text, icons, borders

```css
/* OKLCH Values */
--foreground: oklch(0.98 0 0)              /* Near white - primary text */
--muted-foreground: oklch(0.65 0 0)        /* Gray - secondary text */
--border: oklch(0.2 0 0)                   /* Subtle borders */

/* Approximate HEX */
#FAFAFA (primary text)
#A6A6A6 (secondary text)
#333333 (borders)
```

**Application:**
- Headings: `text-foreground`
- Body text: `text-foreground`
- Secondary text: `text-muted-foreground`
- Borders: `border-border`

#### Destructive (Errors/Warnings)
**Usage:** Error states, delete actions, critical warnings

```css
/* OKLCH Values */
--destructive: oklch(0.577 0.245 27.325)

/* Approximate HEX */
#D94A3D (slightly different red for errors)
```

### Color Usage Rules

**DO:**
- Use matte red for all primary actions (Back Project, Submit, Connect Wallet)
- Use muted foreground for secondary information
- Maintain consistent opacity levels: full, 90%, 50%, 30%, 20%, 10%

**DON'T:**
- Never use blue, purple, or green for CTAs
- Avoid gradients except for subtle accent effects
- Don't use more than 5 colors total in the UI
- Never put light text on light backgrounds or dark on dark

### Semantic Color Mapping

```css
/* Success States */
bg-green-500/20 text-green-400 border-green-500/30

/* Error States */
bg-red-500/20 text-red-400 border-red-500/30

/* Warning/Pending States */
bg-yellow-500/20 text-yellow-400 border-yellow-500/30

/* Accent/Info States */
bg-accent/20 text-accent border-accent/30

/* Hover States */
hover:bg-accent/90 (for buttons)
hover:border-accent/50 (for cards)
hover:text-accent (for text links)
```

---

## Typography

### Font Families

#### Primary Font: Inter
**Usage:** Body text, UI elements, navigation, buttons

```css
/* Implementation */
import { Inter } from 'next/font/google'

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter' 
})

/* CSS Variable */
--font-sans: var(--font-inter), "Inter Fallback"

/* Tailwind Class */
font-sans
```

#### Display Font: Poppins
**Usage:** All headings (h1-h6), hero text, emphasis

```css
/* Implementation */
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-poppins',
})

/* CSS Rule */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-poppins), sans-serif;
  font-weight: 600;
}
```

#### Monospace Font: Geist Mono
**Usage:** Code snippets, technical data, wallet addresses

```css
/* CSS Variable */
--font-mono: "Geist Mono", "Geist Mono Fallback"

/* Tailwind Class */
font-mono
```

### Typography Scale

#### Headings

```css
/* Hero Heading (h1 on homepage) */
text-4xl md:text-6xl lg:text-7xl font-bold
/* 36px → 60px → 72px */

/* Page Title (h1) */
text-3xl md:text-4xl font-bold
/* 30px → 36px */

/* Section Heading (h2) */
text-2xl md:text-3xl font-semibold
/* 24px → 30px */

/* Subsection Heading (h3) */
text-xl font-semibold
/* 20px */

/* Card Title (h4) */
text-lg font-semibold
/* 18px */
```

#### Body Text

```css
/* Large Body */
text-xl md:text-2xl
/* 20px → 24px (hero descriptions) */

/* Regular Body */
text-base
/* 16px (default paragraph text) */

/* Small Body */
text-sm
/* 14px (secondary info, labels) */

/* Extra Small */
text-xs
/* 12px (badges, tags, timestamps) */
```

---

## Tone of Voice

### Brand Voice Characteristics

**Direct & No-Nonsense**
- Speak plainly, avoid corporate jargon
- Get to the point quickly
- Example: "Show us what you built" not "Submit your innovative project proposal"

**Confident & Bold**
- Make declarative statements
- Use active voice
- Example: "Builders pitch. You back. Everyone wins."

**Casual but Not Childish**
- Conversational tone
- Avoid overuse of slang
- Example: "Devs who ship" (good) vs "Epic legendary builders" (too much)

**Action-Oriented**
- Strong verbs
- Imperative mood for CTAs
- Example: "See what's building", "I built something", "Connect Wallet"

### Writing Patterns

#### Headlines
```
✅ DO:
- "Shark Tank if sharks were $1"
- "Stop shouting into the void"
- "See what's building"

❌ DON'T:
- "Welcome to Our Investment Platform"
- "Discover Amazing Opportunities"
- "Join Our Community Today"
```

#### CTAs (Call to Actions)
```
✅ DO:
- "I built something"
- "See what's building"
- "Show me all"
- "Connect Wallet"
- "Back for $1"

❌ DON'T:
- "Submit Project"
- "Browse Projects"
- "View All Projects"
- "Connect Your Wallet"
```

#### Error Messages
```
✅ DO:
- "That didn't work. Try again."
- "Wallet connection failed."
- "Project not found."

❌ DON'T:
- "Oopsie! Something went wrong!"
- "An unexpected error occurred in the system"
```

---

## Spacing & Layout

### Container System

```css
/* Maximum Content Width */
container mx-auto max-w-7xl px-6
/* Max width: 1280px, horizontal padding: 24px */

/* Page Sections */
container mx-auto max-w-6xl px-4
/* Max width: 1152px, horizontal padding: 16px */

/* Narrow Content (forms, reading) */
container mx-auto max-w-2xl px-4
/* Max width: 672px, horizontal padding: 16px */
```

### Layout Patterns

#### Full-Page Layout
```tsx
<div className="flex flex-col min-h-screen">
  <Header />
  <main className="flex-1 container mx-auto">
    {/* Content */}
  </main>
  <Footer />
</div>
```

#### Section Spacing
```css
/* Page Sections */
py-16 pb-24 md:pb-16
/* Top/bottom: 64px, bottom on mobile: 96px (accounts for bottom nav) */

/* Hero Section */
py-20 md:py-32
/* Top/bottom: 80px → 128px */
```

### Spacing Scale (Tailwind)

```css
/* Use these spacing values consistently */
gap-1   /* 4px */
gap-2   /* 8px */
gap-3   /* 12px */
gap-4   /* 16px */
gap-6   /* 24px */
gap-8   /* 32px */
gap-12  /* 48px */
gap-16  /* 64px */
```

### Grid Systems

```tsx
/* Two-Column Layout (Projects) */
<div className="grid md:grid-cols-2 gap-6">

/* Three-Column Stats */
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">

/* Sidebar Layout (2:1 ratio) */
<div className="grid lg:grid-cols-3 gap-8">
  <div className="lg:col-span-2">{/* Main */}</div>
  <div className="lg:col-span-1">{/* Sidebar */}</div>
</div>
```

---

## Components

### Buttons

#### Primary Button
```tsx
<Button className="bg-accent text-accent-foreground hover:bg-accent/90">
  Primary Action
</Button>
```

#### Secondary Button (Outline)
```tsx
<Button variant="outline">
  Secondary Action
</Button>
```

#### Ghost Button
```tsx
<Button variant="ghost">
  Tertiary Action
</Button>
```

### Cards

#### Standard Card
```tsx
<Card className="hover:border-accent/50 transition-all">
  <CardContent className="p-6">
    {/* Content */}
  </CardContent>
</Card>
```

### Badges

```tsx
/* Status Badges */
<Badge className="bg-green-500/20 text-green-400 border-green-500/30">Live</Badge>
<Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">In Review</Badge>
<Badge className="bg-accent/20 text-accent border-accent/30">Funded</Badge>
<Badge variant="secondary">Draft</Badge>

/* Feature Badge */
<Badge className="bg-accent/20 text-accent-foreground border-accent/30">
  47K+ builders
</Badge>
```

### Progress Bars

```tsx
<Progress 
  value={progress} 
  className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-accent [&>div]:to-accent/70"
/>
```

---

## Animations & Micro-interactions

### Transition Timing

```css
/* Default transitions */
transition-all duration-300

/* Fast interactions */
duration-150

/* Slow, deliberate */
duration-500
```

### Hover States

```css
/* Cards */
hover:scale-[1.02]
hover:shadow-xl
hover:shadow-accent/20
hover:border-accent/50

/* Buttons */
hover:bg-accent/90
active:scale-95

/* Links */
hover:text-accent
transition-colors
```

### Loading States

```tsx
/* Spinner */
<Loader2 className="h-4 w-4 animate-spin" />

/* Skeleton */
<div className="animate-pulse bg-muted rounded h-4 w-full" />
```

---

## Accessibility

### Color Contrast

All text meets WCAG AA standards:
- Primary text on dark: ~14:1 ratio (AAA)
- Muted text on dark: ~6:1 ratio (AA)
- White on accent: ~8:1 ratio (AAA)

### Focus States

```css
*:focus-visible {
  outline: 2px solid oklch(0.55 0.22 25);
  outline-offset: 2px;
}
```

### Keyboard Navigation

- Tab to navigate between elements
- Enter/Space to activate buttons and links
- Escape to close modals and dropdowns
- Arrow keys for dropdowns and menus

---

## Implementation Guide

### Quick Start

```tsx
// app/layout.tsx
import { Inter, Poppins } from 'next/font/google'

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter' 
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-poppins',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${poppins.variable} font-sans`}>
        {children}
      </body>
    </html>
  )
}
```

### Page Layout Pattern

```tsx
export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto max-w-7xl px-6 py-16">
        {/* Your content */}
      </main>
      <Footer />
    </div>
  )
}
```

### Component Imports

```tsx
// UI Components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"

// Icons
import { TrendingUp, Users, Clock, ArrowRight, Loader2 } from 'lucide-react'

// Layout
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
```

---

## Reference Quick Sheet

### Most Used Classes

```css
/* Layout */
flex flex-col min-h-screen
container mx-auto max-w-7xl px-6
flex items-center justify-between
grid md:grid-cols-2 gap-6

/* Colors */
bg-background text-foreground
bg-card text-card-foreground
bg-accent text-accent-foreground
text-muted-foreground
border-border

/* Typography */
text-4xl md:text-6xl font-bold
text-xl md:text-2xl
text-sm text-muted-foreground
font-semibold

/* Spacing */
py-16 pb-24 md:pb-16
mb-8 mb-6 mb-4 mb-2
gap-4 gap-6 gap-8
p-6

/* Interactive */
hover:bg-accent/90
hover:text-accent
hover:scale-[1.02]
transition-all duration-300
active:scale-95

/* Effects */
rounded-lg
shadow-xl
backdrop-blur
```

### Color Reference

```
Background:   oklch(0.08 0 0)   → #141414
Card:         oklch(0.12 0 0)   → #1F1F1F
Foreground:   oklch(0.98 0 0)   → #FAFAFA
Muted:        oklch(0.65 0 0)   → #A6A6A6
Accent:       oklch(0.55 0.22 25) → #C94032 (matte red)
Border:       oklch(0.2 0 0)    → #333333
```

---

**Last Updated:** December 2025  
**Maintained By:** OneDollarVentures Team  
**Version:** 1.0
