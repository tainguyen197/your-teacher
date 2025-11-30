import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
dotenv.config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN!, { polling: true });

function isAuthorized(chatId: string) {
  return chatId.toString() === TELEGRAM_CHAT_ID;
}

bot.onText(/^\/start$/, (msg) => {
  const chatId = msg.chat.id.toString();

  if (!isAuthorized(chatId)) {
    return;
  }

  bot.sendMessage(chatId, "Hello, world!");
});
