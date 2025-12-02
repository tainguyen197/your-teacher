import openaiClient from "../client/openai.client";

const defaultTools = [
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
];

const defaultInputMessages = {
  role: "user" as const,
  content: "Generate a daily vocabulary word above B2 level",
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
      input: [defaultInputMessages],
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

export { generateText, getRandomVocabulary, getDailyVocabulary };
