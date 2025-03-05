"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import useFriends from "@/hooks/Friends";
import SplashScreen from "@/components/SplashScreen";
import { FriendsBox, FindFriends } from "@/components/Friends";
import { Friend, FriendRequest } from "@/types/Friends";
import MenuDropdown from "@/components/Menu";

export default function FriendsPage() {
  const router = useRouter();
  const { getFriends, updateFriendRequest } = useFriends();

  // State for friend requests and user friends
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [friendsList, setFriendsList] = useState<Friend[]>([]);
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch both friends and friend requests on component mount
  useEffect(() => {
    async function fetchFriendsData() {
      try {
        setIsLoading(true);
        const { data, error } = await getFriends();

        if (error) {
          console.error("Error fetching friends data:", error);
          setError("Failed to load friends data");
          return;
        }

        if (data) {
          // Extract accepted friends
          if (data.accepted && Array.isArray(data.accepted)) {
            const acceptedFriends = data.accepted.map(
              (email: string, index: number) => ({
                id: `friend-${index}`,
                email: email,
              })
            );
            setFriendsList(acceptedFriends);
          }

          // Extract pending requests
          if (data.pending && Array.isArray(data.pending)) {
            const pendingRequests = data.pending.map(
              (email: string, index: number) => ({
                id: `request-${index}`,
                email: email,
              })
            );
            setFriendRequests(pendingRequests);
          }
        }
      } catch (err) {
        console.error("Exception fetching friends data:", err);
        setError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    fetchFriendsData();
  }, []);

  // Accept friend request
  const handleAccept = async (id: string, email: string) => {
    try {
      // Call your API to accept the friend request
      const response = await updateFriendRequest(email, "accepted");

      if (response.error) {
        setError(response.error);
        return;
      }

      // Move from requests to friends list
      const friend = { id, email };
      setFriendsList((prev) => [...prev, friend]);

      // Remove from pending requests
      setFriendRequests((prev) => prev.filter((req) => req.id !== id));

      setSuccessMessage(`Friend request from ${email} accepted!`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Error accepting friend request:", err);
      setError("Failed to accept friend request");
      setTimeout(() => setError(null), 3000);
    }
  };

  // Reject friend request or remove friend
  const handleReject = async (id: string, email: string) => {
    try {
      // Call API to decline the friend request
      const response = await updateFriendRequest(email, "declined");

      if (response.error) {
        setError(response.error);
        return;
      }

      // Remove from pending requests and friendslist 
      setFriendRequests((prev) => prev.filter((req) => req.id !== id));
      setFriendsList((prev) => prev.filter((friend) => friend.id !== id));

      // Determine appropriate message based on where the item was found
      if (id.startsWith('friend-')) {
        setSuccessMessage(`Removed ${email} from friends`);
      } else {
        setSuccessMessage(`Friend request from ${email} declined`);
      }
      
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Error rejecting friend request:", err);
      setError("Failed to reject friend request");
      setTimeout(() => setError(null), 3000);
    }
  };

  // Send friend request
  const handleSendRequest = async () => {
    if (!email.trim()) {
      setError("Please enter an email address");
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      const response = await updateFriendRequest(email, "pending");

      if (response.error) {
        setError(response.error);
      } else {
        setSuccessMessage(`Friend request sent to ${email}`);
        setEmail(""); // Clear the input field
      }

      setTimeout(() => {
        setError(null);
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error("Error sending friend request:", err);
      setError("Failed to send friend request");
      setTimeout(() => setError(null), 3000);
    }
  };

  if (isLoading)
    return <SplashScreen />;

  return (
    <div className="bg-black min-h-screen flex flex-col items-center text-white px-6 py-10 min-w-full">
      {/* Fixed position messages at the top */}
      <div className="fixed top-4 z-50 flex flex-col items-center w-full">
        {error && (
          <div className="bg-red-500 text-white px-4 py-2 rounded-lg mb-2 max-w-md">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-500 text-white px-4 py-2 rounded-lg max-w-md">
            {successMessage}
          </div>
        )}
      </div>

      
      <h1 className="flex text-4xl font-bold text-secondary items-center justify-center mt-4">
        FRIENDS
      </h1>

      {/* Main Container: Left (Friends List) & Right (Requests + Find Friends) */}
      <div className="w-3/4 flex flex-col md:flex-row justify-between mt-5">
        {/* LEFT SIDE - LIST OF MY FRIENDS */}
        <div className="w-full md:w-1/2 flex flex-col items-center mb-8 md:mb-0">
        <FriendsBox title="My Friends">
            {friendsList.length === 0 ? (
              <p className="text-gray-400">No friends added yet.</p>
            ) : (
              friendsList.map((friend) => (
                <div
                  key={friend.id}
                  className="flex justify-between items-center border-2 border-secondary h-14 bg-gray-800 p-2 mb-2 rounded-2xl"
                >
                  <span>{friend.email}</span>
                  <FaTimesCircle
                    className="text-red-500 cursor-pointer hover:text-red-400"
                    size={18}
                    onClick={() => handleReject(friend.id, friend.email)}
                    aria-label="Remove friend"
                    title="Remove friend"
                  />
                </div>
              ))
            )}
          </FriendsBox>
        </div>

        {/* RIGHT SIDE - FRIEND REQUESTS & FIND FRIENDS */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          {/* Friend Requests Section */}
          <FriendsBox title="Friend Requests" height="h-[220px]">
            {friendRequests.length === 0 ? (
              <p className="text-gray-400">No friend requests.</p>
            ) : (
              friendRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex justify-between items-center border-2 border-secondary min-h-[56px] h-14 bg-gray-800 p-2 mb-2 rounded-2xl"
                >
                  <span className="truncate max-w-[70%]">{request.email}</span>
                  <div className="flex space-x-2">
                    {/* Accept Friend Request */}
                    <FaCheckCircle
                      className="text-green-500 cursor-pointer hover:text-green-400"
                      size={20}
                      onClick={() => handleAccept(request.id, request.email)}
                    />
                    {/* Reject Friend Request */}
                    <FaTimesCircle
                      className="text-red-500 cursor-pointer hover:text-red-400"
                      size={20}
                      onClick={() => handleReject(request.id, request.email)}
                    />
                  </div>
                </div>
              ))
            )}
          </FriendsBox>

          {/* Find Friends Section */}
          <FindFriends
          email={email}
          setEmail={setEmail}
          onClick={handleSendRequest}
          />
        </div>
      </div>
      <MenuDropdown/>
    </div>
    
  );
}
