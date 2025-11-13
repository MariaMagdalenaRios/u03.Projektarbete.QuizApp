import { createClient } from 'https://esm.sh/@supabase/supabase-js'
import { supabaseUrl, supabaseServiceRoleKey } from '../localEnv.js';

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

export async function loadData() {
  // debug auth state
  const authInfo = await supabase.auth.getUser()

  // request with count to see whether any rows exist
  const { data, error } = await supabase
    .from('Users')
    .select('*')

  if (error) {
    console.error(error)
    return null
  }
  return data
}

export async function addUser(user) {
  const authInfo = await supabase.auth.getUser()

  // request with count to see whether any rows exist
  const { data, error } = await supabase
    .from('Users') 
    .insert([user])

  if (error) {
    console.error(error)
    return null
  }
  return data
}


export async function editUser(user) {
  const authInfo = await supabase.auth.getUser()

  // request with count to see whether any rows exist
  const { data, error } = await supabase
    .from('Users') 
    .update(user)
    .eq('id', user.id)

  if (error) {
    console.error(error)
    return "error"
  }

  console.log('editUser data:', data);
  return "success"
}


export async function deleteUser(user) {
  const authInfo = await supabase.auth.getUser()

  // request with count to see whether any rows exist
  const { data, error } = await supabase
    .from('Users') 
    .delete()
    .eq('id', user.id)

  if (error) {
    console.error(error)
    return "error"
  }

  console.log('deleteUser data:', data);
  return "success"
}




