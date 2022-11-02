import 'dotenv/config';

import { Client, Intents, Permissions } from 'discord.js';
import db from 'quick.db';
import eventHandler from './events/Events.handler.js';
import commandHandler from './commands/Command.handler.js';

const { TOKEN } = process.env;

const intents = new Intents();

intents.add(
  Intents.FLAGS.GUILD_PRESENCES,
  Intents.FLAGS.GUILD_MEMBERS,
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILD_BANS,
  Intents.FLAGS.DIRECT_MESSAGES,
  Intents.FLAGS.GUILD_MESSAGE_REACTIONS
);

const client = new Client({
  restRequestTimeout: 60000,
  intents,
  partials: ['CHANNEL'],
});

client.Events = eventHandler(client);
client.Commands = commandHandler();
client.Database = db;
client.Permission = new Permissions(104324673n);

client.login(TOKEN);
