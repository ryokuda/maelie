import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://rlzhmcyvyctrlqidkhja.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsemhtY3l2eWN0cmxxaWRraGphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUzNDQyMDYsImV4cCI6MjA0MDkyMDIwNn0.eGh3o4oIQaZR1e3yyngoEe9X9vedllN9j-mBYuV-hYY";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
