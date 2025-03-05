"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import MenuDropdown from "@/components/Menu";

export default function ProfilePage() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [fullName, setFullName] = useState<string>("Unknown User");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        console.error("Error fetching user:", error);
        router.push("/login");
      } else {
        console.log("User metadata:", data.user.user_metadata);
        setUser(data.user);
        setFullName(data.user.user_metadata?.fullName || "Unknown User");
      }
      setLoading(false);
    }

    fetchUser();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white px-6 py-10 w-full">
      <MenuDropdown />

      <h1 className="flex text-4xl font-bold text-secondary items-center justify-center mt-4">
        PROFILE
      </h1>

      <div className="flex flex-col items-center justify-center mt-4">
        <svg className="w-20 h-20 text-secondary" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z" clipRule="evenodd"/>
        </svg>

        {user ? (
          <div className="font-semibold">
            <p className="mb-2">Name:</p>
            <p className="text-lg font-normal p-2 border-2 border-secondary rounded-2xl bg-gray-800 w-80 text-center">
              {fullName}
            </p>

            <p className="mt-4 mb-2">Email:</p>
            <p className="text-lg font-normal p-2 border-2 border-secondary bg-gray-800 w-80 text-center rounded-2xl">
              {user.email}
            </p>
          </div>
        ) : (
          <p className="text-red-500">No user found.</p>
        )}

        <button
          className="mt-10 px-6 py-2 bg-secondary text-white rounded-2xl shadow-md bg-secondary hover:bg-purple-700 transition"
          onClick={async () => {
            await supabase.auth.signOut();
            router.push("/login");
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
