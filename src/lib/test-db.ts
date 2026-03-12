import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

console.log('Testing connection to:', supabaseUrl);
console.log('Using Key:', supabaseAnonKey ? 'KEY_PROVIDED' : 'KEY_MISSING');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const { data, error } = await supabase.from('attorneys').select('*').limit(1);
  if (error) {
    console.error('Connection Error:', error);
  } else {
    console.log('Connection Successful! Found:', data?.length, 'attorneys');
  }

  const testSubmission = {
    full_name: 'Test Connectivity User',
    email: 'test@example.com',
    message: 'Testing connection from script',
    practice_area: 'General Inquiry'
  };

  const { error: insertError } = await supabase.from('contact_submissions').insert(testSubmission);
  if (insertError) {
    console.error('Insert Error:', insertError);
  } else {
    console.log('Insert Successful!');
  }
}

test();
