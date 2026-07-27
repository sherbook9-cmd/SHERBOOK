-- ==============================================================================
-- SherBook.com - Complete All-In-One Production Schema for Supabase
-- Tagline: "Pakistan's Smart AI Powered Online Bookstore"
-- Compatible with Supabase PostgreSQL (Supports pgvector, RLS, Auth Triggers)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. EXTENSIONS
-- ------------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector"; -- Enables vector similarity search for Google Gemini text-embedding-004

-- ------------------------------------------------------------------------------
-- 2. ENUM TYPES
-- ------------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('customer', 'admin', 'superadmin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.order_status AS ENUM (
        'pending', 
        'confirmed', 
        'processing', 
        'shipped', 
        'delivered', 
        'cancelled'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.payment_status AS ENUM (
        'pending', 
        'paid', 
        'failed', 
        'refunded'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.payment_method AS ENUM (
        'cod',           -- Cash on Delivery
        'easypaisa',     -- Easypaisa
        'jazzcash',      -- JazzCash
        'bank_transfer', -- Direct Bank Transfer
        'debit_card',    -- Debit Card
        'credit_card'    -- Credit Card
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ------------------------------------------------------------------------------
-- 3. TABLES DEFINITION
-- ------------------------------------------------------------------------------

-- PROFILES (Syncs automatically with Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    role public.user_role DEFAULT 'customer'::public.user_role NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- BOOKS (Stores book details + 768-dim vector embeddings for Gemini AI semantic search)
CREATE TABLE IF NOT EXISTS public.books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    isbn TEXT UNIQUE,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    cover_image_url TEXT,
    publisher TEXT,
    language TEXT DEFAULT 'English',
    edition TEXT,
    release_year INT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_trending BOOLEAN DEFAULT FALSE,
    is_bestseller BOOLEAN DEFAULT FALSE,
    rating_avg NUMERIC(3, 2) DEFAULT 0.00 CHECK (rating_avg >= 0 AND rating_avg <= 5.00),
    rating_count INT DEFAULT 0,
    embedding vector(768), -- Gemini text-embedding-004 model dimension
    metadata JSONB DEFAULT '{}'::jsonb, -- Raw AI extracted OCR payload
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    city TEXT NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    order_status public.order_status DEFAULT 'pending'::public.order_status NOT NULL,
    payment_status public.payment_status DEFAULT 'pending'::public.payment_status NOT NULL,
    payment_method public.payment_method NOT NULL,
    tracking_number TEXT UNIQUE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ORDER ITEMS
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    book_id UUID REFERENCES public.books(id) ON DELETE SET NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    total_price NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- CART ITEMS
CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, book_id)
);

-- WISHLISTS
CREATE TABLE IF NOT EXISTS public.wishlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, book_id)
);

-- REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(book_id, user_id)
);

-- AI ANALYSIS LOGS
CREATE TABLE IF NOT EXISTS public.ai_analysis_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    source_type TEXT NOT NULL, -- e.g. 'cover_ocr', 'excel_import', 'ai_recommendation'
    raw_payload JSONB,
    extracted_output JSONB,
    status TEXT DEFAULT 'completed',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ------------------------------------------------------------------------------
-- 4. INDEXES FOR HIGH-PERFORMANCE SEARCH & PAGINATION
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_books_title ON public.books(title);
CREATE INDEX IF NOT EXISTS idx_books_author ON public.books(author);
CREATE INDEX IF NOT EXISTS idx_books_isbn ON public.books(isbn);
CREATE INDEX IF NOT EXISTS idx_books_category ON public.books(category_id);
CREATE INDEX IF NOT EXISTS idx_books_flags ON public.books(is_featured, is_trending, is_bestseller);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);

-- Vector Index (HNSW for ultra-fast AI Semantic Search similarity matching)
CREATE INDEX IF NOT EXISTS idx_books_embedding ON public.books USING hnsw (embedding vector_cosine_ops);

-- ------------------------------------------------------------------------------
-- 5. FUNCTIONS & TRIGGERS
-- ------------------------------------------------------------------------------

-- Function 1: Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION public.update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_profiles_timestamp ON public.profiles;
CREATE TRIGGER trg_update_profiles_timestamp BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

DROP TRIGGER IF EXISTS trg_update_books_timestamp ON public.books;
CREATE TRIGGER trg_update_books_timestamp BEFORE UPDATE ON public.books FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

DROP TRIGGER IF EXISTS trg_update_orders_timestamp ON public.orders;
CREATE TRIGGER trg_update_orders_timestamp BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

