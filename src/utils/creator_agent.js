import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI(process.env.GOOGLE_API_KEY);
const cache = new Map();

/**
 * Gera conteúdo de texto para um post de mídia social com base em uma descrição.
 * @param {string} description - A descrição ou tema para o post.
 * @param {string} platform - A platforma de mídia social (ex: 'instagram', 'facebook', 'linkedin').
 * @returns {Promise<string>} O texto gerado para o post.
 */
async function generateSocialMediaContent(description, platform) {
  console.info("GENERATE_SOCIAL_MEDIA_CONTENT", { description, platform: platform });

  if (!description || !platform) {
    throw new Error("Description and platform are required");
  }

  let key = `content-${description}-${platform}`;

  if (!cache.has(key)) {

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: `Você é um especialista em marketing digital e mídias sociais. Sua tarefa é criar um texto para um post para a platforma '${platform}. O texto deve ser cativante, profissional e otimizado para o público e formato da platforma especificada. Evite usar hashtags a menos que seja explicitamente solicitado. Seja direto e conciso. Saída: Somente o texto gerado.'`
      },
      contents: description,
    });

    console.info("LLM_USAGE (Text)", response.usageMetadata);
    console.log(cache);

    cache.set(key, response.text);
  }
  console.log(cache);
  return cache.get(key);
}

/**
 * Gera um prompt de imagem detalhado para ser usado por um modelo de IA de geração de imagem.
 * @param {string} description - A descrição ou tema para a imagem. 
 * @returns {Promise<string>} O prompt de imagem gerado.
 */
async function generateImagePrompt(description, platform) {

  console.info("GENERATE_IMAGE_PROMPT", { description, platform });

  if (!description || !platform) {
    throw new Error("Description and platform are required");
  }

  let key = `image-${description}-${platform}`;

  if (!cache.has(key)) {

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: `Você é um especialista em direção de arte para mídias sociais. Sua tarefa é criar um prompt para um modelo de geração de imagem. O prompt deve ser em inglês, sucinto, e descrever uma imagem visualmente atraente, profissional e moderna que se relacione o tema recebido para a seguinte platforma '${platform}'. O prompt deve focar em aspectos visuais, como composição, cores, iluminação e estilo. Exemplo de output: "A minimalist and clean flat lay of a healthy meal, with vibrant colors, top-down view, soft natural lighting, professional product photography style."`,
      },
      contents: description,
    });

    console.log({ "text": response.text });

    console.info("LLM_USAGE (Text)", response.usageMetadata);
    cache.set(key, response.text);
  }

  return cache.get(key);
}

/**
 * Gera uma imagem usando o modelo Imagen do Google Cloud Vertex AI.
 * @param {string} imagePrompt - O prompt detalhado para a geração da imagem.
 * @returns {Promise<Buffer | null>} O buffer da imagem gerada em formato PNG, ou null se não for gerada.
 */
async function generateImage(imagePrompt) {
  try {
    console.info("GENERATE_IMAGE_WITH_PROMPT", { imagePrompt });

    if (!imagePrompt) {
      throw new Error("imagePrompt is required");
    }

    // Para geração de imagem, usamos um modelo que pode chamar ferramentas.
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp-image-generation",
      contents: imagePrompt,
      config: {
        responseModalities: [
          "Text", "Image"
        ]
      }
    });

    console.info("LLM_USAGE (Image)", response.usageMetadata);

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const imageData = part.inlineData.data;
        return Buffer.from(imageData, "base64");
      }
    }
    return null; // Retorna null se nenhuma imagem for encontrada
  } catch (error) {
    console.error("Error in generateImage:", error);
    throw new Error("Não foi possível gerar a imagem. A chamada de função esperada não ocorreu.");
  }
}

export { generateImage, generateImagePrompt, generateSocialMediaContent };

