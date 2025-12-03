import { ResponseCreateParamsNonStreaming } from "openai/resources/responses/responses";
import openaiClient from "../client/openai.client";

const defaultTools: ResponseCreateParamsNonStreaming["tools"] = [
  {
    type: "function" as const,
    name: "get_daily_vocabulary",
    description: "Get a daily vocabulary word above B2 level",
    parameters: {
      type: "object",
      properties: {
        word: { type: "string", description: "The daily vocabulary word" },
        ipa: {
          type: "string",
          description: "The International Phonetic Alphabet (IPA) of the word",
        },
        meaning: { type: "string", description: "The meaning of the word" },
        example: {
          type: "string",
          description: "An example sentence using the word",
        },
      },
      required: ["word", "ipa", "meaning", "example"],
      additionalProperties: false,
    },
    strict: true,
  },
  {
    type: "function" as const,
    name: "generate_b1_sentence",
    description:
      "Generate a sentence in vietnamese that user will translate to english in future. The sentence should be a B1 level sentence.",
    parameters: {
      type: "object",
      properties: {
        sentence: { type: "string", description: "The vietnamese sentence" },
      },
      required: ["sentence"],
      additionalProperties: false,
    },
    strict: true,
  },
  {
    type: "function" as const,
    name: "evaluate_translation",
    description:
      "Evaluate the user's English translation of the Vietnamese sentence. Provide feedback on accuracy, grammar, and suggest improvements if needed. Be encouraging and educational.",
    parameters: {
      type: "object",
      properties: {
        score: {
          type: "number",
          description: "The score of the translation out of 10",
        },
        suggested_translation: {
          type: "string",
          description:
            "A correct/ideal English translation of the original sentence",
        },
        evaluation: {
          type: "string",
          description:
            "Brief overall evaluation of the translation (1-2 sentences)",
        },
        feedback: {
          type: "array",
          description: "List of specific feedback points",
          items: { type: "string" },
        },
        improvements: {
          type: "array",
          description: "List of specific improvement suggestions",
          items: { type: "string" },
        },
      },
      required: [
        "score",
        "suggested_translation",
        "evaluation",
        "feedback",
        "improvements",
      ],
      additionalProperties: false,
    },
    strict: true,
  },
];

const systemMessage = {
  role: "user" as const,
  content:
    "You are a helpful english teacher assistant. Generate a sentence in vietnamese that user will translate to english in future. The sentence should be a B1 level sentence.",
};

const generateText = async (prompt: string) => {
  const response = await openaiClient.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });
  return response.choices[0].message.content;
};

const getRandomVocabulary = async (): Promise<string> => {
  const response = await openaiClient.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content:
          "Generate a random vocabulary word above B2 level. Return only the word, no other text.",
      },
    ],
  });

  return response.choices[0].message.content ?? "No vocabulary word found";
};

const getDailyVocabulary = async (): Promise<any> => {
  try {
    const response = await openaiClient.responses.create({
      model: "gpt-4o-mini",
      input: [systemMessage],
      tools: defaultTools,
    });

    if (response.output[0].type !== "function_call") {
      return "No daily vocabulary word found";
    }

    return JSON.parse(response.output[0].arguments);
  } catch (error) {
    console.error(error);
    return "No daily vocabulary word found";
  }
};

const generateWritingPrompt = async () => {
  const response = await openaiClient.responses.create({
    model: "gpt-4o-mini",
    input: [systemMessage],
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

  console.log(response.output[0]);

  if (response.output[0].type !== "function_call") {
    return null;
  }

  return JSON.parse(response.output[0].arguments);
};

export {
  generateText,
  getRandomVocabulary,
  getDailyVocabulary,
  generateWritingPrompt,
  evaluateTranslation,
};
