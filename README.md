# 🚀 LMS Core Dashboard Portal (Frontend Client)

A modern, multi-tenant financial administration client platform built using **Next.js 15 (App Router)** and **TypeScript**. This platform provides private lending companies and micro-finance brokers with secure, real-time control panels to onboard borrowers, process automated loan tracking pipelines, monitor cash flows, and trace real-time system audit metrics.

## 🛠 Tech Stack Architecture

* **Application Framework:** Next.js 15 (App Router Core)
* **Language Layer:** TypeScript (Strictly typed schemas)
* **Design & System Tokens:** Tailwind CSS v4 Engine (Zero runtime utility tokens)
* **Component Composition:** Shadcn UI Primitives (Component border-radius tokens locked at exactly `0.55rem`)
* **Asynchronous Data Hydration:** TanStack React Query v5
* **Real-time Synchronization Engine:** Microsoft SignalR Core WebSockets Client
* **Network Transport Layer:** Axios HTTP Client Interceptors

---

## ✨ Implemented Core Features

### 💻 Workspace Command Overview
An analytical hub displaying real-time Key Performance Indicators (KPIs) like Accumulated Capital, Portfolio Risk Factors, and Revenue Profit Margins. It features type-safe, monochromatic **Recharts (Line and Pie layouts)** that dynamically toggle theme states instantly.

### 👥 Borrowers Portfolio Registry
A centralized, isolated customer directory page allowing loan officers to register micro-lending candidates, filter accounts dynamically via local indexing arrays, and evaluate borrower liabilities instantly via risk validation guards.

### 🛡 Immutable Compliance & Auditing
A dual-view security panel that streams system telemetry concurrently. It displays **Operational Activity Trails** (detailing descriptive "Before vs After" data mutations) and **Access Firewall Logs** (tracking failed authentication challenges and user profiles within a 24h index window).

### 🏢 Tenant Configurations Console
A settings cockpit giving Organization Admins the authority to modify operational parameters (such as standard regional VAT scales and Default Base Loan Interest calculations) that are snapshotted instantly during transaction execution loops.

### 👤 Profile Customizations Panel
An integrated navigation dropdown overlay inside the `TopNavBar` module that handles live sessions, extracts client-side identity tags, and coordinates unified interface theme switches (**Light / Dark / System**) through the `next-themes` provider.

---

## 🎨 Design System Constraints

This workspace relies on a minimalistic, high-contrast, professional monochromatic theme design philosophy.
* **Typography:** Anchored to `Geist`, `Geist Mono`, and `Inter` variable font mapping hierarchies.
* **Visual Curves:** Components are locked to an explicit container token system radius of **`0.55rem`** (`rounded-xl` for main panels, `rounded-md` for inputs/buttons).
* **Theme Continuity:** Class-based mode selections are wired directly to the system root using the Tailwind v4 custom selector directive: `@custom-variant dark (&:is(.dark *));`.

---

## 📦 Directory Structure Mapping

```bash
src/
├── app/
│   ├── dashboard/
│   │   ├── audit/            # Security logs & firewall metrics stream
│   │   ├── clients/          # Borrowers profile management and risk guards
│   │   ├── loans/            # Interactive financial ledger (Future sprint)
│   │   ├── organizations/    # Base tax & default snapshot percentage views
│   │   ├── users/            # Staff directory registry and access controls
│   │   ├── layout.tsx        # Shell context container invoking TopNavBar & Sidebar
│   │   └── page.tsx          # Real-time Recharts analytics index page
│   ├── globals.css           # Tailwind v4 directives and OKLCH color token rules
│   └── layout.tsx            # Next-Themes and React Query Global Providers wrapper
├── components/
│   ├── ui/                   # Decoupled Shadcn primitive design UI files
│   ├── sidebar-nav.tsx       # Extracted link array mapping panel component
│   └── top-nav-bar.tsx       # Navigation bar containing profile actions & themes
└── lib/
    ├── api-client.ts         # Axios configuration instance
    └── api-hooks.ts          # Central repository for TanStack Queries & Mutations
```

---

## ⚡ Getting Started & Deployment

### 1. Environmental Variable Injection
Create an environmental validation settings document in your project root called `.env.local` and specify your proxy routing gateway address:
```env
NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:5243/api
NEXT_PUBLIC_SIGNALR_HUB_URL=http://localhost:5243/hubs
```

### 2. Dependency Resolution Loop
Install the type-safe packages and build components inside your local machine workspace terminal node:
```bash
npm install
```

### 3. Execution of Local Runtime Instance
Fire up the Next.js development engine server pipeline:
```bash
npm run dev
```
Open your browser framework environment to **`http://localhost:3000`** to interface with your authentication window gateway split pane.

---

## 📋 Real-Time Synchronization Specification

The frontend connects with the backend ecosystem via two communication techniques configured within `src/lib/api-hooks.ts` and `src/app/dashboard/page.tsx`:
1. **State Management Pipelines:** TanStack Queries manage data caching layer caches. Calling mutations (such as `useCreateBorrowerMutation`) auto-invalidates target query indices to update tables en-masse.
2. **WebSockets Push Delivery:** On dashboard mounting cycles, a persistent `HubConnection` pipeline locks into the remote backend route notifications. Upon receiving a broadcast event label (`ReceiveNotification`), the client forces an query invalidation sequence to refresh analytics lines instantly.
