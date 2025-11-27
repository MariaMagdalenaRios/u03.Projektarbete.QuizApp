// Docs on request and context https://docs.netlify.com/functions/build/#code-your-function-2
import { supabase } from './utils/supabaseClient.js';

export async function handler(event, context) {
  // const authInfo = await supabase.auth.getUser()

  const { data, error } = await supabase.from('Users').select('*');

  if (error) {
    return { statusCode: 500, body: error.message };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
}

