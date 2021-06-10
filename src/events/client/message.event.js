export default {
  name: 'message',
  once: false,
  run: (client, message) => {
    if (
      !message.author.bot &&
      message.content.startsWith(process.env.BOT_PREFIX)
    ) {
      const args = message.content
        .slice(process.env.BOT_PREFIX.length)
        .split(/ +/);
      const commandName = args.shift().toLowerCase();

      if (commandName)
        client.Commands.get(commandName).run({ client, message, args });
    }
  },
};
