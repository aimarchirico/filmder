import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

// Function to fetch accepted friends and pending friends, returning only emails
serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify authentication
    const authHeader = req.headers.get('Authorization')?.split('Bearer ')[1];
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }), 
        { status: 401, headers: corsHeaders }
      );
    }

    // Get user from JWT
    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader)
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }), 
        { status: 401, headers: corsHeaders }
      );
    }

    // Get accepted friends - user can be either sender or receiver
    const { data: acceptedFriends, error: acceptedError } = await supabase
      .from('friends')
      .select('sender_id, receiver_id')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .eq('status', 'accepted');

    if (acceptedError) {
      return new Response(
        JSON.stringify({ error: acceptedError.message }), 
        { status: 500, headers: corsHeaders }
      );
    }

    // Extract friend IDs (the other user in each relationship)
    const acceptedFriendIds = acceptedFriends.map(friend => 
      friend.sender_id === user.id ? friend.receiver_id : friend.sender_id
    );

    // Get pending friend requests - user must be the receiver
    const { data: pendingRequests, error: pendingError } = await supabase
      .from('friends')
      .select('sender_id')
      .eq('receiver_id', user.id)
      .eq('status', 'pending');

    if (pendingError) {
      return new Response(
        JSON.stringify({ error: pendingError.message }), 
        { status: 500, headers: corsHeaders }
      );
    }

    // Extract pending sender IDs
    const pendingSenderIds = pendingRequests.map(request => request.sender_id);

    // Now get the emails for all these IDs
    // First, combine all IDs we need to look up
    const allUserIds = [...acceptedFriendIds, ...pendingSenderIds];
    
    // If there are no friends or pending requests, return empty lists
    if (allUserIds.length === 0) {
      return new Response(
        JSON.stringify({
          accepted: [],
          pending: []
        }),
        { 
          status: 200, 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Get all user emails in a single query
    const { data: userEmails, error: emailsError } = await supabase.auth.admin
      .listUsers()
      .then(res => {
        if (res.error) return { data: null, error: res.error };
        
        // Filter to only the users we need and extract just the id and email
        const filteredUsers = res.data.users
          .filter(u => allUserIds.includes(u.id))
          .map(u => ({ id: u.id, email: u.email }));
          
        return { data: filteredUsers, error: null };
      });

    if (emailsError) {
      return new Response(
        JSON.stringify({ error: emailsError.message }), 
        { status: 500, headers: corsHeaders }
      );
    }

    // Create a lookup map of id -> email
    const emailMap = {};
    userEmails.forEach(user => {
      emailMap[user.id] = user.email;
    });

    // Map IDs to emails for accepted friends
    const acceptedEmails = acceptedFriendIds.map(id => emailMap[id] || null)
      .filter(email => email !== null); // Remove any null entries

    // Map IDs to emails for pending requests
    const pendingEmails = pendingSenderIds.map(id => emailMap[id] || null)
      .filter(email => email !== null); // Remove any null entries

    return new Response(
      JSON.stringify({
        accepted: acceptedEmails,
        pending: pendingEmails
      }),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});