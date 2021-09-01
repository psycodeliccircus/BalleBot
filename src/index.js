import 'dotenv/config';
import './services/database/connection.js';
import { Client } from 'discord.js';
import disbut from 'discord-buttons';
import db from 'quick.db';

import eventHandler from './events/Events.handler.js';
import commandHandler from './commands/Command.handler.js';
import reactionHandler from './reactionAdd/Reaction.handler.js';
import buttonHandler from './buttons/Button.handler.js';

const { TOKEN } = process.env;

const client = new Client({
  partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USERS', 'GUILD_MEMBER'],
});

disbut(client);
client.Events = eventHandler(client);
client.Buttons = buttonHandler();
client.Commands = commandHandler();
client.Reactions = reactionHandler();
client.Database = db;

client.login(TOKEN);
