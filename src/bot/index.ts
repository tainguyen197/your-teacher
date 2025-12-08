import telegramClient from "../client/telegram.client";
import registerStartCommand from "./commands/start.command";
import {
  registerEvaluateTranslationCommand,
  registerWritingCommand,
} from "./commands/writing.command";

registerStartCommand(telegramClient);
registerWritingCommand(telegramClient);
registerEvaluateTranslationCommand(telegramClient);

export default telegramClient;
