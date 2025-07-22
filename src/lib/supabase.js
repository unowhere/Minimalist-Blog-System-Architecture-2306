import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ocseixwttdizaymapllh.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jc2VpeHd0dGRpemF5bWFwbGxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxNzI5ODIsImV4cCI6MjA2ODc0ODk4Mn0.dNDLa9YzwxzTYSJrqcFbkm_619tM6byuvmgMN6VNkjI'

if (SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY === '<ANON_KEY>') {
  throw new Error('Missing Supabase variables');
}

export default createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})