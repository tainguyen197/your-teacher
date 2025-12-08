import { generateWritingPrompt } from "../services/openai.service";
import { Telegraf } from "telegraf";
import { sentenceStore as sentenceStoreTemp } from "../db/store_temp";

const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

export const dailyWritingJob = async (bot: Telegraf) => {
  const result = await generateWritingPrompt();
  if (!result) {
    return;
  }

  const { sentence } = result;
  sentenceStoreTemp.sentence = sentence;
  await bot.telegram.sendMessage(TELEGRAM_CHAT_ID, sentence, {
    parse_mode: "Markdown",
  });
};
