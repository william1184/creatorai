
import { generateImage } from "@/utils/creator_agent";
import { promises as fs } from 'fs';
import path from 'path';


export async function POST(request) {
    try {
        const body = await request.json();
        const { imagePrompt, imageId } = body;

        console.log("Image generation request received:", imagePrompt, imageId);

        if (!imagePrompt || !imageId) {
            return Response.json({ error: 'imagePrompt and imageId are required' }, { status: 400 });
        }

        const imageBuffer = await generateImage(imagePrompt);

        if (!imageBuffer) {
            throw new Error("Image buffer could not be generated.");
        }

        const filePath = path.join('/tmp', imageId);

        await fs.mkdir('/tmp', { recursive: true });
        await fs.writeFile(filePath, imageBuffer);
        
        return Response.json({ data: { imageId: imageId } }, { status: 201 });

    } catch (error) {
        console.error('Error in /api/generative/image:', error);
        return Response.json({ error: 'Failed to generate image' }, { status: 500 });
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