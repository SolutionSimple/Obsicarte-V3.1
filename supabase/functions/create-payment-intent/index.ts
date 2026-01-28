import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface CreatePaymentIntentRequest {
  tier: 'roc' | 'saphir' | 'emeraude';
  quantity: number;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  shippingAddress: {
    street: string;
    city: string;
    postal_code: string;
    country: string;
  };
}

const tierPrices = {
  roc: 2990,
  saphir: 4990,
  emeraude: 7990,
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");

    if (!stripeSecretKey) {
      return new Response(
        JSON.stringify({ error: "Stripe n'est pas configuré" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const {
      tier,
      quantity,
      customerEmail,
      customerName,
      customerPhone,
      shippingAddress,
    }: CreatePaymentIntentRequest = await req.json();

    if (!tier || !quantity || !customerEmail || !customerName || !shippingAddress) {
      return new Response(
        JSON.stringify({ error: "Données manquantes" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const amount = tierPrices[tier] * quantity;

    const paymentIntentData = {
      amount,
      currency: "eur",
      automatic_payment_methods: { enabled: true },
      metadata: {
        tier,
        quantity: quantity.toString(),
        customerEmail,
        customerName,
      },
    };

    const response = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(paymentIntentData as any).toString(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Erreur lors de la création du paiement");
    }

    const paymentIntent = await response.json();

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in create-payment-intent function:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Erreur lors de la création du paiement"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
