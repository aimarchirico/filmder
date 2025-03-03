import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Verify authentication
    const authHeader = req.headers.get("Authorization")?.split("Bearer ")[1];
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    // Get sender from JWT
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(authHeader);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    const body = await req.text();

    // Try parsing the body
    let email, status;
    try {
      const data = JSON.parse(body);
      email = data.email;
      // Default to 'pending' if no status provided
      status = data.status || "pending";

      // Validate status is one of the allowed values
      if (!["pending", "accepted", "declined"].includes(status)) {
        return new Response(
          JSON.stringify({
            error:
              "Invalid status value. Must be pending, accepted, or declined",
          }),
          { status: 400, headers: corsHeaders }
        );
      }
    } catch (parseError) {
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body", body: body }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get receiver's ID from email
    const { data: receiver, error: receiverError } = await supabase.auth.admin
      .listUsers()
      .then(({ data }) => ({
        data: data?.users.find((u) => u.email === email),
        error: null,
      }))
      .catch((error) => ({ data: null, error }));

    if (receiverError || !receiver) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    if (receiver.id === user.id) {
      return new Response(
        JSON.stringify({
          error: "You cannot send a friend request to yourself",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check if friend request already exists
    const { data: existingRequest, error: checkError } = await supabase
      .from("friends")
      .select()
      .or(
        `and(sender_id.eq.${user.id},receiver_id.eq.${receiver.id}),and(sender_id.eq.${receiver.id},receiver_id.eq.${user.id})`
      )
      .single();

    // Validate status parameter
    if (!existingRequest && status !== "pending") {
      return new Response(
        JSON.stringify({
          error: 'Can only create new requests with "pending" status',
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (existingRequest) {
      // If request exists, check permissions based on roles
      if (status === "accepted" && existingRequest.receiver_id !== user.id) {
        return new Response(
          JSON.stringify({
            error: "Only the receiver can accept a friend request",
          }),
          { status: 403, headers: corsHeaders }
        );
      }

      // Special case for declining - delete the row instead of updating
      // Allow either the sender or receiver to decline
      if (status === "declined") {
        const { error: deleteError } = await supabase
          .from("friends")
          .delete()
          .match({
            sender_id: existingRequest.sender_id,
            receiver_id: existingRequest.receiver_id,
          });

        if (deleteError) {
          return new Response(JSON.stringify({ error: deleteError.message }), {
            status: 500,
            headers: corsHeaders,
          });
        }

        return new Response(
          JSON.stringify({ message: "Friend request declined" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // For other status changes (accepting), update the row
      if (status !== existingRequest.status) {
        const { error: updateError } = await supabase
          .from("friends")
          .update({ status: status })
          .match({
            sender_id: existingRequest.sender_id,
            receiver_id: existingRequest.receiver_id,
          });

        if (updateError) {
          return new Response(JSON.stringify({ error: updateError.message }), {
            status: 500,
            headers: corsHeaders,
          });
        }

        return new Response(
          JSON.stringify({ message: `Friend request updated to ${status}` }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Otherwise, it's a duplicate with the same status
      return new Response(
        JSON.stringify({
          error: "Friend request already exists with this status",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Insert new friend request (only gets here if no existing request)
    const { error: insertError } = await supabase.from("friends").insert([
      {
        sender_id: user.id,
        receiver_id: receiver.id,
        status: "pending", // Force pending for new requests
      },
    ]);

    if (insertError) {
      return new Response(JSON.stringify({ error: insertError.message }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    return new Response(
      JSON.stringify({
        message:
          status === "pending"
            ? "Friend request sent successfully"
            : status === "accepted"
            ? "Friend added successfully"
            : "Friend request declined",
      }),
      {
        status: 201,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }
});
