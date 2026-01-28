import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

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

function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');

  return `ORD-${year}${month}${day}-${random}`;
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

    const signature = req.headers.get("stripe-signature");
    const body = await req.text();

    let event;
    try {
      event = JSON.parse(body);
    } catch (err) {
      return new Response(
        JSON.stringify({ error: "Invalid payload" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const { tier, quantity, customerEmail, customerName } = paymentIntent.metadata;

      const orderNumber = generateOrderNumber();

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          order_number: orderNumber,
          customer_email: customerEmail,
          customer_name: customerName,
          customer_phone: null,
          shipping_address: {},
          tier,
          quantity: parseInt(quantity),
          total_amount: paymentIntent.amount,
          status: "confirmed",
          payment_status: "succeeded",
          stripe_payment_intent_id: paymentIntent.id,
          stripe_customer_id: paymentIntent.customer,
          confirmed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (orderError) {
        throw orderError;
      }

      const cards = [];
      for (let i = 0; i < parseInt(quantity); i++) {
        const cardCode = generateCardCode();
        const activationCode = generateActivationCode();

        cards.push({
          card_code: cardCode,
          activation_code: activationCode,
          tier,
          status: "pending",
          order_id: order.id,
        });
      }

      const { error: cardsError } = await supabase
        .from("cards")
        .insert(cards);

      if (cardsError) {
        throw cardsError;
      }

      const { data: existingUser } = await supabase.auth.admin.getUserByEmail(customerEmail);

      if (existingUser?.user) {
        const userId = existingUser.user.id;

        const { error: subError } = await supabase.rpc('create_subscription_from_card', {
          p_user_id: userId,
          p_card_tier: tier,
          p_stripe_customer_id: paymentIntent.customer,
          p_duration_months: 12
        });

        if (subError) {
          console.error('Error creating subscription:', subError);
        } else {
          console.log(`Created subscription for user ${userId} with tier ${tier}`);
        }

        const { error: updateOrderError } = await supabase
          .from('orders')
          .update({ user_id: userId })
          .eq('id', order.id);

        if (updateOrderError) {
          console.error('Error updating order with user_id:', updateOrderError);
        }
      } else {
        console.log(`User with email ${customerEmail} not found - subscription will be created after signup`);
      }

      console.log(`Created order ${orderNumber} with ${quantity} cards`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in stripe-webhook function:", error);
    return new Response(
      JSON.stringify({ error: "Webhook processing failed" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
