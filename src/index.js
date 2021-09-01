import 'dotenv/config';
import './services/database/connection.js'
import { Client } from 'discord.js';
import disbut from "discord-buttons";
import db from 'quick.db';

const { TOKEN } = process.env;

import EventHandler from './events/Events.handler.js';
import CommandHandler from './commands/Command.handler.js';
import ReactionHandler from './reactionAdd/Reaction.handler.js';
import ButtonHandler from './buttons/Button.handler.js';

const client = new Client({
  partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USERS', 'GUILD_MEMBER'],
});

disbut(client);
client.Events = EventHandler(client);
client.Buttons = ButtonHandler();
client.Commands = CommandHandler();
client.Reactions = ReactionHandler();
client.Database = db;

client.login(TOKEN);
