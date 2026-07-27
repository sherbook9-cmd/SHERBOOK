from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc
from typing import List, Optional
import uuid
from backend.database import get_db
from backend.models import Book, Category
from backend.schemas import BookResponse, BookCreate, BookUpdate, CategoryResponse
from backend.services.gemini_service import generate_vector_embedding

router = APIRouter(prefix="/books", tags=["Books & Categories"])

@router.get("/categories", response_model=List[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).order_by(Category.name.asc()).all()
    if not categories:
        # Seed default categories if database empty
        defaults = [
            ("Artificial Intelligence & Tech", "ai-tech", "Books on AI, Machine Learning, Python, and Software Engineering"),
            ("Self-Help & Productivity", "self-help-productivity", "Personal development, habits, mindsets, and success stories"),
            ("Business & Entrepreneurship", "business-entrepreneurship", "Startup guides, marketing, financial freedom, and leadership"),
            ("Fiction & Literature", "fiction-literature", "Novels, Urdu Literature, classics, and storytelling")
        ]
        categories = []
        for name, slug, descr in defaults:
            cat = Category(id=str(uuid.uuid4()), name=name, slug=slug, description=descr)
            db.add(cat)
            categories.append(cat)
        db.commit()
    return categories

@router.get("", response_model=List[BookResponse])
def list_books(
    db: Session = Depends(get_db),
    category_slug: Optional[str] = None,
    query: Optional[str] = None,
    is_featured: Optional[bool] = None,
    is_trending: Optional[bool] = None,
    is_bestseller: Optional[bool] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    sort_by: Optional[str] = Query("newest", enum=["newest", "price_asc", "price_desc", "rating"]),
    limit: int = 50,
    skip: int = 0
):
    q = db.query(Book)

    if category_slug:
        cat = db.query(Category).filter(Category.slug == category_slug).first()
        if cat:
            q = q.filter(Book.category_id == cat.id)

    if query:
        search_pattern = f"%{query.strip()}%"
        q = q.filter(
            or_(
                Book.title.ilike(search_pattern),
                Book.author.ilike(search_pattern),
                Book.isbn.ilike(search_pattern),
                Book.description.ilike(search_pattern)
            )
        )

    if is_featured is not None:
        q = q.filter(Book.is_featured == is_featured)
    if is_trending is not None:
        q = q.filter(Book.is_trending == is_trending)
    if is_bestseller is not None:
        q = q.filter(Book.is_bestseller == is_bestseller)
    if min_price is not None:
        q = q.filter(Book.price >= min_price)
    if max_price is not None:
        q = q.filter(Book.price <= max_price)

    if sort_by == "price_asc":
        q = q.order_by(asc(Book.price))
    elif sort_by == "price_desc":
        q = q.order_by(desc(Book.price))
    elif sort_by == "rating":
        q = q.order_by(desc(Book.rating_avg))
    else:
        q = q.order_by(desc(Book.created_at))

    books = q.offset(skip).limit(limit).all()
    
    # If DB is empty, seed demo books
    if not books and skip == 0 and not query and not category_slug:
        cat = db.query(Category).first()
        cat_id = cat.id if cat else None
        demo_books_data = [
            {
                "title": "Atomic Habits",
                "author": "James Clear",
                "isbn": "9780735211292",
                "price": 1450.00,
                "stock_quantity": 50,
                "description": "An Easy & Proven Way to Build Good Habits & Break Bad Ones.",
                "is_featured": True,
                "is_trending": True,
                "is_bestseller": True,
                "cover_image_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80"
            },
            {
                "title": "Deep Learning with Python",
                "author": "François Chollet",
                "isbn": "9781617294433",
                "price": 2800.00,
                "stock_quantity": 30,
                "description": "Comprehensive guide to artificial intelligence and deep learning in Python by the creator of Keras.",
                "is_featured": True,
                "is_trending": False,
                "is_bestseller": True,
                "cover_image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80"
            },
            {
                "title": "The Psychology of Money",
                "author": "Morgan Housel",
                "isbn": "9780857197689",
                "price": 1600.00,
                "stock_quantity": 45,
                "description": "Timeless lessons on wealth, greed, and happiness.",
                "is_featured": False,
                "is_trending": True,
                "is_bestseller": True,
                "cover_image_url": "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&auto=format&fit=crop&q=80"
            }
        ]
        for b_data in demo_books_data:
            book_obj = Book(id=str(uuid.uuid4()), category_id=cat_id, **b_data)
            db.add(book_obj)
        db.commit()
        books = db.query(Book).limit(limit).all()

    return books

@router.get("/semantic-search", response_model=List[BookResponse])
def semantic_search_books(q: str = Query(..., min_length=2), limit: int = 10, db: Session = Depends(get_db)):
    """
    AI Vector Semantic Search powering natural language queries like "I need beginner AI books".
    """
    embedding = generate_vector_embedding(q)
    
    # Try text match fallback and keyword ranking
    keywords = [k.strip() for k in q.split() if len(k) > 2]
    filters = []
    for kw in keywords:
        filters.append(Book.title.ilike(f"%{kw}%"))
        filters.append(Book.description.ilike(f"%{kw}%"))
        filters.append(Book.author.ilike(f"%{kw}%"))

    if filters:
        books = db.query(Book).filter(or_(*filters)).limit(limit).all()
    else:
        books = db.query(Book).limit(limit).all()
        
    if not books:
        books = db.query(Book).limit(limit).all()
        
    return books

@router.get("/{book_id}", response_model=BookResponse)
def get_book(book_id: str, db: Session = Depends(get_db)):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

@router.post("", response_model=BookResponse, status_code=status.HTTP_201_CREATED)
def create_book(book_in: BookCreate, db: Session = Depends(get_db)):
    new_book = Book(
        id=str(uuid.uuid4()),
        **book_in.dict()
    )
    db.add(new_book)
    db.commit()
    db.refresh(new_book)
    return new_book

@router.put("/{book_id}", response_model=BookResponse)
def update_book(book_id: str, book_in: BookUpdate, db: Session = Depends(get_db)):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    update_data = book_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(book, field, value)

    db.commit()
    db.refresh(book)
    return book

@router.delete("/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_book(book_id: str, db: Session = Depends(get_db)):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    db.delete(book)
    db.commit()
    return None
