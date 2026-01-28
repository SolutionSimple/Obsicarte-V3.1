import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface GenerateCodesRequest {
  tier: 'roc' | 'saphir' | 'emeraude';
  quantity: number;
  batchName: string;
  resellerId?: string;
  notes?: string;
}

function generateActivationCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const segments = 2;
  const segmentLength = 4;

  const code = Array.from({ length: segments }, () => {
    return Array.from({ length: segmentLength }, () => {
      return chars[Math.floor(Math.random() * chars.length)];
    }).join('');
  }).join('-');

  return code;
}

function generateCardCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const segments = 3;
  const segmentLength = 4;

  const code = Array.from({ length: segments }, () => {
    return Array.from({ length: segmentLength }, () => {
      return chars[Math.floor(Math.random() * chars.length)];
    }).join('');
  }).join('-');

  return `OBSI-${code}`;
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

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Non autorisé" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Non autorisé" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { data: userRole } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!userRole || userRole.role !== "admin") {
      return new Response(
        JSON.stringify({ error: "Accès refusé - Admin uniquement" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const {
      tier,
      quantity,
      batchName,
      resellerId,
      notes,
    }: GenerateCodesRequest = await req.json();

    if (!tier || !quantity || !batchName || quantity <= 0 || quantity > 1000) {
      return new Response(
        JSON.stringify({ error: "Données invalides (max 1000 cartes par batch)" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { data: batch, error: batchError } = await supabase
      .from("activation_batches")
      .insert({
        batch_name: batchName,
        tier,
        cards_count: quantity,
        status: resellerId ? "assigned" : "ready",
        created_by: user.id,
        assigned_to_reseller_id: resellerId || null,
        notes: notes || null,
      })
      .select()
      .single();

    if (batchError) {
      throw batchError;
    }

    const cards = [];
    for (let i = 0; i < quantity; i++) {
      const cardCode = generateCardCode();
      const activationCode = generateActivationCode();

      cards.push({
        card_code: cardCode,
        activation_code: activationCode,
        tier,
        status: "pending",
        reseller_id: resellerId || null,
      });
    }

    const { data: createdCards, error: cardsError } = await supabase
      .from("cards")
      .insert(cards)
      .select();

    if (cardsError) {
      throw cardsError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        batchId: batch.id,
        cards: createdCards,
        message: `${quantity} cartes générées avec succès`,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in generate-activation-codes function:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Erreur lors de la génération des codes"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
