from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Any, Dict
from datetime import datetime

# Category Schemas
class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    parent_id: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

# Book Schemas
class BookBase(BaseModel):
    title: str
    author: str
    isbn: Optional[str] = None
    description: Optional[str] = None
    price: float = Field(..., ge=0)
    stock_quantity: int = Field(default=0, ge=0)
    category_id: Optional[str] = None
    cover_image_url: Optional[str] = None
    publisher: Optional[str] = None
    language: Optional[str] = "English"
    edition: Optional[str] = None
    release_year: Optional[int] = None
    is_featured: Optional[bool] = False
    is_trending: Optional[bool] = False
    is_bestseller: Optional[bool] = False

class BookCreate(BookBase):
    metadata_json: Optional[Dict[str, Any]] = None

class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    isbn: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    stock_quantity: Optional[int] = None
    category_id: Optional[str] = None
    cover_image_url: Optional[str] = None
    publisher: Optional[str] = None
    language: Optional[str] = None
    edition: Optional[str] = None
    release_year: Optional[int] = None
    is_featured: Optional[bool] = None
    is_trending: Optional[bool] = None
    is_bestseller: Optional[bool] = None

class BookResponse(BookBase):
    id: str
    rating_avg: float = 0.0
    rating_count: int = 0
    category: Optional[CategoryResponse] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Order Schemas
class OrderItemCreate(BaseModel):
    book_id: str
    quantity: int = Field(..., gt=0)
    unit_price: float

class OrderCreate(BaseModel):
    customer_name: str
    customer_email: str
    customer_phone: str
    shipping_address: str
    city: str
    payment_method: str  # cod, easypaisa, jazzcash, bank_transfer, debit_card, credit_card
    notes: Optional[str] = None
    items: List[OrderItemCreate]

class OrderItemResponse(BaseModel):
    id: str
    book_id: Optional[str]
    quantity: int
    unit_price: float
    total_price: float
    book: Optional[BookResponse] = None

    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: str
    user_id: Optional[str]
    customer_name: str
    customer_email: str
    customer_phone: str
    shipping_address: str
    city: str
    total_amount: float
    order_status: str
    payment_status: str
    payment_method: str
    tracking_number: Optional[str]
    notes: Optional[str]
    created_at: datetime
    items: List[OrderItemResponse] = []

    class Config:
        from_attributes = True

# AI Schemas
class AICoverScanResponse(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    isbn: Optional[str] = None
    genre: Optional[str] = None
    description: Optional[str] = None
    publisher: Optional[str] = None
    language: Optional[str] = "English"
    edition: Optional[str] = None
    release_year: Optional[int] = None
    confidence: float = 0.95
    raw_ocr: Optional[str] = None

class AIChatMessage(BaseModel):
    role: str  # 'user' or 'assistant'
    content: str

class AIChatRequest(BaseModel):
    messages: List[AIChatMessage]
    session_id: Optional[str] = None

class AIChatResponse(BaseModel):
    reply: str
    suggested_books: List[BookResponse] = []
