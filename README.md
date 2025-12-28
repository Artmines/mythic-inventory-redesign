# 🎒 Mythic Inventory System

<div align="center">

**A modern, feature-rich inventory system for FiveM with React UI**

[![Built with React](https://img.shields.io/badge/Built%20with-React%2018-61DAFB.svg?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-5.0-007FFF.svg?logo=mui)](https://mui.com/)
[![Redux](https://img.shields.io/badge/Redux-Toolkit-764ABC.svg?logo=redux)](https://redux-toolkit.js.org/)

</div>

---

## ✨ Features

### 🎯 Core Functionality
- **Drag & Drop System** - Intuitive item management with visual feedback
- **Multi-Inventory Support** - Player, secondary (ground/containers), and shop inventories
- **Smart Stacking** - Automatic item merging and stack management
- **Item Durability** - Visual durability bars with color coding
- **Rarity System** - Color-coded item rarities (Common, Uncommon, Rare, Epic, Legendary)
- **Weight Management** - Real-time weight tracking and capacity limits
- **Hotbar System** - Quick access slots (1-5) with keybind support

### 🛒 Shop System
- **Buy & Sell** - Purchase from shops and sell items back
- **Custom Pricing** - Per-item pricing with quantity support
- **Shop Restrictions** - Cannot use/give items while shopping
- **Stock Management** - Configurable stock limits per item

### 🔨 Crafting System
- **Recipe-Based Crafting** - Define recipes with required materials
- **Material Tracking** - Real-time material count verification
- **Crafting Benches** - Multiple bench types with custom recipes
- **Craft Queue** - Timed crafting with progress tracking
- **Cooldown System** - Per-recipe cooldowns to prevent spam
- **Batch Crafting** - Craft multiple items at once

### 🤝 Player Interactions
- **Give Items** - Transfer items to nearby players
- **Player Selection** - Visual popup to select from nearby players
- **Proximity Detection** - Automatic nearby player detection (3.0 unit radius)
- **Use Items** - Context-aware item usage with animations

### 🎨 UI/UX Features
- **Modern Design** - Sleek, purple-themed interface with glassmorphism
- **Responsive Layout** - Adapts to different screen sizes
- **Smooth Animations** - Fade transitions and hover effects
- **Visual Feedback** - Glow effects, shadows, and state indicators
- **Tooltips** - Detailed item information on hover
- **Custom Metadata** - Display custom labels and images
- **Split Dialog** - Split stacks with custom amount selection

### 🛠️ Technical Features
- **Performance Optimized** - Memoized components and efficient rendering
- **Redux State Management** - Centralized state with Redux Toolkit
- **Type Safety** - Full TypeScript support
- **Theme System** - Centralized color management with alpha channel support
- **Sound Effects** - UI sound feedback for actions
- **Dev Mode** - Built-in development tools for testing

---

## 📸 Screenshots

![Inventory Main](image.png)

![Crafting System](image-1.png)

![Shop System](image-2.png)

---

## 🚀 Installation

### Prerequisites
- Node.js 16+
- FiveM Server with Mythic Framework

### Setup

1. **Navigate to the UI directory**
   ```bash
   cd resources/[mythic]/mythic-inventory/ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

4. **Development mode** (optional)
   ```bash
   npm run dev
   ```
---

## 🎮 Usage

### Player Controls

#### Keyboard
- **1-5** - Use hotbar items
- **Left Click + Drag** - Move full stack
- **Right Click + Drag** - Move half stack
- **Ctrl + Left Click + Drag** - Move half stack
- **Ctrl + Right Click + Drag** - Move single item
- **Shift + Right Click** - Open split dialog
- **Shift + Left Click** - Quick transfer to other inventory
- **Middle Mouse Click** - Use item (if usable)
---

## 🎨 Theming

The inventory uses a centralized theme system located in `ui/src/styles/theme.ts`:

```typescript
export const colors = {
  primary: {
    main: '#8685EF',
    alpha: (opacity: number) => alpha('#8685EF', opacity),
  },
  inventory: {
    background: '#1f1f1f',
  },
  text: {
    primary: '#ffffff',
    secondary: 'rgba(255, 255, 255, 0.7)',
    disabled: 'rgba(255, 255, 255, 0.4)',
  },
  // ... more colors
};
```

### Customization
To change the theme colors, edit `theme.ts` and rebuild the UI. All components use theme constants for consistent styling.

---

## 🛠️ Development

### Tech Stack
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Redux Toolkit** - State management
- **Material-UI (MUI)** - Component library
- **Emotion** - CSS-in-JS styling
- **Vite** - Build tool and dev server

### Dev Mode
Press `F8` in-game to toggle dev mode and test different states:
- Inventory Only
- Inventory + Ground
- Crafting Bench
- Shop
- Test Nearby Players

---

## 📊 Performance

### Optimizations
- **React.memo** - Memoized components prevent unnecessary re-renders
- **useMemo & useCallback** - Cached expensive computations
- **Optimistic Updates** - Instant UI feedback with rollback on errors
- **Lazy Loading** - Code splitting for faster initial load
- **requestAnimationFrame** - Smooth cursor tracking
- **Efficient selectors** - Targeted Redux state subscriptions
---

## 🤝 Contributing

Contributions are welcome! Areas for improvement:

- [ ] Additional item types and categories
- [ ] Advanced sorting and filtering
- [ ] Search functionality
- [ ] Container management UI
- [ ] Trade system between players
- [ ] Auction house integration
- [ ] Item comparison tooltips

---

## 📝 Credits

**Original Design & Development:**
- Blake from FiveForge Studios
- Tyh & Yarn

**Recent Updates & Enhancements:**
- Modern React UI rewrite
- Give Item system implementation
- Theme system & color management
- Performance optimizations
- Shop mode restrictions

---

<div align="center">

**Built with ❤️ for the FiveM community**

</div>
