import { helpWithASpecificCommand } from '../../everyone/comandosCommon/help.command.js';
import Colors from '../../../utils/layoutEmbed/colors.js';
import Icons from '../../../utils/layoutEmbed/iconsMessage.js';

export default {
  name: 'addLog',
  description: `<prefix>addLog para adicionar o chat de report do bot`,
  permissions: ['staff'],
  aliases: ['addChannelLog', 'setlog', 'channellog'],
  category: 'AntiSpam ⚠️',
  run: ({ message, client, args, prefix }) => {
    if (!args[0]) {
      const [command] = message.content.slice(prefix.length).split(/ +/);
      helpWithASpecificCommand(command, client, message);
      return;
    }
    const guildIdDatabase = new client.Database.table(
      `guild_id_${message.guild.id}`
    );

    const idChannelLog = args[0].replace(/(<#)|(>)/g, '');

    const channel = client.channels.cache.get(idChannelLog);
    if (!channel) {
      return message.channel.send({
        content: `${message.author}`,
        embeds: [
          {
            color: Colors.pink_red,
            thumbnail: Icons.erro,
            title: '**Não encontrei o chat!**',
            description:
              '> Tente mencionar o chat com **#chat** ou use o **ID** do chat para adicionar e receber notificações sobre configurações, banimentos, avisos e muito mais!',
            footer: {
              text: message.author.tag,
              icon_url: `${message.author.displayAvatarURL({ dynamic: true })}`,
            },
            timestamp: new Date(),
          },
        ],
      });
    }
    guildIdDatabase.set('channel_log', idChannelLog);

    message.channel.send({
      content: `${message.author}`,
      embeds: [
        {
          color: Colors.pink_red,
          thumbnail: Icons.sucess,
          title: `O Chat Log foi atualizado com sucesso: `,
          description: `**Caso queira modificar basta usar o comando novamente com outro chat!**\n> **Chat setado:** ${channel}`,
          footer: {
            text: message.author.tag,
            icon_url: `${message.author.displayAvatarURL({ dynamic: true })}`,
          },
        },
      ],
    });
  },
};
