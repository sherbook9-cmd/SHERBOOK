# SherBook.com - Pakistan's Smart AI-Powered Online Bookstore

📁 **Desktop Project Directory:** `C:\Users\R Y Z E N\Desktop\sherbook`

---

## ⚡ Quick Start: Running Database Schema in Supabase

1. Open your **Supabase Dashboard** ([supabase.com](https://supabase.com)).
2. Go to the **SQL Editor** tab on the left sidebar.
3. Click **New Query**.
4. Open [supabase_schema.sql](file:///C:/Users/R%20Y%20Z%20E%20N/Desktop/sherbook/supabase_schema.sql) from your Desktop project folder:
   `C:\Users\R Y Z E N\Desktop\sherbook\supabase_schema.sql`
5. Copy all content into the SQL Editor and click **Run**.

---

## 🔑 Adding Your Google AI Studio API Key

1. Copy `.env.example` to `.env` in `C:\Users\R Y Z E N\Desktop\sherbook`.
2. Replace `GEMINI_API_KEY` with your actual key from [Google AI Studio](https://aistudio.google.com/):

```env
GEMINI_API_KEY="AIzaSyYourActualKeyHere"
```

---

## 📊 Database Features Built-In:
- **`pgvector` AI Embedding Support:** Integrated with Google Gemini 768-dim `text-embedding-004` model.
- **Pakistani Payment Options:** Native support for Easypaisa, JazzCash, Cash on Delivery, Bank Transfer, Debit/Credit Card.
- **Auto Rating Recalculation:** Automatic recalculation of book review averages.
- **Supabase Auth Sync:** Auto-creates profile entries when users sign up.
- **Seed Data Included:** Pre-populated with AI & Tech, Self-Help, Business categories, and sample bestsellers.
