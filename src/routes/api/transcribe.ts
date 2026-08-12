import { createFileRoute } from "@tanstack/react-router";

const MAX_BYTES = 20 * 1024 * 1024;

export const Route = createFileRoute("/api/transcribe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Anciennement routé via le gateway IA de Lovable (LOVABLE_API_KEY).
        // Hors Lovable, on appelle directement l'API OpenAI.
        // -> crée une clé sur https://platform.openai.com/api-keys
        // -> ajoute OPENAI_API_KEY dans les variables d'env Vercel.
        const apiKey = process.env["OPENAI_API_KEY"];
        if (!apiKey) {
          return new Response(JSON.stringify({ error: "Transcription indisponible" }), {
            status: 503,
            headers: { "content-type": "application/json" },
          });
        }

        const form = await request.formData();
        const file = form.get("file");
        if (!(file instanceof File) || file.size < 1024) {
          return new Response(
            JSON.stringify({ error: "Enregistrement vide ou trop court." }),
            { status: 400, headers: { "content-type": "application/json" } },
          );
        }
        if (file.size > MAX_BYTES) {
          return new Response(
            JSON.stringify({ error: "Enregistrement trop long, découpe ta récitation." }),
            { status: 413, headers: { "content-type": "application/json" } },
          );
        }

        const upstream = new FormData();
        upstream.append("model", "gpt-4o-transcribe");
        upstream.append("file", file, "recitation.wav");
        upstream.append("language", "ar");

        const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
          method: "POST",
          headers: { Authorization: `Bearer ${apiKey}` },
          body: upstream,
        });

        const body = await res.text();
        if (!res.ok) {
          console.error(`Transcription failed [${res.status}]: ${body}`);
          return new Response(JSON.stringify({ error: body || "Échec de la transcription" }), {
            status: res.status,
            headers: { "content-type": "application/json" },
          });
        }

        return new Response(body, { headers: { "content-type": "application/json" } });
      },
    },
  },
});
