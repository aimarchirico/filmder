"use client";
import { login } from "./actions";
import { useRouter } from "next/navigation"; // Import useRouter

export default function LoginPage() {
  const router = useRouter(); // Initialize useRouter

  return (
    <div className="flex min-h-screen flex-col md:flex-row items-center justify-center md:justify-start">
      {/* Left Section (Login Form) */}
      <div className="flex md:w-2/3 w-full items-center justify-center p-6 bg-primary">
        <div className="w-full max-w-md shadow-lg rounded-2xl p-8 border-4 border-secondary">
          <h2 className="text-2xl font-semibold text-center text-white mb-6">
            Welcome Back!
          </h2>
          <form className="flex flex-col gap-4">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-gray-400 text-sm font-medium">
                Email:
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full mt-1 p-3 border-2 border-secondary rounded-2xl bg-gray-800 text-white focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-gray-400 text-sm font-medium">
                Password:
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full mt-1 p-3 border-2 border-secondary rounded-2xl bg-gray-800 text-white focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Enter your password"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-2">
              <button
                formAction={login}
                className="w-full bg-secondary hover:bg-purple-700 text-white font-medium py-3 rounded-2xl transition"
              >
                Log in
              </button>
              <div className="items-center justify-center text-center text-gray-400 mt-4">
                Don't have an account?
                <button
                  type="button"
                  onClick={() => router.push("/signup")} // Navigate to Signup Page
                  className="w-full bg-white hover:bg-gray-800 font-medium py-3 rounded-2xl transition text-primary hover:text-gray"
                >
                  Sign up
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Right Section (Purple Background) - Hidden on Small Screens */}
      <div className="hidden md:block w-2/5 bg-secondary min-h-screen"></div>
    </div>
  );
}
