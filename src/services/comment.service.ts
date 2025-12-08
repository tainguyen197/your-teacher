import openaiClient from "../client/openai.client";

const generateComment = async (sentence: string) => {
  const response = await openaiClient.responses.create({
    model: "gpt-4o-mini",
    input: [
      {
        role: "system" as const,
        content: "You are a helpful english teacher assistant.",
      },
      {
        role: "user" as const,
        content: `Generate a comment for the following result: "${sentence}", should be a short comment, max 100 characters`,
      },
    ],
  });

  return response.output[0].type === "message" &&
    response.output[0].content[0].type === "output_text"
    ? response.output[0].content[0].text
    : null;
};

export { generateComment };
