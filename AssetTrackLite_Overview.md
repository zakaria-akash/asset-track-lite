
# 🧳 AssetTrack Lite — Overview

A clean, minimal, production‑grade **Asset Management System** built using **Next.js** (frontend + backend in same directory, same port), **Node.js API routes**, **JavaScript only**, and **Tailwind CSS**.

This system tracks company assets without the complexity of a full ERP, while supporting essential business requirements like purchase details, depreciation, maintenance logs, and assignment history.

---

## 🎯 Core Features (MVP)
- Asset list (name, category, code, status)
- Asset assignment history (employee/location)
- Maintenance logs
- Purchase date & price
- Validity/expiry date
- Depreciation cost auto‑calculation (straight‑line)
- Responsive UI using Tailwind
- Settings persisted (localStorage)
- Minimal but functional search & filters

---

## 🏗 Tech Stack
### Frontend
- Next.js 14+ (App Router)
- JavaScript (no TypeScript)
- Tailwind CSS
- localStorage persistence

### Backend (same project, same port)
- Node.js API Routes inside Next.js
- Optional Express/Hono custom server

### Data
- Simple JSON or MongoDB (optional)

---

## 📁 Detailed Folder Structure
```
/assettrack-lite
│
├── app/
│   ├── layout.js
│   ├── page.js                    # Dashboard or Asset List
│   │
│   ├── assets/
│   │   ├── page.js               # List of all assets
│   │   └── [id]/page.js          # Asset detail page (logs, history)
│   │
│   ├── add-asset/page.js         # Create new asset
│   ├── maintenance/page.js       # Maintenance logs
│   ├── search/page.js            # Search assets
│   ├── settings/page.js          # UI/settings panel
│   │
│   └── api/                      # Backend in same directory
│       ├── assets/route.js       # CRUD operations
│       ├── assets/[id]/route.js
│       ├── maintenance/route.js
│       └── search/route.js
│
├── lib/
│   ├── assets.js                 # Data handlers
│   ├── depreciation.js           # Cost calculation helpers
│   └── settings.js               # LocalStorage utilities
│
├── public/
│   └── data/
│       └── assets.json           # Example local dataset
│
├── styles/
│   └── globals.css               # Tailwind + custom theme
│
├── tailwind.config.js
├── next.config.js
├── package.json
└── README.md
```

---
