import random
import string
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
from backend.database import get_db
from backend.models import Order, OrderItem, Book
from backend.schemas import OrderCreate, OrderResponse
from backend.services.notification_service import send_email_notification, send_whatsapp_order_alert

router = APIRouter(prefix="/orders", tags=["Orders & Checkout"])

def generate_tracking_number() -> str:
    digits = ''.join(random.choices(string.digits, k=6))
    return f"SHER-{digits}"

@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def place_order(order_in: OrderCreate, db: Session = Depends(get_db)):
    """
    Places order, validates stock quantity, deducts inventory automatically, 
    generates tracking number, and dispatches WhatsApp & Email notifications.
    """
    if not order_in.items:
        raise HTTPException(status_code=400, detail="Order must contain at least one book item.")

    total_amount = 0.0
    items_to_create = []

    for item in order_in.items:
        book = db.query(Book).filter(Book.id == item.book_id).first()
        if not book:
            raise HTTPException(status_code=404, detail=f"Book with ID {item.book_id} not found.")

        if book.stock_quantity < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for '{book.title}'. Available: {book.stock_quantity}, requested: {item.quantity}."
            )

        # Deduct stock
        book.stock_quantity -= item.quantity
        line_total = float(book.price) * item.quantity
        total_amount += line_total

        items_to_create.append({
            "book": book,
            "quantity": item.quantity,
            "unit_price": float(book.price),
            "total_price": line_total
        })

    # Add shipping fee rule: Free shipping over Rs. 2000, else Rs. 199
    shipping_fee = 0.0 if total_amount >= 2000 else 199.0
    final_total = total_amount + shipping_fee

    tracking_num = generate_tracking_number()
    order_id = str(uuid.uuid4())

    new_order = Order(
        id=order_id,
        customer_name=order_in.customer_name,
        customer_email=order_in.customer_email,
        customer_phone=order_in.customer_phone,
        shipping_address=order_in.shipping_address,
        city=order_in.city,
        total_amount=final_total,
        order_status="pending",
        payment_status="paid" if order_in.payment_method in ["easypaisa", "jazzcash", "debit_card", "credit_card"] else "pending",
        payment_method=order_in.payment_method,
        tracking_number=tracking_num,
        notes=order_in.notes
    )

    db.add(new_order)
    db.flush()

    for item_data in items_to_create:
        order_item = OrderItem(
            id=str(uuid.uuid4()),
            order_id=order_id,
            book_id=item_data["book"].id,
            quantity=item_data["quantity"],
            unit_price=item_data["unit_price"],
            total_price=item_data["total_price"]
        )
        db.add(order_item)

    db.commit()
    db.refresh(new_order)

    # Dispatches notifications asynchronously / background mock
    whatsapp_payload = {
        "tracking_number": tracking_num,
        "customer_name": order_in.customer_name,
        "customer_phone": order_in.customer_phone,
        "city": order_in.city,
        "total_amount": final_total,
        "payment_method": order_in.payment_method
    }
    send_whatsapp_order_alert(whatsapp_payload)

    email_html = f"""
    <h2>Thank you for your order at SherBook.com!</h2>
    <p>Hi <b>{order_in.customer_name}</b>,</p>
    <p>Your order <b>#{tracking_num}</b> has been received and is being processed.</p>
    <p><b>Total Amount:</b> Rs. {final_total:,.2f}</p>
    <p><b>Payment Method:</b> {order_in.payment_method.upper()}</p>
    <p><b>Shipping Address:</b> {order_in.shipping_address}, {order_in.city}</p>
    <p>We will deliver your books within 2-4 business days.</p>
    <hr/>
    <p><i>SherBook.com - Pakistan's Smart AI Powered Online Bookstore</i></p>
    """
    send_email_notification(order_in.customer_email, f"Order Confirmation #{tracking_num} - SherBook.com", email_html)

    return new_order

@router.get("/tracking/{tracking_number}", response_model=OrderResponse)
def track_order(tracking_number: str, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.tracking_number == tracking_number.strip().upper()).first()
    if not order:
        raise HTTPException(status_code=404, detail=f"No order found with tracking number '{tracking_number}'.")
    return order

@router.get("", response_model=List[OrderResponse])
def list_orders(db: Session = Depends(get_db), limit: int = 50, skip: int = 0):
    orders = db.query(Order).order_by(Order.created_at.desc()).offset(skip).limit(limit).all()
    return orders
