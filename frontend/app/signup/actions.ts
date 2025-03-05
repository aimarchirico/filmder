"use server";

import { createClient } from "@/utils/supabase/server";

export async function signup(formData: FormData) {
  const supabase = await createClient();

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
      data: {
        full_name: fullName, // ✅ Store full name in metadata
      },
    },
  });

  if (error) {
    return { error: error.message, success: null };
  }

  return { error: null, success: "Signup successful! Please check your email." };
}
