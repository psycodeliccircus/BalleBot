import Colors from '../../../utils/commandsFunctions/layoutEmbed/colors.js';
import Icons from '../../../utils/commandsFunctions/layoutEmbed/iconsMessage.js';

export default {
  name: 'activateRecaptcha',
  description: `Ative ou Desative sistema de recaptcha contra selfbots!`,
  permissions: ['staff'],
  aliases: ['recaptcha', 'disableAnrecaptcha', 'activeRecaptcha', 'recaptcha'],
  category: 'AntiSpam ⚠️',
  run: ({ message, client }) => {
    const guildIdDatabase = new client.Database.table(
      `guild_id_${message.guild.id}`
    );

    const antiself = guildIdDatabase.get('recaptcha');
    if (antiself) {
      guildIdDatabase.set('recaptcha', false);
      return message.channel.send({
        content: `${message.author}`,
        embeds: [
          {
            color: Colors.pink_red,
            thumbnail: Icons.erro,
            title: `O Sitema de Recaptcha foi desativado!`,
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
    guildIdDatabase.set('recaptcha', true);
    message.channel.send({
      content: `${message.author}`,
      embeds: [
        {
          color: Colors.pink_red,
          thumbnail: Icons.sucess,
          title: `O Sitema de Recaptcha foi Ativado!`,
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
