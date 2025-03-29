
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.25.0";
import Stripe from "https://esm.sh/stripe@12.0.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Initialize Stripe
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY") || "";
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2022-11-15",
    });

    // Extract the token from the authorization header
    const token = authHeader.replace('Bearer ', '');
    
    // Verify the JWT
    const { data: { user }, error: verifyError } = await supabase.auth.getUser(token);
    
    if (verifyError || !user) {
      throw new Error('Invalid token or user not found');
    }
    
    // Parse the request body to get pricing info
    const body = await req.json();
    const billingCycle = body.billingCycle || 'monthly';
    
    // Get price ID based on billing cycle
    const priceId = billingCycle === 'yearly' 
      ? Deno.env.get("STRIPE_YEARLY_PRICE_ID") 
      : Deno.env.get("STRIPE_MONTHLY_PRICE_ID");
    
    if (!priceId) {
      throw new Error(`Price ID not found for billing cycle: ${billingCycle}`);
    }
    
    // Check if user already has a subscription
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (subscriptionError && subscriptionError.code !== 'PGRST116') {
      throw new Error('Error checking subscription');
    }
    
    // Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.get('origin')}/dashboard?success=true`,
      cancel_url: `${req.headers.get('origin')}/pricing?canceled=true`,
      client_reference_id: user.id,
      subscription_data: {
        trial_period_days: subscriptionData?.status === 'trialing' ? 0 : 7,
        metadata: {
          user_id: user.id,
        },
      },
    });

    // Return the session URL
    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 400,
      }
    );
  }
});
