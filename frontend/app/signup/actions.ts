"use server";

import { createClient } from "@/utils/supabase/server"; // ✅ Use your existing server client

export async function signup(formData: FormData) {
  const supabase = await createClient(); // ✅ Use your existing function

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;

  if (!email || !password || !fullName) {
    return { error: "All fields are required", success: null };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { fullName },
    },
  });

  if (error) {
    return { error: error.message, success: null }; // ✅ Always return an object
  }

  return { error: null, success: "Signup successful! Please check your email." };
}
