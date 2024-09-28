import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or API key is missing. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Function to get an authenticated Supabase client
export const getAuthenticatedClient = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    return supabase.auth.setSession(session);
  }
  return supabase;
};

// Verificar se o cliente Supabase foi inicializado corretamente
if (!supabase.auth) {
  console.error('Supabase client was not initialized correctly. Auth object is missing.');
}