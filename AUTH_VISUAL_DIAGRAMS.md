# 🎨 ConstructAI Authentication - Visual Diagrams

## 📊 System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                     CONSTRUCTAI FRONTEND                         │
│                    (React + TypeScript)                          │
└──────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST API
                              │
┌──────────────────────────────────────────────────────────────────┐
│                    CONSTRUCTAI BACKEND                           │
│                  (FastAPI + PostgreSQL)                          │
│                                                                  │
│  Routes:                                                         │
│  • POST /auth/register        → User Registration              │
│  • POST /auth/login           → User Authentication            │
│  • GET  /auth/me              → Get Current User               │
│  • POST /auth/forgot-password → Request Password Reset         │
│  • POST /auth/reset-password  → Reset Password                 │
└──────────────────────────────────────────────────────────────────┘
                              │
                              │ SQL Queries
                              │
                    ┌─────────┴─────────┐
                    │  PostgreSQL DB    │
                    │  • Users Table    │
                    │  • Sessions       │
                    │  • Tokens         │
                    └───────────────────┘
```

---

## 🔄 Registration Flow Diagram

```
                           START
                             │
                             ▼
                    ┌────────────────┐
                    │   /register    │
                    │ Registration   │
                    │     Page       │
                    └────────────────┘
                             │
                             ▼
                    ┌────────────────────────────┐
                    │  User Fills Form           │
                    │  • Full Name               │
                    │  • Email                   │
                    │  • Username                │
                    │  • Password (8+ chars)     │
                    │  • Confirm Password        │
                    └────────────────────────────┘
                             │
                             ▼
                    ┌────────────────────────────┐
                    │  Client-Side Validation    │
                    │  • All fields filled?      │
                    │  • Email format valid?     │
                    │  • Username 3+ chars?      │
                    │  • Passwords match?        │
                    │  • Password 8+ chars?      │
                    └────────────────────────────┘
                          Yes │ No
                             ▼ ▼
                        ❌ Error ✅ Pass
                        │        │
                        │        ▼
                        │   ┌────────────────────┐
                        │   │ Submit Form        │
                        │   │ POST /auth/register│
                        │   └────────────────────┘
                        │        │
                        │        ▼
                        │   ┌────────────────────────────┐
                        │   │  Backend Validation        │
                        │   │  • Email unique?           │
                        │   │  • Username unique?        │
                        │   │  • Pydantic validation     │
                        │   └────────────────────────────┘
                        │          Yes │ No
                        │             ▼ ▼
                        │         ✅ OK ❌ Error
                        │             │ │
        ┌───────────────┴─────────────┘ │
        │                               │
        ▼                               ▼
   ┌────────────────┐          ┌────────────────┐
   │ Create User    │          │ Show Error     │
   │ Hash Password  │          │ Message        │
   │ Save to DB     │          │                │
   └────────────────┘          └────────────────┘
        │
        ▼
   ┌────────────────┐
   │ Success        │
   │ Message        │
   │ "Account       │
   │  Created!"     │
   └────────────────┘
        │
        ▼
   ┌────────────────┐
   │ Auto-Redirect  │
   │ to /login      │
   │ after 2 secs   │
   └────────────────┘
        │
        ▼
      END
```

---

## 🔐 Login Flow Diagram

```
                           START
                             │
                             ▼
                    ┌────────────────┐
                    │    /login      │
                    │   Login Page   │
                    └────────────────┘
                             │
                             ▼
                    ┌────────────────────────────┐
                    │  User Enters Credentials   │
                    │  • Email                   │
                    │  • Password                │
                    └────────────────────────────┘
                             │
                             ▼
                    ┌────────────────────────────┐
                    │  Frontend Validation       │
                    │  • Email filled?           │
                    │  • Password filled?        │
                    └────────────────────────────┘
                          Yes │ No
                             ▼ ▼
                        ✅ Pass ❌ Error
                             │    │
                             │    └──→ Show Error
                             │
                             ▼
                    ┌────────────────────┐
                    │ Submit Credentials │
                    │ POST /auth/login   │
                    └────────────────────┘
                             │
                             ▼
                    ┌────────────────────────────┐
                    │  Backend Authentication    │
                    │  • Find user by email?     │
                    │  • Compare password hash?  │
                    │  • User active?            │
                    └────────────────────────────┘
                          Yes │ No
                             ▼ ▼
                        ✅ Valid ❌ Invalid
                             │      │
                             │      └──→ Return Error
                             │           {"detail": "..."}
                             ▼
                    ┌────────────────────────────┐
                    │  Generate JWT Token        │
                    │  Payload:                  │
                    │  • user_id                 │
                    │  • email                   │
                    │  • exp (expiration)        │
                    └────────────────────────────┘
                             │
                             ▼
                    ┌────────────────────────────┐
                    │  Return Response           │
                    │  {                         │
                    │   "access_token": "jwt...",│
                    │   "token_type": "bearer",  │
                    │   "user": {...}            │
                    │  }                         │
                    └────────────────────────────┘
                             │
                             ▼
                    ┌────────────────────────────┐
                    │  Frontend Processes        │
                    │  • Save token to storage   │
                    │  • Save user info          │
                    │  • Update auth state       │
                    │  • Set Bearer header       │
                    └────────────────────────────┘
                             │
                             ▼
                    ┌────────────────────────────┐
                    │  Navigate to Dashboard     │
                    │  Protected Route ✓         │
                    └────────────────────────────┘
                             │
                             ▼
                      USER LOGGED IN ✅
