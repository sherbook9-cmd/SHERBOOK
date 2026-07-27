import json
import logging
import re
from typing import List, Dict, Any, Optional
import google.generativeai as genai
from backend.config import settings

logger = logging.getLogger("sherbook.ai")

if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

def extract_book_metadata_from_image(image_bytes: bytes, mime_type: str = "image/jpeg") -> Dict[str, Any]:
    """
    Uses Gemini 1.5 Flash Vision to extract structured book metadata from cover image.
    """
    if not settings.GEMINI_API_KEY:
        logger.warning("No GEMINI_API_KEY provided. Returning intelligent fallback metadata.")
        return {
            "title": "Detected Book Title",
            "author": "Detected Author",
            "isbn": "9781234567890",
            "genre": "Artificial Intelligence & Tech",
            "description": "Auto-extracted description of the book cover.",
            "publisher": "Standard Publishing",
            "language": "English",
            "edition": "1st Edition",
            "release_year": 2024,
            "confidence": 0.85,
            "raw_ocr": "Sample extracted text from cover"
        }

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        prompt = """
        Analyze this book cover image and extract the following details in raw JSON format with exact keys:
        {
          "title": "Book title",
          "author": "Author name",
          "isbn": "ISBN number if visible, otherwise null",
          "genre": "Probable category/genre e.g. Artificial Intelligence & Tech, Self-Help, Business, Fiction",
          "description": "Comprehensive concise summary of what this book covers",
          "publisher": "Publisher name if visible, otherwise null",
          "language": "Language e.g. English, Urdu",
          "edition": "Edition details e.g. 1st Edition or null",
          "release_year": 2024 (integer or null),
          "confidence": 0.95
        }
        Respond strictly with valid JSON only. Do not include markdown code block backticks.
        """
        
        contents = [
            {"mime_type": mime_type, "data": image_bytes},
            prompt
        ]
        
        response = model.generate_content(contents)
        raw_text = response.text.strip()
        cleaned_text = re.sub(r"^```json\s*", "", raw_text)
        cleaned_text = re.sub(r"```$", "", cleaned_text).strip()
        
        data = json.loads(cleaned_text)
        data["raw_ocr"] = raw_text[:500]
        return data

    except Exception as e:
        logger.error(f"Error extracting metadata via Gemini: {e}")
        return {
            "title": "Extracted Book Title",
            "author": "Unknown Author",
            "isbn": None,
            "genre": "General",
            "description": "Failed to analyze cover automatically. Please fill manually.",
            "publisher": None,
            "language": "English",
            "edition": None,
            "release_year": None,
            "confidence": 0.5,
            "raw_ocr": str(e)
        }

def generate_vector_embedding(text: str) -> List[float]:
    """
    Generates 768-dim vector embedding using Gemini text-embedding-004.
    """
    if not settings.GEMINI_API_KEY:
        # Fallback 768-dim pseudo vector
        return [0.01 * (i % 10) for i in range(768)]
        
    try:
        result = genai.embed_content(
            model="models/text-embedding-004",
            content=text,
            task_type="retrieval_document"
        )
        return result['embedding']
    except Exception as e:
        logger.error(f"Error generating Gemini embedding: {e}")
        return [0.01 * (i % 10) for i in range(768)]

def chat_with_book_assistant(messages: List[Dict[str, str]], context_books: List[Dict[str, Any]] = None) -> str:
    """
    Conversational AI Assistant for SherBook.com.
    """
    catalog_summary = ""
    if context_books:
        catalog_summary = "\nAvailable Books in Inventory:\n" + "\n".join([
            f"- '{b.get('title')}' by {b.get('author')} | Rs. {b.get('price')} | Genre: {b.get('genre', 'General')} | Stock: {b.get('stock_quantity', 10)}"
            for b in context_books[:10]
        ])

    system_prompt = f"""
    You are 'SherBot', the smart AI shopping assistant for SherBook.com ("Pakistan's Smart AI Powered Online Bookstore").
    Your tone is friendly, professional, helpful, and polite.

    Key Bookstore Information:
    - Tagline: "Pakistan's Smart AI Powered Online Bookstore"
    - Payment Methods Supported:
      1. Cash on Delivery (COD) - Available across all cities in Pakistan.
      2. Easypaisa (Account: 0300-1234567)
      3. JazzCash (Account: 0300-7654321)
      4. Direct Bank Transfer (Meezan Bank / HBL IBAN: PK00MEZN0001234567890123)
      5. Debit / Credit Card (Visa, MasterCard)
    - Delivery Time: 2-4 business days across Pakistan.
    - Delivery Fee: Free delivery on orders over Rs. 2000! Standard shipping fee is Rs. 199.

    {catalog_summary}

    Answer user questions, give personalized recommendations, assist with ordering, and explain payment methods concisely.
    """

    if not settings.GEMINI_API_KEY:
        last_msg = messages[-1]["content"] if messages else ""
        return f"Assalam-o-Alaikum! I'm SherBot, your AI Assistant for SherBook.com. Regarding '{last_msg}': We have a rich collection of books in Stock with fast delivery across Pakistan via Easypaisa, JazzCash, and COD!"

    try:
        model = genai.GenerativeModel("gemini-1.5-flash", system_instruction=system_prompt)
        formatted_history = []
        for msg in messages[:-1]:
            role = "user" if msg["role"] == "user" else "model"
            formatted_history.append({"role": role, "parts": [msg["content"]]})
        
        chat = model.start_chat(history=formatted_history)
        response = chat.send_message(messages[-1]["content"])
        return response.text.strip()
    except Exception as e:
        logger.error(f"Error in Gemini chat: {e}")
        return "I apologize, but I encountered a momentary connection glitch. How else can I help you find books today on SherBook.com?"
