"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

// ✅ Define the Friend Request Type
type FriendRequest = {
  id: number;
  name: string;
};

export default function FriendsPage() {
  const router = useRouter();

  // ✅ Fix: Use `string` instead of `String`
  const [username, setUsername] = useState<string>("");
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setTimeout(() => {
      setFriendRequests([
        { id: 1, name: "SupiSnail" },
        { id: 2, name: "HeleneErBeast007" },
        { id: 3, name: "SuperAmario2004" },
        { id: 4, name: "AuBEASTgust"},
        { id: 5, name: "LineTheLegend2000"},
        { id: 6, name: "MarkusMilf" },
      ]);
    }, 500);
  }, []);

  if (!isClient) return <p className="text-gray-400">Loading...</p>;

  // ✅ Accept Friend Request
  const handleAccept = (id: number) => {
    setFriendRequests(friendRequests.filter((friend) => friend.id !== id));
  };

  // ✅ Reject Friend Request
  const handleReject = (id: number) => {
    setFriendRequests(friendRequests.filter((friend) => friend.id !== id));
  };

  console.log("Rendering FriendsPage:", { username, friendRequests });

  return (
    <div className="bg-black min-h-screen flex flex-col items-center text-white">
      {/* Title */}
      <h1 className="text-4xl font-bold text-secondary mt-10">FILMDER</h1>

      {/* Main Container */}
      <div className="w-3/4 flex justify-between  mt-10">
        {/* Left Section - Search for Friends */}
        <div className="w-1/2 flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-4">Find Friends</h2>

          <div className="p-4 w-3/4 h-128 flex flex-col">
            <p className="text-lg font-medium mb-4 text-center">Want to link up with friends?</p>

            <label className=" mb-2">E-mail:</label>
            <input
              type="text"
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
              className="w-full p-3 border-2 border-secondary rounded-2xl text-white bg-gray-800 focus:outline-none"
            />

            <button className="mt-4 px-6 py-3 bg-secondary text-white rounded-2xl hover:bg-purple-700 transition">
              Find friend
            </button>

            {/* Home Button (Aligned to Left Corner) */}
            <div className="self-start mt-6">
              <button
                type="button"
                onClick={() => router.push("/home")}
                className="px-6 py-3 bg-secondary text-white rounded-full shadow-md hover:bg-purple-700 transition"
              >
                Home
              </button>
            </div>
          </div>
        </div>


        {/* Right Section - Friend Requests */}
        <div className="w-1/2 flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-4">Friend Requests</h2>

          <div className="border-secondary border-4 rounded-2xl p-4 w-3/4 h-80 overflow-y-auto flex flex-col">
            {/* ✅ Loading Indicator */}
            {friendRequests.length === 0 && <p>Loading friend requests...</p>}

            {/* ✅ Friend Request List */}
            {friendRequests.length > 0 &&
              friendRequests.map((friend) => (
                <div
                  key={friend.id}
                  className="flex justify-between items-center border-2 border-secondary bg-gray-800 p-2 mb-2 rounded-2xl"
                >
                  <span>{friend.name}</span>
                  <div className="flex space-x-2">
                    {/* Accept Friend Request */}
                    <FaCheckCircle
                      className="text-green-500 cursor-pointer hover:text-green-400"
                      size={20}
                      onClick={() => handleAccept(friend.id)}
                    />
                    {/* Reject Friend Request */}
                    <FaTimesCircle
                      className="text-red-500 cursor-pointer hover:text-red-400"
                      size={20}
                      onClick={() => handleReject(friend.id)}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

      </div>
    </div>
  );
}
