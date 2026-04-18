# ConstructAI Frontend Architecture

## Application Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    ConstructAI Frontend                      │
│                  (React + TypeScript + Vite)                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                        App Component                         │
│  ├─ Router Setup                                            │
│  ├─ Protected Routes                                        │
│  └─ Auth State Management                                   │
└─────────────────────────────────────────────────────────────┘

        │
        ├─ Login Page (/login)
        │  └─ Email/Password Form
        │     └─ JWT Token Storage
        │
        ├─ Dashboard (/)
        │  ├─ Statistics Cards (4)
        │  ├─ Activity Charts (2)
        │  └─ Recent Projects Table
        │
        ├─ Projects (/projects)
        │  ├─ Project Grid
        │  ├─ Create Form
        │  ├─ Edit/Delete/Upload
        │  └─ Empty State
        │
        └─ Project Detail (/projects/:id)
           ├─ Project Info
           ├─ BOQ Management
           ├─ Activities Table
           └─ Gantt Chart Placeholder

┌─────────────────────────────────────────────────────────────┐
│                    Navbar Component                          │
│  ├─ Logo                                                    │
│  ├─ Navigation Links                                        │
│  ├─ User Profile                                            │
│  └─ Mobile Menu                                             │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Architecture

```
┌─────────────────┐
│  User Interface │
│  (React Pages)  │
└────────┬────────┘
         │
         ▼
┌──────────────────────┐
│  State Management    │
│  - authStore         │
│  - localStorage      │
│  - React hooks       │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  API Client Layer    │
│  - axios             │
│  - interceptors      │
│  - error handling    │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  HTTP Requests       │
│  ↓                   │
│  Backend (FastAPI)   │
│  ↓                   │
│  HTTP Responses      │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  Update State &      │
│  Re-render UI        │
└──────────────────────┘
```

## Component Hierarchy

```
App
├── Router
│   ├── Login
│   ├── ProtectedRoute
│   │   ├── Dashboard
│   │   │   ├── StatCard (x4)
│   │   │   ├── Chart (LineChart)
│   │   │   ├── Chart (BarChart)
│   │   │   └── ProjectsTable
│   │   ├── Projects
│   │   │   ├── ProjectForm
│   │   │   └── ProjectCard (x many)
│   │   │       ├── ActionBtn (x3)
│   │   │       └── StatusBadge
│   │   └── ProjectDetail
│   │       ├── ProjectInfo
│   │       ├── BOQUpload
│   │       ├── ActivitiesTable
│   │       └── GanttChart
│   └── Navbar
│       ├── Logo
│       ├── NavLink (x3)
│       ├── UserProfile
│       └── LogoutBtn
└── Global Styles
```

## API Integration Map

```
Frontend Routes          API Endpoints           Backend Services
─────────────────────────────────────────────────────────────────

/login          ─────→  POST /auth/login        AuthService
                ◄─────  JWT Token + User

/               ─────→  GET /projects/          ProjectService
                ◄─────  List of Projects

/projects       ─────→  POST /projects/         ProjectService
                ◄─────  New Project

/projects       ─────→  DELETE /projects/{id}   ProjectService
                ◄─────  Deleted

/projects/:id   ─────→  GET /projects/{id}      ProjectService
                ◄─────  Project Details

                ─────→  POST /projects/{id}/    ProjectService
                        upload-boq               BOQParser
                ◄─────  BOQ Processed
```

## Authentication Flow

```
┌──────────────┐
│ User enters  │
│  credentials │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│  Form Validation     │
│  - Email format      │
│  - Password length   │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  POST /auth/login    │
│  - email             │
│  - password          │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Response Received   │
│  - JWT Token         │
│  - User Data         │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Store Token in      │
│  localStorage        │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Update authStore    │
│  - isAuthenticated   │
│  - user data         │
│  - token             │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Redirect to /       │
│  Dashboard           │
└──────────────────────┘
```

## Data Structures

### User Object
```typescript
{
  id: 1,
  email: "test@example.com",
  username: "testuser",
  full_name: "Test User",
  role: "project_manager",
  is_active: true,
  is_verified: true,
  created_at: "2026-04-18T00:00:00"
}
```

### Project Object
```typescript
{
  id: 1,
  name: "Office Building",
  description: "Modern 5-story office building",
  location: "Downtown, City",
  start_date: "2026-05-01T00:00:00",
  end_date: "2027-12-31T00:00:00",
  total_duration_days: 580,
  total_cost: 2500000,
  status: "active",
  boq_file_path: "path/to/boq.xlsx",
  schedule_data: { /* Gantt data */ },
  created_at: "2026-04-18T00:00:00",
  updated_at: "2026-04-18T12:30:00"
}
```

## State Management Strategy

```
┌─────────────────────────────────────────┐
│         Global Auth State               │
│  (authStore)                            │
│  ├─ isAuthenticated: boolean            │
│  ├─ user: User | null                   │
│  ├─ token: string | null                │
│  └─ Methods:                            │
│     ├─ setAuth(response)                │
│     ├─ logout()                         │
│     ├─ loadFromStorage()                │
│     └─ setUser(user)                    │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│      Local Component State              │
│  (React hooks)                          │
│  ├─ Loading states                      │
│  ├─ Form data                           │
│  ├─ Error messages                      │
│  └─ UI visibility                       │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│      Browser Storage                    │
│  (localStorage)                         │
│  ├─ access_token                        │
│  └─ user (JSON string)                  │
└─────────────────────────────────────────┘
```

## Error Handling Flow

```
User Action
    │
    ▼
Validation Check
    │
    ├─ Valid ─────→ Send Request
    │
    └─ Invalid ──→ Show Error
                   └─ Display Validation Message

Send Request
    │
    ▼
Network Response
    │
    ├─ 200 OK ──────→ Process Data
    │                └─ Update State
    │                └─ Show Success (optional)
    │
    ├─ 401 Unauth ─→ Clear Storage
    │                └─ Redirect to Login
    │
    ├─ 400 Bad ────→ Show Error Message
    │
    ├─ 500 Error ──→ Show Generic Error
    │
    └─ Network ────→ Timeout/Offline
                     └─ Show Connection Error
```

## Performance Optimization Points

```
1. Code Splitting
   └─ React Router lazy loading pages

2. Component Optimization
   └─ React.memo for expensive components
   └─ useCallback for event handlers
   └─ useMemo for computed values

3. API Optimization
   └─ Request deduplication
   └─ Response caching ready
   └─ Pagination ready

4. UI Optimization
   └─ CSS Grid over flexbox where possible
   └─ Efficient re-renders
   └─ Minimal DOM updates

5. Bundle Optimization
   └─ Vite fast builds
   └─ Tree shaking enabled
   └─ Minification on build
```

## Responsive Breakpoints

```
Mobile (< 480px)
├─ Single column layouts
├─ Stack all elements
├─ Touch-friendly buttons
└─ Simplified navigation

Mobile Large (480px - 768px)
├─ 2 column grids
├─ Adjusted spacing
├─ Hamburger menu
└─ Simplified tables

Tablet (768px - 1024px)
├─ 3 column grids
├─ Full forms
├─ Adjusted charts
└─ Side navigation

Desktop (> 1024px)
├─ 4 column grids
├─ Full features
├─ All charts visible
└─ Complete navigation
```

---

**Architecture Version**: 2.0.0
**Last Updated**: April 2026
