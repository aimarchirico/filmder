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

  // ✅ State for friend requests and user friends
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [friendsList, setFriendsList] = useState<FriendRequest[]>([]); // Friends you've accepted
  const [username, setUsername] = useState<string>("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setTimeout(() => {
      setFriendRequests([
        { id: 1, name: "SupiSnail@gmail.com" },
        { id: 2, name: "HeleneErBeast007@ntnu.no" },
        { id: 3, name: "SuperAmario2004@icloud.com" },
        { id: 4, name: "AuBEASTgust@yahoo.com" },
        { id: 5, name: "LineTheLegend2000@hotmail.com" },
        { id: 6, name: "MarkusMilf@idi.ntnu.no" },
        { id: 7, name: "SupiSnail@gmail.com" },
        { id: 8, name: "HeleneErBeast007@ntnu.no" },
        { id: 9, name: "SuperAmario2004@icloud.com" },
        { id: 10, name: "AuBEASTgust@yahoo.com" },
        { id: 11, name: "LineTheLegend2000@hotmail.com" },
        { id: 12, name: "MarkusMilf@idi.ntnu.no" },
      ]);
    }, 500);
  }, []);

  if (!isClient) return <p className="text-gray-400">Loading...</p>;

  // ✅ Accept Friend Request
  const handleAccept = (id: number) => {
    const friend = friendRequests.find((f) => f.id === id);
    if (friend) {
      setFriendsList([...friendsList, friend]); // Move friend to friends list
    }
    setFriendRequests(friendRequests.filter((friend) => friend.id !== id));
  };

  // ✅ Reject Friend Request
  const handleReject = (id: number) => {
    setFriendRequests(friendRequests.filter((friend) => friend.id !== id));
  };

  console.log("Rendering FriendsPage:", { username, friendRequests, friendsList });

  return (
    <div className="bg-black min-h-screen flex flex-col items-center text-white">
      {/* Home Button */}
      <div className="ml-10 mt-10">
        <button
          type="button"
          onClick={() => router.push("/home")}
          className="text-4xl font-bold text-secondary"
        >
          FILMDER
        </button>
      </div>

      {/* Main Container: Left (Friends List) & Right (Requests + Find Friends) */}
      <div className="w-3/4 flex justify-between mt-5">
        {/* ✅ LEFT SIDE - LIST OF MY FRIENDS */}
        <div className="w-1/2 flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-4">My Friends</h2>
          <div className="p-4 w-3/4 w-124 flex flex-col">
            {friendsList.length === 0 ? (
              <p className="text-gray-400">No friends added yet.</p>
            ) : (
              friendsList.map((friend) => (
                <div
                  key={friend.id}
                  className="flex justify-between items-center border-2 border-secondary h-14 bg-gray-800 p-2 mb-2 rounded-2xl"
                >
                  <span>{friend.name}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ✅ RIGHT SIDE - FRIEND REQUESTS & FIND FRIENDS */}
        <div className="w-1/2 flex flex-col items-center">
          {/* Friend Requests Section */}
          <h2 className="text-2xl font-semibold mb-4">Friend Requests</h2>
          <div className="border-secondary border-4 rounded-2xl p-4 w-3/4 h-[320px] min-h-[320px] overflow-y-scroll pr-4 flex flex-col scrollbar">
            {friendRequests.length === 0 ? (
              <p className="text-gray-400">No friend requests.</p>
            ) : (
              friendRequests.map((friend) => (
                <div
                  key={friend.id}
                  className="flex justify-between items-center border-2 border-secondary min-h-[56px] h-14 bg-gray-800 p-2 mb-2 rounded-2xl"
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
              ))
            )}
          </div>

          {/* Find Friends Section */}
          <h2 className="text-2xl font-semibold mt-6 mb-4">Find Friends</h2>
          <div className="p-4 w-3/4 flex flex-col">
            <label className="mb-2">E-mail:</label>
            <input
              type="text"
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
              className="w-full p-3 border-2 border-secondary rounded-2xl text-white bg-gray-800 focus:outline-none"
            />
            <button className="mt-4 px-6 py-3 bg-secondary text-white rounded-2xl hover:bg-purple-700 transition">
              Find friend
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
