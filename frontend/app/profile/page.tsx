"use client";

import { useState, useEffect } from 'react';
import PageContainer from '@/components/PageContainer';
import SplashScreen from '@/components/SplashScreen';
import useUser from '@/hooks/User';
import useMovies from '@/hooks/Movies';
import useFriends from '@/hooks/Friends';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

export default function ProfilePage() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [fullName, setFullName] = useState<string>("Unknown User");
  const [loading, setLoading] = useState(true);
  const [likedMovies, setLikedMovies] = useState(0);
  const [friendsCount, setFriendsCount] = useState(0);
  
  const { getLikedMoviesCount } = useMovies();
  const { getFriendsCount } = useFriends();

  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        console.error("Error fetching user:", error);
        router.push("/login");
      } else {
        setUser(data.user);
        setFullName(data.user.user_metadata?.fullName || "Unknown User");
        
        // Fetch additional stats
        try {
          const moviesCount = await getLikedMoviesCount();
          const friends = await getFriendsCount();
          
          setLikedMovies(moviesCount);
          setFriendsCount(friends);
        } catch (error) {
          console.error("Error fetching user stats:", error);
        }
      }
      setLoading(false);
    }
  
    fetchUser();
  }, []);
  

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <PageContainer title="PROFILE">
      <div className="max-w-lg mx-auto">
        {/* Profile Content */}
        <div className="border-secondary border-2 bg-gray-900 p-6 rounded-lg shadow-lg">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-secondary rounded-full h-20 w-20 flex items-center justify-center text-2xl font-bold text-white">
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h2 className="text-white text-xl font-semibold">{fullName}</h2>
              <p className="text-gray-400">{user?.email}</p>
            </div>
          </div>
          
          {/* Profile Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-secondary text-2xl font-bold">{likedMovies}</p>
              <p className="text-gray-400">Liked Movies</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-secondary text-2xl font-bold">{friendsCount}</p>
              <p className="text-gray-400">Friends</p>
            </div>
          </div>
          
          {/* Account Info Section */}
          <div className="mt-6">
            <h3 className="text-white text-lg font-semibold mb-3">Account Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-gray-400 block mb-1">Email</label>
                <p className="text-white bg-gray-800 px-3 py-2 rounded">{user?.email}</p>
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Member Since</label>
                <p className="text-white bg-gray-800 px-3 py-2 rounded">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "Unknown"}
                </p>
              </div>
            </div>
          </div>
          
          {/* Sign Out Button */}
          <div className="mt-8">
            <button 
              onClick={handleSignOut}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
