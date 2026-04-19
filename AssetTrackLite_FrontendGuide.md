
# 🎨 AssetTrack Lite — Frontend Guide

A modern, minimal user interface built using **Next.js + Tailwind CSS** with **JavaScript only**.

---

## 🧰 Frontend Tools
- Next.js 14+ (SSG/SSR mixed)
- Tailwind CSS for fast UI development
- localStorage for settings
- Responsive UI
- Dark theme with mandatory palette:
 	- Dark brown: #5C4033
 	- Dark green: #182c25

---

## 🎨 Theme Rules (Mandatory)

- Use a default page-level gradient that combines #5C4033 and #182c25.
- Prioritize these two colors across small elements:
 	- Buttons
 	- Chips/tags and badges
 	- Compact cards and bordered pills
 	- Icon accents and selected/active states
- Keep contrast readable for text and data-dense views.
- Avoid introducing an unrelated primary accent color family.

---

## 🖥 Pages Overview
### 1. Asset List (`/assets`)
Shows:
- Asset name
- Category
- Status
- Purchase price
- Depreciated value

### 2. Asset Detail (`/assets/[id]`)
Includes:
- Assignment history
- Maintenance logs
- Purchase & validity info
- Auto‑computed depreciation

### 3. Add Asset (`/add-asset`)
Simple form for creating asset items.

### 4. Maintenance (`/maintenance`)
Add/view maintenance entries.

### 5. Search (`/search`)
Search assets by name, category or serial.

### 6. Settings (`/settings`)
- Preferred display mode
- Table density
- Font size
- localStorage persistence

---
