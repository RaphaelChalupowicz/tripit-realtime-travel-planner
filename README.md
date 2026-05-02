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
│   │   ├── Infrastructure/     # JWT, utilities, cross-cutting concerns
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
