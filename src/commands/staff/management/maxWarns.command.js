import { helpWithASpecificCommand } from '../../everyone/commandsCommon/help.command.js';
import Colors from '../../../utils/commandsFunctions/layoutEmbed/colors.js';

export default {
  name: 'maxWarns',
  description: `comando setar uma quantidade de warn para banir um usuário do seu servidor, para isso use <prefix>setCountWarns <quantidade/2/3>`,
  permissions: ['staff'],
  aliases: ['setCountWarns', 'setWarnsCount', 'setCountWarnsToBan'],
  category: 'Moderação ⚔️',
  run: ({ message, client, args, prefix }) => {
    function isNumber(n) {
      return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
    }

    if (!args[0] || !isNumber(args[0])) {
      const [command] = message.content.slice(prefix.length).split(/ +/);
      helpWithASpecificCommand(command, client, message);
      return;
    }

    const guildIdDatabase = new client.Database.table(
      `guild_id_${message.guild.id}`
    );

    guildIdDatabase.set('maxWarns', args[0]);
    message.channel.send({
      content: `${message.author}`,
      embeds: [
        {
          color: Colors.pink_red,
          title: `Quantidade máxima de warns salva no servidor : **\`${args[0]}\`**`,
          footer: {
            text: `${message.author.tag}`,
            icon_url: `${message.author.displayAvatarURL({ dynamic: true })}`,
          },
          timestamp: new Date(),
        },
      ],
    });
  },
};
