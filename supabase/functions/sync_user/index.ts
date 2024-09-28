import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

serve(async (req) => {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  const { user } = await req.json()

  const { data, error } = await supabase
    .from('users')
    .insert({
      id: user.id,  // This should now be a UUID
      email: user.email,
      full_name: user.user_metadata?.full_name || '',
      created_at: new Date().toISOString(),
    })

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    })
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  })
})