import {
  getDailyVocabulary,
  getRandomVocabulary,
} from "../../services/openai.service";
import { Telegraf } from "telegraf";

export default function registerWordCommand(bot: Telegraf) {
  bot.command("word", async (ctx) => {
    const word = await getDailyVocabulary();
    ctx.reply(
      `*Word:* ${word.word}\n*IPA:* ${word.ipa}\n*Meaning:* ${word.meaning}\n*Example:* ${word.example}`
    ),
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "Get Random Word", callback_data: "get_random_word" }],
          ],
        },
      };
  });
}
