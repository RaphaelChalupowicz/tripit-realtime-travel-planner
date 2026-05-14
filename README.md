# ✈️ TripIt - making trips should be easy!

A collaborative **Realtime travel planner** that lets users create trips, build tracks, track budgets, and collaborate with friends and family in **live shared workspaces**.

Built with **React + TypeScript** frontend, **Supabase Auth**, and **.NET + SignalR** backend.

---

# 🚀 What it does

TripIt allows users to:

1. Create trips with destination and dates
2. Invite friends / family to collaborate
3. Plan daily tracks
4. Add locations on an interactive map
5. Track notes and travel details
6. Manage shared trip budget
7. Collaborate in **Realtime** using SignalR (planned)
8. Assign roles (Owner / Editor / Viewer)
9. Auto save and sync across devices
10. Work on **desktop + mobile** seamlessly

The result: one shared workspace for planning trips together.

---

# ✨ Why this is different

Most travel planners are single user tools and complex.

TripIt is built for **Realtime collaboration** and makes messy group trip planning feel **easy and deliberate**:

```bash
create trip → invite users → edit itinerary → live sync → shared planning
                                                  ↓
                                         multi user workspace
```

Users see updates instantly:

user adds activity → broadcast via SignalR → all users updated

---

# 🏗️ Architecture

```bash
tripit/
├── client/                     # React frontend
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── features/
│   │   ├── pages/
│   │   ├── services/
│   │   └── store/
│
├── server/                     # ASP.NET Core backend
│   ├── TripIt.Api/
│   │   ├── Features/           # Feature-based modules
│   │   │   ├── Auth/           # Authentication integration (Supabase Auth)
│   │   │   ├── Trips/          # Trip management
│   │   │   ├── Itinerary/      # Days & activities
│   │   │   ├── Collaboration/  # Participants & roles
│   │   │   ├── Budget/         # Expenses tracking
│   │   │   └── Realtime/       # SignalR logic (later phase)
│   │   │
│   │   ├── Models/             # Domain entities (User, Trip, etc.)
│   │   ├── Data/               # DbContext and EF Core setup
│   │   ├── Hubs/               # SignalR hubs
│   │   ├── Infrastructure/     # JWT, utilities, cross cutting concerns
│   │   ├── Middleware/         # Custom middleware
│   │   └── Program.cs          # Application entry point
│
└── README.md
```

---

# 🧠 Real-time collaboration

Users connected to the same trip receive updates when:

- itinerary changes
- activity added
- notes edited
- participant added
- location added

SignalR groups:

trip:{tripId}

Workflow:

user edit → API save → DB update → SignalR broadcast → UI refresh

---

# 🗺️ Features

## Trips

- Create trip
- Edit trip
- Delete trip
- Share trip
- Trip dashboard

## Collaboration

- Invite users
- Owner / Editor / Viewer roles
- Live updates
- Presence (planned)

## Itinerary

- Trip days
- Activities
- Time planning
- Notes
- Locations

## Map

- OpenStreetMap
- Activity markers
- Location picker
- Day filtering

## Budget (V1 planned)

- Expense tracking
- Split between users
- Total cost

## Notes

- Trip notes
- Activity notes
- Shared editing

---

# 🖥️ Screens (planned)

- Landing page
- Login / Register
- Dashboard
- Create trip
- Trip workspace
- Map + planner split view
- Collaboration panel

---

# ⚙️ Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind
- React Router
- Supabase Auth
- TanStack Query
- Zustand
- React Leaflet
- OpenStreetMap

## Backend

- ASP.NET Core (.NET 8)
- SignalR
- Entity Framework Core
- Swagger
- SignalR (planned)

## Authentication

- Supabase Auth (email/password and google auth provider via Supabase)
- Frontend session handling through Supabase client

## Database

- PostgreSQL
- EF Core Migrations

## Database strategy (Cloud-primary + local cache)

This project treats the cloud database as the single source of truth (Supabase/Postgres). The frontend keeps a minimal local cache of the current `AppUser` (in `localStorage`) to improve UX while the client syncs with the server on signin.

Developer notes:

- When a user signs in the client will always attempt to fetch the canonical `Users` row from the server. A short lived cache (5 minute TTL) is used to show the user's onboarding state while the remote call completes.
- Avoid keeping a separate persistent local DB copy of the `Users` table. If you need local offline-first features later, prefer IndexedDB and design a sync reconciliation strategy.
- If you accidentally drop the server local table, the server will recreate or upsert the user during sync; note this will set `IsOnboardingCompleted` to `false` on a fresh insert. To avoid losing important flags, keep backups and enable migrations.

