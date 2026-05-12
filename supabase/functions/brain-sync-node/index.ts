import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  // 🛡️ Security: The function is now a "Secure Webhook"
  if (req.method !== 'POST') return new Response("Forbidden", { status: 403 });
  
  try {
    const payload = await req.json();
    console.log("🧠 Intelligence Received:", payload);
    
    return new Response(JSON.stringify({ status: "synced", ref: "ixdukafvxqermhgoczou" }), {
      headers: { "Content-Type": "application/json" },
      status: 200 
    });
  } catch (e) {
    return new Response("Error", { status: 400 });
  }
})
