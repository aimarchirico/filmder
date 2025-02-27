import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

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

    // Get sender from JWT
    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader)
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }), 
        { status: 401, headers: corsHeaders }
      );
    }

    // Add this debug log
    const body = await req.text();
    console.log('Request body:', body);

    // Try parsing the body
    let email;
    try {
      const data = JSON.parse(body);
      email = data.email;
    } catch (parseError) {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body', body: body }),
        { 
          status: 400, 
          headers: { 
            ...corsHeaders,
            'Content-Type': parseError.message
          }
        }
      );
    }

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'Email is required' } }
      );
    }

    // Get receiver's ID from email
    const { data: receiver, error: receiverError } = await supabase
      .auth.admin.listUsers()
      .then(({ data }) => ({
        data: data?.users.find(u => u.email === email),
        error: null
      }))
      .catch(error => ({data: null, error }));

    if (receiverError || !receiver) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: corsHeaders }
      );
    }

    // Check if friend request already exists
    const { data: existingRequest, error: checkError } = await supabase
      .from('friends')
      .select()
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${receiver.id}),and(sender_id.eq.${receiver.id},receiver_id.eq.${user.id})`)
      .single();

      if (existingRequest) {
        // If already request from receiver, update to accepted
        if (existingRequest.sender_id === receiver.id && existingRequest.status !== 'accepted') {
          const { error: updateError } = await supabase
            .from('friends')
            .update({ status: 'accepted' })
            .match({ sender_id: receiver.id, receiver_id: user.id });
  
          if (updateError) {
            return new Response(
              JSON.stringify({ error: updateError.message }),
              { status: 500, headers: corsHeaders }
            );
          }
  
          return new Response(
            JSON.stringify({ message: 'Friend request accepted' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
  
        // Otherwise, it's already accepted or a duplicate
        return new Response(
          JSON.stringify({ error: 'Friend request already exists' }),
          { status: 400, headers: {...corsHeaders,  'Content-Type': "Friend requ"}}
        );
      }

    // Insert friend request
    const { error: insertError } = await supabase
      .from('friends')
      .insert([{
        sender_id: user.id,
        receiver_id: receiver.id,
        status: 'pending'
      }]);

    if (insertError) {
      return new Response(
        JSON.stringify({ error: insertError.message }),
        { status: 501, headers: corsHeaders }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Friend request sent successfully' }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 501, 
        headers: { 
          ...corsHeaders,
          'Content-Type': error.message
        }
      }
    );
  }
});