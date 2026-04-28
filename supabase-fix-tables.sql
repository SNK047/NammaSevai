-- Drop existing tables and recreate with text IDs to support MongoDB ObjectIds
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS service_requests CASCADE;
DROP TABLE IF EXISTS complaints CASCADE;
DROP TABLE IF EXISTS workers CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table with text ID to support MongoDB ObjectIds
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'worker', 'admin')),
  avatar TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  lat NUMERIC,
  lng NUMERIC,
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workers table
CREATE TABLE IF NOT EXISTS workers (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  skills TEXT[],
  category TEXT,
  description TEXT,
  experience INTEGER DEFAULT 0,
  hourly_rate NUMERIC DEFAULT 0,
  availability TEXT DEFAULT 'available',
  rating_average NUMERIC DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  total_jobs INTEGER DEFAULT 0,
  is_approved BOOLEAN DEFAULT false,
  documents TEXT[],
  service_city TEXT,
  service_radius INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service Requests table
CREATE TABLE IF NOT EXISTS service_requests (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  worker_id TEXT REFERENCES workers(id),
  service_type TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  scheduled_date TIMESTAMPTZ,
  address TEXT NOT NULL,
  estimated_cost NUMERIC DEFAULT 0,
  final_cost NUMERIC,
  notes TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  worker_id TEXT REFERENCES workers(id),
  service_request_id TEXT REFERENCES service_requests(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Complaints table
CREATE TABLE IF NOT EXISTS complaints (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  address TEXT,
  city TEXT,
  lat NUMERIC,
  lng NUMERIC,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  admin_notes TEXT,
  resolved_at TIMESTAMPTZ,
  is_public BOOLEAN DEFAULT true,
  upvotes TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);
