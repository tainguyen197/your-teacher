import { Response } from "openai/resources/responses/responses";

export const isToolCall = (response: Response) => {
  return response.output[0].type === "function_call";
};
