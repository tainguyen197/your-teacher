import dotenv from "dotenv";
import { Telegraf } from "telegraf";
dotenv.config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

const telegramClient = new Telegraf(TELEGRAM_BOT_TOKEN!);

export default telegramClient;
