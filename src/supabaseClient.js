import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://otzetvgrtxrpkxxqehgb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90emV0dmdydHhycGt4eHFlaGdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc0MDc3MDksImV4cCI6MjA0Mjk4MzcwOX0.cI6uRP5WGhaNN66csTebyE9D_2KxbyMCaIe9EUuJeKI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
