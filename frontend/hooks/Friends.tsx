import { createClient } from "@/utils/supabase/client";
import useUser from "@/hooks/User"
import { FunctionsHttpError } from '@supabase/supabase-js'

const useFriends = () => {
  const supabase: any = createClient();
  const { getUser } = useUser(supabase);

  const updateFriendRequest = async (email: string, status: string = 'pending') => {
    const user = await getUser();
    if (!user || !email) {
      return { error: 'User not authenticated or email missing' };
    }
    
    const response = await supabase.functions.invoke('add-friend', {
      body: { email, status }
    });

    if (response.error && response.error instanceof FunctionsHttpError) {
      const errorMessage = await response.error.context.json()
      return {
        data: response.data,
        error: errorMessage.error || 'Unknown error occurred'
      };
    }

    return {
      data: response.data,
      error: response.error?.message || null
    };
  }

const getFriends = async () => {
    const user = await getUser();
    if (!user) {
      return { error: 'User not authenticated' };
    }

    const response = await supabase.functions.invoke('fetch-friends');

    if (response.error && response.error instanceof FunctionsHttpError) {
      const errorMessage = await response.error.context.json()
      return {
        data: null,
        error: errorMessage.error || 'Unknown error occurred'
      };
    }

    return {
      data: response.data,
      error: response.error?.message || null
    };
  }

  return {
    updateFriendRequest,
    getFriends,
  }
}

export default useFriends;