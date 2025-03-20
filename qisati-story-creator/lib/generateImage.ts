//lib/generateImage:
// /lib/generateImage.ts

export type ImageGenerationOptions = {
  negativePrompt?: string;
  model?: string;
  aspectRatio?: "square" | "landscape" | "smallPortrait" | "portrait" | "wide";
  highResolution?: boolean;
  images?: number;
  steps?: number;
  initialImageMode?: "color" | "structure" | "depth" | "scribble";
  initialImageUrl?: string;
  initialImageEncoded?: string;
  initialImageStrength?: number;
};

export const generateImage = async (
  prompt: string,
  options: ImageGenerationOptions = {}
) => {
  // Build the request payload with default values if not provided.
  const payload = {
    prompt, // required: image(s) description (length between 3 and 765)
    negativePrompt: options.negativePrompt || "",
    model: options.model || "lyra",
    aspectRatio: options.aspectRatio || "square",
    highResolution: options.highResolution ?? false,
    images: options.images || 4,
    steps: options.steps || 20,
    initialImageMode: options.initialImageMode || "color",
    ...(options.initialImageUrl && {
      initialImageUrl: options.initialImageUrl,
    }),
    ...(options.initialImageEncoded && {
      initialImageEncoded: options.initialImageEncoded,
    }),
    ...(options.initialImageStrength !== undefined && {
      initialImageStrength: options.initialImageStrength,
    }),
  };

  // Call the StarryAI image creation endpoint.
  const response = await fetch("https://api.starryai.com/creations/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": process.env.STARRYAI_API_KEY || "",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Image generation failed: ${errorText}`);
  }

  return response.json();
};
