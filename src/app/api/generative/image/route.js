
import { generateImage, generateImagePrompt } from "@/utils/creator_agent";
import { promises as fs } from 'fs';
import path from 'path';


export async function POST(request) {
    try {
        const body = await request.json();
        const { description, platform, imageId } = body;

        console.log("Image generation request received:", description, platform, imageId);

        if (!description || !platform || !imageId) {
            return new Response(JSON.stringify({ error: 'Description, platform and imageId are required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
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
        
        return new Response(JSON.stringify({ data: { imageId: imageId } }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.error('Error in /api/generative/image:', error);
        return new Response(JSON.stringify({ error: 'Failed to generate image prompt' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const imageId = searchParams.get('id');

        if (!imageId) {
            return new Response(JSON.stringify({ error: 'Image ID is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
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
            return new Response(JSON.stringify({ error: 'Image not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
        }
        console.error('Error in GET /api/generative/image:', error);
        return new Response(JSON.stringify({ error: 'Failed to retrieve image' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}