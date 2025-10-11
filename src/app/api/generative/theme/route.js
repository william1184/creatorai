import { generateSocialMediaContent } from "@/utils/creator_agent";

export async function POST(request) {
    try {
        const body = await request.json();
        const { description, platform } = body;

        if (!description || !platform) {
            return new Response(JSON.stringify({ error: 'Description and platform are required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const generatedText = await generateSocialMediaContent(description, platform);

        // Retornando um objeto JSON padrão, que é o que o Next.js faz por baixo dos panos com Response.json
        return new Response(JSON.stringify({ data: { text: generatedText } }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.error('Error in /api/generative/theme:', error);
        return new Response(JSON.stringify({ error: 'Failed to generate content' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}