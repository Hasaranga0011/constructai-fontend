# ConstructAI Frontend - Quick Start Guide

## Installation & Setup

### 1. Install Dependencies
```bash
cd constructai-fontend
npm install
```

This will install all required packages:
- React 19
- TypeScript
- Vite (build tool)
- React Router (routing)
- Axios (HTTP client)
- Recharts (charts)
- Lucide React (icons)
- Date-fns (date utilities)

### 2. Configure Environment
The `.env` file is already configured:
```
VITE_API_URL=http://localhost:8000
```

Update this if your backend runs on a different URL.

### 3. Start Development Server
```bash
npm run dev
```

The frontend will be available at: `http://localhost:5173`

## Project Structure

```
src/
├── api/                    # API clients
│   ├── client.ts          # Axios config & interceptors
│   ├── auth.ts            # Auth endpoints
│   └── projects.ts        # Project endpoints
├── pages/                 # Page components
│   ├── Login.tsx          # Login page
│   ├── Dashboard.tsx      # Dashboard with stats & charts
│   ├── Projects.tsx       # Projects list with CRUD
│   └── ProjectDetail.tsx  # Detailed project view
├── components/            # Reusable components
│   └── Navbar.tsx         # Navigation bar
├── store/                 # State management
│   └── authStore.ts       # Auth store (login, logout, user data)
├── App.tsx               # Main app with routing
├── main.tsx              # Entry point
└── index.css             # Global styles
```

## Key Pages

### 1. **Login Page** (`/login`)
- Email and password login
- Stores JWT token in localStorage
- Demo: test@example.com / password

### 2. **Dashboard** (`/`)
- Real-time project statistics
- Activity trends chart
- Status distribution chart
- Recent projects table

### 3. **Projects** (`/projects`)
- List all projects
- Create new project
- Delete projects
- Upload BOQ files

### 4. **Project Detail** (`/projects/:id`)
- Complete project information
- BOQ file management
- Project activities
- Gantt chart (placeholder)

## API Endpoints Used

### Authentication
- `POST /auth/login` - Login with email/password
- `GET /auth/me` - Get current user
- `POST /auth/register` - Register new user

### Projects
- `GET /projects/` - Get all projects
- `POST /projects/` - Create new project
- `GET /projects/{id}` - Get project details
- `PUT /projects/{id}` - Update project
- `DELETE /projects/{id}` - Delete project
- `POST /projects/{id}/upload-boq` - Upload BOQ file

## Features Implemented

✅ **Authentication**
- JWT-based login
- Protected routes
- Auto-logout on token expiration
- User profile display

✅ **Dashboard**
- Statistics cards (total, active, completed projects)
- Charts (line & bar)
- Recent projects table

✅ **Project Management**
- Create/Read/Delete operations
- Project status tracking
- BOQ file uploads
- Cost and duration tracking

✅ **UI/UX**
- Responsive design (desktop, tablet, mobile)
- Modern gradient backgrounds
- Smooth animations
- Dark/Light mode ready
- Accessibility features

## Styling System

### Colors
- **Primary**: #2563eb (Blue)
- **Success**: #10b981 (Green)
- **Warning**: #f59e0b (Amber)
- **Danger**: #ef4444 (Red)
- **Background**: #f8fafc (Light)
- **Text**: #1e293b (Dark)

### Breakpoints
- **Desktop**: > 1024px (full features)
- **Tablet**: 768px - 1024px (adjusted layouts)
- **Mobile**: < 768px (single column, stacked)

## Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Linting
npm run lint
```

## Troubleshooting

### Port 5173 already in use?
```bash
npm run dev -- --port 3000
```

### Backend not connecting?
1. Check backend is running on `http://localhost:8000`
2. Check CORS is enabled in backend
3. Verify `.env` API URL
4. Open browser DevTools → Network tab to see API calls

### Login not working?
1. Check backend database has test user
2. Verify backend is running
3. Check browser console for errors

### Build failing?
```bash
rm -rf node_modules dist
npm install
npm run build
```

## Next Steps

To extend this dashboard:

1. **Add More Pages**
   - Create new file in `src/pages/`
   - Add route to `App.tsx`
   - Add navigation link to `Navbar.tsx`

2. **Add More Charts**
   - Use Recharts components
   - Import from `src/api/projects.ts`

3. **Improve Authentication**
   - Add forgot password
   - Add registration page
   - Add 2FA support

4. **Add Real-Time Updates**
   - WebSocket integration
   - Live project updates
   - Activity notifications

## Dependencies

- **react** (19.2.4): UI library
- **react-dom** (19.2.4): React DOM utilities
- **axios** (1.6.5): HTTP client
- **react-router-dom** (6.20.0): Routing
- **recharts** (2.10.3): Charts
- **lucide-react** (0.294.0): Icons
- **date-fns** (2.30.0): Date utilities

---

**Last Updated**: April 2026
**Version**: 2.0.0
