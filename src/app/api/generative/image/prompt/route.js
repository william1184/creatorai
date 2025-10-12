
import { generateImagePrompt } from "@/utils/creator_agent";

export async function POST(request) {
    try {
        const body = await request.json();
        const { description, platform } = body;

        console.log("Image generation request received:", description, platform);

        if (!description || !platform) {
            return Response.json({ error: 'Description and platform are required' }, { status: 400 });
        }

        // gerar prompt para imagem
        const imagePrompt = await generateImagePrompt(description, platform);
        console.log(imagePrompt);
        console.log("Prompt created");
        return Response.json({ data: { imagePrompt: imagePrompt } }, { status: 201 });

    } catch (error) {
        console.error('Error in /api/generative/image:', error);
        return Response.json({ error: 'Failed to generate image prompt' }, { status: 500 });
    }
}