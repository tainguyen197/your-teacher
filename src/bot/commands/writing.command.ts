import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import {
  evaluateTranslation,
  generateWritingPrompt,
} from "../../services/openai.service";
import { sentenceStore as sentenceStoreTemp } from "../../db/store_temp";
import { dailyWritingJob } from "../../jobs/dailyWriting.job";
import { generateComment } from "../../services/comment.service";

export const registerWritingCommand = (bot: Telegraf) => {
  bot.command("writing", async (ctx) => {
    const result = await generateWritingPrompt();

    if (!result) {
      ctx.reply("No writing prompt found");
      return;
    }
    const { sentence } = result;

    sentenceStoreTemp.sentence = sentence;

    await ctx.reply(
      `_"${sentence}"_
      
      Reply with your translation!`,
      { parse_mode: "Markdown" }
    );
  });
};

export const registerEvaluateTranslationCommand = (bot: Telegraf) => {
  bot.on(message("text"), async (ctx) => {
    const translate = ctx.message.text;

    const result = await evaluateTranslation(
      sentenceStoreTemp.sentence,
      translate
    );

    if (!result) {
      ctx.reply("No evaluation found");
      return;
    }

    const { evaluation, feedback, improvements, score, suggested_translation } =
      result as {
        evaluation: string;
        feedback: string[];
        improvements: string[];
        score: number;
        suggested_translation: string;
      };

    // Visual score representation
    const scoreStars =
      "⭐".repeat(Math.round(score)) + "☆".repeat(10 - Math.round(score));
    const scoreEmoji = score >= 8 ? "🎉" : score >= 5 ? "👍" : "💪";

    // Format feedback as bullet points
    const feedbackList = Array.isArray(feedback)
      ? feedback.map((f) => `   • ${f}`).join("\n")
      : `   • ${feedback}`;

    // Format improvements as numbered list
    const improvementsList = Array.isArray(improvements)
      ? improvements.map((imp, i) => `   ${i + 1}. ${imp}`).join("\n")
      : `   1. ${improvements}`;

    const response = `📝 *Evaluation*

${scoreEmoji} *Score:* ${score}/10
${scoreStars}

📖 *Summary*
${evaluation}

💬 *Feedback*
${feedbackList}

🚀 *How to Improve*
${improvementsList}

✅ *Suggested Translation*
_"${suggested_translation}"_
`;
    ctx.reply(response, { parse_mode: "Markdown" });

    setTimeout(async () => {
      if (score < 8) {
        const comment = await generateComment("Not good enough, try again!");
        if (comment) {
          await ctx.reply(comment, { parse_mode: "Markdown" });
        }
      } else {
        const comment = await generateComment(
          "Good job!, next sentence will be sent to you soon!"
        );
        if (comment) {
          await ctx.reply(comment, { parse_mode: "Markdown" });
        }
      }
      await dailyWritingJob(bot);
    }, 10 * 1000); // 10 seconds
  });
};
