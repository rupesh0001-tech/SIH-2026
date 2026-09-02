# Farmer Setu Application — Authentication Module

## Overview

The **Farmer Setu Authentication Module** (`apps/application/farmer-setu`) provides an onboarding, authentication, and session management system designed exclusively for Indian Farmers. It connects the mobile client directly to the backend API while enforcing strict single-role (`FARMER`) access.

---

## Key Features

1. **Strict Farmer-Only Access**:
   - No role selector is shown to the user.
   - Registration hardcodes `role: "FARMER"`.
   - Login validates that the user's role in the backend is `FARMER`. Any other role (e.g. `MANDI_OPERATOR`, `ADMIN`) is strictly rejected with a clear error message.

2. **Cross-Platform Backend Connectivity**:
   - On **Web**: Directly connects to `http://localhost:4000/api/v1`.
   - On **Expo Go (Physical Android / iOS device)**: Dynamically extracts the host IP via `expo-constants` (e.g., `10.91.95.157:4000/api/v1`) so developers can test directly on mobile phones on the same local network without manual IP configuration.
   - On **Android Emulator**: Routes to `http://10.0.2.2:4000/api/v1`.

3. **Screen Flow**:
   - `index.tsx`: Welcome/Onboarding screen featuring the AI-generated 3D farmer mascot asset (`farmer-mascot.jpg`), value proposition, and quick actions ("Log In as Farmer", "Register as Farmer").
   - `(auth)/login.tsx`: Modern card login with phone/email identifier, password visibility toggle, remember me checkbox, and social pills.
   - `(auth)/register.tsx`: Farmer registration collecting full name, phone number, email, and password.
   - `(farmer)/dashboard.tsx`: Dedicated clean Farmer Dashboard displaying the plain text **"Dashboard"** alongside the authenticated farmer's name, verified status badge, and sign-out action.

---

## API Endpoints Utilized

| Endpoint | Method | Payload | Description |
| :--- | :--- | :--- | :--- |
| `/api/v1/auth/login` | `POST` | `{ identifier, password }` | Authenticates farmer by email/phone. Validates role `FARMER`. |
| `/api/v1/auth/register` | `POST` | `{ name, email, phone, password, role: "FARMER" }` | Registers a new farmer account. |
| `/api/v1/auth/me` | `GET` | `Bearer <token>` | Fetches authenticated farmer profile. |

---

## Directory Structure

```
apps/application/farmer-setu/
├── assets/images/
│   ├── farmer-mascot.jpg       # AI-generated 3D farmer mascot
│   └── farmer-hero.jpg         # AI-generated cinematic farm sunrise hero
├── src/
│   ├── app/
│   │   ├── _layout.tsx         # Stack routing + AuthProvider
│   │   ├── index.tsx           # Welcome / Onboarding splash screen
│   │   ├── (auth)/
│   │   │   ├── login.tsx       # Farmer login screen
│   │   │   └── register.tsx    # Farmer registration screen
│   │   └── (farmer)/
│   │       └── dashboard.tsx   # Plain text Farmer Dashboard
│   ├── components/ui/
│   │   ├── AppButton.tsx       # Reusable rounded pill button
│   │   ├── AppInput.tsx        # Styled input with password toggle
│   │   ├── BackButton.tsx      # Circular back button
│   │   └── SocialAuthPill.tsx  # Social login quick buttons
│   ├── context/
│   │   └── AuthContext.tsx     # Session state & actions
│   ├── interfaces/
│   │   ├── auth.interface.ts   # TypeScript contracts
│   │   └── index.ts            # Barrel export
│   └── services/
│       ├── api.ts              # Cross-platform API client
│       └── auth.service.ts     # Pure modular auth functions
```
