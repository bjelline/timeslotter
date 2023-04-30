import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://elcukmpnfnhhnkgsythy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsY3VrbXBuZm5oaG5rZ3N5dGh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODI2ODA2ODUsImV4cCI6MTk5ODI1NjY4NX0.tzXkvPPmWq72foF8OqhUTkhv2xQxsgnCCV60_0T4b-Q'
);
