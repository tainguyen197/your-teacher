import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import {
  evaluateTranslation,
  generateWritingPrompt,
} from "../../services/openai.service";

let writingSentence = "";

export const registerWritingCommand = (bot: Telegraf) => {
  bot.command("writing", async (ctx) => {
    const result = await generateWritingPrompt();

    if (!result) {
      ctx.reply("No writing prompt found");
      return;
    }
    const { sentence, prompt } = result;

    writingSentence = sentence;

    await ctx.reply(
      `📝 *Writing Exercise*
      
      Translate this sentence to English:
      
      _"${sentence}"_
      
      Reply with your translation!`,
      { parse_mode: "Markdown" }
    );
  });
};

export const registerEvaluateTranslationCommand = (bot: Telegraf) => {
  bot.on(message("text"), async (ctx) => {
    const translate = ctx.message.text;

    const result = await evaluateTranslation(writingSentence, translate);

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
  });
};
