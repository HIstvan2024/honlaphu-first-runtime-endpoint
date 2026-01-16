const N8N_WEBHOOK = "https://n8n.srv1254407.hstgr.cloud/webhook/f522d3c0-0cef-45de-bf2b-1abec3d8cb1c";
const API_KEY = "honlaphutesztKulcs2626";

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }

    if (request.method !== "POST") {
      return new Response("POST only", { status: 405 });
    }

    try {
      const body = await request.json();
      const { message, sessionId, botId } = body;

      const response = await fetch(N8N_WEBHOOK, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": API_KEY
        },
        body: JSON.stringify({ message, sessionId, botId })
      });

      if (!response.ok) {
        return new Response(JSON.stringify({ 
          error: "N8N hiba", 
          status: response.status,
          statusText: response.statusText
        }), {
          status: response.status,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });
      }

      const data = await response.json();

      return new Response(JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });

    } catch (error) {
      return new Response(JSON.stringify({ 
        error: error.message,
        stack: error.stack 
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
  }
};
