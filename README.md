# Leftover Recipe Generator

Full project including frontend (Vite + React) and backend (Express) that calls Anthropic Claude.

## Setup

### Backend
1. Copy server/.env.example to server/.env and set your ANTHROPIC_API_KEY.
2. Install and run:
```bash
cd server
npm install
npm start
```

### Frontend
1. Install and run:
```bash
cd vite-project
npm install
npm run dev
```

Open http://localhost:5173

Notes:
- Frontend sends requests to http://localhost:5174/api/generate
- Backend expects `ANTHROPIC_API_KEY` in server/.env
