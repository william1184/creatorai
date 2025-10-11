
export async function POST(request) {
    try {
        const body = await request.json();
        const { description, platform } = body;

        if (!description || !platform) {
            return Response.json({ error: 'Description and platform are required' }, { status: 400 });
        }

    } catch (error) {
        console.error('Error in /api/generative/theme:', error);
        return Response.json({ error: 'Failed to generate content' }, { status: 500 });
    }
}