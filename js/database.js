
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
    .eq('email', user.email)

  if (error) {
    console.error(error)
    return "error"
  }

  console.log('editUser data:', data);
  return "success"
}


export async function saveUser(user) {
  const authInfo = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('Users') 
    .select('*')
    .eq('email', user.email)

  if (error) {
    console.error(error)
    return null
  }

  if (data.length > 0) {
    console.log('User already exists:', data[0]);
    user.games_played = data[0].games_played + 1
    user.average_score = Math.round(((data[0].average_score * data[0].games_played) + user.current_score) / user.games_played)
    delete user.current_score;
    await editUser(user);
  } else {
    user.games_played = 1
    user.average_score = user.current_score
    delete user.current_score;

    await addUser(user);
  }
}

