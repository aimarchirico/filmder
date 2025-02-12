"use client";
import { signup } from "./actions";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const router = useRouter(); // ✅ Correct useRouter initialization

    return (
        <div className="flex min-h-screen bg-[#6f4ef2]">
            {/* Left Section (Background / Decoration) */}
            <div className="w-1/2 bg-[#6f4ef2] flex items-center justify-center">
                {/* Optional: Add any design elements here */}
            </div>

            {/* Right Side (Signup Form) */}
            <div className="flex w-1/2 items-center justify-center p-6">
                <div className="w-full max-w-md p-8 border-4 rounded-2xl border-black">
                    <h2 className="text-2xl font-semibold text-center text-white mb-6">
                        Create an Account
                    </h2>

                    <form className="flex flex-col gap-4">
                        {/* Full Name Input */}
                        <div>
                            <label htmlFor="full-name" className="block text-white text-sm font-bold">
                                Full name:
                            </label>
                            <input
                                id="full-name"
                                name="fullName"
                                type="text"
                                required
                                className="w-full mt-1 p-3 rounded-2x rounded-2xl border-2 border-black bg-white text-white focus:ring-2 focus:ring-blue-400 outline-none"
                                placeholder="Enter your full name"
                            />
                        </div>

                        {/* Username Input */}
                        <div>
                            <label htmlFor="username" className="block text-white text-sm font-bold">
                                Username:
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="w-full mt-1 p-3 border-2 border-black rounded-2xl bg-white text-gray-900 focus:ring-2 focus:ring-blue-400 outline-none"
                                placeholder="Enter your username"
                            />
                        </div>

                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-white text-sm font-bold">
                                Email:
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="w-full mt-1 p-3 border-2 border-black rounded-2xl bg-white text-gray-900 focus:ring-2 focus:ring-blue-400 outline-none"
                                placeholder="Enter your email"
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-white text-sm font-bold">
                                Password:
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="w-full mt-1 p-3 border-2 border-black rounded-2xl bg-white text-gray-900 focus:ring-2 focus:ring-blue-400 outline-none"
                                placeholder="Enter your password"
                            />
                        </div>

                        {/* Confirm Password Input */}
                        <div>
                            <label htmlFor="confirm-password" className="block text-white text-sm font-bold">
                                Confirm Password:
                            </label>
                            <input
                                id="confirm-password"
                                name="confirmPassword"
                                type="password"
                                required
                                className="w-full mt-1 p-3 border-2 border-black rounded-2xl bg-white text-gray-900 focus:ring-2 focus:ring-blue-400 outline-none"
                                placeholder="Confirm your password"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col gap-3 mt-4">
                            <button
                                formAction={signup}
                                className="w-full bg-black hover:bg-purple-600 text-white font-medium py-3 rounded-2xl transition"
                            >
                                Register
                            </button>
                            <div className="text-center text-white">
                                Already have an account?
                                <button
                                    type="button"
                                    onClick={() => router.push("/login")}
                                    className="text-white font-bold hover:underline ml-1 rounded-2xl"
                                >
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
