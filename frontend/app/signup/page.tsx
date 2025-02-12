"use client";

import { useState } from "react";
import { signup } from "./actions";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(null);

    const result = await signup(formData);

    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(result.success ?? null); // ✅ Ensures success is always a string or null
      setTimeout(() => router.push("/login"), 3000); // Redirect after 3s
    }
  }

  return (
    <div className="flex min-h-screen bg-secondary">
        <div className="flext w-1/2"/>
      {/* Signup Form */}
      <div className="flex w-1/2 items-center justify-center p-6">
        <div className="w-full max-w-md p-8 border-4 rounded-2xl border-black">
          <h2 className="text-2xl font-semibold text-center text-white mb-6">Create an Account</h2>

          {/* Show Success or Error Messages */}
          {error && <p className="text-red-500 text-center">{error}</p>}
          {success && <p className="text-green-500 text-center">{success}</p>}

          <form action={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="full-name" className="block text-white text-sm font-bold">Full Name:</label>
              <input
                id="full-name"
                name="fullName"
                type="text"
                required
                className="w-full mt-1 p-3 border-2 border-black rounded-2xl bg-white text-gray-900 focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-white text-sm font-bold">Email:</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full mt-1 p-3 border-2 border-black rounded-2xl bg-white text-gray-900 focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-white text-sm font-bold">Password:</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full mt-1 p-3 border-2 border-black rounded-2xl bg-white text-gray-900 focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex flex-col gap-3 mt-4">
              <button className="w-full bg-black hover:bg-purple-600 text-white font-medium py-3 rounded-2xl transition">
                Register
              </button>
              <div className="text-center text-white">
                Already have an account?
                <button type="button" onClick={() => router.push("/login")} className="text-white font-bold hover:underline ml-1">
                  Login
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
