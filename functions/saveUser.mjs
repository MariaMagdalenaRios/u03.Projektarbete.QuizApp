import { supabase } from "./utils/supabaseClient.js";

export async function handler(event, context) {
  try {
    // Only accept POST
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed!" }),
      };
    }

    // Parse incoming JSON body
    const user = JSON.parse(event.body);
    const email = user.email;

    // 1. Check if user exists
    const { data: existing, error: getError } = await supabase
      .from("Users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (getError) {
      console.error("Select error:", getError);
      return { statusCode: 500, body: JSON.stringify({ error: getError.message }) };
    }

    let result;

    // 2. User exists → update
    if (existing) {
      const games_played = existing.games_played + 1;
      const average_score = Math.round(
        (existing.average_score * existing.games_played + user.current_score) / games_played
      );

      const updatedUser = {
        ...existing,
        games_played,
        average_score,
      };

      delete updatedUser.current_score;

      const { data, error } = await supabase
        .from("Users")
        .update(updatedUser)
        .eq("email", email)
        .select();

      if (error) {
        console.error("Update error:", error);
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
      }

      result = data;
    }
    // 3. No user found → insert new
    else {
      const newUser = {
        ...user,
        games_played: 1,
        average_score: user.current_score,
      };

      delete newUser.current_score;

      const { data, error } = await supabase
        .from("Users")
        .insert([newUser])
        .select();

      if (error) {
        console.error("Insert error:", error);
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
      }

      result = data;
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (e) {
    console.error("Unexpected error:", e);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    };
  }
}