```

---

## 🔑 Password Recovery Flow Diagram

```
                           START
                             │
                             ▼
                    ┌─────────────────────┐
                    │  /forgot-password   │
                    │   Enter Email       │
                    └─────────────────────┘
                             │
                             ▼
                    ┌──────────────────────────┐
                    │   STEP 1: Request Reset  │
                    │                          │
                    │  User enters email and   │
                    │  clicks "Send Link"      │
                    └──────────────────────────┘
                             │
                             ▼
                    ┌──────────────────────────┐
                    │  Frontend Validation     │
                    │  • Email filled?         │
                    │  • Email format valid?   │
                    └──────────────────────────┘
                          Yes │ No
                             ▼ ▼
                        ✅ OK ❌ Error
                             │   │
                             │   └──→ Show error msg
                             │
                             ▼
                    ┌──────────────────────────┐
                    │  Send Request            │
                    │  POST /auth/forgot-pwd   │
                    │  { "email": "user@ex..." }
                    └──────────────────────────┘
                             │
                             ▼
                    ┌──────────────────────────┐
                    │  Backend Processing      │
                    │  • Find user by email    │
                    │  • Generate reset token  │
                    │  • Create email link     │
                    │  • Send email (SMTP)     │
                    └──────────────────────────┘
                             │
                             ▼
                    ┌──────────────────────────┐
                    │  Show Success Message    │
                    │  "Check your email for   │
                    │   reset link!"           │
                    └──────────────────────────┘
                             │
                             ▼
                    ┌──────────────────────────┐
                    │   STEP 2: Reset Password │
                    │                          │
                    │  User clicks email link: │
                    │  /forgot-pwd?token=xyz   │
                    └──────────────────────────┘
                             │
                             ▼
                    ┌──────────────────────────┐
                    │  Frontend Detects Token  │
                    │  • Extract from URL      │
                    │  • Show reset form       │
                    │  • New Password field    │
                    │  • Confirm Password      │
                    └──────────────────────────┘
                             │
                             ▼
                    ┌──────────────────────────┐
                    │  User Enters Passwords   │
                    │  • New Password          │
                    │  • Confirm Password      │
                    │  • Click Reset           │
                    └──────────────────────────┘
                             │
                             ▼
                    ┌──────────────────────────┐
                    │  Frontend Validation     │
                    │  • Both filled?          │
                    │  • 8+ characters?        │
                    │  • Passwords match?      │
                    └──────────────────────────┘
                          Yes │ No
                             ▼ ▼
                        ✅ OK ❌ Error
                             │   │
                             │   └──→ Show error msg
                             │
                             ▼
                    ┌──────────────────────────┐
                    │  Send Reset Request      │
                    │  POST /auth/reset-pwd    │
                    │  {                       │
                    │   "token": "...",        │
                    │   "new_password": "...", │
                    │   "confirm_pwd": "..."   │
                    │  }                       │
                    └──────────────────────────┘
                             │
                             ▼
                    ┌──────────────────────────┐
                    │  Backend Processing      │
                    │  • Verify token valid    │
                    │  • Hash new password     │
                    │  • Update in database    │
                    │  • Invalidate token      │
                    └──────────────────────────┘
                             │
                             ▼
                    ┌──────────────────────────┐
                    │  Success Message         │
                    │  "Password reset         │
                    │   successful!"           │
                    └──────────────────────────┘
                             │
                             ▼
                    ┌──────────────────────────┐
                    │  Auto-Redirect to Login  │
                    │  after 2 seconds         │
                    └──────────────────────────┘
                             │
                             ▼
                    ┌──────────────────────────┐
                    │  User Can Login          │
                    │  with new password ✅    │
                    └──────────────────────────┘
                             │
                             ▼
                      PASSWORD RESET COMPLETE
