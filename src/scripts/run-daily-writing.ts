import { dailyWritingJob } from "../jobs/dailyWriting.job";
import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);

const dailyWriting = async () => {
  await dailyWritingJob(bot);
  console.log("Daily writing job completed");
};

dailyWriting();
