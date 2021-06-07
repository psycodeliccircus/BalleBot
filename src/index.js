import 'dotenv/config';
import { Client } from 'discord.js';
import CommandHandler from './commands/Command.handler.js';

const prefix = process.env.BOT_PREFIX;

const client = new Client({
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

client.Commands = CommandHandler();

client.once('ready', () => {
  console.log(`Logged as ${client.user.tag}`);
});

client.once('message', (message) => {
  if (!message.author.bot && message.content.startsWith(prefix)) {
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    client.Commands.get(command)({ client, message, args });
  }
});

client.login(process.env.BOT_TOKEN);
