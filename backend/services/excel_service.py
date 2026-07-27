import io
import logging
from typing import List, Dict, Any, Tuple
import pandas as pd

logger = logging.getLogger("sherbook.excel")

def process_excel_book_import(file_bytes: bytes, filename: str) -> Tuple[List[Dict[str, Any]], Dict[str, int]]:
    """
    Parses, cleans, removes duplicates, and structures book data from Excel or CSV files.
    """
    try:
        if filename.endswith(".csv"):
            df = pd.read_csv(io.BytesIO(file_bytes))
        else:
            df = pd.read_excel(io.BytesIO(file_bytes))
            
        # Normalize column headers to lowercase and trimmed strings
        df.columns = [str(col).strip().lower().replace(" ", "_") for col in df.columns]
        
        # Column mapping fallback dictionary
        col_map = {
            "book_title": "title",
            "book_name": "title",
            "name": "title",
            "author_name": "author",
            "writer": "author",
            "isbn_number": "isbn",
            "isbn13": "isbn",
            "cost": "price",
            "amount": "price",
            "pkr": "price",
            "qty": "stock_quantity",
            "stock": "stock_quantity",
            "quantity": "stock_quantity",
            "genre": "category",
            "category_name": "category",
            "summary": "description",
            "details": "description"
        }
        df = df.rename(columns=col_map)
        
        # Ensure required columns exist
        if "title" not in df.columns or "author" not in df.columns:
            raise ValueError("Excel file must contain at least 'Title' and 'Author' columns.")
            
        initial_count = len(df)
        
        # Clean text columns
        for col in ["title", "author", "isbn", "description", "category", "publisher", "language", "edition"]:
            if col in df.columns:
                df[col] = df[col].astype(str).str.strip().replace("nan", None).replace("None", None)
            else:
                df[col] = None

        # Clean numeric columns
        if "price" in df.columns:
            df["price"] = pd.to_numeric(df["price"].astype(str).str.replace(r"[^\d.]", "", regex=True), errors="coerce").fillna(990.0)
        else:
            df["price"] = 990.0

        if "stock_quantity" in df.columns:
            df["stock_quantity"] = pd.to_numeric(df["stock_quantity"], errors="coerce").fillna(10).astype(int)
        else:
            df["stock_quantity"] = 10

        # Remove duplicate titles / ISBNs
        df = df.drop_duplicates(subset=["title", "author"], keep="first")
        cleaned_count = len(df)
        duplicates_removed = initial_count - cleaned_count

        books_list = []
        for _, row in df.iterrows():
            book_dict = {
                "title": row["title"],
                "author": row["author"],
                "isbn": row["isbn"] if row["isbn"] and str(row["isbn"]).lower() != "none" else None,
                "price": float(row["price"]),
                "stock_quantity": int(row["stock_quantity"]),
                "description": row["description"] if row["description"] else f"A magnificent book titled '{row['title']}' by {row['author']}.",
                "category_name": row["category"] if row["category"] else "Artificial Intelligence & Tech",
                "publisher": row["publisher"] if row["publisher"] else "SherBook Publishing",
                "language": row["language"] if row["language"] else "English",
                "edition": row["edition"] if row["edition"] else "Standard Edition"
            }
            books_list.append(book_dict)

        stats = {
            "total_rows_read": initial_count,
            "processed_valid": cleaned_count,
            "duplicates_removed": duplicates_removed
        }
        
        return books_list, stats

    except Exception as e:
        logger.error(f"Error processing Excel file: {e}")
        raise ValueError(f"Failed to process Excel import: {str(e)}")
