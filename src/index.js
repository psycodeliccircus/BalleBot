import 'dotenv/config';
import { Client } from 'discord.js';

import EventHandler from './events/Events.handler.js';
import CommandHandler from './commands/Command.handler.js';

const client = new Client({
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

client.Events = EventHandler(client);
client.Commands = CommandHandler();

client.login(process.env.BOT_TOKEN);
