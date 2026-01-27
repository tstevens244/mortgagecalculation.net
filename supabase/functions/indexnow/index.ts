import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const INDEXNOW_KEY = "mortgagecalculation2024indexnow";
const HOST = "mortgagecalculation.net";

// All URLs to submit
const ALL_URLS = [
  "/",
  "/refinance-calculator",
  "/house-affordability",
  "/mortgage-qualification-calculator",
  "/rent-or-buy",
  "/extra-mortgage-payments-calculator",
  "/bi-weekly-mortgage-payments-calculator",
  "/cash-out-refinance-calculator",
  "/second-mortgage-calculator",
  "/conventional-mortgage-calculator",
  "/fha-loan-calculator",
  "/va-loan-calculator",
  "/usda-loan-calculator",
  "/jumbo-loan-calculator",
  "/adjustable-rate-mortgage-calculator",
  "/heloc-calculator",
  "/mortgage-assistant",
];

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { urls } = await req.json().catch(() => ({ urls: null }));
    
    // Use provided URLs or submit all URLs
    const urlsToSubmit = urls || ALL_URLS;
    const fullUrls = urlsToSubmit.map((path: string) => 
      path.startsWith('http') ? path : `https://${HOST}${path}`
    );

    // Submit to Bing IndexNow API
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: `https://${HOST}/indexnow-key.txt`,
        urlList: fullUrls,
      }),
    });

    const status = response.status;
    let message = "";

    switch (status) {
      case 200:
        message = "URLs submitted successfully";
        break;
      case 202:
        message = "URLs accepted, pending processing";
        break;
      case 400:
        message = "Invalid request format";
        break;
      case 403:
        message = "Key not valid for this host";
        break;
      case 422:
        message = "Invalid URLs in request";
        break;
      case 429:
        message = "Too many requests, try again later";
        break;
      default:
        message = `Received status: ${status}`;
    }

    return new Response(
      JSON.stringify({
        success: status === 200 || status === 202,
        status,
        message,
        urlsSubmitted: fullUrls.length,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: unknown) {
    console.error("IndexNow error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
