import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ActivateCardRequest {
  activationCode: string;
  email: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { activationCode, email }: ActivateCardRequest = await req.json();

    if (!activationCode || !email) {
      return new Response(
        JSON.stringify({ error: "Code d'activation et email requis" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const normalizedCode = activationCode.trim().toUpperCase();
    const normalizedEmail = email.trim().toLowerCase();

    const { data: card, error: cardError } = await supabase
      .from("cards")
      .select("*")
      .eq("activation_code", normalizedCode)
      .maybeSingle();

    if (cardError) {
      throw cardError;
    }

    if (!card) {
      return new Response(
        JSON.stringify({ error: "Code d'activation invalide" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (card.status === "activated") {
      return new Response(
        JSON.stringify({ error: "Cette carte a déjà été activée" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { data: existingUser } = await supabase.auth.admin.listUsers();
    const userExists = existingUser?.users.find(u => u.email === normalizedEmail);

    let userId: string;
    let shouldOnboard = false;

    if (userExists) {
      userId = userExists.id;
    } else {
      const tempPassword = crypto.randomUUID();
      const { data: newUser, error: signUpError } = await supabase.auth.admin.createUser({
        email: normalizedEmail,
        password: tempPassword,
        email_confirm: true,
      });

      if (signUpError) {
        throw signUpError;
      }

      userId = newUser.user.id;
      shouldOnboard = true;

      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role: "customer" });

      if (roleError) {
        console.error("Error creating user role:", roleError);
      }
    }

    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    let profileId: string;

    if (existingProfile) {
      profileId = existingProfile.id;
    } else {
      const username = normalizedEmail.split("@")[0];
      const { data: newProfile, error: profileError } = await supabase
        .from("profiles")
        .insert({
          user_id: userId,
          username: username,
          email: normalizedEmail,
          full_name: "",
          title: "",
          bio: "",
          phone: "",
          website: "",
          profile_photo_url: "",
          video_url: "",
          pdf_url: "",
          social_links: {},
          design_template: "minimal",
          qr_customization: {},
          lead_collection_enabled: false,
          lead_form_fields: {
            name: true,
            email: true,
            phone: false,
            message: false,
          },
          is_active: true,
          view_count: 0,
          sector: "",
          custom_fields: [],
        })
        .select()
        .single();

      if (profileError) {
        throw profileError;
      }

      profileId = newProfile.id;
    }

    const { error: updateError } = await supabase
      .from("cards")
      .update({
        status: "activated",
        profile_id: profileId,
        activated_at: new Date().toISOString(),
      })
      .eq("id", card.id);

    if (updateError) {
      throw updateError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Carte activée avec succès",
        profileId,
        shouldOnboard,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in activate-card function:", error);
    return new Response(
      JSON.stringify({ error: "Erreur lors de l'activation de la carte" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
