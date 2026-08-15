const SUPABASE_URL = "https://buhvlyqjnikdohdcccpr.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_0MiuWnnOTjsvQfTsBhvrHw_r1m4djNy";

const db = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);
