# 📚 Library Management System — Next.js Frontend

A modern, full-featured frontend for the Library Management System built with **Next.js 16**, **React 19**, **Tailwind CSS v4**, and **shadcn/ui**.

---

## 🚀 Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js 16](https://nextjs.org/) | React framework (App Router) |
| [React 19](https://react.dev/) | UI library |
| [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first styling |
| [shadcn/ui](https://ui.shadcn.com/) | Component library (Radix UI based) |
| [Axios](https://axios-http.com/) | HTTP client for API calls |
| [Recharts](https://recharts.org/) | Dashboard charts & graphs |
| [Lucide React](https://lucide.dev/) | Icon library |
| [next-themes](https://github.com/pacocoursey/next-themes) | Dark / light mode |
| [Sonner](https://sonner.emilkowal.ski/) | Toast notifications |

---

## 📁 Project Structure

```
library-management-fe/
├── src/
│   ├── app/
│   │   ├── admin/               # Admin portal pages
│   │   │   ├── books/           # Manage books
│   │   │   ├── dashboard/       # Admin dashboard & stats
│   │   │   ├── requests/        # Book issue requests
│   │   │   ├── settings/        # Admin settings & profile
│   │   │   ├── users/           # Manage users
│   │   │   └── layout.tsx       # Admin layout with sidebar
│   │   ├── user/                # User portal pages
│   │   │   ├── alloted/         # Currently borrowed books
│   │   │   ├── books/           # Browse all books
│   │   │   ├── history/         # Borrowing history
│   │   │   ├── profile/         # User profile
│   │   │   ├── settings/        # User settings
│   │   │   └── layout.tsx       # User layout with sidebar
│   │   ├── signup/              # Signup page
│   │   ├── page.tsx             # Login page (root)
│   │   ├── layout.js            # Root layout
│   │   └── globals.css          # Global styles
│   ├── components/              # Reusable UI components
│   ├── hooks/                   # Custom React hooks
│   └── lib/
│       └── api/
│           └── axios.ts         # Axios instance with interceptors
├── public/                      # Static assets
├── .env                         # Environment variables
├── next.config.mjs              # Next.js configuration
├── tailwind.config.js           # Tailwind CSS configuration
└── package.json
```

---

## ⚙️ Prerequisites

- **Node.js 18.17+** — [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn** / **pnpm**
- A running instance of the [FastAPI backend](../fastapi/README.md)

---

## 🛠️ Local Setup & Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd lib-manage/library-management-fe
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the root of `library-management-fe/`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

> - For **local development**, point this to your locally running FastAPI server.
> - For **production**, point this to your deployed backend URL (e.g. `https://your-api.vercel.app`).

### 4. Run the development server

```bash
npm run dev
```

The app will be available at: **http://localhost:3000**

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server with hot reload |
| `npm run build` | Build the optimized production bundle |
| `npm run start` | Start the production server (after build) |
| `npm run lint` | Run ESLint to check for code issues |

---

## 🗂️ Application Pages & Routes

### 🔓 Public

| Route | Description |
|---|---|
| `/` | Login page |
| `/signup` | User registration page |

### 🛡️ Admin Portal (`/admin/*`)

| Route | Description |
|---|---|
| `/admin/dashboard` | Stats overview with charts |
| `/admin/books` | Add, edit, delete books |
| `/admin/users` | View and manage all users |
| `/admin/requests` | Approve / reject book issue requests |
| `/admin/settings` | Admin profile & password settings |

### 👤 User Portal (`/user/*`)

| Route | Description |
|---|---|
| `/user/books` | Browse the full book catalog |
| `/user/alloted` | View currently borrowed books |
| `/user/history` | View past borrowing history |
| `/user/profile` | View user profile |
| `/user/settings` | Update profile & change password |

---

## 🌐 Environment Variables Reference

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Base URL for the FastAPI backend | `http://localhost:8000` |

> All frontend environment variables **must** be prefixed with `NEXT_PUBLIC_` to be accessible in the browser.

---

## ☁️ Deploying to Vercel

### Option 1: Vercel Dashboard (Recommended)

1. Push your code to GitHub / GitLab / Bitbucket.
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo.
3. Set the **Root Directory** to `library-management-fe`.
4. Add the environment variable:
   - `NEXT_PUBLIC_API_BASE_URL` → your deployed FastAPI backend URL
5. Click **Deploy**.

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy from the frontend directory
cd library-management-fe
vercel
```

When prompted, set the environment variable `NEXT_PUBLIC_API_BASE_URL` to your backend URL.

---

## 🔑 Authentication Flow

1. User logs in at `/` → receives a **JWT token** from the FastAPI backend.
2. The token is stored in `localStorage`.
3. All subsequent API requests automatically attach the token via an **Axios request interceptor**.
4. If the server returns a **401 Unauthorized**, the app clears the session and redirects to login.

---

## 🎨 UI & Theming

- Supports **dark mode** and **light mode** via `next-themes`.
- Built with **shadcn/ui** components for a consistent, accessible design system.
- Charts on the admin dashboard are powered by **Recharts**.
- Toast notifications use **Sonner**.

---

## 📝 License

This project is for educational/personal use.
