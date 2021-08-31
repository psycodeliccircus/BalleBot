import 'dotenv/config';
import { Client } from 'discord.js';
import db from 'quick.db';

const { TOKEN } = process.env;

import EventHandler from './events/Events.handler.js';
import CommandHandler from './commands/Command.handler.js';

const client = new Client({
    partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USERS', 'GUILD_MEMBER'],
});

client.Events = EventHandler(client);
client.Commands = CommandHandler();
client.Database = db;

client.login(TOKEN);