-- Function 2: Auto Sync Supabase Auth User Creation to Public Profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'customer'::public.user_role)
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_on_auth_user_created ON auth.users;
CREATE TRIGGER trg_on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function 3: Recalculate book ratings automatically when reviews change
CREATE OR REPLACE FUNCTION public.update_book_rating()
RETURNS TRIGGER AS $$
DECLARE
    target_book_id UUID;
BEGIN
    IF TG_OP = 'DELETE' THEN
        target_book_id := OLD.book_id;
    ELSE
        target_book_id := NEW.book_id;
    END IF;

    UPDATE public.books
    SET 
        rating_avg = COALESCE((SELECT AVG(rating)::NUMERIC(3,2) FROM public.reviews WHERE book_id = target_book_id), 0.00),
        rating_count = (SELECT COUNT(*) FROM public.reviews WHERE book_id = target_book_id)
    WHERE id = target_book_id;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_review_rating_change ON public.reviews;
CREATE TRIGGER trg_review_rating_change
    AFTER INSERT OR UPDATE OR DELETE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION public.update_book_rating();

-- Function 4: AI Vector Match for Natural Language Semantic Search (Gemini text-embedding-004)
CREATE OR REPLACE FUNCTION public.match_books (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  author TEXT,
  isbn TEXT,
  description TEXT,
  price NUMERIC,
  cover_image_url TEXT,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    books.id,
    books.title,
    books.author,
    books.isbn,
    books.description,
    books.price,
    books.cover_image_url,
    1 - (books.embedding <=> query_embedding) AS similarity
  FROM public.books
  WHERE 1 - (books.embedding <=> query_embedding) > match_threshold
  ORDER BY books.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- ------------------------------------------------------------------------------
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Public profiles read" ON public.profiles;
CREATE POLICY "Public profiles read" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users edit own profile" ON public.profiles;
CREATE POLICY "Users edit own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Books & Categories (Public Read, Admin All)
DROP POLICY IF EXISTS "Public read books" ON public.books;
CREATE POLICY "Public read books" ON public.books FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin modify books" ON public.books;
CREATE POLICY "Admin modify books" ON public.books FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
);

DROP POLICY IF EXISTS "Public read categories" ON public.categories;
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin modify categories" ON public.categories;
CREATE POLICY "Admin modify categories" ON public.categories FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
);

-- Cart & Wishlist Policies
DROP POLICY IF EXISTS "User cart access" ON public.cart_items;
CREATE POLICY "User cart access" ON public.cart_items FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "User wishlist access" ON public.wishlists;
CREATE POLICY "User wishlist access" ON public.wishlists FOR ALL USING (auth.uid() = user_id);

-- Orders Policies
DROP POLICY IF EXISTS "User view own orders" ON public.orders;
CREATE POLICY "User view own orders" ON public.orders FOR SELECT USING (
    auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
);

DROP POLICY IF EXISTS "Anyone place order" ON public.orders;
CREATE POLICY "Anyone place order" ON public.orders FOR INSERT WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 7. INITIAL SEED DATA (CATEGORIES & DEMO BOOKS)
-- ------------------------------------------------------------------------------
INSERT INTO public.categories (name, slug, description) VALUES
('Artificial Intelligence & Tech', 'ai-tech', 'Books on AI, Machine Learning, Python, and Software Engineering'),
('Self-Help & Productivity', 'self-help-productivity', 'Personal development, habits, mindsets, and success stories'),
('Business & Entrepreneurship', 'business-entrepreneurship', 'Startup guides, marketing, financial freedom, and leadership'),
('Fiction & Literature', 'fiction-literature', 'Novels, Urdu Literature, classics, and storytelling')
ON CONFLICT (slug) DO NOTHING;

-- Demo Books
INSERT INTO public.books (title, author, isbn, price, stock_quantity, description, is_featured, is_trending, is_bestseller) VALUES
('Atomic Habits', 'James Clear', '9780735211292', 1450.00, 50, 'An Easy & Proven Way to Build Good Habits & Break Bad Ones.', true, true, true),
('Deep Learning with Python', 'François Chollet', '9781617294433', 2800.00, 30, 'Comprehensive guide to artificial intelligence and deep learning.', true, false, true),
('The Psychology of Money', 'Morgan Housel', '9780857197689', 1600.00, 45, 'Timeless lessons on wealth, greed, and happiness.', false, true, true)
ON CONFLICT (isbn) DO NOTHING;

-- ==============================================================================
-- END OF SCHEMA
-- ==============================================================================
