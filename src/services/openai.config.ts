import { ResponseCreateParamsNonStreaming } from "openai/resources/responses/responses";

export const defaultTools: ResponseCreateParamsNonStreaming["tools"] = [
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
