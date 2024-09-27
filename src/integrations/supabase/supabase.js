import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or API key is missing. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Verificar se o cliente Supabase foi inicializado corretamente
if (!supabase.auth) {
  console.error('Supabase client was not initialized correctly. Auth object is missing.');
}