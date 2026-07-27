import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import httpx
from backend.config import settings

logger = logging.getLogger("sherbook.notifications")

def send_email_notification(to_email: str, subject: str, body_html: str) -> bool:
    """
    Sends transactional emails (order confirmations, updates) using SMTP.
    """
    if not settings.SMTP_PASSWORD:
        logger.info(f"[MOCK EMAIL SENT to {to_email}] Subject: {subject}")
        return True

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"SherBook.com <{settings.SMTP_USER}>"
        msg["To"] = to_email

        html_part = MIMEText(body_html, "html")
        msg.attach(html_part)

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(settings.SMTP_USER, to_email, msg.as_string())
        
        logger.info(f"Successfully sent email to {to_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {e}")
        return False

def send_whatsapp_order_alert(order_data: dict) -> bool:
    """
    Sends WhatsApp notification to book owner/admin upon new customer order.
    """
    admin_phone = "+923001234567"
    message_text = f"🛒 *NEW SHERBOOK ORDER PLACED!*\n\n" \
                   f"Order ID: {order_data.get('tracking_number')}\n" \
                   f"Customer: {order_data.get('customer_name')}\n" \
                   f"Phone: {order_data.get('customer_phone')}\n" \
                   f"City: {order_data.get('city')}\n" \
                   f"Total Amount: Rs. {order_data.get('total_amount'):,.2f}\n" \
                   f"Payment: {order_data.get('payment_method').upper()}\n\n" \
                   f"SherBook AI Automation System"

    if not settings.WHATSAPP_API_TOKEN:
        logger.info(f"[MOCK WHATSAPP SENT to Admin] Message:\n{message_text}")
        return True

    try:
        url = f"https://graph.facebook.com/v18.0/{settings.WHATSAPP_PHONE_NUMBER_ID}/messages"
        headers = {
            "Authorization": f"Bearer {settings.WHATSAPP_API_TOKEN}",
            "Content-Type": "application/json"
        }
        payload = {
            "messaging_product": "whatsapp",
            "to": admin_phone,
            "type": "text",
            "text": {"body": message_text}
        }
        with httpx.Client(timeout=10.0) as client:
            res = client.post(url, json=payload, headers=headers)
            if res.status_code == 200:
                logger.info("WhatsApp order notification delivered to Admin successfully.")
                return True
            else:
                logger.warning(f"WhatsApp API responded with status {res.status_code}: {res.text}")
                return False
    except Exception as e:
        logger.error(f"WhatsApp notification exception: {e}")
        return False
