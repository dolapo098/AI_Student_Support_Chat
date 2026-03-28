# Kay — Student Support UI

Single-page **Vue 3 + TypeScript + Vite** app for `KENT_AI_Service`: a richer **landing** plus a **floating chat** (DSH-style bubble, bottom-right).

## Run

1. Start the API (from `KENT_AI_Service`), e.g.  
   `uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload`

2. Copy `.env.example` to `.env` and set `VITE_API_BASE_URL` if not using port **8000** (must include `//api/v1`).

3. Install and dev server:

   ```bash
   npm install
   npm run dev
   ```

   Opens **http://localhost:5173** (backend defaults allow **localhost** and **127.0.0.1** on ports 5173/3000). Use the **same** host in the address bar as in `ALLOWED_ORIGINS` if you customise it.

## Deploy to Vercel (from your machine — account is in the browser)

You **cannot** finish Vercel signup inside Cursor. The repo is ready so import is quick:

1. Push the latest commit (includes `vercel.json` for Vue Router / SPA).
2. Open **[vercel.com](https://vercel.com)** → **Sign up** → **Continue with GitHub**.
3. **Add New… → Project** → **Import** this repository (`AI_Student_Support_Chat` or your repo name).
4. Vercel should detect **Vite**: **Build Command** `npm run build`, **Output Directory** `dist`. Leave defaults unless Vercel suggests otherwise.
5. **Environment Variables** (Production): add **`VITE_API_BASE_URL`** = your **public** FastAPI base URL, e.g. `https://your-api.example.com/api/v1` (must be **HTTPS** in production).
6. **Deploy**. You get a URL like `https://….vercel.app`.

**CORS:** Your FastAPI `ALLOWED_ORIGINS` (or equivalent) must include your Vercel origin, e.g. `https://your-app.vercel.app`.

---

## Docker (local)

Run from **this directory** (the Git repo root when this UI is its own repository). Image tag **`kentassessment`** is CLI-only:

```bash
docker build -t kentassessment:local .
docker run --rm -p 8080:80 kentassessment:local
```

## API contract

- `POST /chat` — `{ "message", "session_id" }` (server holds history)
- `DELETE /chat/session/{session_id}` — clear server session (“Clear chat”)
