import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!query || query.trim() === "") {
      return new Response(
        JSON.stringify({ isCarRelated: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          {
            role: "system",
            content: `You are a classifier that determines if a user query is related to cars, vehicles, or automotive topics. 
            
A query is car-related if it mentions:
- Car brands, models, types (sedan, SUV, truck, etc.)
- Car features (fuel economy, horsepower, seats, cargo space, etc.)
- Car buying, selling, or recommendations
- Driving, commuting, road trips
- Vehicle maintenance, parts, or accessories
- Price ranges or budgets for vehicles
- Any automotive-related preferences

Respond with ONLY "yes" if car-related, or "no" if not car-related. Nothing else.`
          },
          {
            role: "user",
            content: query
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required" }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      // Default to allowing the query if AI fails
      return new Response(
        JSON.stringify({ isCarRelated: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content?.toLowerCase().trim();
    const isCarRelated = answer === "yes";

    return new Response(
      JSON.stringify({ isCarRelated }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Validation error:", error);
    // Default to allowing the query if there's an error
    return new Response(
      JSON.stringify({ isCarRelated: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
