import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://qvsybhhfvmvsujkxlkul.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2c3liaGhmdm12c3Vqa3hsa3VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwMzg4MjIsImV4cCI6MjEwMzYxNDgyMn0.joJMwdzejRW1Q5PLZF_0ZbBO6n8lbr4IsNtCut9sIsc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testComments() {
  console.log('Testing comments table...');
  const postId = 'c6282b5c-b490-4196-9b13-a145677878e5';
  
  // 1. Insert a comment
  console.log('1. Inserting comment...');
  const { data: insertData, error: insertError } = await supabase
    .from('comments')
    .insert([{ post_id: postId, author: 'TestScript', avatar: '🤖', text: 'Hello from script' }])
    .select();
    
  if (insertError) {
    console.error('Insert Error:', insertError);
    return;
  }
  
  console.log('Inserted Comment:', insertData);
  const newCommentId = insertData[0].id;
  
  // 2. Fetch comments
  console.log('2. Fetching comments...');
  const { data: fetch, error: fetchError } = await supabase
    .from('comments')
    .select('*');
    
  console.log('Fetched Comments:', fetch);
  
  // 3. Delete comment
  console.log('3. Deleting comment with ID:', newCommentId);
  const { data: deleteData, error: deleteError } = await supabase
    .from('comments')
    .delete()
    .eq('id', newCommentId)
    .select();
    
  console.log('Deleted data:', deleteData, 'Error:', deleteError);
}

testComments();
