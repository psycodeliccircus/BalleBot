import 'dotenv/config';

import { Client, Collection } from 'discord.js';

const client = new Client({
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

client.commands = new Collection();

client.once('ready', () => {
  console.log(`Logged as ${client.user.tag}`);
});

client.once('message', (message) => {
  if (message.content === 'ping') message.reply('Pong');
});

client.login(process.env.BOT_TOKEN);
