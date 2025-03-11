"use client";

import { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import PageContainer from '@/components/PageContainer';
import { FriendsBox, FindFriends } from "@/components/Friends";
import useUser from '@/hooks/User';
import SplashScreen from '@/components/SplashScreen';
import useFriends from '@/hooks/Friends';

export default function FriendsPage() {
  const [loading, setLoading] = useState(true);
  const [friendsList, setFriendsList] = useState<any[]>([]);
  const [friendRequests, setFriendRequests] = useState<any[]>([]);
  const [friendEmail, setFriendEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { getFriends, updateFriendRequest } = useFriends();
  // Fetch both friends and friend requests
  useEffect(() => {
    async function fetchFriendsData() {
      try {
        setLoading(true);
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
        setLoading(false);
      }
    }

    fetchFriendsData();
  }, []);

  // Accept friend request
  const handleAccept = async (id: string, email: string) => {
    try {
      const response = await updateFriendRequest(email, "accepted");

      if (response.error) {
        setError(response.error);
        return;
      }

      // Move from requests to friends list
      const friend = { id, email };
      setFriendsList((prev) => [...prev, friend]);

      
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
      const response = await updateFriendRequest(email, "declined");

      if (response.error) {
        setError(response.error);
        return;
      }

      // Remove from pending requests and friendslist 
      setFriendRequests((prev) => prev.filter((req) => req.id !== id));
      setFriendsList((prev) => prev.filter((friend) => friend.id !== id));

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
    if (!friendEmail.trim()) {
      setError("Please enter an email address");
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      const response = await updateFriendRequest(friendEmail, "pending");

      if (response.error) {
        setError(response.error);
      } else {
        setSuccessMessage(`Friend request sent to ${friendEmail}`);
        setFriendEmail(""); 
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

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <PageContainer title="FRIENDS">
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


      <div className="w-full flex flex-col md:flex-row justify-between">
        {/* Friends list */}
        <div className="w-full md:w-1/2 flex flex-col items-center mb-0 md:mb-0">
          <FriendsBox title="My Friends">
            {friendsList.length === 0 ? (
              <p className="text-gray-400">No friends added yet.</p>
            ) : (
              friendsList.map((friend) => (
                <div
                  key={friend.id}
                  className="flex justify-between items-center h-14 bg-gray-800 p-2 mb-2 rounded-2xl"
                >
                  <span className="truncate max-w-[80%]">{friend.email}</span>
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

        <div className="w-full md:w-1/2 flex flex-col items-center md:pl-4">
          {/* Friend Requests */}
          <FriendsBox title="Friend Requests" height="h-[200px]">
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
                    <FaCheckCircle
                      className="text-green-500 cursor-pointer hover:text-green-400"
                      size={20}
                      onClick={() => handleAccept(request.id, request.email)}
                    />
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

          {/* Add Friend Form */}
          
          <FriendsBox title="Add Friends" height="h-[130px]">
            <div className="w-full">
              <form onSubmit={(e) => {e.preventDefault(); handleSendRequest();}} className="flex flex-col gap-2 w-full">
              <input
                type="email"
                placeholder="Enter your friend's email"
                value={friendEmail}
                onChange={(e) => setFriendEmail(e.target.value)}
                className="w-full bg-gray-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <button
                type="submit"
                className="w-full bg-secondary hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Send Request
              </button>
              </form>
            </div>
          </FriendsBox>
        </div>
      </div>
    </PageContainer>
  );
}
