# Kidssite Project Memory

## Key Architecture
- Next.js 16+ with App Router, React 19, Framer Motion 12, Tailwind CSS 4
- Arabic children's educational platform "براعم مجان"
- Layout: `dir="rtl"` on `<html>`, Rubik Arabic font
- Main page: `app/page.tsx` with animated background gradient (day→night)

## Backend (Added Feb 2026)
- MongoDB Atlas via Mongoose. Connection string in `.env.local`
- **OOP Pattern**: Singleton DB connection, Service layer, Model classes
- Auth: JWT in httpOnly cookie (`baraem_admin_token`), bcryptjs password hashing
- Middleware: `middleware.ts` protects all `/admin/*` except login page
- Seed: POST `/api/seed?secret=baraem_seed_2024` populates initial data

## Models (lib/models/)
- Admin, Game, Story, Video, Challenge, OasisContent, Treasure, ClassSession
- SiteSettings (singleton), VisitorLog + PageStats

## API Routes (all in app/api/)
- `/api/auth/{login,logout,me}` — JWT auth
- `/api/games`, `/api/stories`, `/api/watch`, `/api/challenges`, `/api/oasis`, `/api/variety`, `/api/classes` — full CRUD
- `/api/settings` — GET/PUT site settings
- `/api/visitors` — POST to track visit, GET stats
- `/api/dashboard/stats` — aggregate dashboard stats (admin only)
- `/api/seed` — seeds initial data

## Admin Dashboard (/admin/*)
- Login at `/admin` → redirects to `/admin/dashboard` if authenticated
- AdminShell component provides sidebar + topbar layout
- DataTable, Modal, FormField, StatCard, Toggle reusable components
- Pages: dashboard, games, stories, watch, challenges, oasis, variety, classes, visitors, settings
- Charts using recharts (BarChart)

## VisitorCounter
- Now uses real backend `/api/visitors` (POST to log, returns totalVisits)
- Falls back to localStorage if API unavailable
- Uses sessionStorage for session ID

## Critical RTL + CSS Transform Gotcha
In RTL mode (`dir="rtl"`), flex containers with `flex-direction: row` flow items right-to-left. A 300vw flex container inside a 100vw parent overflows to the LEFT (right-aligned in RTL). `translateX` is always physical:
- **Positive translateX** = move RIGHT = reveals content to the LEFT (correct for RTL scrolling)
- **Negative translateX** = move LEFT = pushes content further off-screen (WRONG for RTL)
- CSS `translateX(%)` is relative to the ELEMENT'S OWN WIDTH, not parent. So -200% on a 300vw element = -600vw, not -200vw. Correct value: 66.67% (= 200vw/300vw * 100%)

## Key Files
- `components/featured/GamesSection.tsx` - Horizontal scroll parallax game section
- `app/page.tsx` - Main page with animated gradient background via `motion.main`
- `app/layout.tsx` - RTL layout with `dir="rtl"`, Rubik Arabic font
- `lib/db.ts` - Singleton MongoDB connection
- `lib/auth.ts` - JWT + bcrypt auth utilities
- `lib/api.ts` - Standardized API response helpers + withAdminAuth HOF
- `components/admin/AdminShell.tsx` - Admin layout with sidebar
- Assets: `فهد.png`, `omani_fort_model.png`, `sidr_tree.png`, `omani_pottery.png`, `logo.png`
