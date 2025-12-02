import { Markup, Telegraf } from "telegraf";

export default function registerStartCommand(bot: Telegraf) {
  bot.start((ctx) => {
    ctx.reply("Hello, world from start command!");
  });
}
