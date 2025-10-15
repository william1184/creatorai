import { generateSocialMediaContent } from "@/utils/creator_agent";

export async function POST(request) {
    try {
        const body = await request.json();
        const { description, platform, company_name, category } = body;

        if (!description || !platform) {
            return Response.json({ error: 'Description and platform are required' }, { status: 400 });
        }

        const generatedText = await generateSocialMediaContent(description, platform, company_name, category);

        // Retornando um objeto JSON padrão, que é o que o Next.js faz por baixo dos panos com Response.json
        return Response.json({ data: { text: generatedText } }, { status: 201 });
    } catch (error) {
        console.error('Error in /api/generative/theme:', error);
        return Response.json({ error: 'Failed to generate content' }, { status: 500 });
    }
}