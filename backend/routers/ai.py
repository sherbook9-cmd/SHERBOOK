from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import uuid
from backend.database import get_db
from backend.models import Book, Category, AIAnalysisLog
from backend.schemas import AICoverScanResponse, AIChatRequest, AIChatResponse, BookResponse
from backend.services.gemini_service import extract_book_metadata_from_image, chat_with_book_assistant
from backend.services.excel_service import process_excel_book_import

router = APIRouter(prefix="/ai", tags=["AI Engine"])

@router.post("/scan-cover", response_model=AICoverScanResponse)
async def scan_book_cover(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    AI Auto-Fill: Upload a book cover image -> Gemini Vision detects Title, Author, ISBN, Genre, Description, Publisher, Language, Edition, Release Year.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be a valid image (JPEG, PNG, WEBP).")

    contents = await file.read()
    metadata = extract_book_metadata_from_image(contents, file.content_type)

    # Save log
    log = AIAnalysisLog(
        id=str(uuid.uuid4()),
        source_type="cover_ocr",
        raw_payload={"filename": file.filename, "content_type": file.content_type},
        extracted_output=metadata,
        status="completed"
    )
    db.add(log)
    db.commit()

    return metadata

@router.post("/excel-import")
async def import_books_from_excel(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Excel Import: Reads Excel file, cleans data, removes duplicates, categorizes books, and imports into Database.
    """
    if not (file.filename.endswith(".xlsx") or file.filename.endswith(".xls") or file.filename.endswith(".csv")):
        raise HTTPException(status_code=400, detail="File must be an Excel (.xlsx, .xls) or CSV file.")

    contents = await file.read()
    try:
        books_data, stats = process_excel_book_import(contents, file.filename)
        
        imported_count = 0
        categories_map = {c.name.lower(): c.id for c in db.query(Category).all()}

        for b in books_data:
            cat_name = b.pop("category_name", "General")
            cat_id = categories_map.get(cat_name.lower())
            
            if not cat_id:
                # Create category if not existing
                slug = cat_name.lower().replace(" ", "-").replace("&", "and")
                new_cat = Category(id=str(uuid.uuid4()), name=cat_name, slug=slug)
                db.add(new_cat)
                db.flush()
                cat_id = new_cat.id
                categories_map[cat_name.lower()] = cat_id

            # Check if book exists by title and author
            existing = db.query(Book).filter(Book.title == b["title"], Book.author == b["author"]).first()
            if existing:
                existing.stock_quantity += b["stock_quantity"]
                existing.price = b["price"]
            else:
                new_book = Book(
                    id=str(uuid.uuid4()),
                    category_id=cat_id,
                    **b
                )
                db.add(new_book)
                imported_count += 1

        db.commit()

        return {
            "status": "success",
            "message": f"Successfully processed Excel import. {imported_count} new books added, {stats['duplicates_removed']} duplicates merged/skipped.",
            "stats": stats
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/chat", response_model=AIChatResponse)
def chat_ai(payload: AIChatRequest, db: Session = Depends(get_db)):
    """
    AI Chatbot: Answers customer questions, searches books, recommends titles, and explains Pakistani payment methods.
    """
    # Fetch recent books context
    recent_books = db.query(Book).limit(10).all()
    context_data = [
        {
            "title": b.title,
            "author": b.author,
            "price": float(b.price),
            "stock_quantity": b.stock_quantity,
            "genre": b.category.name if b.category else "General"
        }
        for b in recent_books
    ]

    messages_list = [{"role": msg.role, "content": msg.content} for msg in payload.messages]
    reply_text = chat_with_book_assistant(messages_list, context_data)

    # Convert recent_books to response objects
    suggested_books = [BookResponse.from_orm(b) for b in recent_books[:3]]

    return AIChatResponse(
        reply=reply_text,
        suggested_books=suggested_books
    )

@router.get("/recommendations", response_model=List[BookResponse])
def get_ai_recommendations(db: Session = Depends(get_db)):
    """
    Returns AI curated recommendation highlights.
    """
    recommendations = db.query(Book).filter(Book.is_featured == True).limit(6).all()
    if not recommendations:
        recommendations = db.query(Book).limit(6).all()
    return recommendations
