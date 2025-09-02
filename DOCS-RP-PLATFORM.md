RP Platform Frontend

Overview
- React + Vite app scaffold with a centralized API service at src/services/api.js.
- Minimal pages: Home, Login, Dashboard, Events, Posts, Forums.
- Reads VITE_API_BASE_URL from .env; dev proxy to http://localhost:5000 for /api and /uploads.

Run locally
1) Backend
   - cd d:/final-year-project/backend
   - Ensure .env has FRONTEND_URL=http://localhost:5173 and PORT=5000
   - npm install
   - npm run dev (or npm start)
   - Verify: http://localhost:5000/health should return JSON

2) Frontend
   - cd d:/final-year-project/frontend/rp-platform
   - npm install
   - Create .env if missing with: VITE_API_BASE_URL=http://localhost:5000
   - npm run dev
   - Open the printed URL (default http://localhost:5173)

Centralized API service (src/services/api.js)
- request(): fetch wrapper adding JSON headers and Authorization from localStorage token.
- Namespaces reflect backend routes: auth, shared, student, lecturer, admin, plus health.
- Each function returns parsed JSON and throws rich Error with err.status and err.data.

Routing/UI
- Simple hash-based router in App.jsx for quick navigation without extra dependencies.
- Update components to match the design in Final year project.pdf inside frontend/rp-platform.

Notes
- The current UI is a functional shell; implement the PDF’s exact visuals and components.
- If you get CORS issues, restart backend after updating FRONTEND_URL in backend/.env.
- For file upload, use Api.auth.profile.uploadPicture(file) which sends FormData.
