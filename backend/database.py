import logging
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from backend.config import settings

logger = logging.getLogger("sherbook.database")

# Format database URL if postgresql is specified for async or sync
db_url = settings.DATABASE_URL
if db_url.startswith("postgresql://"):
    # Convert postgresql:// to postgresql+psycopg2:// for sync or keep as postgresql://
    sync_db_url = db_url.replace("postgresql://", "postgresql+psycopg2://", 1)
else:
    sync_db_url = db_url

try:
    engine = create_engine(sync_db_url, pool_pre_ping=True, pool_size=10, max_overflow=20)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
except Exception as e:
    logger.warning(f"Database connection setup warning: {e}. Falling back to SQLite memory/local mode.")
    engine = create_engine("sqlite:///./sherbook_fallback.db", connect_args={"check_same_thread": False})
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
