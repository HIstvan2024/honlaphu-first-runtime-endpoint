const N8N_WEBHOOK = "https://n8n.srv1254407.hstgr.cloud/webhook/f522d3c0-0cef-45de-bf2b-1abec3d8cb1c";
const API_KEY = "apikulcs26sclukipa";

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
      const { message, sessionId, botId } = await request.json();

      const response = await fetch(N8N_WEBHOOK, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": API_KEY
        },
        body: JSON.stringify({ message, sessionId, botId })
      });

      const text = await response.text();

      // Chunk-ok összerakása
      let fullResponse = "";
      const lines = text.split("\n").filter(line => line.trim());
      
      for (const line of lines) {
        try {
          const chunk = JSON.parse(line);
          if (chunk.content) {
            fullResponse += chunk.content;
          }
        } catch {
          // Ha nem JSON, skip
        }
      }

      return new Response(JSON.stringify({ response: fullResponse }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
  }
};