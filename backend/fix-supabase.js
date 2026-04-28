const https = require('https');

const query = `
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS service_requests CASCADE;
DROP TABLE IF EXISTS complaints CASCADE;
DROP TABLE IF EXISTS workers CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'user',
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

CREATE TABLE IF NOT EXISTS workers (
  id TEXT PRIMARY KEY,
  user_id TEXT,
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

CREATE TABLE IF NOT EXISTS service_requests (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  worker_id TEXT,
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

CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  worker_id TEXT,
  service_request_id TEXT,
  rating INTEGER NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS complaints (
  id TEXT PRIMARY KEY,
  user_id TEXT,
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
`;

const postData = JSON.stringify({ query });

const options = {
  hostname: 'gggzpkqkqdhvtspweute.supabase.co',
  path: '/rest/v1/rpc/exec',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdnZ3pwa3FrcWRodnRzcHdldXRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNTU2ODYsImV4cCI6MjA5MjkzMTY4Nn0.1BnV5OqCu9e18SQdwrIUsD_IKOb5jcO1wlDWQJKeEPI',
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdnZ3pwa3FrcWRodnRzcHdldXRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNTU2ODYsImV4cCI6MjA5MjkzMTY4Nn0.1BnV5OqCu9e18SQdwrIUsD_IKOb5jcO1wlDWQJKeEPI'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
  });
});

req.on('error', console.error);
req.write(postData);
req.end();
