import { createClient } from "@supabase/supabase-js";

// Client for public UI queries (e.g. fetching workshops)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy"
);

// Admin client for backend API routes (e.g. inserting registrations securely)
// This skips Row Level Security policies, so NEVER use it in client components
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "dummy"
);
