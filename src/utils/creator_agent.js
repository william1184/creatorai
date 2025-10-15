import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({});
const contentCache = new Map();
const promptCache = new Map();

const socialMediaConfig = {
  'facebook': { focus: 'Emotion + simplicity' },
  'instagram': { focus: 'Visual + relatable' },
  'linkedin': { focus: 'Insight + storytelling' },
}

/**
 * Gera conteúdo de texto para um post de mídia social com base em uma descrição.
 * @param {string} description - A descrição ou tema para o post.
 * @param {string} platform - A platforma de mídia social (ex: 'instagram', 'facebook', 'linkedin').
 * @returns {Promise<string>} O texto gerado para o post.
 */
async function generateSocialMediaContent(description, platform, companyName, category) {
  console.info("GENERATE_SOCIAL_MEDIA_CONTENT", { description, platform, companyName, category });

  if (!description || !platform) {
    throw new Error("Description and platform are required");
  }

  const cacheKey = `content::${platform}::${description}::${companyName}::${category}`;
  if (contentCache.has(cacheKey)) {
    console.info('CACHE HIT: generateSocialMediaContent', { description, platform, companyName, category });
    return contentCache.get(cacheKey);
  }

  const companyContext = companyName ? `para a empresa '${companyName}'` : '';
  const categoryContext = category ? `que atua na categoria de '${category}'` : '';
  const contextString = [companyContext, categoryContext].filter(Boolean).join(' ');

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: `Você é um especialista em marketing digital e mídias sociais. Sua tarefa é criar um texto para um post para a platforma '${platform}' ${contextString}.
      O texto deve ser **${socialMediaConfig[platform].focus}** , profissional e otimizado para o público e formato da platforma especificada. Evite usar hashtags a menos que seja explicitamente solicitado. 
      Output: Somente o texto gerado`
    },
    contents: description
  });

  console.info("LLM_USAGE (Text)", response.usageMetadata);
  contentCache.set(cacheKey, response.text);

  return contentCache.get(cacheKey);
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

  const cacheKey = `prompt::${platform}::${description}`;
  if (promptCache.has(cacheKey)) {
    console.info('CACHE HIT: generateImagePrompt', { description, platform });
    return promptCache.get(cacheKey);
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: `Você é um especialista em direção de arte para mídias sociais. Sua tarefa é criar um prompt para um modelo de geração de imagem. 
    O prompt deve ser em inglês, sucinto, e descrever uma imagem visualmente atraente, profissional e moderna que se relacione o tema recebido para a seguinte platforma '${platform}'. 
    O prompt deve focar em aspectos visuais, como composição, cores, iluminação e estilo. Exemplo de output: "A minimalist and clean flat lay of a healthy meal, with vibrant colors, top-down view, 
    soft natural lighting, professional product photography style."`
    },
    contents: description
  });

  console.info("LLM_USAGE (Image Prompt)", response.usageMetadata);
  promptCache.set(cacheKey, response.text);

  return promptCache.get(cacheKey);
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
