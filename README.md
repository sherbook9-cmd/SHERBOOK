---
title: SherBook Backend API
emoji: 📚
colorFrom: blue
colorTo: indigo
sdk: docker
app_port: 7860
pinned: false
---

# SherBook.com - Pakistan's Smart AI-Powered Online Bookstore Backend

FastAPI backend services powering **SherBook.com** ("Pakistan's Smart AI Powered Online Bookstore").

## ⚡ Features Built-In:
- **Google Gemini Vision OCR**: Book cover scanning to auto-extract metadata.
- **`pgvector` AI Embedding Support**: Integrated with Google Gemini 768-dim `text-embedding-004` model.
- **Pakistani Payment Options**: Native support for Easypaisa, JazzCash, Cash on Delivery, Bank Transfer, Debit/Credit Card.
- **Excel Bulk Import Engine**: Pandas-based cleaning, deduplication, and bulk insertion.
- **SherBot AI Assistant**: Contextual AI chatbot for inventory queries & payment guidance.

---

## 🔑 Environment Variables Required (Hugging Face Secrets):
Add these under **Space Settings -> Variables and Secrets**:
- `GEMINI_API_KEY`: Your Google AI Studio API key
- `DATABASE_URL`: Supabase PostgreSQL connection string
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase public anon key
