import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vlcmcyzpgsywvtjlsqqy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsY21jeXpwZ3N5d3Z0amxzcXF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3MjI2MzIsImV4cCI6MjA4OTI5ODYzMn0.1Y7ULHx1QQJIPpI47k-arad4mFiZqL7-ZGUbl4tcjp8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
