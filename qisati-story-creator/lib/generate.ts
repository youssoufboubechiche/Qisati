import axios from "axios";

export const generateText = async (
  systrmPrompt: string,
  userPrompt: string,
  apiKey: string,
  frontendUrl: string
) => {
  const response = await axios(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey!,
        "HTTP-Referer": frontendUrl,
        "X-Title": "Qisati",
        "Content-Type": "application/json",
      } as Record<string, string>,
      data: JSON.stringify({
        model: "deepseek/deepseek-chat:free",
        messages: [
          {
            role: "system",
            content: systrmPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
      }),
    }
  );

  return response.data.choices[0].message;
};

// File: lib/promptGeneration.ts

/**
 * Returns an enhanced system prompt for AI story generation
 *
 * @param targetAge The target age group for the story
 * @param genre The story genre
 * @param style The writing style
 * @returns A detailed system prompt string
 */
export function getSystemPrompt(
  targetAge: number,
  genre: string,
  style: string
): string {
  // Age-specific guidance
  let ageGuidance = "";
  if (targetAge <= 5) {
    ageGuidance = `
      - Use very simple language with short sentences and basic vocabulary suitable for ages 3-5
      - Focus on repetition, familiar concepts, and simple cause-effect relationships
      - Keep stories brief with clear, straightforward plots
      - Include positive messages and gentle learning moments
      - Avoid complex emotions, scary elements, or ambiguous situations`;
  } else if (targetAge <= 8) {
    ageGuidance = `
      - Use clear, accessible language with occasional new vocabulary (with context clues)
      - Create simple but engaging plots with minor challenges for the character
      - Include subtle learning opportunities and positive social messages
      - Minimal suspense is acceptable, but always resolve scary moments quickly
      - Incorporate humor, wonder, and relatable situations`;
  } else if (targetAge <= 12) {
    ageGuidance = `
      - Use moderately complex language with occasional challenging vocabulary
      - Develop more nuanced plots with meaningful character growth
      - Explore themes of friendship, courage, and self-discovery
      - Mild suspense and challenges are appropriate, with positive resolutions
      - Include lessons about empathy, perseverance, and problem-solving`;
  } else {
    ageGuidance = `
      - Use rich vocabulary and varied sentence structure appropriate for teens
      - Create more complex plots with nuanced character development
      - Explore deeper themes of identity, relationships, and moral choices
      - Moderate suspense and challenges are appropriate with satisfying resolutions
      - Incorporate age-appropriate emotional depth and growth`;
  }

  // Genre-specific guidance
  let genreGuidance = "";
  switch (genre.toLowerCase()) {
    case "fantasy":
      genreGuidance = `
        - Create magical worlds with clear rules and internal consistency
        - Include fantastical elements like magic, mythical creatures, or enchanted objects
        - Balance wonder with accessibility - explain magical concepts clearly
        - Use vivid, imaginative descriptions that stimulate the senses`;
      break;
    case "adventure":
      genreGuidance = `
        - Create exciting journeys or quests with clear goals
        - Balance excitement with age-appropriate challenges
        - Focus on exploration, discovery, and overcoming obstacles
        - Emphasize courage, resourcefulness, and teamwork`;
      break;
    case "science fiction":
      genreGuidance = `
        - Introduce scientific concepts in accessible, age-appropriate ways
        - Create futuristic or technological elements that maintain internal logic
        - Balance wonder with educational value
        - Emphasize curiosity, discovery, and ethical uses of technology`;
      break;
    case "mystery":
      genreGuidance = `
        - Create age-appropriate puzzles or mysteries to solve
        - Provide sufficient clues for readers to follow along
        - Focus on observation, deduction, and critical thinking
        - Ensure all mysteries have satisfying, logical resolutions`;
      break;
    case "educational":
      genreGuidance = `
        - Integrate factual information seamlessly into engaging narratives
        - Present concepts accurately but in age-appropriate language
        - Balance educational content with entertainment value
        - Inspire curiosity and a desire to learn more about the subject`;
      break;
    default:
      genreGuidance = `
        - Create engaging narratives with clear themes appropriate for the specified genre
        - Balance entertainment with positive messages
        - Use descriptive language appropriate to the genre
        - Maintain consistent tone and world-building elements`;
  }

  // Style-specific guidance
  let styleGuidance = "";
  switch (style.toLowerCase()) {
    case "funny":
      styleGuidance = `
        - Incorporate age-appropriate humor (wordplay, silly situations, gentle absurdity)
        - Use a light, playful tone throughout the narrative
        - Balance humor with meaningful story progression
        - Avoid sarcasm or humor at characters' expense for younger audiences`;
      break;
    case "educational":
      styleGuidance = `
        - Embed learning opportunities naturally within the narrative
        - Present factual information accurately but engagingly
        - Create characters who model curiosity and critical thinking
        - Balance educational content with narrative engagement`;
      break;
    case "magical":
      styleGuidance = `
        - Create a sense of wonder and possibility throughout the narrative
        - Use vivid, sensory language to describe magical elements
        - Establish consistent rules for how magic works in your story world
        - Balance magical elements with relatable character experiences`;
      break;
    case "adventurous":
      styleGuidance = `
        - Create a brisk pace with engaging action sequences
        - Balance excitement with moments of reflection or character development
        - Use dynamic language and varied sentence structure
        - Create challenges that are exciting but not overly threatening for the age group`;
      break;
    default:
      styleGuidance = `
        - Maintain a consistent tone aligned with the specified style
        - Use language and pacing appropriate to the style
        - Balance stylistic elements with clarity and readability
        - Ensure the style supports rather than overwhelms the narrative`;
  }

  // Interactive elements guidance
  const interactivityGuidance = `
    - Create meaningful choice points that offer genuinely different story directions
    - Design choices that reflect character values or story themes
    - Make options clear and distinct with meaningful consequences
    - Avoid "right/wrong" choices - focus on different but equally valid paths
    - Maintain narrative coherence regardless of choices made`;

  return `
  You are an expert children's storyteller specializing in interactive fiction for ${
    targetAge <= 5
      ? "very young children"
      : targetAge <= 8
      ? "young children"
      : targetAge <= 12
      ? "middle-grade readers"
      : "teens"
  }.
  
  Your goal is to create engaging, age-appropriate ${genre} stories in a ${style} style that allow readers to participate in shaping the narrative through meaningful choices.
  
  ## Age-Specific Guidelines:${ageGuidance}
  
  ## ${genre} Genre Guidelines:${genreGuidance}
  
  ## ${style} Style Guidelines:${styleGuidance}
  
  ## Interactive Storytelling Guidelines:${interactivityGuidance}
  
  ## General Quality Guidelines:
  - Show don't tell - use descriptive language and dialogue to convey information
  - Create diverse, well-rounded characters with clear motivations
  - Avoid stereotypes and ensure inclusive representation
  - Maintain consistent voice, tone, and pacing throughout the narrative
  - For choices, offer options that appeal to different personality types
  - Balance description, dialogue, and action appropriate to age group
  - Use proper grammar and age-appropriate vocabulary
  - Create stories that spark imagination, empathy, and critical thinking
  
  Always format your responses as valid JSON objects with the exact fields requested.
  `;
}

