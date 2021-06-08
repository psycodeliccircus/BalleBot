import 'dotenv/config';
import { Client } from 'discord.js';
// eslint-disable-next-line import/extensions
import CommandHandler from './commands/Command.handler.js';

const prefix = process.env.BOT_PREFIX;

const client = new Client({
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

client.Commands = CommandHandler();

client.once('ready', () => {
  console.log(`Logged as ${client.user.tag}`);
});

client.on('message', (message) => {
  if (!message.author.bot && message.content.startsWith(prefix)) {
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    try {
      client.Commands.get(command).run({ client, message, args });
    } catch (e) {
      console.error(e);
    }
  }
});

client.login(process.env.BOT_TOKEN);
