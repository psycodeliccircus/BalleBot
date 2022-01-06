import Colors from '../../../utils/commandsFunctions/layoutEmbed/colors.js';
import Icons from '../../../utils/commandsFunctions/layoutEmbed/iconsMessage.js';

export default {
  name: 'activateAntiSpam',
  description: `Ative ou Desative sistema de AntiSpam e AntiFlood nos canais que o BalleBot tem acesso apenas mandando esse comando`,
  permissions: ['staff'],
  aliases: ['antiSpam', 'disableAntiSpam', 'activeAntiSpam'],
  category: 'AntiSpam ⚠️',
  run: ({ message, client }) => {
    const guildIdDatabase = new client.Database.table(
      `guild_id_${message.guild.id}`
    );

    const antispam = guildIdDatabase.get('AntiSpam');
    if (antispam) {
      guildIdDatabase.set('AntiSpam', false);
      return message.channel.send({
        content: `${message.author}`,
        embeds: [
          {
            color: Colors.pink_red,
            thumbnail: Icons.erro,
            title: `O Sitema de AntiSpam foi desativado!`,
            author: {
              name: message.author.tag,
              icon_url: message.author.displayAvatarURL({ dynamic: true }),
            },
            description: `Para reativar use o comando novamente!`,
            timestamp: new Date(),
          },
        ],
      });
    }
    guildIdDatabase.set('AntiSpam', true);
    message.channel.send({
      content: `${message.author}`,
      embeds: [
        {
          color: Colors.pink_red,
          thumbnail: Icons.sucess,
          title: `O Sitema de AntiSpam foi Ativado!`,
          author: {
            name: message.author.tag,
            icon_url: message.author.displayAvatarURL({ dynamic: true }),
          },
          description: `Para desativar use o comando novamente!`,
          timestamp: new Date(),
        },
      ],
    });
  },
};