```

---

## 📱 Component Structure

```
App
├── Router
│   ├── Login (public)
│   │   ├── Email Input
│   │   ├── Password Input
│   │   ├── Login Button
│   │   ├── Link to Register
│   │   └── Link to Forgot Password
│   │
│   ├── Register (public)
│   │   ├── Full Name Input
│   │   ├── Email Input
│   │   ├── Username Input
│   │   ├── Password Input (with toggle)
│   │   ├── Confirm Password Input
│   │   ├── Sign Up Button
│   │   └── Link to Login
│   │
│   ├── ForgotPassword (public)
│   │   ├── Step 1: Email
│   │   │   ├── Email Input
│   │   │   └── Send Button
│   │   ├── Step 2: Reset
│   │   │   ├── New Password Input (with toggle)
│   │   │   ├── Confirm Password Input
│   │   │   └── Reset Button
│   │   └── Link to Login
│   │
│   ├── Dashboard (protected)
│   │   ├── Navbar
│   │   ├── Stats Cards
│   │   └── Charts
│   │
│   ├── Projects (protected)
│   │   ├── Navbar
│   │   ├── Create Form
│   │   └── Project Grid
│   │
│   └── ProjectDetail (protected)
│       ├── Navbar
│       ├── Project Info
│       └── BOQ/Activities
│
└── Store (authStore)
    └── { user, token, isAuthenticated, methods }
```

---

## 🔐 JWT Token Flow

```
Frontend                      Backend                    Database
  │                             │                           │
  │ 1. POST /login              │                           │
  ├────────────────────────────>│                           │
  │    {email, password}         │                           │
  │                             │ 2. Find user              │
  │                             ├──────────────────────────>│
  │                             │ 3. User record            │
  │                             │<──────────────────────────┤
  │                             │                           │
  │                             │ 4. Compare password hash  │
  │                             │                           │
  │                             │ 5. Generate JWT token     │
  │                             │    - Sign with secret     │
  │                             │    - Add expiration       │
  │                             │                           │
  │  6. Return token            │                           │
  │<────────────────────────────┤                           │
  │    {access_token, user}     │                           │
  │                             │                           │
  │ 7. Store in localStorage    │                           │
  │    authStore                │                           │
  │                             │                           │
  │ 8. Add to header            │                           │
  │    Authorization: Bearer    │                           │
  │    {token}                  │                           │
  │                             │                           │
  │ 9. GET /auth/me             │                           │
  ├────────────────────────────>│                           │
  │    (with token in header)   │                           │
  │                             │ 10. Decode token          │
  │                             │     Verify signature      │
  │                             │     Check expiration      │
  │                             │                           │
  │                             │ 11. Get user_id from token
  │                             ├──────────────────────────>│
  │                             │ 12. Fetch user record     │
  │                             │<──────────────────────────┤
  │  13. Return user data       │                           │
  │<────────────────────────────┤                           │
  │    {user data}              │                           │
  │                             │                           │
  │ 14. Grant access            │                           │
  │     Show Dashboard          │                           │
```

---

## 📊 Form Validation Matrix

```
┌─────────────────────────────────────────────────────────────────┐
│          REGISTRATION FORM VALIDATION                           │
├─────────────────────────────────────────────────────────────────┤
│ Field                 │ Frontend Validation    │ Backend Validation
├──────────────────────┼────────────────────────┼──────────────────
│ Full Name            │ • Required             │ • Max 100 chars
│                      │ • No validation needed │ • Pydantic check
├──────────────────────┼────────────────────────┼──────────────────
│ Email                │ • Required             │ • EmailStr type
│                      │ • Email format check   │ • Unique constraint
│                      │ • Regex validation     │ • DB lookup
├──────────────────────┼────────────────────────┼──────────────────
│ Username             │ • Required             │ • 3-50 char range
│                      │ • Min 3 characters     │ • Unique constraint
│                      │ • Alphanumeric+_       │ • DB lookup
├──────────────────────┼────────────────────────┼──────────────────
│ Password             │ • Required             │ • 8-100 char range
│                      │ • Min 8 characters     │ • Hash & store
│                      │ • Show/hide toggle     │ • Bcrypt hashing
├──────────────────────┼────────────────────────┼──────────────────
│ Confirm Password     │ • Required             │ • Must match
│                      │ • Must match password  │ • (verified in POST)
└──────────────────────┴────────────────────────┴──────────────────┘
```

---

## 🎯 API Response Status Codes

```
┌────────────────┬─────────────────────────────────────────────────┐
│  Status Code   │  Meaning                                        │
├────────────────┼─────────────────────────────────────────────────┤
│  201 Created   │ User registration successful                   │
│  200 OK        │ Login/password reset successful                │
│  400 Bad Req   │ Validation failed (email exists, etc)          │
│  401 Unauth    │ Invalid credentials or expired token           │
│  404 Not Found │ User not found                                 │
│  422 Unproc    │ Invalid data format (Pydantic validation)      │
│  500 Server Err│ Backend error (check logs)                     │
└────────────────┴─────────────────────────────────────────────────┘
```

---

## 🔄 Error Handling Flow

```
                        API Request
                             │
                             ▼
                    ┌────────────────┐
                    │  Success (2xx) │
                    └────────────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
                    ▼                 ▼
             Process Data      Show Error
              Update State     Message
              Redirect         Retry
              
                    ┌────────────────┐
                    │  Error (4xx)   │
                    └────────────────┘
                             │
                    ┌────────┴────────────┐
                    │                     │
                    ▼                     ▼
            User Error          Server Error
            Show Message        Show Message
            Let Retry           Log Error
