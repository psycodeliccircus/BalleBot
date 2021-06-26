import 'dotenv/config';
import './services/database/connection.js'
import { Client } from 'discord.js';

import EventHandler from './events/Events.handler.js';
import CommandHandler from './commands/Command.handler.js';
import ReactionHandler from './reactionAdd/Reaction.handler.js';

const client = new Client({
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

client.Events = EventHandler(client);
client.Commands = CommandHandler();
client.Reactions = ReactionHandler();

client.login(process.env.BOT_TOKEN);