Recommended developer workflow:

1. Configure Supabase credentials in `TripIt/Client/.env.local` and server config.
2. Run EF Core migrations and enable DB backups for the server Postgres used in development:

```bash
cd TripIt/server/TripIt.Api
dotnet ef database update
dotnet run
```

3. Run the frontend and sign in. The client will cache `AppUser` in `localStorage` under the `appUserCache` key for a short TTL to improve routing decisions while syncing.

4. If you decide to migrate the server Postgres to Supabase Postgres (so Supabase Auth + Supabase Postgres are unified).

5. For production, prefer hosting the canonical Postgres (Supabase DB) and restrict server side local only persistence to transient caches only.

---

# 📋 Requirements

Frontend:

- Node 18+
- npm

Backend:

- .NET 8 SDK
- PostgreSQL

---

# ⚙️ Setup

## 1. Clone repository

```bash
git clone https://github.com/RaphaelChalupowicz/tripit-realtime-travel-planner.git
cd tripit-realtime-travel-planner
```

## 2. Backend setup

```bash
cd TripIt/server/TripIt.Api
dotnet restore
dotnet ef database update
dotnet run
```

Server runs on:

```bash
http://localhost:5122
```

Security and secrets

- Do NOT commit database passwords or service role keys to source control. Remove any real credentials from `appsettings.*.json` before committing.
- For local development prefer `dotnet user-secrets`:

```powershell
cd TripIt/server/TripIt.Api
# set the connection string for this project (keeps secrets out of repo)
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=db.<project-ref>.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=<password>;SSL Mode=Require;Trust Server Certificate=true" --project TripIt.Api.csproj
```

Or set a process env var in your terminal for one-off runs:

```powershell
$env:SUPABASE_PG_CONN = "Host=db.<project-ref>.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=<password>;SSL Mode=Require;Trust Server Certificate=true"
dotnet run
```

If you use the included migration scripts, they are located at `TripIt/server/TripIt.Api/tools/` and are intended as operational helpers sanitize any examples before use.

## 3. Frontend setup

```bash
cd TripIt/Client
npm install
npm run dev
```

Create `TripIt/Client/.env.local` with:

```bash
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-public-key>
VITE_API_BASE_URL=http://localhost:5122
```

Client runs on:

```bash
http://localhost:8080
```

Health check page:

```bash
http://localhost:8080/health-check
```

---

# 🔐 Authentication

Authentication is handled by **Supabase Auth**.

Frontend authentication uses the Supabase client with:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Typical flow:

- Sign up / sign in from frontend via Supabase Auth
- Supabase manages user identity and sessions
- Frontend sends authenticated requests to backend APIs as needed

Planned protected routes:

- /trips
- /trip/:id
- /signalr

---

# 📡 SignalR

## Hub (planned)

- TripHub

## Events (planned)

- JoinTrip
- LeaveTrip
- TripUpdated
- ActivityUpdated
- ParticipantAdded

---

# 🧾 Example Trip Flow

```bash
Create trip: "Italy 2026" → invite friends → create day 1 → add "Colosseum" → add "Dinner in Rome" → save

Friend joins → sees updates live
```

---

# 🗂️ Entities

## User (implemented)

- Id
- ExternalAuthId
- AuthProvider
- Email
- FirstName
- LastName
- ProfileImageUrl
- IsAdmin
- IsOnboardingCompleted
- CreatedAt
- UpdatedAt

## Trip

- Id
- Name
- Destination
- StartDate
- EndDate
- OwnerId

## TripParticipant

- UserId
- TripId
- Role

## TripDay

- Id
- TripId
- Date

## Activity

- Id
- TripDayId
- Title
- Notes
- Latitude (may be changed)
- Longitude (may be changed)
- StartTime
- EndTime

---

# 🧭 Roadmap

## ✅ V1

- [x] Auth
- [ ] Trips
- [ ] Dashboard
- [ ] Trip workspace
- [ ] Map
- [ ] Itinerary
- [ ] Collaboration (SignalR)
- [ ] Roles
- [ ] Responsive UI

## 🔜 V2

- [ ] Budget tracking
- [ ] Comments
- [ ] Presence indicators
- [ ] Activity log
- [ ] Attachments
- [ ] Export trip

## 🔜 V3

- [ ] Mobile PWA
- [ ] Offline mode
- [ ] Route planning
- [ ] AI trip suggestions

---

# 🎯 Goals

## TripIt aims to:

- [x] simplify collaborative trip planning
- [x] provide Realtime shared editing
- [x] unify map + itinerary + notes
- [x] support mobile + desktop

License
MIT
