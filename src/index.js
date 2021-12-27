import 'dotenv/config';

import { Client, Intents } from 'discord.js';
import db from 'quick.db';
import eventHandler from './events/Events.handler.js';
import commandHandler from './commands/Command.handler.js';

const { TOKEN } = process.env;

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.Events = eventHandler(client);
client.Commands = commandHandler();
client.Database = db;

client.login(TOKEN);
