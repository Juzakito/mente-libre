import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qvsybhhfvmvsujkxlkul.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2c3liaGhmdm12c3Vqa3hsa3VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwMzg4MjIsImV4cCI6MjEwMzYxNDgyMn0.joJMwdzejRW1Q5PLZF_0ZbBO6n8lbr4IsNtCut9sIsc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSelect() {
  const { data, error } = await supabase.from('posts').select('*');
  console.log('Posts:', data);
}
testSelect();
