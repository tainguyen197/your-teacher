import openaiClient from "../client/openai.client";
import { defaultTools } from "./openai.config";

const generateWritingPrompt = async () => {
  const response = await openaiClient.responses.create({
    model: "gpt-4o-mini",
    input: [
      {
        role: "system" as const,
        content: "You are a helpful english teacher assistant.",
      },
      {
        role: "user" as const,
        content:
          "Generate a sentence in vietnamese that user will translate to english in future. The sentence should be a B1 level sentence.",
      },
    ],
    tools: defaultTools,
  });

  if (response.output[0].type !== "function_call") {
    return null;
  }

  const sentence = JSON.parse(response.output[0].arguments).sentence;

  return {
    sentence,
    prompt: `Generate a writing prompt for the following sentence: ${sentence}`,
  };
};

const evaluateTranslation = async (sentence: string, translation: string) => {
  const response = await openaiClient.responses.create({
    model: "gpt-4o-mini",
    input: [
      {
        role: "system" as const,
        content:
          "You are a helpful English teacher. Evaluate the user's English translation of the Vietnamese sentence. Provide feedback on accuracy, grammar, and suggest improvements if needed. Be encouraging and educational.",
      },
      {
        role: "user" as const,
        content: `Original Vietnamese sentence: "${sentence}"\n\nUser's English translation: "${translation}"\n\nPlease evaluate this translation.`,
      },
    ],
    tools: defaultTools,
  });

  if (response.output[0].type !== "function_call") {
    return null;
  }

  return JSON.parse(response.output[0].arguments);
};

export { generateWritingPrompt, evaluateTranslation };
