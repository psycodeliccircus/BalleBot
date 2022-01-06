import { helpWithASpecificCommand } from '../../everyone/commandsCommon/help.command.js';
import Colors from '../../../utils/commandsFunctions/layoutEmbed/colors.js';

export default {
  name: 'setPrefix',
  description: `comando setar um prefixo customizado para seu servidor, para isso use <prefix>setPrefix <novo prefix>`,
  permissions: ['staff'],
  aliases: ['prefix', 'addPrefix'],
  category: 'Acessórios ✨',
  run: ({ message, client, args, prefix }) => {
    if (!args[0]) {
      const [command] = message.content.slice(prefix.length).split(/ +/);
      helpWithASpecificCommand(command, client, message);
      return;
    }

    const guildIdDatabase = new client.Database.table(
      `guild_id_${message.guild.id}`
    );

    guildIdDatabase.set('prefix', args[0]);
    message.channel.send({
      content: `${message.author}`,
      embeds: [
        {
          color: Colors.pink_red,
          title: `Prefixo salvo no servidor : **\`${args[0]}\`**`,
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
