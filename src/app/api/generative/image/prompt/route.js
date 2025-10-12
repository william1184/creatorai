
import { generateImagePrompt } from "@/utils/creator_agent";

export async function POST(request) {
    try {
        const body = await request.json();
        const { description, platform } = body;

        console.log("Image generation request received:", description, platform);

        if (!description || !platform) {
            return new Response(JSON.stringify({ error: 'Description, platform are required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        // gerar prompt para imagem
        const imagePrompt = await generateImagePrompt(description, platform);
        console.log(imagePrompt);
        console.log("Prompt created");
        return new Response(JSON.stringify({ data: { imagePrompt: imagePrompt } }), { status: 201, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.error('Error in /api/generative/image:', error);
        return new Response(JSON.stringify({ error: 'Failed to generate image prompt' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}