```

---

## 📈 Authentication State Lifecycle

```
┌──────────────────────────────────────────────────────────────────┐
│                    AUTH STATE LIFECYCLE                          │
├──────────────────────────────────────────────────────────────────┤
│
│  Initial State
│  ├─ user: null
│  ├─ token: null
│  └─ isAuthenticated: false
│
│         ↓ User Registers/Logs In
│
│  Authenticated State
│  ├─ user: { id, email, username, ... }
│  ├─ token: "eyJhbGc..."
│  └─ isAuthenticated: true
│
│  Stored in localStorage as 'authStore'
│
│         ↓ User Logs Out / Token Expires
│
│  Logged Out State
│  ├─ user: null
│  ├─ token: null
│  └─ isAuthenticated: false
│
│  localStorage cleared
│
└──────────────────────────────────────────────────────────────────┘
```

---

## 📱 Responsive Breakpoints

```
┌─────────────────────────────────────────────────────────────────┐
│           RESPONSIVE DESIGN BREAKPOINTS                         │
├──────────────────────┬──────────────┬──────────────────────────┤
│  Device              │  Width       │  Styling                 │
├──────────────────────┼──────────────┼──────────────────────────┤
│ Mobile Phone         │ < 480px      │ • Full width             │
│ (iPhone SE)          │              │ • Stacked layout         │
│                      │              │ • Larger touch targets   │
│                      │              │ • Vertical nav           │
├──────────────────────┼──────────────┼──────────────────────────┤
│ Tablet               │ 480-1024px   │ • Grid layout            │
│ (iPad)               │              │ • Medium width           │
│                      │              │ • Flexible spacing       │
├──────────────────────┼──────────────┼──────────────────────────┤
│ Desktop              │ > 1024px     │ • Full featured layout   │
│ (Monitor)            │              │ • Optimal spacing        │
│                      │              │ • All features visible   │
└──────────────────────┴──────────────┴──────────────────────────┘
```

---

## 🎨 Design System

```
┌─────────────────────────────────────────────────────────────────┐
│                    DESIGN SYSTEM                                │
├─────────────────────────────────────────────────────────────────┤
│
│  Colors
│  ├─ Primary (Blue):      #2563eb
│  ├─ Gradient:            667eea → 764ba2 (purple to violet)
│  ├─ Success (Green):     #10b981
│  ├─ Danger (Red):        #ef4444
│  ├─ Background:          #f8fafc (light)
│  └─ Text:                #1e293b (dark)
│
│  Typography
│  ├─ Headings:     1.5rem - 2.5rem (bold)
│  ├─ Body:         1rem (regular)
│  ├─ Labels:       0.95rem (semibold)
│  └─ Hints:        0.85rem (light)
│
│  Spacing
│  ├─ Minimal:      0.5rem
│  ├─ Standard:     1rem
│  ├─ Large:        1.5rem - 2rem
│  └─ Huge:         3rem
│
│  Borders
│  ├─ Radius:       0.5rem
│  ├─ Width:        2px (focus), 1px (standard)
│  └─ Color:        #e2e8f0
│
│  Shadows
│  ├─ Small:        0 2px 4px rgba(0,0,0,0.1)
│  └─ Large:        0 20px 60px rgba(0,0,0,0.3)
│
└─────────────────────────────────────────────────────────────────┘
```

---

These diagrams provide visual representations of:
- System architecture
- User flows
- Component hierarchy  
- Data validation
- State management
- Error handling
- Responsive design
- Design system

Perfect for understanding and explaining the authentication system!
