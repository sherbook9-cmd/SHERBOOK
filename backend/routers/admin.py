from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Dict, Any, List
from backend.database import get_db
from backend.models import Order, Book, Profile
from backend.schemas import OrderResponse

router = APIRouter(prefix="/admin", tags=["Admin & Analytics"])

@router.get("/dashboard")
def get_admin_dashboard(db: Session = Depends(get_db)) -> Dict[str, Any]:
    """
    Returns analytics metrics for total revenue, orders, customers, inventory stock levels, low stock warnings.
    """
    total_revenue = db.query(func.sum(Order.total_amount)).scalar() or 0.0
    total_orders = db.query(func.count(Order.id)).scalar() or 0
    total_books = db.query(func.count(Book.id)).scalar() or 0
    total_customers = db.query(func.count(Profile.id)).filter(Profile.role == "customer").scalar() or 0
    
    # Low stock alert: stock_quantity < 5
    low_stock_books = db.query(Book).filter(Book.stock_quantity < 5).all()
    low_stock_count = len(low_stock_books)

    # Recent orders
    recent_orders = db.query(Order).order_by(Order.created_at.desc()).limit(5).all()
    recent_orders_formatted = [
        {
            "id": o.id,
            "tracking_number": o.tracking_number,
            "customer_name": o.customer_name,
            "total_amount": float(o.total_amount),
            "order_status": o.order_status,
            "payment_method": o.payment_method,
            "created_at": o.created_at
        }
        for o in recent_orders
    ]

    low_stock_formatted = [
        {
            "id": b.id,
            "title": b.title,
            "author": b.author,
            "stock_quantity": b.stock_quantity,
            "price": float(b.price)
        }
        for b in low_stock_books
    ]

    return {
        "metrics": {
            "total_revenue": float(total_revenue),
            "total_orders": total_orders,
            "total_books": total_books,
            "total_customers": total_customers,
            "low_stock_count": low_stock_count
        },
        "recent_orders": recent_orders_formatted,
        "low_stock_items": low_stock_formatted
    }

@router.put("/orders/{order_id}/status", response_model=OrderResponse)
def update_order_status(order_id: str, new_status: str, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order.order_status = new_status
    db.commit()
    db.refresh(order)
    return order
