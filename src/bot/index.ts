import telegramClient from "../client/telegram.client";
import registerStartCommand from "./commands/start.command";
import registerWordCommand from "./commands/word.command";

registerStartCommand(telegramClient);
registerWordCommand(telegramClient);

export default telegramClient;
