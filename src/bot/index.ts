import telegramClient from "../client/telegram.client";
import registerStartCommand from "./commands/start.command";
import registerWordCommand from "./commands/word.command";
import {
  registerEvaluateTranslationCommand,
  registerWritingCommand,
} from "./commands/writing.command";

registerStartCommand(telegramClient);
registerWordCommand(telegramClient);
registerWritingCommand(telegramClient);
registerEvaluateTranslationCommand(telegramClient);
export default telegramClient;
