import dotenv from "dotenv";
import { Telegraf } from "telegraf";
dotenv.config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

console.log(TELEGRAM_BOT_TOKEN);
if (!TELEGRAM_BOT_TOKEN) {
  throw new Error("TELEGRAM_BOT_TOKEN is not set in .env file");
}

const telegramClient = new Telegraf(TELEGRAM_BOT_TOKEN!);

console.log("Telegram client initialized");
export default telegramClient;
