import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://sywfobkulzwbzvdzyvon.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5d2ZvYmt1bHp3Ynp2ZHp5dm9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxMDIyNTQsImV4cCI6MjA5NzY3ODI1NH0.Nw8O4u2msG66kNZgjtAMk7bqhiSmljcX8BZ8r10Jlsg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
