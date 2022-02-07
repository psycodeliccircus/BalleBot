import { inspect } from 'util';
import Discord from 'discord.js';

export default {
  name: 'eval',
  description: `Comando de desenvolvedores`,
  permissions: ['developers'],
  aliases: ['e'],
  dm: true,
  category: 'Developers 👷‍♂️',
  // eslint-disable-next-line no-unused-vars
  run: async ({ message, client, args }) => {
    const code = args.join(' ');
    if (!code) return message.channel.send('Coloque um código no eval');
    let output;
    let result;

    try {
      // eslint-disable-next-line no-eval
      result = await eval(code);
    } catch (e) {
      return message.channel.send('Oops, não entendi');
    }
    output = result;
    if (typeof result !== 'string') {
      output = inspect(result);
    }
    message.channel.send(`\`\`\`js\n${output}\`\`\``).catch(() => {
      const buffer = Buffer.from(output);
      const attachment = new Discord.MessageAttachment(buffer, `output.js`);
      message.channel.send({ files: [attachment] });
    });
  },
};