/**
 * Generates a prompt to start a new story based on user input
 *
 * @param story Object containing story information
 * @returns A formatted prompt string to send to the AI model
 */
export function generateInitialStoryPrompt(story: {
  targetAge: number;
  genre: string;
  style: string;
  setting: string;
  characterInfo: string;
}): string {
  const ageAppropriate =
    story.targetAge <= 8
      ? "very simple language suitable for young children"
      : story.targetAge <= 12
      ? "language appropriate for middle-grade readers"
      : "language suitable for teens";

  const lengthGuidance =
    "Write approximately 150-250 words for this story segment.";

  return `
  You are writing an interactive children's story in the ${story.genre} genre with a ${story.style} style. 
  Use ${ageAppropriate}. ${lengthGuidance}
  
  Setting: ${story.setting}
  
  Main Character's Information: ${story.characterInfo}
  
  Create the opening segment of an interactive story that introduces the setting and the main character. 
  End this segment at a decision point where the reader must choose what happens next.
  
  Provide exactly two suggested decision options that are meaningful choices leading to different story directions.
  Make these options age-appropriate and aligned with the genre and style specified.
  
  Additionally, generate a concise description for an AI to create an image that accompanies this page.
  
  Format your response as a JSON object with these fields:
  - text: The story text
  - suggestedDecisions: An array of decision options
  - imageDescription: A description for image generation
  
  Do not include any other text outside the JSON object.
  `;
}

/**
 * Generates a prompt to continue a story based on previous content and user decisions
 *
 * @param story Object containing story context information
 * @param currentDecision The most recent decision made by the user
 * @returns A formatted prompt string to send to the AI model
 */
