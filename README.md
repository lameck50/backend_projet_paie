# Clinique Paie - Backend (Node.js + Express + MongoDB)

## Setup

1. Copy `.env.example` to `.env` and fill values (MONGODB_URI, JWT_SECRET, Airtel credentials).
2. `npm install`
3. `npm run dev` (requires nodemon) or `npm start`

## Endpoints (examples)
- POST /api/auth/register {name,email,password,role}
- POST /api/auth/login {email,password}
- POST /api/personnel {fullName,phone,email,jobTitle,salary,airtelNumber}
- GET /api/personnel
- POST /api/payment/airtel {airtelNumber,amount,personnelId,description}

Note: Airtel integration is stubbed. Replace payment route with real API calls and secure credentials.
