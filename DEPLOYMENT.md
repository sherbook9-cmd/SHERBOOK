# SherBook.com - Complete Deployment Guide

This guide provides step-by-step instructions for deploying:
1. **Database**: Supabase PostgreSQL with `pgvector` extension
2. **Backend**: FastAPI Python API on **Hugging Face Spaces** (Docker)
3. **Frontend**: Next.js 14 on **Vercel**

---

## 🔑 1. Environment Credentials Setup

### Local File Location:
`.env` file at `C:\Users\R Y Z E N\Desktop\sherbook\.env`

### Where to get keys:
1. **Google Gemini API Key**: Go to [Google AI Studio](https://aistudio.google.com/), create a key, and set:
   ```env
   GEMINI_API_KEY="AIzaSyYourActualKey"
   ```
2. **Supabase Database URL & Keys**: Go to your [Supabase Dashboard](https://supabase.com/):
   - **Database Connection String** (`Project Settings -> Database -> Connection String`):
     ```env
     DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
     ```
   - **Supabase URL & Anon Key** (`Project Settings -> API`):
     ```env
     NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
     NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOi..."
     ```

---

## 🚀 2. Backend Deployment on Hugging Face Spaces

1. Log in to [Hugging Face](https://huggingface.co/) and click **New Space**.
2. Name your Space (e.g., `sherbook-backend`).
3. Select **SDK**: `Docker` (Blank Docker template).
4. Clone or push the contents of `C:\Users\R Y Z E N\Desktop\sherbook` to your Hugging Face Space repository:
   - Make sure `Dockerfile` (located in `backend/Dockerfile`) is pushed.
5. In Hugging Face Space **Settings -> Variables and Secrets**, add the following Secrets:
   - `GEMINI_API_KEY`
   - `DATABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Once deployed, Hugging Face will provide your public backend URL, for example:
   `https://yourusername-sherbook-backend.hf.space`

---

## 🌐 3. Frontend Deployment on Vercel

1. Push your project repository to GitHub.
2. Log in to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Select your GitHub repository (`sherbook`).
4. Set **Root Directory** to `frontend`.
5. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_API_URL` = `https://yourusername-sherbook-backend.hf.space` (Your Hugging Face Space URL)
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://[YOUR-PROJECT-REF].supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOi...`
6. Click **Deploy**. Vercel will build and launch `sherbook.com`!

---

## ⚡ Local Testing Commands

### Run Backend Locally:
```bash
cd C:\Users\R Y Z E N\Desktop\sherbook
uvicorn backend.main:app --reload --port 8000
```

### Run Frontend Locally:
```bash
cd C:\Users\R Y Z E N\Desktop\sherbook\frontend
npm run dev
```
Access at `http://localhost:3000`