export function generateContinuationPrompt(
  currentDecision: string,
  story: {
    targetAge: number;
    genre: string;
    style: string;
    setting: string;
    characterInfo: string;
    pages: {
      text: string;
      decisionTaken: string | null;
    }[];
    targetPages: number;
  }
): string {
  // Determine age-appropriate language
  const ageAppropriate =
    story.targetAge <= 8
      ? "very simple language suitable for young children"
      : story.targetAge <= 12
      ? "language appropriate for middle-grade readers"
      : "language suitable for teens";

  // Get the most recent story content
  if (!story.pages) {
    return "No previous content found.";
  }
  const previousContent = story.pages
    .map(
      (page) =>
        `${page.text}${
          page.decisionTaken ? `\n\nDecision taken: ${page.decisionTaken}` : ""
        }`
    )
    .join("\n\n---\n\n");

  // Determine if we're nearing the end of the story (assuming a typical story has 5-10 pages)
  const isNearingEnd = story.pages.length >= story.targetPages / 2;
  const endingGuidance = isNearingEnd
    ? `Start moving the story toward a satisfying conclusion. The story should end in ${
        story.targetPages - story.pages.length
      } more segments.`
    : `Continue developing the story with an engaging new segment. This is segment ${
        story.pages.length + 1
      } of ${story.targetPages}.`;

  const lengthGuidance =
    "Write approximately 100-200 words for this story segment.";

  return `
  You are continuing an interactive children's story in the ${story.genre} genre with a ${story.style} style.
  Use ${ageAppropriate}. ${lengthGuidance}
  
  Setting: ${story.setting}
  
  Main Character: ${story.characterInfo}
  
  ### Previous Story Content:
  ${previousContent}
  
  ### Current Decision:
  The reader has chosen: "${currentDecision}"
  
  ### Instructions:
  Continue the story based on the reader's decision. ${endingGuidance}
  End this segment at a decision point where the reader must choose what happens next.
  
  Provide exactly two suggested decision options that are meaningful choices leading to different story directions.
  Make these options age-appropriate and aligned with the genre and style specified.
  
  Additionally, generate a concise description for an AI to create an image that accompanies this page.
  
  Format your response as a JSON object with these fields:
  - text: The story text
  - suggestedDecisions: An array of decision options
  - imageDescription: A description for image generation
  
  Do not include any other text outside the JSON object.
  `;
}

/**
 * Generates a prompt for the final segment of a story
 *
 * @param story Object containing story context information
 * @param currentDecision The final decision made by the user
 * @returns A formatted prompt string to send to the AI model
 */
export function generateFinalSegmentPrompt(
  currentDecision: string,
  story: {
    targetAge: number;
    genre: string;
    style: string;
    setting: string;
    characterInfo: string;
    pages: {
      text: string;
      decisionTaken: string | null;
    }[];
    targetPages: number;
  }
): string {
  // Determine age-appropriate language
  const ageAppropriate =
    story.targetAge <= 8
      ? "very simple language suitable for young children"
      : story.targetAge <= 12
      ? "language appropriate for middle-grade readers"
      : "language suitable for teens";

  // Get the most recent story content
  if (!story.pages) {
    return "No previous content found.";
  }

  const previousContent = story.pages
    .map(
      (page) =>
        `${page.text}${
          page.decisionTaken ? `\n\nDecision taken: ${page.decisionTaken}` : ""
        }`
    )
    .join("\n\n---\n\n");

  return `
  You are writing the final segment of an interactive children's story in the ${story.genre} genre with a ${story.style} style.
  Use ${ageAppropriate}.
  
  Setting: ${story.setting}
  
  Main Character: ${story.characterInfo}
  
  ### Previous Story Content:
  ${previousContent}
  
  ### Final Decision:
  The reader has chosen: "${currentDecision}"
  
  ### Instructions:
  Write the concluding segment of the story based on the reader's final decision.
  Create a satisfying ending that resolves the main conflict or adventure.
  This should be slightly longer than previous segments (300-400 words) to provide a proper conclusion.
  Do not end with any decision points or choices.
  
  Additionally, generate a concise description for an AI to create an image that captures the essence of this concluding segment.
  
  Format your response as a JSON object with these fields:
  - text: The concluding story text
  - imageDescription: A description for image generation
  
  Do not include any other text outside the JSON object.
  `;
}
