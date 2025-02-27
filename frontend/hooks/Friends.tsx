import { createClient } from "@/utils/supabase/client";
import useUser from "@/hooks/User"
import { FunctionsHttpError } from '@supabase/supabase-js'

const useFriends = () => {
  const supabase: any = createClient();
  const { getUser } = useUser(supabase);

  const sendFriendRequest = async (email: string) => {
    const user = await getUser();
    if (!user || !email) {
      return { error: 'User not authenticated or email missing' };
    }
    
    const response = await supabase.functions.invoke('add-friend', {
      body: { email }
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

  return {
    sendFriendRequest
  }
}

export default useFriends;