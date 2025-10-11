
import { generateImage, generateImagePrompt } from "@/utils/creator_agent";
import { promises as fs } from 'fs';
import path from 'path';


export async function POST(request) {
    try {
        const body = await request.json();
        const { description, platform, imageId } = body;

        console.log("Image generation request received:", description, platform, imageId);

        if (!description || !platform || !imageId) {
            return Response.json({ error: 'Description, platform and imageId are required' }, { status: 400 });
        }

        // gerar prompt para imagem
        const imagePrompt = await generateImagePrompt(description, platform);
        
        console.log("Prompt created");

        const imageBuffer = await generateImage(imagePrompt);

        console.log("Image created");

        if (!imageBuffer) {
            throw new Error("Image buffer could not be generated.");
        }

        const filePath = path.join('/tmp', imageId);

        await fs.mkdir('/tmp', { recursive: true });
        await fs.writeFile(filePath, imageBuffer);
        
        return Response.json({ data: { imageId: imageId } });

    } catch (error) {
        console.error('Error in /api/generative/image:', error);
        return Response.json({ error: 'Failed to generate image prompt' }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const imageId = searchParams.get('id');

        if (!imageId) {
            return Response.json({ error: 'Image ID is required' }, { status: 400 });
        }

        const filePath = path.join('/tmp', imageId);

        const imageBuffer = await fs.readFile(filePath);

        return new Response(imageBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'image/png', // Ou o tipo de imagem correto (jpeg, etc.)
                'Cache-Control': 'public, max-age=31536000, immutable' // Cache forte
            },
        });

    } catch (error) {
        if (error.code === 'ENOENT') {
            // ENOENT = Error NO ENTry (file not found)
            return Response.json({ error: 'Image not found' }, { status: 404 });
        }
        console.error('Error in GET /api/generative/image:', error);
        return Response.json({ error: 'Failed to retrieve image' }, { status: 500 });
    }
}